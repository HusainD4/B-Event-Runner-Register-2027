import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import vm from 'node:vm';

const sandbox = await mkdtemp(path.join(tmpdir(), 'racepack-test-'));
Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
  WHATSAPP_AUTH_DIR: path.join(sandbox, 'auth'),
});
test.after(async () => { await rm(sandbox, { recursive: true, force: true }); });

const { default: prisma } = await import('../src/config/database.ts');
const { checkinRacepack, verifyRacepackCode, enqueueRacepackCheckin } = await import('../src/controllers/admin.racepack.controller.ts');
const { saveEventRacepackBenefits } = await import('../src/controllers/admin.event.controller.ts');

const catalog = [
  { id: 'jersey', eventId: 'event-1', name: 'Jersey', description: 'Kaos peserta' },
  { id: 'bag', eventId: 'event-1', name: 'Goodybag', description: 'Tas peserta' },
  { id: 'medal', eventId: 'event-1', name: 'Medali', description: 'Medali finisher' },
  { id: 'other', eventId: 'event-2', name: 'Lainnya', description: 'Kategori lain' },
];
let settings;
let participant;
let racepackWrites;
let conflict;

function reset() {
  settings = new Map([
    ['racepack_benefits_event-1', JSON.stringify(['jersey', 'bag'])],
    ['racepack_checkins', JSON.stringify({ 'p-1': { queued: true, queuedByAdminId: 'admin-1' } })],
  ]);
  participant = {
    id: 'p-1', eventId: 'event-1', fullNameKtp: 'Peserta',
    bibNumber: '10-001', selectedSize: 'L', order: { status: 'SETTLEMENT' },
    event: { id: 'event-1', category: '10K' },
  };
  racepackWrites = 0;
  conflict = false;
  prisma.appSetting.findUnique = async ({ where }) => settings.has(where.key) ? { value: settings.get(where.key) } : null;
  prisma.appSetting.upsert = async ({ where, create, update }) => {
    settings.set(where.key, settings.has(where.key) ? update.value : create.value);
  };
  prisma.appSetting.create = async ({ data }) => { settings.set(data.key, data.value); racepackWrites++; };
  prisma.$executeRaw = async (strings, value, previous) => {
    assert.match(strings.join('?'), /BINARY value = BINARY/);
    if (conflict || settings.get('racepack_checkins') !== previous) return 0;
    settings.set('racepack_checkins', value);
    racepackWrites++;
    return 1;
  };
  prisma.event.findUnique = async ({ where }) => where.id === 'event-1' ? { id: 'event-1' } : null;
  prisma.eventBenefit.count = async ({ where }) => catalog.filter(item => item.eventId === where.eventId && where.id.in.includes(item.id)).length;
  prisma.eventBenefit.findMany = async ({ where }) => catalog.filter(item => item.eventId === where.eventId && where.id.in.includes(item.id))
    .map(({ id, name, description }) => ({ id, name, description }));
  prisma.participant.findUnique = async () => participant;
  prisma.participant.findFirst = async () => participant;
  prisma.order.findFirst = async () => null;
  prisma.admin.findUnique = async () => ({ fullName: 'Petugas' });
  prisma.log.create = async () => ({});
}

function response() {
  return { status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
}
async function check(items, overrides = {}) {
  const res = response();
  await checkinRacepack({ body: { participantId: 'p-1', ...(items === undefined ? {} : { items }) }, admin: { adminId: 'admin-1' }, ...overrides }, res);
  return res;
}

test('admin can save only unique benefits belonging to the selected category', async () => {
  reset();
  for (const [ids, code] of [[['jersey', 'other'], 400], [['jersey', 'jersey'], 400], [['jersey', 'bag'], 200], [[], 200]]) {
    const res = response();
    await saveEventRacepackBenefits({ params: { eventId: 'event-1' }, body: { benefitIds: ids } }, res);
    assert.equal(res.code, code);
  }
  assert.deepEqual(JSON.parse(settings.get('racepack_benefits_event-1')), []);
});

test('verify uses selected category benefits for individual and master orders', async () => {
  reset();
  const single = response();
  await verifyRacepackCode({ params: { code: 'p-1' }, query: {} }, single);
  assert.equal(single.code, 200);
  assert.deepEqual(single.body.data.racepackBenefits.map(item => item.id), ['jersey', 'bag']);

  prisma.order.findFirst = async () => ({
    status: 'SETTLEMENT', participants: [participant, { ...participant, id: 'p-2', eventId: 'event-2' }],
  });
  settings.set('racepack_benefits_event-2', JSON.stringify(['other']));
  const master = response();
  await verifyRacepackCode({ params: { code: 'order-1' }, query: {} }, master);
  assert.equal(master.code, 200);
  assert.deepEqual(master.body.data.participants.map(p => p.racepackBenefits.map(b => b.id)), [['jersey', 'bag'], ['other']]);
});

test('deleted benefits disappear from current checklists without changing legacy history', async () => {
  reset();
  settings.set('racepack_benefits_event-1', JSON.stringify(['jersey', 'deleted']));
  settings.set('racepack_checkins', JSON.stringify({ 'p-1': { checkedIn: true, items: ['Old BIB', 'Old Jersey'] } }));
  const res = response();
  await verifyRacepackCode({ params: { code: 'p-1' }, query: {} }, res);
  assert.equal(res.code, 200);
  assert.deepEqual(res.body.data.racepackBenefits.map(item => item.id), ['jersey']);
  assert.deepEqual(res.body.data.racepack.items, ['Old BIB', 'Old Jersey']);
});

test('check-in requires the complete current checklist, payment and queue ownership', async () => {
  reset();
  for (const items of [undefined, [], ['jersey'], ['jersey', 'jersey'], ['jersey', 'other'], ['jersey', 'bag', 'medal']]) {
    assert.equal((await check(items)).code, 400, JSON.stringify(items));
  }
  assert.equal((await check(['jersey', 'bag'], { admin: { adminId: 'admin-2' } })).code, 403);
  participant.order.status = 'PENDING';
  assert.equal((await check(['jersey', 'bag'])).code, 400);
  participant.order.status = 'SETTLEMENT';
  settings.set('racepack_benefits_event-1', '[]');
  assert.match((await check(['jersey', 'bag'])).body.message, /belum diatur/);
  settings.set('racepack_benefits_event-1', JSON.stringify(['jersey', 'medal']));
  assert.equal((await check(['jersey', 'bag'])).code, 400);
  assert.equal(racepackWrites, 0);
});

test('successful check-in snapshots names and IDs, rejecting duplicate confirmation', async () => {
  reset();
  const res = await check(['jersey', 'bag']);
  assert.equal(res.code, 200);
  assert.deepEqual(res.body.data.items, ['Jersey', 'Goodybag']);
  assert.deepEqual(res.body.data.benefitSnapshot, [{ id: 'jersey', name: 'Jersey' }, { id: 'bag', name: 'Goodybag' }]);
  settings.set('racepack_benefits_event-1', '[]');
  assert.deepEqual(JSON.parse(settings.get('racepack_checkins'))['p-1'].items, ['Jersey', 'Goodybag']);
  assert.equal((await check(['jersey', 'bag'])).code, 409);
});

test('concurrent modification does not overwrite queue and corrupt JSON is not discarded', async () => {
  reset();
  conflict = true;
  assert.match((await check(['jersey', 'bag'])).body.message, /berubah/);
  assert.equal(racepackWrites, 0);
  conflict = false;
  settings.set('racepack_checkins', '{invalid');
  const res = response();
  await enqueueRacepackCheckin({ body: { participantId: 'p-1' }, admin: { adminId: 'admin-1' } }, res);
  assert.equal(res.code, 500);
  assert.equal(settings.get('racepack_checkins'), '{invalid');
});

test('frontend no longer has hardcoded prechecked racepack items', async () => {
  const html = await readFile(new URL('../../frontend/admin/pages/racepack.html', import.meta.url), 'utf8');
  const js = await readFile(new URL('../../frontend/admin/js/pages/racepack.js', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /chkItemBib|chkItemJersey|Timing Chip PASI/);
  assert.match(js, /selectedChecklistItems/);
  assert.match(js, /racepackBenefits/);
});

test('racepack preview follows each category selection and distinguishes unsaved changes', async () => {
  const html = await readFile(new URL('../../frontend/admin/pages/events.html', import.meta.url), 'utf8');
  assert.match(html, /id="adminEventsContainer"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<section class="admin-section racepack-config-section"/);
  const source = await readFile(new URL('../../frontend/admin/js/pages/events.js', import.meta.url), 'utf8');
  const sectionSource = source.slice(source.indexOf('function renderRacepackConfigs('), source.indexOf('function renderEvents('));
  function makeSection(id, options) {
    const listeners = {};
    const elements = {
      '.racepack-preview-label': {}, '.racepack-config-status': {}, tbody: {},
      '.btn-save-racepack-benefits': {
        addEventListener(type, handler) { listeners.save = handler; },
      },
    };
    return {
      dataset: { eventId: id }, options, elements, listeners,
      querySelector(selector) { return elements[selector]; },
      querySelectorAll() { return this.options.filter(option => option.checked); },
      addEventListener(type, handler) { listeners[type] = handler; },
    };
  }
  const first = makeSection('event-1', [{ value: 'jersey', checked: true }, { value: 'medal', checked: false }]);
  const second = makeSection('event-2', []);
  const container = { querySelectorAll: () => [first, second] };
  const events = [
    { id: 'event-1', ticketName: '10K', category: '10K', racepackBenefitIds: ['jersey'], benefits: [
      { id: 'jersey', name: 'Jersey', description: 'Kaos' },
      { id: 'medal', name: 'Medali', description: 'Finisher' },
    ] },
    { id: 'event-2', ticketName: '5K', category: '5K', benefits: [] },
  ];
  let request;
  const context = {
    document: { getElementById: () => container },
    escapeHtml: value => String(value),
    fetchAdmin: async (url, options) => { request = { url, options }; return { status: 'success', message: 'Tersimpan' }; },
    showAdminToast: () => {},
  };
  vm.runInNewContext(`${sectionSource}\nrenderRacepackConfigs(events)`, { ...context, events });
  assert.match(first.elements.tbody.innerHTML, /Jersey/);
  assert.doesNotMatch(first.elements.tbody.innerHTML, /Medali/);
  assert.match(second.elements.tbody.innerHTML, /Belum ada perlengkapan/);
  first.options[1].checked = true;
  first.listeners.change();
  assert.match(first.elements.tbody.innerHTML, /Medali/);
  assert.match(first.elements['.racepack-preview-label'].textContent, /belum disimpan/);
  assert.deepEqual(events[0].racepackBenefitIds, ['jersey']);
  await first.listeners.save({ currentTarget: first.elements['.btn-save-racepack-benefits'] });
  assert.equal(request.url, '/admin/events/event-1/racepack-benefits');
  assert.deepEqual(JSON.parse(request.options.body), { benefitIds: ['jersey', 'medal'] });
  assert.match(first.elements['.racepack-preview-label'].textContent, /tersimpan/);
  assert.match(second.elements.tbody.innerHTML, /Belum ada perlengkapan/);
});
