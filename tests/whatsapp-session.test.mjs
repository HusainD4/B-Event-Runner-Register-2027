import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const sandbox = await mkdtemp(path.join(tmpdir(), 'event-whatsapp-test-'));
Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
  WHATSAPP_AUTH_DIR: path.join(sandbox, 'auth'),
});

const { default: prisma } = await import('../src/config/database.ts');
const { WhatsAppSessionService } = await import('../src/services/whatsapp-session.service.ts');
prisma.appSetting.upsert = async () => ({});

class FakeSession extends WhatsAppSessionService {
  constructor() {
    super(false);
    this.sockets = [];
    this.loads = 0;
  }
  async loadAuthState() {
    this.loads++;
    await new Promise(resolve => setTimeout(resolve, 20));
    return { state: {}, saveCreds: async () => {} };
  }
  async fetchVersion() { return { version: [2, 3000, 1] }; }
  makeSocket() {
    const socket = {
      ev: new EventEmitter(),
      user: { id: '620000@s.whatsapp.net' },
      end() {},
      async logout() {},
      async sendMessage() {},
    };
    this.sockets.push(socket);
    return socket;
  }
  hasStoredCredentials() { return true; }
}

test('concurrent initialization shares one socket', async () => {
  const session = new FakeSession();
  const sockets = await Promise.all(Array.from({ length: 20 }, () => session.initSocket()));
  assert.equal(session.loads, 1);
  assert.equal(session.sockets.length, 1);
  assert.ok(sockets.every(socket => socket === sockets[0]));
});

test('concurrent QR requests share one socket and all resolve', async () => {
  const session = new FakeSession();
  const requests = [session.generateQrCode(), session.generateQrCode()];
  await new Promise(resolve => setTimeout(resolve, 70));
  assert.equal(session.sockets.length, 1);
  session.sockets[0].ev.emit('connection.update', { qr: 'test-qr' });
  const results = await Promise.all(requests);
  assert.ok(results.every(result => result.status === 'SCAN_QR' && result.qrCodeUrl.startsWith('data:image/png')));
});

test('connection replaced stops retries and never reports stale connected state', async () => {
  const session = new FakeSession();
  const socket = await session.initSocket();
  socket.ev.emit('connection.update', { connection: 'open' });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal((await session.getSession()).status, 'CONNECTED');
  socket.ev.emit('connection.update', {
    connection: 'close',
    lastDisconnect: { error: { output: { statusCode: 440 } } },
  });
  const state = await session.getSession();
  assert.equal(state.status, 'DISCONNECTED');
  assert.match(state.error, /440/);
  await assert.rejects(session.sendMessage('0800000000', 'test'), /440/);
  await assert.rejects(session.initSocket(), /440/);
  await new Promise(resolve => setTimeout(resolve, 5200));
  assert.equal(session.sockets.length, 1);
  const qrRequest = session.generateQrCode();
  await new Promise(resolve => setTimeout(resolve, 70));
  assert.equal(session.sockets.length, 2);
  session.sockets[1].ev.emit('connection.update', { qr: 'another-test-qr' });
  assert.equal((await qrRequest).status, 'SCAN_QR');
});

test('ordinary connection loss reconnects once', async () => {
  const session = new FakeSession();
  const socket = await session.initSocket();
  socket.ev.emit('connection.update', {
    connection: 'close',
    lastDisconnect: { error: { output: { statusCode: 408 } } },
  });
  await new Promise(resolve => setTimeout(resolve, 5200));
  assert.equal(session.sockets.length, 2);
});

test('disconnect during initialization prevents a stale socket from being created', async () => {
  const session = new FakeSession();
  const pending = session.initSocket();
  await session.disconnectSession();
  await assert.rejects(pending, /dibatalkan/);
  assert.equal(session.sockets.length, 0);
  assert.equal((await session.getSession()).status, 'DISCONNECTED');
});

after(async () => {
  await rm(sandbox, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
});
