import test from 'node:test';
import assert from 'node:assert/strict';
import prisma from '../src/config/database.ts';
import { clearParticipantData } from '../src/controllers/admin.participant.controller.ts';
import { requireSuperAdmin } from '../src/middlewares/auth.ts';

function response() {
  return {
    code: 0,
    body: null,
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

function fixture() {
  return {
    maintenance: true,
    orders: [
      { id: 'one', status: 'SETTLEMENT', midtransOrderId: 'ONLINE-1' },
      { id: 'two', status: 'CAPTURE', midtransOrderId: 'OFFLINE-1' },
      { id: 'three', status: 'CANCEL', midtransOrderId: 'ONLINE-2' },
    ],
    participants: [
      { id: 'p1', eventId: 'e1', orderId: 'one' },
      { id: 'p2', eventId: 'e1', orderId: 'one' },
      { id: 'p3', eventId: 'e1', orderId: 'two' },
      { id: 'p4', eventId: 'e1', orderId: 'three' },
      { id: 'p5', eventId: 'e2', orderId: 'one' },
    ],
    events: { e1: 5, e2: 2 },
    settings: ['racepack_checkins', 'payment_expiry_one', 'site_title'],
    qr: 3,
    logs: [{ action: 'PARTICIPANT_MANUAL_CREATE', entityType: 'Participant', entityId: 'p2' }],
  };
}

function mockDatabase(initial, failAudit = false) {
  let state = structuredClone(initial);
  prisma.$transaction = async (callback, options) => {
    assert.equal(options.isolationLevel, 'Serializable');
    const txState = structuredClone(state);
    const tx = {
      appSetting: {
        findUnique: async () => txState.maintenance ? { value: 'true' } : null,
        deleteMany: async () => { txState.settings = txState.settings.filter(key => key !== 'racepack_checkins' && !key.startsWith('payment_expiry_')); },
      },
      order: {
        count: async () => txState.orders.filter(order => order.status === 'PENDING').length,
        deleteMany: async () => { const count = txState.orders.length; txState.orders = []; return { count }; },
      },
      participant: {
        findMany: async () => txState.participants.map(participant => ({
          ...participant, order: txState.orders.find(order => order.id === participant.orderId),
        })),
        deleteMany: async () => { const count = txState.participants.length; txState.participants = []; return { count }; },
      },
      event: {
        update: async ({ where, data }) => {
          txState.events[where.id] += data.stock.increment;
          return { stock: txState.events[where.id] };
        },
      },
      qrToken: {
        deleteMany: async () => { const count = txState.qr; txState.qr = 0; return { count }; },
      },
      log: {
        findMany: async () => txState.logs.filter(log => log.action === 'PARTICIPANT_MANUAL_CREATE'),
        create: async ({ data }) => {
          if (failAudit) throw new Error('audit failed');
          txState.logs.push(data);
        },
      },
    };
    const result = await callback(tx);
    state = txState;
    return result;
  };
  return () => state;
}

const request = (confirmation = 'KOSONGKAN DATA PESERTA', json = true) => ({
  body: { confirmation }, admin: { adminId: 'super', roleName: 'SUPERADMIN' }, is: () => json,
});

test('only SUPERADMIN passes authorization, regardless of wildcard permissions', () => {
  for (const roleName of ['ADMINISTRATOR', 'OPERATOR', undefined]) {
    const res = response();
    let passed = false;
    requireSuperAdmin({ admin: { roleName, permissions: ['*'] } }, res, () => { passed = true; });
    assert.equal(passed, false);
    assert.equal(res.code, 403);
  }
  let passed = false;
  requireSuperAdmin({ admin: { roleName: 'SUPERADMIN' } }, response(), () => { passed = true; });
  assert.equal(passed, true);
});

test('confirmation and JSON are mandatory before opening a transaction', async () => {
  prisma.$transaction = () => { throw new Error('Unexpected transaction'); };
  for (const [req, code] of [[request('wrong'), 400], [request('KOSONGKAN DATA PESERTA', false), 415]]) {
    const res = response();
    await clearParticipantData(req, res);
    assert.equal(res.code, code);
  }
});

test('maintenance and pending-order safeguards preserve data', async () => {
  for (const state of [
    { ...fixture(), maintenance: false },
    { ...fixture(), orders: [...fixture().orders, { id: 'pending', status: 'PENDING' }] },
  ]) {
    const getState = mockDatabase(state);
    const res = response();
    await clearParticipantData(request(), res);
    assert.equal(res.code, 409);
    assert.deepEqual(getState(), state);
  }
});

test('deletes related data and restores only identifiable online paid stock', async () => {
  const getState = mockDatabase(fixture());
  const res = response();
  await clearParticipantData(request(), res);
  assert.equal(res.code, 200);
  assert.deepEqual(res.body.data, { participants: 5, orders: 3, qrTokens: 3, restoredStock: 2 });
  assert.deepEqual(getState().events, { e1: 6, e2: 3 });
  assert.deepEqual(getState().settings, ['site_title']);
  assert.equal(getState().participants.length, 0);
  assert.equal(getState().orders.length, 0);
  assert.equal(getState().qr, 0);
  assert.equal(getState().logs.at(-1).action, 'PARTICIPANT_DATA_CLEARED');
});

test('audit failure rolls back deletions and stock updates', async () => {
  const original = fixture();
  const getState = mockDatabase(original, true);
  const res = response();
  await clearParticipantData(request(), res);
  assert.equal(res.code, 500);
  assert.deepEqual(getState(), original);
});
