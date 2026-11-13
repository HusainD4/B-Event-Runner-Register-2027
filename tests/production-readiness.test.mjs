import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';

const backend = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sandbox = await mkdtemp(path.join(tmpdir(), 'event-backend-test-'));
const previousCwd = process.cwd();
const testEnv = {
  NODE_ENV: 'production',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/nonexistent?connect_timeout=1',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
  REDIS_HOST: '127.0.0.1',
  REDIS_PORT: '1',
  TRUST_PROXY: 'loopback',
};

test('built server resolves its imports and fails closed if MySQL is unavailable', async () => {
  const child = spawn(process.execPath, [path.join(backend, 'dist', 'server.js')], {
    cwd: sandbox,
    env: { ...process.env, ...testEnv },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { output += chunk; });
  const timeout = setTimeout(() => child.kill(), 15000);
  const code = await new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('close', resolve);
  });
  clearTimeout(timeout);
  assert.equal(code, 1, output);
  assert.match(output, /SERVER STARTUP ERROR/);
  assert.doesNotMatch(output, /ERR_MODULE_NOT_FOUND|Cannot find module/);
});

test('API readiness checks MySQL and reports unavailable when it fails', async () => {
  process.chdir(sandbox);
  Object.assign(process.env, testEnv);
  const { default: prisma } = await import('../dist/config/database.js');
  const { redis } = await import('../dist/config/redis.js');
  const { default: app } = await import('../dist/app.js');
  let queries = 0;
  prisma.$queryRaw = async () => {
    queries++;
    if (queries > 1) throw new Error('test database unavailable');
    return [{ 1: 1 }];
  };
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const url = `http://127.0.0.1:${server.address().port}/api/`;
    const responses = await Promise.all(Array.from({ length: 10 }, () => fetch(url)));
    assert.ok(responses.every(response => response.status === 200));
    assert.equal(queries, 1);
    await new Promise(resolve => setTimeout(resolve, 5100));
    const failed = await fetch(url);
    assert.equal(failed.status, 503);
    assert.equal((await failed.json()).status, 'error');

    const registration = `http://127.0.0.1:${server.address().port}/api/register`;
    const attempt = ip => fetch(registration, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0', 'x-forwarded-for': ip },
      body: '{}',
    });
    for (let i = 0; i < 5; i++) assert.notEqual((await attempt('198.51.100.1')).status, 429);
    assert.equal((await attempt('198.51.100.1')).status, 429);
    assert.notEqual((await attempt('198.51.100.2')).status, 429);
  } finally {
    await new Promise(resolve => server.close(resolve));
    redis.disconnect();
    await prisma.$disconnect();
    process.chdir(previousCwd);
  }
});

test.after(async () => {
  await rm(sandbox, { recursive: true, force: true });
});
