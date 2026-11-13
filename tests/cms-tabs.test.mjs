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

test('CMS tabs retain drafts, preserve global save and expose invalid fields', async () => {
  const base = new URL('../../frontend/', import.meta.url);
  const files = [
    'admin/pages/cms.html', 'css/style.css', 'css/admin.css',
    'admin/js/pages/cms.js', 'admin/js/pages/color-palettes.js', 'admin/js/core/tabs.js',
    'admin/js/core/utils.js', 'js/home-appearance.js', 'js/jersey-gallery.js',
  ];
  const contents = Object.fromEntries(await Promise.all(files.map(async file => [
    `/${file}`, (await readFile(new URL(file, base), 'utf8')).replace(/^import ['"][^'"]+\.css['"];?\s*$/gm, ''),
  ])));
  const browser = await chromium.launch({ executablePath: await browserExecutable(), headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.pathname === '/admin/js/core/api.js') return route.fulfill({ contentType: 'text/javascript', body: `
        export async function fetchAdmin(url, options = {}) {
          if (options.method === 'PUT') { window.saved.push(JSON.parse(options.body)); return {status:'success',data:{}}; }
          return {status:'success',data:{site_title:'Judul awal', contact_email:'admin@example.test'}};
        }` });
      if (contents[url.pathname]) return route.fulfill({
        contentType: url.pathname.endsWith('.js') ? 'text/javascript' : 'text/css',
        body: contents[url.pathname],
      });
      if (url.pathname === '/') return route.fulfill({ contentType: 'text/html', body: `
        <!doctype html><meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/css/style.css"><link rel="stylesheet" href="/css/admin.css">
        ${contents['/admin/pages/cms.html']}<div id="adminToastContainer"></div>` });
      return route.abort();
    });
    await page.goto('http://test.internal/');
    await page.evaluate(async () => {
      document.querySelector('#pane-cms').classList.add('active');
      window.saved = [];
      window.cms = await import('/admin/js/pages/cms.js');
      window.cms.initCmsTabs(document.querySelector('#pane-cms [role="tablist"]'));
      document.querySelector('#formCmsSettings').addEventListener('submit', window.cms.handleCmsSubmit);
      await window.cms.loadCmsSettings();
      document.querySelector('#btnToggleCmsPreview').click();
    });
    assert.equal(await page.locator('#pane-cms [role="tab"]').count(), 10);
    await page.locator('#cmsTabHero').click();
    await page.locator('#cmsSiteTitle').fill('Judul baru');
    await page.locator('#cmsTabContact').click();
    await page.locator('#cmsContactEmail').fill('email-tidak-valid');
    await page.locator('#cmsTabFaq').click();
    await page.locator('#btnSaveCmsSubmit').click();
    assert.equal(await page.locator('#cmsTabContact').getAttribute('aria-selected'), 'true');
    assert.equal(await page.evaluate(() => window.saved.length), 0);
    await page.locator('#cmsContactEmail').fill('admin@example.test');
    await page.locator('#cmsTabMedia').click();
    await page.locator('#cmsJerseyGalleryImages').fill('invalid-url');
    await page.locator('#cmsTabHero').click();
    await page.locator('#btnSaveCmsSubmit').click();
    assert.equal(await page.locator('#cmsTabMedia').getAttribute('aria-selected'), 'true');
    assert.equal(await page.evaluate(() => window.saved.length), 0);
    await page.locator('#cmsJerseyGalleryImages').fill('');
    await page.locator('#cmsTabContact').click();
    await page.locator('#cmsContactPhone').fill('08123456789');
    await page.locator('#btnSaveCmsSubmit').click();
    await page.waitForFunction(() => window.saved.length === 1);
    assert.equal(await page.evaluate(() => window.saved[0].site_title), 'Judul baru');
    assert.equal(await page.evaluate(() => window.saved[0].contact_phone), '08123456789');
    await page.locator('#cmsTabHero').click();
    assert.equal(await page.locator('#cmsSiteTitle').inputValue(), 'Judul baru');
    assert.equal(await page.locator('#cmsLivePreview').isVisible(), true);
    await page.locator('#cmsTabHero').focus();
    await page.keyboard.press('End');
    assert.equal(await page.locator('#cmsTabContact').getAttribute('aria-selected'), 'true');
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const id of ['Visibility', 'Hero', 'Stats', 'Route', 'Faq', 'ComingSoon', 'Media', 'Legal', 'Documents', 'Contact']) {
        await page.locator(`#cmsTab${id}`).click();
        assert.equal(await page.locator('#pane-cms [role="tabpanel"]:visible').count(), 1);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow on ${id} at ${width}`);
      }
    }
  } finally { await browser.close(); }
});
