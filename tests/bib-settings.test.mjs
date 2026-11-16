import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const sandbox = await mkdtemp(path.join(tmpdir(), 'event-bib-test-'));
Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
  WHATSAPP_AUTH_DIR: path.join(sandbox, 'auth'),
});
after(async () => { await rm(sandbox, { recursive: true, force: true }); });

const { default: prisma } = await import('../src/config/database.ts');
const { coreApi } = await import('../src/config/midtrans.ts');
const { getGlobalBibSettings } = await import('../src/services/bib.service.ts');
const { syncAllMidtransOrders } = await import('../src/controllers/admin.order.controller.ts');

test('default BIB timing is manual and saved automatic timings are preserved', async () => {
  prisma.appSetting.findUnique = async () => null;
  assert.equal((await getGlobalBibSettings()).timing, 'MANUAL');
  for (const timing of ['PAYMENT_SUCCESS', 'RACEPACK_CHECKIN', 'MANUAL']) {
    prisma.appSetting.findUnique = async () => ({ value: JSON.stringify({ timing }) });
    assert.equal((await getGlobalBibSettings()).timing, timing);
  }
  const html = await readFile(new URL('../../frontend/admin/pages/bib-settings.html', import.meta.url), 'utf8');
  assert.match(html, /name="bibTiming" value="MANUAL" checked/);
  assert.doesNotMatch(html, /name="bibTiming" value="PAYMENT_SUCCESS" checked/);
});

test('payment synchronization respects the BIB issuance setting', async () => {
  const originalStatus = coreApi.transaction.status;
  coreApi.transaction.status = async () => ({ transaction_status: 'settlement' });
  try {
    for (const timing of [null, 'MANUAL', 'RACEPACK_CHECKIN', 'PAYMENT_SUCCESS']) {
      let generated = 0;
      prisma.appSetting.findUnique = async () => timing ? { value: JSON.stringify({ timing }) } : null;
      prisma.order.findMany = async () => [{
        id: 'order-1', midtransOrderId: 'test-order',
        participants: [{ id: 'participant-1', bibNumber: null, event: { category: '5K' } }],
      }];
      prisma.$transaction = async callback => callback({
        order: { update: async () => ({}) },
        appSetting: { findMany: async () => [] },
        participant: { update: async () => { generated++; } },
        log: { create: async () => ({}) },
      });
      const res = {
        status(code) { this.code = code; return this; },
        json(body) { this.body = body; return this; },
      };
      await syncAllMidtransOrders({}, res);
      assert.equal(res.code, 200);
      assert.equal(res.body.data.updatedSettlement, 1);
      assert.equal(generated, timing === 'PAYMENT_SUCCESS' ? 1 : 0, String(timing));
    }
  } finally {
    coreApi.transaction.status = originalStatus;
  }
});
