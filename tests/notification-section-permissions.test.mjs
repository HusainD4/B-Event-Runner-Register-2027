import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import vm from 'node:vm';

const sandbox = await mkdtemp(path.join(tmpdir(), 'event-notif-sections-'));
Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
  WHATSAPP_AUTH_DIR: path.join(sandbox, 'auth'),
});
test.after(async () => { await rm(sandbox, { recursive: true, force: true }); });

const { NOTIFICATION_SECTIONS, allowedNotificationFields, canAccessNotificationSection } = await import('../src/utils/notification-section-permissions.ts');
const { getNotificationSettings, updateNotificationSettings } = await import('../src/controllers/admin.notification.controller.ts');
const { requireNotificationSection } = await import('../src/middlewares/auth.ts');
const { default: prisma } = await import('../src/config/database.ts');

const admin = { adminId: 'admin', username: 'admin', roleName: 'ADMINISTRATOR', permissions: [
  'notifications:manage', 'section:notification-configured', 'section:notification-mode',
] };
function response() {
  return { status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
}

test('notification catalog and access distinguish legacy, configured and superadmin roles', () => {
  const keys = NOTIFICATION_SECTIONS.map(section => section.key);
  const fields = NOTIFICATION_SECTIONS.flatMap(section => section.fields);
  assert.equal(new Set(keys).size, keys.length);
  assert.equal(new Set(fields).size, fields.length);
  assert.equal(canAccessNotificationSection({ ...admin, permissions: ['notifications:*'] }, 'section:notification-smtp'), true);
  assert.equal(canAccessNotificationSection(admin, 'section:notification-smtp'), false);
  assert.equal(canAccessNotificationSection({ ...admin, roleName: 'SUPERADMIN', permissions: [] }, 'section:notification-smtp'), true);
  assert.deepEqual(allowedNotificationFields(admin), ['wa_dispatch_mode']);
});

test('restricted settings omit SMTP secrets and reject mixed updates before writes', async () => {
  const oldFind = prisma.appSetting.findMany;
  const oldUpsert = prisma.appSetting.upsert;
  let writes = 0;
  prisma.appSetting.findMany = async () => [
    { key: 'wa_dispatch_mode', value: 'MANUAL' },
    { key: 'email_smtp_pass', value: 'secret' },
  ];
  prisma.appSetting.upsert = async () => { writes++; };
  try {
    const read = response();
    await getNotificationSettings({ admin }, read);
    assert.equal(read.code, 200);
    assert.deepEqual(read.body.data, { wa_dispatch_mode: 'MANUAL' });
    for (const body of [
      { email_smtp_pass: 'new' },
      { wa_dispatch_mode: 'AUTO', email_smtp_pass: 'new' },
      { settings: { email_smtp_pass: 'new' } },
      { unrecognized: 'value' },
    ]) {
      const res = response();
      await updateNotificationSettings({ admin, body }, res);
      assert.equal(res.code, 403);
    }
    assert.equal(writes, 0);
    const denied = response();
    requireNotificationSection('section:notification-test')({ admin }, denied, () => assert.fail('unexpected access'));
    assert.equal(denied.code, 403);
  } finally {
    prisma.appSetting.findMany = oldFind;
    prisma.appSetting.upsert = oldUpsert;
  }
});

test('allowed notification group updates only its fields', async () => {
  const oldUpsert = prisma.appSetting.upsert;
  const oldLog = prisma.log.create;
  const writes = [];
  prisma.appSetting.upsert = async value => { writes.push(value.where.key); };
  prisma.log.create = async () => ({});
  try {
    const res = response();
    await updateNotificationSettings({ admin, body: { wa_dispatch_mode: 'MANUAL' } }, res);
    assert.equal(res.code, 200);
    assert.deepEqual(writes, ['wa_dispatch_mode']);
  } finally {
    prisma.appSetting.upsert = oldUpsert;
    prisma.log.create = oldLog;
  }
});

test('UI selects an allowed tab, and socket delivery checks current permissions', async () => {
  const source = await readFile(new URL('../../frontend/admin/js/core/rbac.js', import.meta.url), 'utf8');
  const ids = ['Gateway', 'Mode', 'Channel', 'Pdf', 'Smtp', 'WaTemplate', 'EmailTemplate', 'Test'];
  const elements = {};
  for (const id of ids) {
    elements[`notifTab${id}`] = { id: `notifTab${id}`, disabled: false, style: {}, selected: id === 'Gateway' };
    elements[`notifPanel${id}`] = { dataset: {}, hidden: id !== 'Gateway' };
  }
  const tabs = ids.map(id => elements[`notifTab${id}`]);
  const tablist = { querySelector: selector => selector.includes('aria-selected')
    ? tabs.find(tab => tab.selected && !tab.disabled) : tabs.find(tab => !tab.disabled) };
  const context = {
    window: { addEventListener() {}, innerWidth: 1200 },
    document: {
      getElementById: id => elements[id] || null,
      querySelector: selector => selector.startsWith('#pane-notifications') ? tablist : null,
      querySelectorAll: () => [],
    },
    selectTab: (list, id) => {
      for (const tab of tabs) {
        tab.selected = tab.id === id;
        elements[tab.id.replace('Tab', 'Panel')].hidden = !tab.selected;
      }
    },
  };
  vm.runInNewContext(source.replace(/^import .*;\s*/m, '').replaceAll('export function ', 'function '), context);
  context.applyRbacUi({ role: { name: admin.roleName, permissions: admin.permissions } });
  assert.equal(elements.notifTabMode.selected, true);
  assert.equal(elements.notifPanelGateway.hidden, true);
  assert.equal(elements.notifTabSmtp.disabled, true);
  const sockets = await readFile(new URL('../src/sockets/index.ts', import.meta.url), 'utf8');
  assert.match(sockets, /admin:whatsapp_session/);
  assert.match(sockets, /prisma\.admin\.findMany/);
  assert.match(sockets, /canAccessNotificationSection/);
  assert.match(sockets, /admin\.tokenVersion !== socket\.data\.tokenVersion/);
});
