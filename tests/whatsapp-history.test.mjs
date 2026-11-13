import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { readFile } from 'node:fs/promises';

Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
  WHATSAPP_AUTH_DIR: path.join(tmpdir(), 'event-history-test-auth'),
});
const { default: prisma } = await import('../src/config/database.ts');
const { whatsappSessionService } = await import('../src/services/whatsapp-session.service.ts');
const { sendWithWhatsAppHistory } = await import('../src/services/whatsapp-history.service.ts');
const { getWhatsAppHistory, clearWhatsAppHistory, sendWhatsAppDirectMessage } = await import('../src/controllers/admin.notification.controller.ts');

function response() {
  return { status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
}

test('outgoing history records the exact message and uncertain results', async () => {
  const entries = [];
  prisma.log.create = async ({ data }) => {
    const entry = { id: String(entries.length), ...data };
    entries.push(entry);
    return entry;
  };
  prisma.log.updateMany = async ({ where, data }) => {
    Object.assign(entries.find(entry => entry.id === where.id), data);
    return { count: 1 };
  };
  await sendWithWhatsAppHistory('order-1', 'Halo\nPeserta', 'TEXT', async () => {});
  assert.deepEqual(entries[0].metadata, { message: 'Halo\nPeserta', kind: 'TEXT', status: 'SENT' });
  await assert.rejects(sendWithWhatsAppHistory('order-1', 'tiket.pdf', 'PDF', async () => { throw new Error('timeout'); }), /timeout/);
  assert.equal(entries[1].metadata.status, 'UNKNOWN');
  let sent = false;
  prisma.log.create = async () => { throw new Error('database unavailable'); };
  await assert.rejects(sendWithWhatsAppHistory('order-1', 'test', 'TEXT', async () => { sent = true; }), /database unavailable/);
  assert.equal(sent, false);
  prisma.log.create = async () => ({ id: 'existing' });
  prisma.log.updateMany = async () => { throw new Error('database unavailable'); };
  const oldError = console.error;
  console.error = () => {};
  try {
    await assert.rejects(sendWithWhatsAppHistory('order-1', 'test', 'TEXT', async () => { sent = true; }), /mungkin sudah terkirim/);
    assert.equal(sent, true);
  } finally { console.error = oldError; }
});

test('history and clear are order-scoped and clear writes a separate audit', async () => {
  prisma.order.findUnique = async ({ where }) => where.id === 'missing' ? null : { id: where.id };
  let query;
  prisma.log.findMany = async args => {
    query = args;
    return [{ id: 'new' }, { id: 'old' }];
  };
  let res = response();
  await getWhatsAppHistory({ params: { orderId: 'order-1' } }, res);
  assert.deepEqual(res.body.data.items.map(item => item.id), ['old', 'new']);
  assert.equal(query.where.entityId, 'order-1');
  assert.equal(query.where.action, 'WHATSAPP_CONSOLE_MESSAGE');
  assert.equal(query.take, 100);
  let deletion, audit;
  prisma.$transaction = async callback => callback({
    order: { findUnique: prisma.order.findUnique },
    log: {
      deleteMany: async args => { deletion = args; return { count: 2 }; },
      create: async ({ data }) => { audit = data; },
    },
  });
  res = response();
  await clearWhatsAppHistory({ params: { orderId: 'order-1' }, admin: { adminId: 'admin-1' } }, res);
  assert.equal(res.code, 200);
  assert.deepEqual(deletion.where, { action: 'WHATSAPP_CONSOLE_MESSAGE', entityType: 'Order', entityId: 'order-1' });
  assert.equal(audit.action, 'WHATSAPP_CONSOLE_CLEAR');
  assert.equal(audit.adminId, 'admin-1');
  assert.equal(audit.metadata.deletedCount, 2);
  res = response();
  await clearWhatsAppHistory({ params: { orderId: 'missing' } }, res);
  assert.equal(res.code, 404);
});

test('direct message uses the buyer phone associated with the selected order', async () => {
  prisma.order.findUnique = async () => ({ user: { phoneNumber: '08123456789' } });
  prisma.log.create = async ({ data }) => ({ id: 'id-1', ...data });
  prisma.log.updateMany = async () => ({ count: 1 });
  const prevConnected = whatsappSessionService.isConnected;
  const prevSend = whatsappSessionService.sendMessage;
  let args;
  whatsappSessionService.isConnected = async () => true;
  whatsappSessionService.sendMessage = async (...values) => { args = values; };
  try {
    const res = response();
    await sendWhatsAppDirectMessage({ body: { orderId: 'order-1', phoneNumber: 'other', message: 'Halo' }, admin: { adminId: 'a' } }, res);
    assert.equal(res.code, 200);
    assert.deepEqual(args, ['08123456789', 'Halo']);
  } finally {
    whatsappSessionService.isConnected = prevConnected;
    whatsappSessionService.sendMessage = prevSend;
  }
});

test('history routes require chat permission', async () => {
  const routes = await readFile(new URL('../src/routes/admin.routes.ts', import.meta.url), 'utf8');
  for (const method of ['get', 'delete']) {
    assert.match(routes, new RegExp(`router\\.${method}\\('/notifications/whatsapp/history/:orderId',\\s*requirePermission\\('whatsapp:chat'\\)`));
  }
});
