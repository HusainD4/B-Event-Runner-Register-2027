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

const { canAccessBibSection, BIB_SECTIONS } = await import('../src/utils/bib-section-permissions.ts');
const { requireBibSection } = await import('../src/middlewares/auth.ts');
const section = 'section:bib-payment-fee';
const admin = (permissions, roleName = 'ADMINISTRATOR') => ({ permissions, roleName });

test('legacy roles preserve access, configured roles are restricted and superadmin remains unrestricted', () => {
  assert.equal(canAccessBibSection(admin(['bib:*']), section), true);
  assert.equal(canAccessBibSection(admin(['bib:manage', 'section:bib-configured', 'section:bib-generation']), section), false);
  assert.equal(canAccessBibSection(admin(['bib:*', 'section:bib-configured', section]), section), true);
  assert.equal(canAccessBibSection(admin(['section:bib-configured', section]), section), false);
  assert.equal(canAccessBibSection(admin([], 'SUPERADMIN'), section), true);
  assert.equal(canAccessBibSection(undefined, section), false);
  assert.equal(BIB_SECTIONS.length, 4);
});

test('middleware denies both reads and writes for disabled section', () => {
  for (const method of ['GET', 'PUT']) {
    let next = false;
    const res = { status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
    requireBibSection(section)({ method, admin: admin(['bib:*', 'section:bib-configured']) }, res, () => { next = true; });
    assert.equal(res.code, 403);
    assert.equal(next, false);
  }
});

test('all four admin endpoint groups and cards carry their section access checks', async () => {
  const routes = await readFile(new URL('../src/routes/admin.routes.ts', import.meta.url), 'utf8');
  const html = await readFile(new URL('../../frontend/admin/pages/bib-settings.html', import.meta.url), 'utf8');
  for (const [path, key] of [
    ['/bib/settings', 'section:bib-generation'],
    ['/settings/qr', 'section:bib-qr'],
    ['/settings/racepack-instructions', 'section:bib-instructions'],
    ['/settings/payment-fee', 'section:bib-payment-fee'],
  ]) {
    for (const method of ['get', 'put']) {
      assert.ok(routes.includes(`router.${method}('${path}', requireBibSection('${key}')`));
    }
    assert.ok(html.includes(`data-bib-section="${key}"`));
  }
});
