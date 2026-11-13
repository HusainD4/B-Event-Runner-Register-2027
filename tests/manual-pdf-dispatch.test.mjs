import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
  WHATSAPP_AUTH_DIR: path.join(tmpdir(), 'event-manual-pdf-test-auth'),
});

const { default: prisma } = await import('../src/config/database.ts');
const { dispatchManualPdf, getNotificationLogs } = await import('../src/controllers/admin.notification.controller.ts');

function response() {
  return {
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

function setup(initial = {}) {
  const state = {
    order: { status: 'SETTLEMENT', user: { phoneNumber: '08123456789', email: 'runner@example.test' }, _count: { participants: 1 } },
    jobs: new Map(Object.entries(initial)),
    logs: [],
    failLog: false,
    channel: 'WA',
  };
  prisma.$transaction = async callback => {
    const jobs = new Map([...state.jobs].map(([key, value]) => [key, { ...value }]));
    const logs = [];
    const tx = {
      appSetting: { findUnique: async () => state.channel === null ? null : { value: state.channel } },
      order: { findUnique: async () => state.order },
      pdfDelivery: {
        updateMany: async ({ where, data }) => {
          const job = jobs.get(where.channel);
          if (!job || !where.status.in.includes(job.status)) return { count: 0 };
          Object.assign(job, data);
          return { count: 1 };
        },
        upsert: async ({ where, create }) => {
          const channel = where.orderId_channel.channel;
          if (!jobs.has(channel)) jobs.set(channel, { ...create, status: 'PENDING', error: null });
          return jobs.get(channel);
        },
      },
      log: { create: async ({ data }) => {
        if (state.failLog) throw new Error('test database failure');
        logs.push(data);
      } },
    };
    const result = await callback(tx);
    state.jobs = jobs;
    state.logs.push(...logs);
    return result;
  };
  return state;
}

async function dispatch(body) {
  const res = response();
  await dispatchManualPdf({ body, admin: { adminId: 'admin-1' } }, res);
  return res;
}

test('manual PDF endpoint validates input, paid status, participants and buyer contacts', async () => {
  const state = setup();
  for (const body of [null, {}, { orderId: 'order-1', channel: 'DISABLED' }, { orderId: 'order-1', channel: 'WA', confirmResend: 'true' }]) {
    assert.equal((await dispatch(body)).code, 400);
  }
  state.order = null;
  assert.equal((await dispatch({ orderId: 'order-1', channel: 'WA' })).code, 404);
  state.order = { status: 'PENDING', user: { phoneNumber: '', email: '' }, _count: { participants: 1 } };
  assert.equal((await dispatch({ orderId: 'order-1', channel: 'WA' })).code, 400);
  state.order.status = 'CAPTURE';
  state.order._count.participants = 0;
  assert.equal((await dispatch({ orderId: 'order-1', channel: 'WA' })).code, 400);
  state.order._count.participants = 1;
  assert.match((await dispatch({ orderId: 'order-1', channel: 'WA' })).body.message, /WhatsApp/);
  state.order.user.phoneNumber = '08123456789';
  state.channel = 'BOTH';
  assert.match((await dispatch({ orderId: 'order-1', channel: 'BOTH' })).body.message, /email/);
  assert.equal(state.jobs.size, 0);
  assert.equal(state.logs.length, 0);
});

test('manual PDF selection queues only the requested channels and records an audit log', async () => {
  const state = setup();
  state.channel = 'EMAIL';
  let res = await dispatch({ orderId: 'order-1', channel: 'EMAIL' });
  assert.equal(res.code, 200);
  assert.deepEqual(res.body.data.channels, { EMAIL: 'PENDING' });
  assert.deepEqual([...state.jobs.keys()], ['EMAIL']);
  assert.equal(state.logs[0].adminId, 'admin-1');
  assert.equal(state.logs[0].action, 'PDF_DELIVERY_MANUAL_REQUEST');
  state.channel = 'BOTH';
  res = await dispatch({ orderId: 'order-1', channel: 'BOTH' });
  assert.equal(res.code, 200);
  assert.deepEqual(res.body.data.channels, { WA: 'PENDING', EMAIL: 'PENDING' });
  assert.equal(state.jobs.size, 2);
});

test('resend requires confirmation and leaves active jobs untouched', async () => {
  const state = setup({ EMAIL: { status: 'SENT', error: null } });
  state.channel = 'BOTH';
  let res = await dispatch({ orderId: 'order-1', channel: 'BOTH' });
  assert.equal(res.code, 409);
  assert.equal(state.jobs.has('WA'), false);
  assert.equal(state.logs.length, 0);
  res = await dispatch({ orderId: 'order-1', channel: 'BOTH', confirmResend: true });
  assert.equal(res.code, 200);
  assert.deepEqual(res.body.data.channels, { WA: 'PENDING', EMAIL: 'PENDING' });
  state.jobs.set('WA', { status: 'PROCESSING', error: null });
  state.jobs.set('EMAIL', { status: 'SENDING', error: null });
  res = await dispatch({ orderId: 'order-1', channel: 'BOTH', confirmResend: true });
  assert.deepEqual(res.body.data.channels, { WA: 'PROCESSING', EMAIL: 'SENDING' });
  state.jobs.set('WA', { status: 'FAILED', error: 'Hasil tidak pasti' });
  state.channel = 'WA';
  assert.equal((await dispatch({ orderId: 'order-1', channel: 'WA' })).code, 409);
  res = await dispatch({ orderId: 'order-1', channel: 'WA', confirmResend: true });
  assert.equal(res.body.data.channels.WA, 'PENDING');
  assert.equal(state.jobs.get('WA').error, null);
});

test('manual PDF follows active notification channel and rejects stale or disabled settings', async () => {
  const state = setup();
  assert.equal((await dispatch({ orderId: 'order-1', channel: 'EMAIL' })).code, 409);
  state.channel = 'DISABLED';
  assert.equal((await dispatch({ orderId: 'order-1', channel: 'WA' })).code, 400);
  state.channel = null;
  assert.equal((await dispatch({ orderId: 'order-1', channel: 'WA' })).code, 200);
  assert.deepEqual([...state.jobs.keys()], ['WA']);
});

test('notification logs expose configured channel and its default', async () => {
  prisma.order.findMany = async () => [];
  prisma.log.findMany = async () => [];
  for (const [setting, expected] of [[null, 'WA'], ['EMAIL', 'EMAIL'], ['BOTH', 'BOTH'], ['DISABLED', 'DISABLED']]) {
    prisma.appSetting.findUnique = async ({ where }) => where.key === 'notif_channel' && setting !== null ? { value: setting } : null;
    const res = response();
    await getNotificationLogs({ query: {} }, res);
    assert.equal(res.code, 200);
    assert.equal(res.body.data.stats.notificationChannel, expected);
  }
});

test('database errors roll back the queue and are reported', async () => {
  const state = setup();
  state.failLog = true;
  const previous = console.error;
  console.error = () => {};
  try {
    const res = await dispatch({ orderId: 'order-1', channel: 'WA' });
    assert.equal(res.code, 500);
    assert.equal(state.jobs.size, 0);
  } finally {
    console.error = previous;
  }
});

test('manual PDF route requires dispatch permission', async () => {
  const routes = await readFile(new URL('../src/routes/admin.routes.ts', import.meta.url), 'utf8');
  assert.match(routes, /router\.post\('\/notifications\/dispatch-pdf',\s*requirePermission\('notifications:dispatch'\),\s*dispatchManualPdf\)/);
});
