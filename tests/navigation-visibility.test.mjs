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

test('hiding every CMS home section replaces the navbar registration CTA with Coming Soon', async () => {
  const frontend = new URL('../../frontend/', import.meta.url);
  const browser = await chromium.launch({ executablePath: await browserExecutable(), headless: true });

  try {
    const page = await browser.newPage();
    await page.route('**/*', async route => {
      const pathname = new URL(route.request().url()).pathname;
      if (pathname === '/') {
        return route.fulfill({
          contentType: 'text/html',
          body: '<!doctype html><nav class="top-navbar"><ul><li id="checkTicketNav"><a href="/cek-tiket.html">Cek Tiket</a></li></ul></nav><button id="navDaftarBtn" class="btn btn-primary btn-glow"><i></i> Daftar Tiket</button><script type="module">import {areAllHomeSectionsHidden,syncNavigationVisibility,syncRegistrationCtaVisibility} from "/js/navigation-visibility.js"; window.syncCta=syncRegistrationCtaVisibility; window.syncNav=syncNavigationVisibility; window.allHidden=areAllHomeSectionsHidden;</script>',
        });
      }
      if (pathname === '/js/navigation-visibility.js') {
        return route.fulfill({
          contentType: 'text/javascript',
          body: await readFile(new URL('js/navigation-visibility.js', frontend), 'utf8'),
        });
      }
      return route.abort();
    });

    await page.goto('http://test.internal/');
    await page.waitForFunction(() => typeof window.syncCta === 'function');
    await page.evaluate(() => {
      const visibility = {
        hero: false, stats: false, route: false, facilities: false,
        tickets: false, legal: false, faq: false, footer: false,
      };
      window.syncCta(visibility);
      window.syncNav(visibility);
    });
    const button = page.locator('#navDaftarBtn');
    assert.equal(await button.isDisabled(), true);
    assert.match(await button.innerText(), /COMING SOON/);
    assert.doesNotMatch(await button.innerText(), /Daftar Tiket/);
    assert.equal(await button.getAttribute('aria-label'), 'Informasi event segera hadir');
    assert.equal(await button.evaluate(element => element.classList.contains('is-coming-soon')), true);
    assert.equal(await page.locator('#checkTicketNav').isHidden(), true);
    await page.evaluate(() => {
      const visibility = {
        hero: false, stats: false, route: false, facilities: false,
        tickets: false, legal: false, faq: false, footer: true,
      };
      window.syncCta(visibility);
      window.syncNav(visibility);
    });
    assert.equal(await page.locator('#checkTicketNav').isVisible(), true, 'Cek Tiket returns when the home page is no longer in Coming Soon mode');
    assert.equal(await page.evaluate(() => window.allHidden({
      hero: false, stats: false, route: false, facilities: false,
      tickets: false, legal: false, faq: false, footer: true,
    })), false, 'the Coming Soon CTA only applies when every section is disabled');
  } finally {
    await browser.close();
  }
});

test('mobile and tablet layouts display the editable platform name as a fixed bookmark ribbon', async () => {
  const frontend = new URL('../../frontend/', import.meta.url);
  const navbar = await readFile(new URL('template/layout/navbar.html', frontend), 'utf8');
  const style = await readFile(new URL('css/style.css', frontend), 'utf8');
  const browser = await chromium.launch({ executablePath: await browserExecutable(), headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.route('**/*', route => route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><style>${style}</style>${navbar}`,
    }));
    await page.goto('http://test.internal/');

    const platformName = page.locator('#mobileNavbarPlatformName');
    assert.equal(await platformName.textContent(), 'SIEXA');
    const mobileStyle = await platformName.evaluate(element => {
      const style = getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      return {
        position: style.position,
        clipPath: style.clipPath,
        background: style.backgroundImage,
        top: bounds.top,
        left: bounds.left,
        display: style.display,
      };
    });
    assert.equal(mobileStyle.position, 'fixed');
    assert.match(mobileStyle.clipPath, /polygon/);
    assert.match(mobileStyle.background, /linear-gradient/);
    assert.equal(mobileStyle.display, 'block');
    assert.equal(mobileStyle.top, 0);
    assert.equal(mobileStyle.left, 16);
    assert.equal(await page.locator('.top-navbar-container').isHidden(), true, 'the standalone bookmark remains visible when the mobile layout hides the navbar');
    assert.equal(await page.locator('#navbarEventName').textContent(), 'TEGAL RUN 2026');

    for (const width of [820, 1024, 1077, 1200]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await platformName.evaluate(element => getComputedStyle(element).display), 'block', `bookmark ribbon should show at ${width}px`);
      assert.equal(await platformName.evaluate(element => getComputedStyle(element).pointerEvents), 'none');
      assert.equal(await platformName.evaluate(element => getComputedStyle(element).transform), 'none');
      assert.equal(await page.locator('#navbarPlatformName').evaluate(element => getComputedStyle(element).display), 'none');
      if (width > 768) {
        const ribbonBottom = await platformName.evaluate(element => element.getBoundingClientRect().bottom);
        const navbarTop = await page.locator('.top-navbar-container').evaluate(element => element.getBoundingClientRect().top);
        assert.ok(navbarTop >= ribbonBottom, `navbar should not overlap bookmark ribbon at ${width}px`);
      }
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    assert.equal(await platformName.evaluate(element => getComputedStyle(element).display), 'none');
  } finally {
    await browser.close();
  }
});
