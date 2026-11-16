import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

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
const { registerEvent, checkParticipantNiks } = await import('../src/controllers/register.controller.ts');
const { registerPayloadSchema } = await import('../src/middlewares/validate.ts');
const { isValidRegistrationPhone, setupRegistrationPhone } = await import('../../frontend/js/registration-phone.js');

test('registration WhatsApp numbers use +62 and have 10 to 14 digits on both client and server', () => {
  const eventId = 'c0a80101-1234-4567-8901-123456789abc';
  const participant = {
    fullNameKtp: 'Peserta', bibName: 'PESERTA', nik: '1234567890123456',
    gender: 'MALE', birthPlace: 'Tegal', birthDate: '2000-01-01',
    fullAddress: 'Alamat lengkap', bloodType: 'O',
    emergencyContactName: 'Keluarga', emergencyContactPhone: '081234567890',
  };
  for (const prefix of ['08', '628', '+628']) {
    for (const length of [9, 10, 11, 12, 13, 14, 15]) {
      const phone = prefix + '1'.repeat(length - prefix.replace('+', '').length);
      const expected = prefix === '+628' && length >= 10 && length <= 14;
      assert.equal(isValidRegistrationPhone(phone), expected, phone);
      const body = { eventId, bookerPhone: phone, participants: [{ ...participant, phoneNumber: phone }] };
      assert.equal(registerPayloadSchema.safeParse({ body }).success, expected, phone);
    }
  }
  for (const phone of ['+628123456', '+628123456789012', '1234567890', '+62812 345678', '+62812a345678']) {
    assert.equal(isValidRegistrationPhone(phone), false, phone);
    assert.equal(registerPayloadSchema.safeParse({ body: { eventId, bookerPhone: phone, participants: [{ ...participant, phoneNumber: '+62812345678' }] } }).success, false, phone);
    assert.equal(registerPayloadSchema.safeParse({ body: { eventId, bookerPhone: '+62812345678', participants: [{ ...participant, phoneNumber: phone }] } }).success, false, phone);
  }
});

test('registration input converts 08 or 628 and limits the plus-prefixed number', () => {
  let onInput;
  const input = { value: '', addEventListener(_type, listener) { onInput = listener; } };
  setupRegistrationPhone(input);
  assert.equal(input.maxLength, 15);
  input.value = '081234567890';
  onInput();
  assert.equal(input.value, '+6281234567890');
  input.value = '6281234567890';
  onInput();
  assert.equal(input.value, '+6281234567890');
  input.value = '081234567890123';
  onInput();
  assert.equal(input.value, '+6281234567890123');
  assert.equal(isValidRegistrationPhone(input.value), false);
});

test('registration validation marks incorrect fields and clears corrected fields', () => {
  const source = readFileSync(new URL('../../frontend/js/app.js', import.meta.url), 'utf8');
  const validation = source.slice(source.indexOf('const validatedRegistrationSteps ='), source.indexOf('function updateSummaryReview()'));
  const elements = new Map();
  const errors = new Map();
  const makeField = (id, value = '') => {
    const attributes = new Map();
    const field = {
      value, validity: { valid: false }, dataset: {}, isConnected: true,
      getAttribute: name => attributes.get(name) || null,
      setAttribute: (name, value) => attributes.set(name, value),
      removeAttribute: name => attributes.delete(name),
      focus() { this.focused = true; },
      closest(selector) {
        if (selector === '.form-group') return { appendChild(error) { errors.set(error.id, error); } };
        if (selector === '#stepSection1') return true;
        return null;
      },
    };
    elements.set(id, field);
    return field;
  };
  const name = makeField('bookerName');
  const email = makeField('bookerEmail');
  const phone = makeField('bookerPhone');
  const document = {
    getElementById: id => elements.get(id) || errors.get(id),
    createElement: () => ({ remove() { errors.delete(this.id); } }),
  };
  const context = vm.createContext({
    document, isValidRegistrationPhone, state: { participantCount: 0 },
    showToast() {}, syncBookerToParticipant1() {},
  });
  vm.runInContext(validation, context);

  assert.equal(context.validateStep(1), false);
  for (const field of [name, email, phone]) {
    assert.equal(field.getAttribute('aria-invalid'), 'true');
    assert.ok(errors.get(field.getAttribute('aria-describedby'))?.textContent);
  }
  assert.equal(name.focused, true);

  name.value = 'Nama Peserta';
  phone.value = '+6281234567890';
  email.value = 'invalid@';
  assert.equal(context.validateStep(1, false), false);
  assert.equal(name.getAttribute('aria-invalid'), null);
  assert.equal(phone.getAttribute('aria-invalid'), null);
  assert.equal(email.getAttribute('aria-invalid'), 'true');
  email.value = 'peserta@example.test';
  email.validity.valid = true;
  assert.equal(context.validateStep(1, false), true);
  assert.equal(email.getAttribute('aria-invalid'), null);
  assert.equal(errors.size, 0);
});

function response() {
  return {
    code: 0,
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('public registration reuses matching contact or creates a separate buyer without changing old orders', async () => {
  const event = { id: 'event-1', ticketName: '5K', category: '5K', price: 10000, eventDate: null, isClosed: false, jerseys: [] };
  const existing = { id: 'buyer-1', fullName: 'Pembeli Awal', email: 'buyer@example.test', phoneNumber: '+6281234567890' };
  const participant = { fullNameKtp: 'Peserta', nik: '1234567890123456', birthDate: '2000-01-01', emergencyContactPhone: '081234567890' };
  const buyers = [existing];
  let userUpdates = 0;
  let userCreates = 0;
  let ordersCreated = 0;
  let midtransCustomer;
  prisma.event.findUnique = async () => event;
  prisma.event.findMany = async () => [event];
  prisma.appSetting.findMany = async () => [];
  prisma.appSetting.findUnique = async () => null;
  prisma.participant.findMany = async () => [];
  prisma.user.findMany = async ({ where }) => buyers.filter(user => user.email === where.email);
  prisma.user.update = async () => { userUpdates++; throw new Error('Public registration must not update a buyer'); };
  prisma.user.create = async ({ data }) => { userCreates++; const user = { id: `new-buyer-${userCreates}`, ...data }; buyers.push(user); return user; };
  prisma.order.findUnique = async () => null;
  prisma.$transaction = async callback => callback({
    appSetting: { findMany: async () => [], create: async () => ({}) },
    $executeRaw: async () => 1,
    participant: { findMany: async () => [] },
    user: { findMany: prisma.user.findMany, create: prisma.user.create },
    event: { findMany: async () => [event], updateMany: async () => ({ count: 1 }) },
    order: { create: async ({ data }) => {
      ordersCreated++;
      return { id: 'order-1', midtransOrderId: data.midtransOrderId, user: buyers.find(user => user.id === data.userId) };
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
    const acceptedDifferentPhone = await attempt('buyer@example.test', '081999999999');
    assert.equal(acceptedDifferentPhone.code, 201);
    assert.equal(midtransCustomer.phone, '+6281999999999');
    assert.equal(userUpdates, 0);
    assert.equal(ordersCreated, 1);
    assert.equal(existing.phoneNumber, '+6281234567890');

    const accepted = await attempt('BUYER@example.test', '0812-3456-7890');
    assert.equal(accepted.code, 201);
    assert.equal(userUpdates, 0);
    assert.equal(ordersCreated, 2);
    assert.equal(midtransCustomer.first_name, 'Pembeli Awal');
    assert.equal(midtransCustomer.phone, '+6281234567890');

    const acceptedAgain = await attempt('buyer@example.test', '081999999999');
    assert.equal(acceptedAgain.code, 201);
    assert.equal(userCreates, 1);
    const newBuyer = await attempt('new@example.test', '081234567890', 'Pemesan Baru');
    assert.equal(newBuyer.code, 201);
    assert.equal(userCreates, 2);
    assert.equal(ordersCreated, 4);
  } finally {
    snap.createTransaction = originalSnap;
  }
});

test('NIK validation rejects duplicates across categories while permitting cancelled orders', async () => {
  let existing = [{ nik: '1234567890123456', status: 'SETTLEMENT' }];
  prisma.participant.findMany = async ({ where }) => existing
    .filter(row => where.nik.in.includes(row.nik) && !where.order.status.notIn.includes(row.status))
    .map(({ nik }) => ({ nik }));
  const check = async participants => {
    const res = response();
    await checkParticipantNiks({ body: { participants } }, res);
    assert.equal(res.code, 200);
    return res.body.data.duplicateParticipants;
  };
  const nik = '1234567890123456';
  assert.deepEqual(await check([{ eventId: 'other-category', nik }]), [1]);
  existing[0].status = 'CANCEL';
  assert.deepEqual(await check([{ eventId: 'other-category', nik }]), []);
  existing[0].status = 'EXPIRE';
  assert.deepEqual(await check([{ eventId: 'other-category', nik }]), []);
  assert.deepEqual(await check([{ eventId: 'a', nik }, { eventId: 'b', nik }]), [2]);
});

test('checkout rechecks NIK under a transaction lock before reserving stock', async () => {
  const event = { id: 'event-1', ticketName: '5K', category: '5K', price: 10000, eventDate: null, isClosed: false, jerseys: [] };
  const participant = { nik: '1234567890123456' };
  let stockUpdates = 0;
  let locks = 0;
  prisma.event.findUnique = async () => event;
  prisma.event.findMany = async () => [event];
  prisma.appSetting.findMany = async () => [];
  prisma.appSetting.findUnique = async () => null;
  prisma.participant.findMany = async () => [];
  prisma.user.findMany = async () => [{ id: 'buyer-1', phoneNumber: '+6281234567890' }];
  prisma.$transaction = async (callback, options) => {
    assert.equal(options.isolationLevel, 'ReadCommitted');
    return callback({
      $executeRaw: async () => { locks++; },
      participant: { findMany: async () => [{ nik: participant.nik }] },
      event: { updateMany: async () => { stockUpdates++; return { count: 1 }; } },
    });
  };
  const res = response();
  await registerEvent({ body: {
    eventId: event.id, participants: [participant], bookerEmail: 'buyer@example.test', bookerPhone: '+6281234567890',
  } }, res);
  assert.equal(locks, 1);
  assert.equal(stockUpdates, 0);
  assert.equal(res.code, 409);
  assert.equal(res.body.code, 'DUPLICATE_NIK');
  assert.deepEqual(res.body.duplicateParticipants, [1]);
});

test.after(async () => { await rm(sandbox, { recursive: true, force: true }); });
