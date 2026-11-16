import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
});

const { adminLogin } = await import('../src/controllers/admin.auth.controller.ts');
const { verifyAuthToken } = await import('../src/middlewares/auth.ts');
const { hashPassword } = await import('../src/utils/password.ts');
const { default: prisma } = await import('../src/config/database.ts');

test('login uses a small cookie even for many permissions and middleware reloads current permissions', async () => {
  const permissions = Array.from({ length: 256 }, (_, i) => `section:example-permission-${i}`);
  const admin = {
    id: 'd45b4dc5-8470-4847-8c21-3ab8e0e22af6', username: 'testuser', email: 'test@example.test',
    roleId: 'role-1', fullName: 'Test Admin', tokenVersion: 3, isActive: true,
    password: await hashPassword('test-password'), role: { id: 'role-1', name: 'ADMINISTRATOR', permissions },
  };
  const oldFindFirst = prisma.admin.findFirst;
  const oldFindUnique = prisma.admin.findUnique;
  const oldLog = prisma.log.create;
  prisma.admin.findFirst = async () => admin;
  prisma.admin.findUnique = async () => admin;
  prisma.log.create = async () => ({});
  try {
    let cookie;
    const res = {
      cookie(name, value, options) { cookie = { name, value, options }; return this; },
      status(code) { this.code = code; return this; },
      json(body) { this.body = body; return this; },
    };
    await adminLogin({ body: { identifier: 'testuser', password: 'test-password' } }, res);
    assert.equal(res.code, 200);
    assert.deepEqual(res.body.data.admin.role.permissions, permissions);
    assert.ok(cookie.value.length < 512);
    const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET);
    assert.equal(decoded.adminId, admin.id);
    assert.equal(decoded.tokenVersion, 3);
    assert.equal(decoded.permissions, undefined);
    admin.role.permissions = ['page:dashboard'];
    const req = { headers: { cookie: `${cookie.name}=${cookie.value}` }, method: 'GET' };
    let nextCalled = false;
    await verifyAuthToken(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.deepEqual(req.admin.permissions, ['page:dashboard']);
    admin.tokenVersion++;
    res.clearCookie = () => {};
    await verifyAuthToken({ headers: { cookie: `${cookie.name}=${cookie.value}` }, method: 'GET' }, res, () => assert.fail('revoked token accepted'));
    assert.equal(res.code, 401);
  } finally {
    prisma.admin.findFirst = oldFindFirst;
    prisma.admin.findUnique = oldFindUnique;
    prisma.log.create = oldLog;
  }
});
