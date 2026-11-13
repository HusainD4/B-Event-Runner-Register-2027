import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backend = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sandbox = await mkdtemp(path.join(tmpdir(), 'event-webhook-test-'));
const previousCwd = process.cwd();
Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
});
process.chdir(sandbox);

const { default: prisma } = await import('../src/config/database.ts');
const { handleMidtransWebhook } = await import('../src/controllers/webhook.controller.ts');
const { verifyMidtransSignature } = await import('../src/middlewares/verifySignature.ts');

function createOrder(status = 'PENDING') {
  return {
    id: 'order-1',
    midtransOrderId: 'MIDTRANS-1',
    status,
    totalAmount: '1000.00',
    participants: [{ eventId: 'event-1' }],
  };
}

function setup(initialStatus = 'PENDING') {
  const state = {
    order: createOrder(initialStatus),
    stock: 5,
    updates: 0,
    logs: [],
    expiryDeletes: 0,
  };
  prisma.order.findUnique = async () => state.order;
  prisma.appSetting.findMany = async () => [{ key: 'notif_channel', value: 'DISABLED' }];
  prisma.$transaction = async callback => callback({
    order: {
      updateMany: async ({ where, data }) => {
        if (state.order.status !== where.status) return { count: 0 };
        state.order.status = data.status;
        state.updates++;
        return { count: 1 };
      },
    },
    event: {
      update: async ({ data }) => {
        state.stock += data.stock.increment;
        return { stock: state.stock };
      },
    },
    appSetting: {
      deleteMany: async () => { state.expiryDeletes++; return { count: 1 }; },
    },
    log: {
      create: async ({ data }) => { state.logs.push(data); return data; },
    },
  });
  return state;
}

function response() {
  return {
    statusCode: 0,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

async function webhook(payload) {
  const res = response();
  await handleMidtransWebhook({ body: payload }, res);
  return res;
}

test('rejects a validly signed notification whose amount differs from the order', async () => {
  const state = setup();
  const res = await webhook({
    order_id: state.order.midtransOrderId,
    gross_amount: '1001.00',
    transaction_status: 'settlement',
  });
  assert.equal(res.statusCode, 403);
  assert.equal(state.order.status, 'PENDING');
  assert.equal(state.updates, 0);
});

test('a late settlement does not reopen a cancelled order or send a payment notification', async () => {
  const state = setup('CANCEL');
  const res = await webhook({
    order_id: state.order.midtransOrderId,
    gross_amount: '1000.00',
    transaction_status: 'settlement',
  });
  assert.equal(res.statusCode, 200);
  assert.equal(state.order.status, 'CANCEL');
  assert.equal(state.updates, 0);
  assert.match(state.logs[0].description, /PEMERIKSAAN MANUAL/);
});

test('a duplicate paid webhook does not update or redispatch an already settled order', async () => {
  const state = setup('SETTLEMENT');
  const res = await webhook({
    order_id: state.order.midtransOrderId,
    gross_amount: '1000',
    transaction_status: 'settlement',
  });
  assert.equal(res.statusCode, 200);
  assert.equal(state.order.status, 'SETTLEMENT');
  assert.equal(state.updates, 0);
  assert.equal(state.expiryDeletes, 0);
});

test('only the first cancellation restores stock and clears expiry', async () => {
  const state = setup();
  const payload = {
    order_id: state.order.midtransOrderId,
    gross_amount: '1000.00',
    transaction_status: 'cancel',
  };
  assert.equal((await webhook(payload)).statusCode, 200);
  assert.equal(state.order.status, 'CANCEL');
  assert.equal(state.stock, 6);
  assert.equal(state.expiryDeletes, 1);
  assert.equal((await webhook(payload)).statusCode, 200);
  assert.equal(state.stock, 6);
  assert.equal(state.updates, 1);
  assert.equal(state.expiryDeletes, 1);
});

test('signature middleware rejects malformed signatures and accepts a valid SHA-512 signature', () => {
  const payload = { order_id: 'MIDTRANS-1', status_code: '200', gross_amount: '1000.00' };
  const signature = crypto.createHash('sha512')
    .update(`${payload.order_id}${payload.status_code}${payload.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`)
    .digest('hex');
  const invoke = signatureKey => {
    const res = response();
    let passed = false;
    verifyMidtransSignature({ body: { ...payload, signature_key: signatureKey } }, res, () => { passed = true; });
    return { res, passed };
  };
  assert.equal(invoke('not-a-signature').res.statusCode, 400);
  assert.equal(invoke('0'.repeat(128)).res.statusCode, 403);
  assert.equal(invoke(signature).passed, true);
});

after(async () => {
  process.chdir(previousCwd);
  await rm(sandbox, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
});
