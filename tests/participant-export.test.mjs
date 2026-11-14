import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';

Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
});

const { default: prisma } = await import('../src/config/database.ts');
const { exportParticipantsCsv } = await import('../src/controllers/admin.participant-export.controller.ts');
const { requirePermission } = await import('../src/middlewares/auth.ts');

class MockResponse extends EventEmitter {
  headers = {};
  chunks = [];
  headersSent = false;
  destroyed = false;
  code = 200;
  setHeader(name, value) { this.headers[name] = value; }
  removeHeader(name) { delete this.headers[name]; }
  type(value) { this.headers['Content-Type'] = value; return this; }
  status(code) { this.code = code; return this; }
  json(body) { this.body = body; return this; }
  write(chunk) { this.headersSent = true; this.chunks.push(chunk); return true; }
  end() { this.ended = true; }
  destroy() { this.destroyed = true; }
}

function participant(i) {
  const id = String(i).padStart(5, '0');
  return {
    id, fullNameKtp: i === 1100 ? '=FORMULA("test")' : `Pelari ${id}`, bibName: 'Nama, "BIB"',
    bibNumber: null, nik: '0123456789012345', phoneNumber: '08123456789', gender: 'MALE',
    birthPlace: 'Kota', birthDate: new Date('2000-01-01T00:00:00Z'), fullAddress: 'Jalan\nBaru',
    country: 'Indonesia', bloodType: 'O', medicalHistory: 'Riwayat', emergencyContactName: 'Kontak',
    emergencyContactPhone: '08123456789', communityName: null, jerseyId: null, selectedSize: 'M',
    createdAt: new Date('2026-01-01T00:00:00Z'), event: { id: 'event', ticketName: 'Tiket', category: i % 2 ? '5K' : '10K', price: '100000' },
    jersey: null, order: { id: `order-${id}`, midtransOrderId: `TR-${id}`, status: i % 2 ? 'PENDING' : 'SETTLEMENT',
      totalAmount: '105000', createdAt: new Date('2026-01-01T00:00:00Z'), updatedAt: new Date('2026-01-02T00:00:00Z'),
      user: { id: 'user', fullName: 'Pemesan', email: 'test@example.test', phoneNumber: '08123456789' } },
  };
}

function setup() {
  const all = Array.from({ length: 1201 }, (_, i) => participant(i));
  const state = { pages: [], logs: [] };
  prisma.$transaction = async callback => callback({
    appSetting: { findUnique: async () => ({ value: JSON.stringify({ '01100': { checkedIn: true, checkedInAt: '2026-01-01', items: ['BIB'], notes: 'Siap' } }) }) },
    participant: { findMany: async ({ where, take }) => {
      state.pages.push(where);
      return all.filter(p => !where.id || p.id > where.id.gt).slice(0, take);
    } },
    log: { create: async ({ data }) => { state.logs.push(data); return data; } },
  });
  return state;
}

async function run(filters) {
  const res = new MockResponse();
  await exportParticipantsCsv({ body: filters, admin: { adminId: 'admin' } }, res);
  return res;
}

test('exports every matching participant across pages with safe CSV and transaction data', async () => {
  const state = setup();
  const res = await run({ tab: 'SETTLED', category: '10K', search: '' });
  assert.equal(res.ended, true);
  assert.equal(res.headers['Cache-Control'], 'private, no-store, max-age=0');
  assert.equal(state.pages.length, 3);
  assert.equal(state.logs[0].metadata.count, 601);
  const csv = res.chunks.join('');
  assert.ok(csv.startsWith('\uFEFF'));
  assert.match(csv, /"ID Order Midtrans".*"Total Order"/);
  assert.match(csv, /"'=FORMULA\(""test""\)"/);
  assert.match(csv, /"Nama, ""BIB"""/);
  assert.match(csv, /"'0123456789012345"/);
  assert.match(csv, /"Jalan\nBaru"/);
  assert.match(csv, /"Riwayat"/);
  assert.match(csv, /"105000"/);
  assert.doesNotMatch(csv, /"snapToken"/);
});

test('all tab includes more than 1000 participants without truncation', async () => {
  const state = setup();
  const res = await run({ tab: 'ALL', category: '', search: '' });
  assert.equal(res.ended, true);
  assert.equal(state.logs[0].metadata.count, 1201);
  assert.match(res.chunks.join(''), /Pelari 01200/);
});

test('racepack and search filters apply to data beyond first page', async () => {
  const state = setup();
  const res = await run({ tab: 'RACEPACK_DONE', category: '10K', search: 'FORMULA' });
  assert.equal(res.ended, true);
  assert.equal(state.logs[0].metadata.count, 1);
  assert.match(res.chunks.join(''), /01100/);
  assert.match(res.chunks.join(''), /Siap/);
});

test('invalid filters are rejected and missing required permissions are denied', async () => {
  setup();
  const res = await run({ tab: 'ALL', category: 'unknown', search: '' });
  assert.equal(res.code, 400);
  const middleware = requirePermission('orders:read');
  const denied = new MockResponse();
  middleware({ admin: { roleName: 'ADMIN', permissions: ['participants:read'] } }, denied, () => assert.fail('access granted'));
  assert.equal(denied.code, 403);
});

test('database failure during streaming aborts the response', async () => {
  setup();
  prisma.$transaction = async callback => callback({
    appSetting: { findUnique: async () => null },
    participant: { findMany: async () => { throw new Error('test failure'); } },
  });
  const res = await run({ tab: 'ALL', category: '', search: '' });
  assert.equal(res.destroyed, true);
  assert.notEqual(res.ended, true);
});
