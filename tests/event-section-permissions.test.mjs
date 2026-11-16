import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
});

const { canAccessEventSection } = await import('../src/utils/event-section-permissions.ts');
const { requireEventSection } = await import('../src/middlewares/auth.ts');
const { getAdminEvents } = await import('../src/controllers/admin.event.controller.ts');
const { default: prisma } = await import('../src/config/database.ts');

const admin = { adminId: 'admin', roleName: 'ADMINISTRATOR', permissions: [
  'events:read', 'benefits:manage', 'section:event-configured', 'section:event-catalog',
] };
function response() {
  return { status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
}

test('event sections retain legacy and superadmin access and deny disabled sections', () => {
  assert.equal(canAccessEventSection({ ...admin, permissions: [] }, 'section:event-racepack'), true);
  assert.equal(canAccessEventSection(admin, 'section:event-racepack'), false);
  assert.equal(canAccessEventSection({ ...admin, roleName: 'SUPERADMIN', permissions: [] }, 'section:event-racepack'), true);
  let nextCalled = false;
  const res = response();
  requireEventSection('section:event-racepack')({ admin }, res, () => { nextCalled = true; });
  assert.equal(res.code, 403);
  assert.equal(nextCalled, false);
});

test('event list keeps shared category data but filters racepack configuration', async () => {
  const oldEvents = prisma.event.findMany;
  const oldSettings = prisma.appSetting.findMany;
  prisma.event.findMany = async () => [{
    id: 'event-1', eventDate: null, isClosed: false, price: 100, stock: 10,
    _count: { participants: 0 }, benefits: [], jerseys: [],
  }];
  prisma.appSetting.findMany = async () => [];
  try {
    const res = response();
    await getAdminEvents({ admin }, res);
    assert.equal(res.code, 200);
    assert.equal(res.body.data[0].id, 'event-1');
    assert.equal(Object.hasOwn(res.body.data[0], 'racepackBenefitIds'), false);
    const allowed = response();
    await getAdminEvents({ admin: { ...admin, permissions: [...admin.permissions, 'section:event-racepack'] } }, allowed);
    assert.deepEqual(allowed.body.data[0].racepackBenefitIds, []);
  } finally {
    prisma.event.findMany = oldEvents;
    prisma.appSetting.findMany = oldSettings;
  }
});

test('category and racepack mutations use independent guards', async () => {
  const routes = await readFile(new URL('../src/routes/admin.routes.ts', import.meta.url), 'utf8');
  for (const route of [
    "router.post('/events',", "router.put('/events/:id',", "router.delete('/events/:id',",
    "router.get('/events/:eventId/benefits',", "router.post('/events/:eventId/benefits',",
    "router.put('/benefits/:id',", "router.delete('/benefits/:id',",
    "router.get('/jerseys',", "router.post('/jerseys',", "router.put('/jerseys/:id',",
    "router.delete('/jerseys/:id',", "router.post('/events/:eventId/bib-config',",
  ]) {
    const line = routes.split('\n').find(value => value.includes(route));
    assert.ok(line?.includes("requireEventSection('section:event-catalog')"), route);
  }
  assert.match(routes, /router\.put\('\/events\/:eventId\/racepack-benefits'.*requireEventSection\('section:event-racepack'\)/);
  const html = await readFile(new URL('../../frontend/admin/pages/events.html', import.meta.url), 'utf8');
  assert.match(html, /data-event-section="section:event-catalog"/);
  assert.match(html, /data-event-section="section:event-racepack"/);
});
