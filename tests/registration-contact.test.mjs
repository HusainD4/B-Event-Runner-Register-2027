import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const sandbox = await mkdtemp(path.join(tmpdir(), 'event-register-test-'));
Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
  WHATSAPP_AUTH_DIR: path.join(sandbox, 'auth'),
});

const { default: prisma } = await import('../src/config/database.ts');
const { snap } = await import('../src/config/midtrans.ts');
const { registerEvent } = await import('../src/controllers/register.controller.ts');

function response() {
  return {
    code: 0,
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('public registration preserves existing buyer contact and blocks mismatched phones', async () => {
  const event = { id: 'event-1', ticketName: '5K', category: '5K', price: 10000, eventDate: null, isClosed: false, jerseys: [] };
  const existing = { id: 'buyer-1', fullName: 'Pembeli Awal', email: 'buyer@example.test', phoneNumber: '+6281234567890' };
  const participant = { fullNameKtp: 'Peserta', nik: '1234567890123456', birthDate: '2000-01-01', emergencyContactPhone: '081234567890' };
  let buyer = existing;
  let userUpdates = 0;
  let userCreates = 0;
  let ordersCreated = 0;
  let midtransCustomer;
  prisma.event.findUnique = async () => event;
  prisma.event.findMany = async () => [event];
  prisma.appSetting.findMany = async () => [];
  prisma.appSetting.findUnique = async () => null;
  prisma.participant.findMany = async () => [];
  prisma.user.findFirst = async () => buyer;
  prisma.user.update = async () => { userUpdates++; throw new Error('Public registration must not update a buyer'); };
  prisma.user.create = async ({ data }) => { userCreates++; return { id: 'new-buyer', ...data }; };
  prisma.order.findUnique = async () => null;
  prisma.$transaction = async callback => callback({
    appSetting: { findMany: async () => [], create: async () => ({}) },
    event: { findMany: async () => [event], updateMany: async () => ({ count: 1 }) },
    order: { create: async ({ data }) => {
      ordersCreated++;
      return { id: 'order-1', midtransOrderId: data.midtransOrderId, user: buyer || { id: 'new-buyer', fullName: 'Pemesan Baru', email: 'new@example.test', phoneNumber: '+6281234567890' } };
    } },
    log: { create: async () => ({}) },
  });
  prisma.order.update = async () => ({});
  const originalSnap = snap.createTransaction;
  snap.createTransaction = async payload => {
    midtransCustomer = payload.customer_details;
    return { token: 'test-token', redirect_url: 'https://example.test' };
  };
  const attempt = async (email, phone, name = 'Nama Baru') => {
    const res = response();
    await registerEvent({ body: { eventId: event.id, participants: [participant], bookerEmail: email, bookerPhone: phone, bookerName: name }, get: () => undefined }, res);
    return res;
  };
  try {
    const rejected = await attempt('buyer@example.test', '081999999999');
    assert.equal(rejected.code, 409);
    assert.equal(rejected.body.code, 'BOOKER_CONTACT_MISMATCH');
    assert.equal(userUpdates, 0);
    assert.equal(ordersCreated, 0);
    assert.equal(existing.phoneNumber, '+6281234567890');

    const accepted = await attempt('BUYER@example.test', '0812-3456-7890');
    assert.equal(accepted.code, 201);
    assert.equal(userUpdates, 0);
    assert.equal(ordersCreated, 1);
    assert.equal(midtransCustomer.first_name, 'Pembeli Awal');
    assert.equal(midtransCustomer.phone, '+6281234567890');

    buyer = null;
    const newBuyer = await attempt('new@example.test', '081234567890', 'Pemesan Baru');
    assert.equal(newBuyer.code, 201);
    assert.equal(userCreates, 1);
    assert.equal(ordersCreated, 2);
  } finally {
    snap.createTransaction = originalSnap;
  }
});

test.after(async () => { await rm(sandbox, { recursive: true, force: true }); });
