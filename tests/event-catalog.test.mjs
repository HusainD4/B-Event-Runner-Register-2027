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

test('event catalog preserves actions and remains responsive', async () => {
  const base = new URL('../../frontend/', import.meta.url);
  const files = ['admin/pages/events.html', 'admin/js/pages/events.js', 'admin/js/core/utils.js',
    'admin/js/core/rbac.js', 'admin/modals/modals.html', 'css/style.css', 'css/admin.css'];
  const contents = Object.fromEntries(await Promise.all(files.map(async file => [`/${file}`, await readFile(new URL(file, base), 'utf8')])));
  const browser = await chromium.launch({ executablePath: await browserExecutable(), headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.route('**/*', async route => {
      const pathname = new URL(route.request().url()).pathname;
      const mocks = {
        '/admin/js/core/state.js': 'export const adminState = window.state;',
        '/admin/js/pages/dashboard.js': 'export function updateKpis() {}',
        '/admin/js/core/tabs.js': 'export function selectTab() {}',
        '/admin/js/core/api.js': `export async function fetchAdmin(url, options = {}) {
          window.calls.push({url, options});
          if (options.method === 'PUT') {
            const eventId = url.split('/').pop();
            const event = window.state.events.find(item => item.id === eventId);
            if (event) Object.assign(event, JSON.parse(options.body));
            return {status:'success'};
          }
          if (url === '/admin/events') return {status:'success',data:window.state.events};
          return {status:'success',data:[]};
        }`,
        '/js/api.js': 'export async function apiFetch() {}',
        '/js/jersey-gallery.js': 'export function parseJerseyGallery() { return []; }',
      };
      if (mocks[pathname]) return route.fulfill({ contentType: 'text/javascript', body: mocks[pathname] });
      if (contents[pathname]) return route.fulfill({ contentType: pathname.endsWith('.js') ? 'text/javascript' : 'text/css', body: contents[pathname] });
      return route.fulfill({ contentType: 'text/html', body: `<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/css/style.css"><link rel="stylesheet" href="/css/admin.css">
        <div class="admin-main-wrapper"><main class="admin-content-body">
        ${contents['/admin/pages/events.html']}</main></div>
        ${contents['/admin/modals/modals.html']}<div id="adminToastContainer"></div>` });
    });
    await page.goto('http://test.internal/');
    await page.evaluate(async () => {
      document.querySelector('#pane-events').classList.add('active');
      window.calls = [];
      window.state = { profile: { role: { name: 'SUPERADMIN', permissions: [] } }, events: [
        { id:'event-1', ticketName:'Lari & Senang', category:'10K', stock:100, price:250000, isClosed:false, benefits:[
          { id:'jersey', name:'Jersey', description:'Kaos peserta' },
          { id:'medal', name:'Medali', description:'Medali finisher' },
        ], racepackBenefitIds:['jersey'], jerseys:[{}] },
        { id:'event-2', ticketName:'Kategori Timer', category:'5K', stock:0, price:100000, isClosed:false, registrationClosed:true, registrationClosedByTimer:true, followGlobalTimer:true, registrationPhase:'RACE_DAY', benefits:[] },
      ] };
      window.events = await import('/admin/js/pages/events.js');
      window.events.renderEvents(window.state.events);
    });
    assert.equal(await page.locator('.event-catalog-card').count(), 2);
    assert.equal(await page.locator('.event-catalog-placeholder').count(), 2);
    const config = page.locator('.racepack-config[data-event-id="event-1"]');
    assert.equal(await page.locator('#adminEventsContainer .racepack-config').count(), 0);
    assert.equal(await page.locator('#racepackConfigContainer .racepack-config').count(), 2);
    assert.match(await config.locator('tbody').textContent(), /Jersey/);
    assert.doesNotMatch(await config.locator('tbody').textContent(), /Medali/);
    assert.match(await page.locator('.racepack-config[data-event-id="event-2"] tbody').textContent(), /Belum ada perlengkapan/);
    await config.locator('input[value="medal"]').check();
    assert.match(await config.locator('tbody').textContent(), /Medali/);
    assert.match(await config.locator('.racepack-preview-label').textContent(), /belum disimpan/);
    await config.locator('.btn-save-racepack-benefits').click();
    await page.waitForFunction(() => window.calls.some(call => call.url.endsWith('/racepack-benefits')));
    assert.deepEqual(await page.evaluate(() => JSON.parse(window.calls.find(call => call.url.endsWith('/racepack-benefits')).options.body)), { benefitIds:['jersey', 'medal'] });
    assert.match(await config.locator('.racepack-preview-label').textContent(), /tersimpan/);
    await page.evaluate(() => { window.calls = []; });
    assert.match(await page.locator('.event-catalog-card').first().textContent(), /Lari & Senang/);
    assert.equal(await page.locator('[data-id="event-2"].btn-toggle-close-event').isDisabled(), true);
    assert.equal(await page.locator('#eventStock-event-1').isVisible(), false);
    const box = await page.locator('.event-catalog-summary').first().boundingBox();
    assert.ok(box.width <= 250 && Math.abs(box.width - box.height) <= 1, JSON.stringify(box));
    await page.locator('.event-catalog-summary').first().click();
    assert.equal(await page.locator('#eventStock-event-1').isVisible(), true);
    await page.locator('.btn-toggle-homepage-visibility[data-id="event-1"]').uncheck();
    await page.waitForFunction(() => window.calls.some(call =>
      call.url.endsWith('/event-1') && call.options.method === 'PUT'
      && JSON.parse(call.options.body).isVisible === false
    ));
    await page.waitForFunction(() => document.querySelector('.btn-toggle-homepage-visibility[data-id="event-1"]')?.checked === false);
    assert.equal(await page.locator('.event-catalog-card').first().getAttribute('open'), '');
    const titleRow = await page.locator('.event-catalog-title-row').first().boundingBox();
    const titleBounds = await page.locator('.event-catalog-title-row .admin-event-title').first().boundingBox();
    const toggleBounds = await page.locator('.event-catalog-title-row .event-visibility-toggle').first().boundingBox();
    assert.ok(
      titleBounds.x + titleBounds.width < toggleBounds.x
      && toggleBounds.x + toggleBounds.width <= titleRow.x + titleRow.width,
      `visibility toggle should sit to the right of the ticket name: ${JSON.stringify({ titleRow, titleBounds, toggleBounds })}`
    );
    for (const width of [1440, 768, 640, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const buttons = await page.locator('.event-catalog-card').first().locator('.admin-event-actions .btn').all();
      const boxes = await Promise.all(buttons.map(button => button.boundingBox()));
      assert.equal(boxes.length, 6);
      for (let i = 1; i < boxes.length; i++) {
        assert.ok(Math.abs(boxes[i].x - boxes[0].x) < 1 && Math.abs(boxes[i].width - boxes[0].width) < 1, `buttons not aligned at ${width}: ${JSON.stringify(boxes)}`);
        assert.ok(boxes[i].y >= boxes[i - 1].y + boxes[i - 1].height, `buttons overlap at ${width}`);
      }
      if (width <= 640) {
        assert.ok(boxes.every(box => box.height >= 44), `touch targets at ${width}`);
        const layout = await page.evaluate(() => {
          const rect = selector => document.querySelector(selector).getBoundingClientRect();
          const description = rect('.event-catalog-header p');
          const headerActions = rect('.event-catalog-header .admin-action-bar');
          const card = rect('.event-catalog-card');
          const secondCard = rect('.event-catalog-card:nth-child(2)');
          const list = rect('#adminEventsContainer');
          const stock = rect('#eventStock-event-1');
          const price = rect('#eventPrice-event-1');
          const status = rect('.event-catalog-card:nth-child(2) .event-status-tag');
          const visual = rect('.event-catalog-card:nth-child(2) .event-catalog-visual');
          return {
            headerGap: headerActions.top - description.bottom,
            centered: Math.abs((card.left + (Math.abs(card.top - secondCard.top) < 1 ? secondCard.right : card.right)) / 2 - (list.left + list.right) / 2),
            stockBottom: stock.bottom,
            priceTop: price.top,
            statusRight: status.right,
            visualRight: visual.right,
          };
        });
        assert.ok(layout.headerGap >= 0 && layout.headerGap <= 24, `header spacing at ${width}: ${JSON.stringify(layout)}`);
        assert.ok(layout.centered <= 1, `card alignment at ${width}: ${JSON.stringify(layout)}`);
        assert.ok(layout.priceTop >= layout.stockBottom, `fields overlap at ${width}: ${JSON.stringify(layout)}`);
        assert.ok(layout.statusRight <= layout.visualRight, `status overflow at ${width}: ${JSON.stringify(layout)}`);
        for (const button of await page.locator('.event-catalog-header .btn').all()) {
          assert.ok((await button.boundingBox()).height >= 44, `header touch target at ${width}`);
        }
      }
    }
    await page.locator('#eventStock-event-1').fill('42');
    await page.locator('#eventPrice-event-1').fill('123000');
    await page.locator('.btn-quick-save-event[data-id="event-1"]').click();
    await page.waitForFunction(() => window.calls.some(call => call.options.method === 'PUT'));
    assert.deepEqual(await page.evaluate(() => JSON.parse(window.calls.find(call =>
      call.options.method === 'PUT' && JSON.parse(call.options.body).stock !== undefined
    ).options.body)), {stock:42, price:123000});
    await page.locator('.event-catalog-summary').first().click();
    await page.locator('.btn-manage-benefits[data-id="event-1"]').click();
    assert.equal(await page.locator('#modalEventBenefitsBackdrop').isVisible(), true);
    await page.evaluate(() => document.querySelector('#modalEventBenefitsBackdrop').classList.remove('open'));
    await page.evaluate(() => {
      window.state.profile = { role: { name:'ADMIN', permissions:['events:read'] } };
      window.events.renderEvents(window.state.events);
      document.querySelector('#adminToastContainer').replaceChildren();
    });
    await page.locator('.event-catalog-summary').first().click();
    assert.equal(await page.locator('.btn-quick-save-event').first().isVisible(), false);
    assert.equal(await page.locator('.btn-delete-event').first().isVisible(), false);
    assert.equal(await page.locator('.racepack-config-section').isVisible(), false);
    for (const width of [1440, 768, 640, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        elements: [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > innerWidth + 1).slice(0, 6).map(el => `${el.tagName}.${el.className}#${el.id}`),
      }));
      assert.ok(overflow.width <= width + 1, `overflow at ${width}: ${JSON.stringify(overflow)}`);
      assert.ok(await page.locator('.event-catalog-card').first().isVisible());
      const bounds = await page.locator('.event-catalog-summary').first().boundingBox();
      assert.ok(bounds.width <= 250 && Math.abs(bounds.width - bounds.height) <= 1, `square at ${width}: ${JSON.stringify(bounds)}`);
    }
    await page.evaluate(() => window.events.renderEvents([]));
    assert.match(await page.locator('#adminEventsContainer').textContent(), /Belum ada kategori tiket/);
  } finally { await browser.close(); }
});
