import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const sandbox = await mkdtemp(path.join(tmpdir(), 'event-expiry-test-'));
Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
  WHATSAPP_AUTH_DIR: path.join(sandbox, 'auth'),
});

const { default: prisma } = await import('../src/config/database.ts');
const { coreApi } = await import('../src/config/midtrans.ts');
const { expirePendingOrders } = await import('../src/services/order-expiration.service.ts');

function setup({ expiry = Date.now() - 1000, remote = 'pending', cancelStatus = 'cancel', fail = false, race = false } = {}) {
  const state = {
    order: { id: 'order-1', midtransOrderId: 'MIDTRANS-1', status: 'PENDING', createdAt: new Date(Date.now() - 3600000), participants: [{ eventId: 'event-1' }, { eventId: 'event-1' }] },
    stock: 5, statusCalls: 0, cancelCalls: 0, logs: [],
  };
  prisma.order.findMany = async () => state.order.status === 'PENDING' ? [state.order] : [];
  prisma.order.findUnique = async () => null;
  prisma.appSetting.findMany = async () => [{ key: 'payment_expiry_order-1', value: new Date(expiry).toISOString() }];
  prisma.appSetting.findUnique = async () => ({ value: '30' });
  prisma.appSetting.deleteMany = async () => ({ count: 1 });
  coreApi.transaction.status = async () => {
    state.statusCalls++;
    if (fail) throw new Error('gateway unavailable');
    return { transaction_status: remote, fraud_status: 'accept' };
  };
  coreApi.transaction.cancel = async () => {
    state.cancelCalls++;
    if (race) state.order.status = 'SETTLEMENT';
    return { transaction_status: cancelStatus };
  };
  prisma.$transaction = async callback => callback({
    order: { updateMany: async ({ where, data }) => {
      if (state.order.status !== where.status) return { count: 0 };
      state.order.status = data.status;
      return { count: 1 };
    } },
    event: { update: async ({ data }) => { state.stock += data.stock.increment; return { stock: state.stock }; } },
    appSetting: {
      deleteMany: async () => ({ count: 1 }),
      findMany: async () => [{ key: 'pdf_delivery_channel', value: 'DISABLED' }],
    },
    log: { create: async ({ data }) => { state.logs.push(data); return data; } },
  });
  return state;
}

test('does not contact Midtrans or cancel before the saved deadline', async () => {
  const state = setup({ expiry: Date.now() + 60000 });
  await expirePendingOrders('order-1');
  assert.equal(state.statusCalls, 0);
  assert.equal(state.order.status, 'PENDING');
  assert.equal(state.stock, 5);
});

test('confirmed cancellation expires the order and restores stock once', async () => {
  const state = setup();
  await expirePendingOrders('order-1');
  await expirePendingOrders('order-1');
  assert.equal(state.order.status, 'EXPIRE');
  assert.equal(state.stock, 7);
  assert.equal(state.cancelCalls, 1);
  assert.equal(state.logs[0].metadata.reason, 'expired time');
});

test('gateway failures and unconfirmed cancellation leave the order pending', async () => {
  for (const options of [{ fail: true }, { cancelStatus: 'pending' }, { remote: 'challenge' }]) {
    const state = setup(options);
    await expirePendingOrders('order-1');
    assert.equal(state.order.status, 'PENDING');
    assert.equal(state.stock, 5);
  }
});

test('a concurrent settlement prevents stock restoration', async () => {
  const state = setup({ race: true });
  await expirePendingOrders('order-1');
  assert.equal(state.order.status, 'SETTLEMENT');
  assert.equal(state.stock, 5);
});

test('an already paid gateway transaction is not cancelled', async () => {
  const state = setup({ remote: 'settlement' });
  await expirePendingOrders('order-1');
  assert.equal(state.order.status, 'SETTLEMENT');
  assert.equal(state.cancelCalls, 0);
  assert.equal(state.stock, 5);
});

after(async () => {
  await rm(sandbox, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
});
