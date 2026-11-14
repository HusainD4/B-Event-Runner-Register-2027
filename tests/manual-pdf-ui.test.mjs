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

test('notification log PDF button uses configured channel, confirms and respects paid status and RBAC', async () => {
  const source = await readFile(new URL('../../frontend/admin/js/pages/notif-logs.js', import.meta.url), 'utf8');
  const utils = await readFile(new URL('../../frontend/admin/js/core/utils.js', import.meta.url), 'utf8');
  const rbac = await readFile(new URL('../../frontend/admin/js/core/rbac.js', import.meta.url), 'utf8');
  const browser = await chromium.launch({ executablePath: await browserExecutable(), headless: true });
  try {
    const page = await browser.newPage();
    await page.route('**/*', async route => {
      const pathname = new URL(route.request().url()).pathname;
      const scripts = {
        '/admin/js/pages/notif-logs.js': source,
        '/admin/js/core/utils.js': utils,
        '/admin/js/core/rbac.js': rbac,
        '/admin/js/core/state.js': "export const adminState = window.testState;",
        '/admin/js/core/api.js': `export async function fetchAdmin(endpoint, options) {
          if (endpoint.includes('dispatch-pdf')) {
            window.requests.push(JSON.parse(options.body));
            return { status: 'success', message: 'Diproses' };
          }
          if (endpoint.includes('whatsapp/session')) return { data: { status: 'CONNECTED' } };
          return { status: 'success', data: { items: window.testItems, stats: { notificationChannel: window.testChannel } } };
        }`,
      };
      if (scripts[pathname]) return route.fulfill({ contentType: 'text/javascript', body: scripts[pathname] });
      if (pathname === '/') return route.fulfill({ contentType: 'text/html', body: `
        <table><tbody id="notifLogsTableBody"></tbody></table><div id="adminToastContainer"></div>
        <div id="confirmModalBackdrop"><span id="confirmModalTitle"></span><span id="confirmModalMessage"></span>
        <span id="confirmModalIcon"></span><button id="btnConfirmOk"></button><button id="btnConfirmCancel"></button></div>
      ` });
      return route.abort();
    });

    await page.goto('http://test.internal/');
    await page.evaluate(async () => {
      window.requests = [];
      window.testChannel = 'BOTH';
      window.testState = { profile: { role: { name: 'SUPERADMIN', permissions: [] } } };
      window.testItems = [
        { orderId: 'paid', orderStatus: 'SETTLEMENT', customerName: 'Pelari', customerPhone: '0812', customerEmail: 'a@example.test', ticketCategory: '5K', bibNumbers: '-', pdfDeliveries: [{ channel: 'EMAIL', status: 'SENT' }] },
        { orderId: 'pending', orderStatus: 'PENDING', customerName: 'Pending', customerPhone: '-', customerEmail: '-', ticketCategory: '5K', bibNumbers: '-', pdfDeliveries: [] },
      ];
      window.logsModule = await import('/admin/js/pages/notif-logs.js');
      await window.logsModule.loadNotificationLogs();
    });
    const buttons = page.locator('.btn-dispatch-pdf');
    assert.equal(await buttons.count(), 2);
    assert.equal(await buttons.nth(1).isDisabled(), true);
    assert.equal(await page.locator('.pdf-channel').count(), 0);
    assert.match(await page.locator('.notif-log-channel').first().textContent(), /WA \+ Email/);
    await buttons.first().click();
    assert.equal(await buttons.first().isDisabled(), true);
    assert.match(await page.locator('#confirmModalMessage').textContent(), /WhatsApp dan email.*duplikat/);
    await page.locator('#btnConfirmCancel').click();
    assert.equal(await buttons.first().isEnabled(), true);
    assert.equal(await page.evaluate(() => window.requests.length), 0);
    await buttons.first().click();
    await page.locator('#btnConfirmOk').click();
    await page.waitForFunction(() => window.requests.length === 1);
    assert.deepEqual(await page.evaluate(() => window.requests[0]), { orderId: 'paid', channel: 'BOTH', confirmResend: true });
    await page.waitForFunction(() => document.querySelector('#adminToastContainer')?.textContent.includes('Diproses'));
    await page.evaluate(() => {
      window.testState.profile.role = { name: 'STAFF', permissions: ['notifications:read'] };
      window.logsModule.renderNotifLogsTable(window.testItems);
    });
    assert.equal(await page.locator('.btn-dispatch-pdf').first().isVisible(), false);
    assert.equal(await page.locator('.notif-log-channel').first().isVisible(), false);
    for (const [channel, label] of [['WA', 'WhatsApp'], ['EMAIL', 'Email'], ['BOTH', 'WA + Email']]) {
      await page.evaluate(async channel => {
        window.testState.profile.role = { name: 'SUPERADMIN', permissions: [] };
        window.testChannel = channel;
        await window.logsModule.loadNotificationLogs();
      }, channel);
      assert.equal((await page.locator('.notif-log-channel').first().textContent()).trim(), `Kirim via ${label}`);
      assert.equal(await page.locator('.btn-dispatch-pdf').first().isEnabled(), true);
    }
    await page.evaluate(async () => {
      window.testState.profile.role = { name: 'SUPERADMIN', permissions: [] };
      window.testChannel = 'DISABLED';
      await window.logsModule.loadNotificationLogs();
    });
    assert.equal(await page.locator('.btn-dispatch-pdf').first().isDisabled(), true);
    assert.match(await page.locator('.notif-log-channel').first().textContent(), /Nonaktif/);
    await page.evaluate(async () => {
      window.testChannel = 'WA';
      window.testItems = ['SETTLEMENT', 'CAPTURE', 'PENDING', 'CANCEL', 'EXPIRE', 'DENY', 'REFUND', 'UNEXPECTED', null]
        .map((orderStatus, index) => ({
          orderId: `order-${index}`, orderStatus, customerName: 'Pelari',
          customerPhone: '-', customerEmail: '-', ticketCategory: '5K', bibNumbers: '-', pdfDeliveries: [],
        }));
      await window.logsModule.loadNotificationLogs();
    });
    const rows = page.locator('#notifLogsTableBody tr');
    const expected = [
      ['LUNAS', 'Pembayaran berhasil', true], ['LUNAS', 'Pembayaran berhasil', true],
      ['PENDING', 'Menunggu pembayaran', false], ['GAGAL', 'Dibatalkan', false],
      ['GAGAL', 'Kedaluwarsa', false], ['GAGAL', 'Ditolak', false],
      ['REFUND', 'Dana dikembalikan', false], ['TIDAK DIKETAHUI', 'UNEXPECTED', false],
      ['TIDAK DIKETAHUI', 'Status tidak tersedia', false],
    ];
    for (const [index, [label, detail, enabled]] of expected.entries()) {
      const cell = rows.nth(index).locator('[data-label="Pembayaran"]');
      assert.match(await cell.textContent(), new RegExp(label));
      assert.match(await cell.textContent(), new RegExp(detail));
      assert.equal(await rows.nth(index).locator('.btn-dispatch-pdf').isEnabled(), enabled);
    }
  } finally {
    await browser.close();
  }
});

test('notification and WhatsApp console layouts remain usable at desktop and mobile widths', async () => {
  const [css, logsHtml, waHtml, logsJs, waJs, utils, rbac] = await Promise.all([
    '../../frontend/css/admin.css', '../../frontend/admin/pages/notif-logs.html',
    '../../frontend/admin/pages/whatsapp-web.html', '../../frontend/admin/js/pages/notif-logs.js',
    '../../frontend/admin/js/pages/whatsapp-web.js', '../../frontend/admin/js/core/utils.js',
    '../../frontend/admin/js/core/rbac.js',
  ].map(file => readFile(new URL(file, import.meta.url), 'utf8')));
  const browser = await chromium.launch({ executablePath: await browserExecutable(), headless: true });
  try {
    const page = await browser.newPage();
    await page.route('**/*', async route => {
      const pathname = new URL(route.request().url()).pathname;
      const scripts = {
        '/admin/js/pages/notif-logs.js': logsJs,
        '/admin/js/pages/whatsapp-web.js': waJs,
        '/admin/js/core/utils.js': utils,
        '/admin/js/core/rbac.js': rbac,
        '/admin/js/core/state.js': "export const adminState = window.testState;",
        '/admin/js/core/api.js': `export async function fetchAdmin(endpoint) {
          if (endpoint.includes('whatsapp/session')) return { data: { status: 'CONNECTED' } };
          return { status: 'success', data: { items: [window.fixture], stats: { notificationChannel: 'WA' } } };
        }`,
      };
      if (scripts[pathname]) return route.fulfill({ contentType: 'text/javascript', body: scripts[pathname] });
      if (pathname === '/admin.css') return route.fulfill({ contentType: 'text/css', body: css });
      if (pathname === '/') return route.fulfill({ contentType: 'text/html', body: `<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/admin.css">${logsHtml}${waHtml}` });
      return route.abort();
    });

    await page.goto('http://test.internal/');
    await page.evaluate(async () => {
      window.testState = { profile: { role: { name: 'SUPERADMIN', permissions: [] } } };
      window.fixture = { orderId: 'paid', orderStatus: 'SETTLEMENT', customerName: 'Pelari Contoh', customerPhone: '08123456789', customerEmail: 'runner@example.test', ticketCategory: '5K', ticketName: 'Tiket 5K', bibNumbers: '-', pdfDeliveries: [] };
      window.logsModule = await import('/admin/js/pages/notif-logs.js');
      window.waModule = await import('/admin/js/pages/whatsapp-web.js');
      window.waModule.initWhatsAppStatusDrawer();
      await window.logsModule.loadNotificationLogs();
      window.waModule.renderWhatsAppWebContactList(Array.from({ length: 20 }, (_, i) => ({ ...window.fixture, orderId: `order-${i}` })));
      window.waModule.selectWhatsAppContact(window.fixture);
      window.waModule.renderWhatsAppWebContactList(Array.from({ length: 20 }, (_, i) => ({ ...window.fixture, orderId: `order-${i}` })));
    });
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => {
        document.querySelector('#pane-notif-logs').classList.add('active');
        document.querySelector('#pane-whatsapp-web').classList.remove('active');
      });
      const logLayout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        button: document.querySelector('.btn-dispatch-pdf').getBoundingClientRect(),
        preview: document.querySelector('.notif-log-view').getBoundingClientRect(),
        mode: getComputedStyle(document.querySelector('.notif-log-table thead')).display,
        overflowing: [...document.querySelectorAll('#pane-notif-logs *')].filter(el => el.getBoundingClientRect().right > innerWidth + 1).map(el => `${el.tagName}.${el.className}`).slice(0, 8),
      }));
      assert.ok(logLayout.overflow <= 1, `notification overflow at ${width}px: ${logLayout.overflowing.join(', ')}`);
      if (width <= 680) {
        assert.equal(logLayout.mode, 'none');
        assert.ok(logLayout.button.left >= 0 && logLayout.button.right <= width, `PDF button visible at ${width}px`);
        assert.ok(logLayout.preview.left >= 0 && logLayout.preview.right <= width, `preview button visible at ${width}px`);
      }
      await page.evaluate(() => {
        document.querySelector('#pane-notif-logs').classList.remove('active');
        document.querySelector('#pane-whatsapp-web').classList.add('active');
      });
      const waLayout = await page.evaluate(() => {
        const list = document.querySelector('.wa-web-contact-list');
        const input = document.querySelector('#waDirectChatInput').getBoundingClientRect();
        const send = document.querySelector('#btnSendWaDirectMsg').getBoundingClientRect();
        return {
          overflow: document.documentElement.scrollWidth - innerWidth,
          layout: getComputedStyle(document.querySelector('.wa-web-layout')).display,
          listHeight: list.clientHeight,
          listScrollHeight: list.scrollHeight,
          input: { left: input.left, right: input.right, width: input.width },
          send: { left: send.left, right: send.right },
        };
      });
      assert.ok(waLayout.overflow <= 1, `WhatsApp overflow at ${width}px`);
      assert.ok(waLayout.input.width > 80 && waLayout.input.left >= 0 && waLayout.input.right <= width, `chat input visible at ${width}px`);
      assert.ok(waLayout.send.left >= 0 && waLayout.send.right <= width, `send button visible at ${width}px`);
      assert.equal(await page.locator('#waActiveName').textContent(), 'Pelari Contoh');
      const handle = page.locator('#btnToggleWaStatus');
      assert.equal(await handle.getAttribute('aria-expanded'), 'false');
      assert.equal(await page.locator('#waStatusPanel').isVisible(), false);
      for (const selector of ['#waWebHeaderStatus', '#btnRefreshWaWeb', '#btnGoToWaQr']) {
        assert.equal(await page.locator(`#waStatusPanel ${selector}`).count(), 1);
        assert.equal(await page.locator(selector).isVisible(), false);
      }
      await handle.click();
      assert.equal(await handle.getAttribute('aria-expanded'), 'true');
      assert.equal(await page.locator('#waStatusPanel').isVisible(), true);
      const panel = await page.locator('#waStatusPanel').boundingBox();
      assert.ok(panel.x >= 0 && panel.x + panel.width <= width + 1, `status panel fits at ${width}px`);
      assert.equal(await page.locator('#btnRefreshWaWeb').isVisible(), true);
      assert.equal(await page.locator('#btnGoToWaQr').isVisible(), true);
      assert.equal(await page.locator('#waWebHeaderStatus').isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await handle.getAttribute('aria-expanded'), 'false');
      assert.equal(await page.locator('#waStatusPanel').isVisible(), false);
      assert.equal(await page.locator('#btnRefreshWaWeb').isVisible(), false);
      if (width <= 900) {
        assert.equal(waLayout.layout, 'flex');
        assert.ok(waLayout.listHeight <= 220 && waLayout.listScrollHeight > waLayout.listHeight);
      } else {
        assert.equal(waLayout.layout, 'grid');
      }
    }
  } finally {
    await browser.close();
  }
});

test('WhatsApp console renders persisted messages, sends and clears only the selected order', async () => {
  const [html, script, utils] = await Promise.all([
    '../../frontend/admin/pages/whatsapp-web.html', '../../frontend/admin/js/pages/whatsapp-web.js',
    '../../frontend/admin/js/core/utils.js',
  ].map(file => readFile(new URL(file, import.meta.url), 'utf8')));
  const browser = await chromium.launch({ executablePath: await browserExecutable(), headless: true });
  try {
    const page = await browser.newPage();
    await page.route('**/*', async route => {
      const pathname = new URL(route.request().url()).pathname;
      const scripts = {
        '/admin/js/pages/whatsapp-web.js': script,
        '/admin/js/core/utils.js': utils,
        '/admin/js/core/state.js': 'export const adminState = {};',
        '/admin/js/core/api.js': `export async function fetchAdmin(endpoint, opts = {}) {
          if (endpoint.includes('send-direct')) {
            const body = JSON.parse(opts.body);
            window.messages[body.orderId].push({ createdAt: new Date().toISOString(), metadata: { message: body.message, kind: 'TEXT', status: 'SENT' } });
            return { status: 'success' };
          }
          const id = decodeURIComponent(endpoint.split('/').pop());
          if (opts.method === 'DELETE') {
            window.messages[id] = [];
            return { status: 'success', message: 'Dibersihkan' };
          }
          return { status: 'success', data: { items: window.messages[id] } };
        }`,
      };
      if (scripts[pathname]) return route.fulfill({ contentType: 'text/javascript', body: scripts[pathname] });
      return route.fulfill({ contentType: 'text/html', body: `${html}<div id="adminToastContainer"></div><div id="confirmModalBackdrop"><span id="confirmModalTitle"></span><span id="confirmModalMessage"></span><span id="confirmModalIcon"></span><button id="btnConfirmOk"></button><button id="btnConfirmCancel"></button></div>` });
    });
    await page.goto('http://test.internal/');
    await page.evaluate(async () => {
      window.messages = {
        one: [{ createdAt: new Date().toISOString(), metadata: { message: 'Pesan asli pertama', kind: 'TEXT', status: 'SENT' } }],
        two: [{ createdAt: new Date().toISOString(), metadata: { message: 'Pesan peserta lain', kind: 'TEXT', status: 'SENT' } }],
      };
      window.consoleModule = await import('/admin/js/pages/whatsapp-web.js');
      window.contacts = ['one', 'two'].map(orderId => ({ orderId, customerName: orderId, customerPhone: '08123456789', ticketName: '5K', orderStatus: 'SETTLEMENT' }));
      window.consoleModule.selectWhatsAppContact(window.contacts[0]);
    });
    await page.waitForFunction(() => document.querySelector('#waChatMessagesBox').textContent.includes('Pesan asli pertama'));
    await page.locator('#waDirectChatInput').fill('Pesan baru');
    await page.evaluate(() => window.consoleModule.handleSendDirectWaMessage());
    await page.waitForFunction(() => document.querySelector('#waChatMessagesBox').textContent.includes('Pesan baru'));
    await page.evaluate(() => window.consoleModule.selectWhatsAppContact(window.contacts[1]));
    await page.waitForFunction(() => document.querySelector('#waChatMessagesBox').textContent.includes('Pesan peserta lain'));
    await page.evaluate(() => window.consoleModule.selectWhatsAppContact(window.contacts[0]));
    await page.waitForFunction(() => document.querySelector('#waChatMessagesBox').textContent.includes('Pesan baru'));
    const clearing = page.evaluate(() => window.consoleModule.handleClearWaConsole());
    await page.waitForFunction(() => document.querySelector('#confirmModalMessage').textContent.includes('pesan di WhatsApp tidak akan dihapus') || document.querySelector('#confirmModalMessage').textContent.includes('Pesan di WhatsApp tidak akan dihapus'));
    await page.locator('#btnConfirmOk').click();
    await clearing;
    assert.match(await page.locator('#waChatMessagesBox').textContent(), /Belum ada riwayat/);
    assert.equal(await page.evaluate(() => window.messages.two.length), 1);
  } finally {
    await browser.close();
  }
});
