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

const { countdownSectionsForUpdate, canAccessCountdownSection } = await import('../src/utils/countdown-section-permissions.ts');
const { updateAdminCountdownSettings } = await import('../src/controllers/settings.controller.ts');
const { default: prisma } = await import('../src/config/database.ts');

test('countdown update fields map to their separate sections', () => {
  assert.deepEqual(countdownSectionsForUpdate({ eventCountdownDate: null, isRegistrationClosed: true }), ['section:countdown-timer']);
  assert.deepEqual(countdownSectionsForUpdate({ registrationClosedMessage: 'A', maintenanceEnabled: true }), ['section:countdown-registration-info', 'section:countdown-maintenance']);
  assert.equal(canAccessCountdownSection({ roleName: 'ADMINISTRATOR', permissions: ['countdown:*'] }, 'section:countdown-maintenance'), true);
  assert.equal(canAccessCountdownSection({ roleName: 'ADMINISTRATOR', permissions: ['countdown:*', 'section:countdown-configured'] }, 'section:countdown-maintenance'), false);
  assert.equal(canAccessCountdownSection({ roleName: 'SUPERADMIN', permissions: [] }, 'section:countdown-maintenance'), true);
});

test('rejects unauthorized and mixed updates before any database write', async () => {
  let touched = false;
  prisma.appSetting.findMany = async () => { touched = true; throw new Error('unexpected database access'); };
  for (const body of [
    { maintenanceEnabled: true },
    { registrationClosedMessage: 'Pesan', maintenanceTitle: 'Ditutup' },
  ]) {
    const res = { status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
    await updateAdminCountdownSettings({
      body,
      admin: { roleName: 'ADMINISTRATOR', permissions: ['countdown:manage', 'section:countdown-configured', 'section:countdown-registration-info'] },
    }, res);
    assert.equal(res.code, 403);
    assert.equal(touched, false);
  }
});

test('countdown sections are individually tagged in the admin page', async () => {
  const html = await readFile(new URL('../../frontend/admin/pages/countdown.html', import.meta.url), 'utf8');
  for (const key of ['timer', 'registration-info', 'maintenance']) {
    assert.ok(html.includes(`data-countdown-section="section:countdown-${key}"`));
  }
});
