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

test('ticket detail updates via Socket.IO without navigation and shows square medal', async () => {
  const frontend = new URL('../../frontend/', import.meta.url);
  const html = (await readFile(new URL('ticket-detail.html', frontend), 'utf8'))
    .replace('</head>', '<link rel="stylesheet" href="/css/jersey-gallery.css"></head>');
  const css = await readFile(new URL('css/ticket-detail.css', frontend), 'utf8');
  const siteCss = await readFile(new URL('css/style.css', frontend), 'utf8');
  const galleryCss = await readFile(new URL('css/jersey-gallery.css', frontend), 'utf8');
  const browser = await chromium.launch({ executablePath: await browserExecutable(), headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript(() => {
      window.ticketData = {
        id: 'event-1',
        ticketName: 'Kategori Awal',
        category: '10K',
        stock: 1000,
        remainingStock: 1000,
        totalCapacity: 1000,
        registeredCount: 0,
        price: 250000,
        isClosed: false,
        eventDate: null,
        ticketImage: 'https://test.internal/cover.jpg',
        medalImage: 'https://test.internal/medal.jpg',
        benefits: [{ name: 'GoodieBag', description: 'Perlengkapan lari peserta', image: null }],
        jerseys: [],
        bibConfig: null,
      };
      window.apiCalls = [];
      window.socketHandlers = {};
    });

    await page.route('**/*', async route => {
      const pathname = new URL(route.request().url()).pathname;
      if (pathname === '/ticket-detail.html') {
        return route.fulfill({ contentType: 'text/html', body: html });
      }
      if (pathname === '/css/ticket-detail.css') {
        return route.fulfill({ contentType: 'text/css', body: css });
      }
      if (pathname === '/css/style.css') {
        return route.fulfill({ contentType: 'text/css', body: siteCss });
      }
      if (pathname === '/css/jersey-gallery.css') {
        return route.fulfill({ contentType: 'text/css', body: galleryCss });
      }
      if (pathname === '/js/ticket-detail.js') {
        return route.fulfill({
          contentType: 'text/javascript',
          body: await readFile(new URL('js/ticket-detail.js', frontend), 'utf8'),
        });
      }
      const modules = {
        '/js/api.js': `export async function apiFetch(path) {
          window.apiCalls.push(path);
          const response = data => ({ok:true, async text(){return JSON.stringify(data)}, async json(){return data}});
          if (path.startsWith('/events/')) return response({status:'success',data:window.ticketData});
          if (path === '/settings/checkout-config') return response({status:'success',data:{}});
          if (path === '/settings/countdown') return response({status:'success',data:{isRegistrationClosed:false}});
          throw new Error('Unexpected API request: ' + path);
        }`,
        '/js/branding.js': 'export async function loadWebsiteBranding() { return {}; }',
        '/js/jersey-gallery.js': `export function isValidGalleryImageUrl() { return true; }
          export function parseJerseyGallery() { return []; }
          export function renderJerseyGallery() {}`,
        '/js/realtime.js': `export function subscribeRealtimeEvent(name, handler) { window.socketHandlers[name] = handler; return () => {}; }
          export function connectRealtimeSocket() { window.socketConnected = true; }`,
      };
      if (modules[pathname]) return route.fulfill({ contentType: 'text/javascript', body: modules[pathname] });
      return route.fulfill({ status: 204, body: '' });
    });

    let navigations = 0;
    page.on('framenavigated', frame => {
      if (frame === page.mainFrame()) navigations++;
    });
    await page.goto('http://test.internal/ticket-detail.html?id=event-1');
    await page.waitForFunction(() => document.querySelector('#tdContentSection')?.style.display === 'block');
    assert.equal(await page.locator('#tdTicketName').textContent(), 'Kategori Awal');
    assert.equal(await page.locator('#tdMedalHighlight').isVisible(), true);
    const medalStyle = await page.locator('#tdMedalImage').evaluate(image => {
      const style = getComputedStyle(image);
      return { width: style.width, height: style.height, border: style.borderTopWidth, radius: style.borderRadius };
    });
    assert.equal(medalStyle.width, '80px');
    assert.equal(medalStyle.height, '80px');
    assert.equal(medalStyle.border, '0px');
    assert.equal(medalStyle.radius, '0px');
    const pinStyle = await page.locator('#tdMedalHighlight').evaluate(element => {
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        shadow: style.boxShadow,
        animation: style.animationName,
        attachment: getComputedStyle(element, '::after').borderTopStyle,
      };
    });
    assert.equal(pinStyle.background, 'rgba(0, 0, 0, 0)', 'medal pin should not have a rectangular backing');
    assert.equal(pinStyle.shadow, 'none');
    assert.equal(pinStyle.animation, 'td-pin-sway');
    assert.equal(await page.locator('#tdMedalHighlight').evaluate(element => getComputedStyle(element).animationDuration), '3.2s');
    assert.equal(pinStyle.attachment, 'solid');
    const sectionStyle = await page.locator('.td-col-main > .td-card').nth(1).evaluate(element => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, border: style.borderTopWidth, radius: style.borderTopLeftRadius };
    });
    assert.equal(sectionStyle.background, 'rgb(255, 255, 255)');
    assert.equal(sectionStyle.border, '1px');
    assert.notEqual(sectionStyle.radius, '0px');
    const benefitStyle = await page.locator('.td-benefit-card').evaluate(element => {
      const card = getComputedStyle(element);
      const media = getComputedStyle(element.querySelector('.td-benefit-media'));
      return {
        cardRadius: card.borderTopLeftRadius,
        cardBackground: card.backgroundImage,
        cardShadow: card.boxShadow,
        mediaRadius: media.borderTopLeftRadius,
        mediaWidth: media.width,
      };
    });
    assert.notEqual(benefitStyle.cardRadius, '0px');
    assert.match(benefitStyle.cardBackground, /linear-gradient/);
    assert.notEqual(benefitStyle.cardShadow, 'none');
    assert.equal(benefitStyle.mediaRadius, '16px');
    assert.equal(benefitStyle.mediaWidth, '68px');
    const metricStyle = await page.locator('.td-spec-box').first().evaluate(element => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, borderTop: style.borderTopWidth, border: style.borderLeftWidth };
    });
    assert.equal(metricStyle.background, 'rgb(248, 250, 252)', 'ticket metrics should have distinct cards inside the overview panel');
    assert.equal(metricStyle.border, '1px');
    await page.evaluate(() => {
      const button = document.createElement('button');
      button.className = 'jersey-gallery-slide';
      button.innerHTML = '<img alt="Desain jersey">';
      document.querySelector('#tdJerseyGallery').append(button);
    });
    const galleryImageStyle = await page.locator('#tdJerseyGallery .jersey-gallery-slide').evaluate(element => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, border: style.borderTopWidth, padding: style.padding };
    });
    assert.equal(galleryImageStyle.background, 'rgba(0, 0, 0, 0)', 'jersey gallery images should not have a dedicated box');
    assert.equal(galleryImageStyle.border, '0px');
    assert.equal(galleryImageStyle.padding, '0px');
    const pinBounds = await page.locator('#tdMedalHighlight').boundingBox();
    const coverBoundsDesktop = await page.locator('#tdTicketCover').boundingBox();
    assert.ok(pinBounds.x + pinBounds.width > coverBoundsDesktop.x + coverBoundsDesktop.width - 30, 'medal pin should be positioned in the upper-right corner');
    assert.ok(pinBounds.y < coverBoundsDesktop.y + 40, 'medal pin should stay near the top edge of the cover');

    const initialNavigations = navigations;
    await page.evaluate(() => {
      window.ticketData = {
        ...window.ticketData,
        ticketName: 'Kategori Diperbarui',
        medalImage: 'https://test.internal/medal-updated.jpg',
        price: 300000,
        stock: 999,
        remainingStock: 999,
        totalCapacity: 1000,
        registeredCount: 1,
      };
      window.socketHandlers['public:data_changed']({ topics: ['events'] });
    });
    await page.waitForFunction(() => document.querySelector('#tdTicketName')?.textContent === 'Kategori Diperbarui');
    assert.match(await page.locator('#tdPrice').textContent(), /300\.000/);
    assert.equal(await page.locator('#tdStockPercentage').textContent(), '99,9% tersedia');
    assert.equal(await page.locator('#tdStockFill').evaluate(element => element.style.width), '99.9%');
    assert.equal(await page.locator('#tdMedalImage').getAttribute('src'), 'https://test.internal/medal-updated.jpg');
    assert.equal(navigations, initialNavigations, 'Socket.IO update must not navigate or reload the page');
    assert.equal(await page.evaluate(() => window.socketConnected), true);

    await page.setViewportSize({ width: 375, height: 812 });
    const mobileBenefitMediaWidth = await page.locator('.td-benefit-media').evaluate(element => getComputedStyle(element).width);
    assert.equal(mobileBenefitMediaWidth, '56px');
    const coverBounds = await page.locator('#tdTicketCover').boundingBox();
    assert.ok(coverBounds.width <= 375, `detail cover overflows mobile viewport: ${JSON.stringify(coverBounds)}`);
  } finally {
    await browser.close();
  }
});
