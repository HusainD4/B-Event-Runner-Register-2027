import test from 'node:test';
import assert from 'node:assert/strict';

Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
});

const { default: prisma } = await import('../src/config/database.ts');
const { getAdminParticipants } = await import('../src/controllers/admin.participant.controller.ts');

function response() {
  return { status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
}

test('participant pagination filters all data in database before taking a page', async () => {
  let query;
  const counts = [];
  prisma.appSetting.findUnique = async () => ({ value: JSON.stringify({ 'p-2': { checkedIn: true }, 'p-3': { checkedIn: false } }) });
  prisma.participant.count = async args => { counts.push(args); return 52; };
  prisma.participant.findMany = async args => { query = args; return [{ id: 'p-2' }]; };
  const res = response();
  await getAdminParticipants({ query: { page: '2', limit: '25', tab: 'RACEPACK_DONE', search: 'pelari', category: '5K' } }, res);
  assert.equal(res.code, 200);
  assert.equal(query.skip, 25);
  assert.equal(query.take, 25);
  assert.deepEqual(query.where.AND[1], { id: { in: ['p-2'] } });
  assert.equal(query.where.AND[0].event.category.contains, '5K');
  assert.ok(query.where.AND[0].OR.some(item => item.fullNameKtp?.contains === 'pelari'));
  assert.equal(counts.length, 6);
  assert.equal(res.body.meta.totalPages, 3);
  assert.equal(res.body.data[0].racepack.checkedIn, true);
});

test('invalid status and malformed racepack data fail explicitly', async () => {
  const invalid = response();
  await getAdminParticipants({ query: { tab: 'OTHER' } }, invalid);
  assert.equal(invalid.code, 400);
  prisma.appSetting.findUnique = async () => ({ value: '{' });
  const broken = response();
  const old = console.error;
  console.error = () => {};
  try { await getAdminParticipants({ query: {} }, broken); } finally { console.error = old; }
  assert.equal(broken.code, 500);
});

test('pagination accepts 500 but caps larger requests', async () => {
  let query;
  prisma.appSetting.findUnique = async () => null;
  prisma.participant.count = async () => 1200;
  prisma.participant.findMany = async args => { query = args; return []; };
  for (const [requested, expected] of [['10', 10], ['50', 50], ['100', 100], ['500', 500], ['900', 500]]) {
    const res = response();
    await getAdminParticipants({ query: { page: '2', limit: requested } }, res);
    assert.equal(res.code, 200);
    assert.equal(query.take, expected);
    assert.equal(query.skip, expected);
    assert.equal(res.body.meta.limit, expected);
  }
});
