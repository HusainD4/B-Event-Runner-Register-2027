import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

async function browserExecutable() {
  const candidates = process.env.PDF_CHROME_PATH ? [process.env.PDF_CHROME_PATH] : process.platform === 'win32'
    ? [
      path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Google\\Chrome\\Application\\chrome.exe'),
      path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Microsoft\\Edge\\Application\\msedge.exe'),
      path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Microsoft\\Edge\\Application\\msedge.exe'),
    ]
    : ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable'];
  for (const candidate of candidates) {
    try { await access(candidate); return candidate; } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  throw new Error('Browser Chromium tidak ditemukan. Pasang Chromium atau atur PDF_CHROME_PATH.');
}

test('notification tabs preserve drafts and save only their own settings', async () => {
  const [html, css, globalCss, script, utils, rbac, tabs] = await Promise.all([
    '../../frontend/admin/pages/notifications.html', '../../frontend/css/admin.css', '../../frontend/css/style.css',
    '../../frontend/admin/js/pages/notifications.js', '../../frontend/admin/js/core/utils.js', '../../frontend/admin/js/core/rbac.js', '../../frontend/admin/js/core/tabs.js',
  ].map(file => readFile(new URL(file, import.meta.url), 'utf8')));
  const browser = await chromium.launch({ executablePath: await browserExecutable(), headless: true });
  try {
    const page = await browser.newPage();
    await page.route('**/*', async route => {
      const pathname = new URL(route.request().url()).pathname;
      const scripts = {
        '/admin/js/pages/notifications.js': script,
        '/admin/js/pages/whatsapp-web.js': 'export function renderWhatsAppWebConsoleHeader() {}',
        '/admin/js/core/utils.js': utils,
        '/admin/js/core/rbac.js': rbac,
        '/admin/js/core/tabs.js': tabs,
        '/admin/js/core/api.js': `export async function fetchAdmin(endpoint, options = {}) {
          if (options.method === 'PUT') {
            window.saved.push(JSON.parse(options.body));
            return window.failSave ? {status:'error', message:'Simpan gagal'} : {status:'success'};
          }
          if (window.failLoad) return {status:'error', message:'Muat gagal'};
          return {status:'success',data: {notif_channel:'WA',pdf_delivery_channel:'DISABLED',wa_dispatch_mode:'AUTO',
            email_smtp_host:'smtp.test',email_smtp_port:'587',email_smtp_user:'user@test.local',email_smtp_pass:'secret',
            email_from_name:'Panitia',template_msg_paid:'lama',template_msg_pending:'pending',template_msg_cancel:'batal',
            template_email_paid:'email',template_email_pending:'email pending',template_email_cancel:'email batal',
            email_template_defaults:{PAID:'default paid',PENDING:'default pending',CANCEL:'default cancel'},wa_session:{status:'DISCONNECTED'}}};
        }`,
      };
      if (scripts[pathname]) return route.fulfill({ contentType: 'text/javascript', body: scripts[pathname] });
      if (pathname === '/admin.css') return route.fulfill({ contentType: 'text/css', body: css });
      if (pathname === '/style.css') return route.fulfill({ contentType: 'text/css', body: globalCss });
      return route.fulfill({ contentType: 'text/html', body: `<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/admin.css">${html}<div id="adminToastContainer"></div>` });
    });
    await page.goto('http://test.internal/');
    await page.evaluate(async () => {
      document.querySelector('#pane-notifications').classList.add('active');
      window.saved = [];
      window.module = await import('/admin/js/pages/notifications.js');
      window.module.initNotificationTabs();
    });
    await page.locator('#notifTabMode').click();
    await page.locator('[data-notif-save="mode"]').click();
    assert.equal(await page.evaluate(() => window.saved.length), 0);
    await page.evaluate(() => window.module.loadNotificationSettings());
    await page.locator('#notifSettingDispatchMode').selectOption('MANUAL');
    await page.locator('[data-notif-save="mode"]').click();
    await page.waitForFunction(() => window.saved.length === 1);
    assert.deepEqual(await page.evaluate(() => window.saved[0]), { wa_dispatch_mode: 'MANUAL' });
    await page.locator('#notifTabWaTemplate').click();
    await page.locator('#notifSettingTemplatePaid').fill('Perubahan belum disimpan');
    await page.locator('#notifTabSmtp').click();
    await page.locator('#notifSettingSmtpHost').fill('new.smtp.test');
    await page.locator('#notifSettingSmtpUser').fill('invalid-email');
    await page.locator('[data-notif-save="smtp"]').click();
    assert.equal(await page.evaluate(() => window.saved.length), 1);
    await page.locator('#notifSettingSmtpUser').fill('user@test.local');
    await page.locator('[data-notif-save="smtp"]').click();
    await page.waitForFunction(() => window.saved.length === 2);
    assert.deepEqual(await page.evaluate(() => Object.keys(window.saved[1]).sort()), ['email_from_name', 'email_smtp_host', 'email_smtp_pass', 'email_smtp_port', 'email_smtp_user']);
    await page.locator('#notifTabWaTemplate').click();
    assert.equal(await page.locator('#notifSettingTemplatePaid').inputValue(), 'Perubahan belum disimpan');
    await page.locator('#notifTabEmailTemplate').click();
    await page.locator('#notifSettingEmailTemplatePending').fill('');
    await page.evaluate(() => window.module.handleFillDefaultEmailTemplates());
    assert.equal(await page.locator('#notifSettingEmailTemplatePending').inputValue(), 'default pending');
    assert.equal(await page.locator('#notifSettingEmailTemplatePaid').inputValue(), 'email');
    await page.locator('[data-notif-save="emailTemplate"]').click();
    await page.waitForFunction(() => window.saved.length === 3);
    assert.deepEqual(await page.evaluate(() => Object.keys(window.saved[2]).sort()), ['template_email_cancel', 'template_email_paid', 'template_email_pending']);
    await page.locator('#notifTabChannel').click();
    await page.locator('#notifSettingChannel').selectOption('BOTH');
    await page.locator('[data-notif-save="channel"]').click();
    await page.waitForFunction(() => window.saved.length === 4);
    assert.deepEqual(await page.evaluate(() => window.saved[3]), { notif_channel: 'BOTH' });
    await page.locator('#notifTabPdf').click();
    await page.locator('#notifSettingPdfChannel').selectOption('EMAIL');
    await page.locator('[data-notif-save="pdf"]').click();
    await page.waitForFunction(() => window.saved.length === 5);
    assert.deepEqual(await page.evaluate(() => window.saved[4]), { pdf_delivery_channel: 'EMAIL' });
    await page.locator('#notifTabWaTemplate').click();
    await page.locator('[data-notif-save="waTemplate"]').click();
    await page.waitForFunction(() => window.saved.length === 6);
    assert.equal(await page.evaluate(() => window.saved[5].template_msg_paid), 'Perubahan belum disimpan');
    await page.locator('#notifTabTest').click();
    assert.equal(await page.locator('#btnSendTestNotif').isVisible(), true);
    for (const id of ['testNotifChannel', 'testNotifTarget', 'testNotifMessage', 'btnSendTestNotif']) {
      assert.equal(await page.locator(`#notifPanelTest #${id}`).count(), 1);
    }
    await page.locator('#notifTabGateway').click();
    assert.equal(await page.locator('#btnSendTestNotif').isVisible(), false);
    await page.locator('#notifTabGateway').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#notifTabMode').getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('#pane-notifications [role="tab"]').count(), 8);
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const id of ['Gateway', 'Mode', 'Channel', 'Pdf', 'Smtp', 'WaTemplate', 'EmailTemplate', 'Test']) {
        await page.locator(`#notifTab${id}`).click();
        assert.equal(await page.locator('#pane-notifications [role="tabpanel"]:visible').count(), 1);
        const overflow = await page.evaluate(() => ({
          width: document.documentElement.scrollWidth,
          viewport: innerWidth,
          elements: [...document.querySelectorAll('#pane-notifications *')]
            .filter(el => el.getBoundingClientRect().right > innerWidth + 1 && el.getClientRects().length)
            .map(el => `${el.tagName}#${el.id}.${el.className} ${Math.round(el.getBoundingClientRect().right)}`).slice(0, 10),
        }));
        assert.ok(overflow.width <= overflow.viewport + 1, `overflow on ${id} at ${width}: ${JSON.stringify(overflow)}`);
      }
    }
    await page.evaluate(async () => {
      const { applyRbacUi } = await import('/admin/js/core/rbac.js');
      applyRbacUi({role:{name:'ADMIN',permissions:[]}});
    });
    await page.locator('#notifTabMode').click();
    assert.equal(await page.locator('[data-notif-save="mode"]').isVisible(), false);
    await page.evaluate(async () => {
      const { applyRbacUi } = await import('/admin/js/core/rbac.js');
      applyRbacUi({role:{name:'SUPERADMIN'}});
      window.failSave = true;
    });
    await page.locator('[data-notif-save="mode"]').click();
    await page.waitForFunction(() => document.querySelector('#adminToastContainer').textContent.includes('Simpan gagal'));
    await page.evaluate(async () => { window.failLoad = true; await window.module.loadNotificationSettings(); });
    assert.match(await page.locator('#adminToastContainer').textContent(), /Muat gagal/);
    const savedCount = await page.evaluate(() => window.saved.length);
    await page.locator('[data-notif-save="mode"]').click();
    assert.equal(await page.evaluate(() => window.saved.length), savedCount);
  } finally { await browser.close(); }
});
