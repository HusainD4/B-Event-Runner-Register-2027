import { parentPort, workerData } from 'node:worker_threads';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import QRCode from 'qrcode';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const frontendDist = path.resolve(process.env.PDF_FRONTEND_DIST || path.join(root, 'frontend', 'dist'));
const origin = 'http://ticket.internal';

async function browserExecutable() {
  const candidates = process.env.PDF_CHROME_PATH ? [process.env.PDF_CHROME_PATH] : process.platform === 'win32'
    ? [
      path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Google\\Chrome\\Application\\chrome.exe'),
      path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Microsoft\\Edge\\Application\\msedge.exe'),
      path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Microsoft\\Edge\\Application\\msedge.exe'),
    ]
    : ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable'];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  throw new Error('Browser Chromium tidak ditemukan. Pasang Chromium atau atur PDF_CHROME_PATH.');
}

async function render() {
  const qrOptions = {
    width: 480,
    margin: 4,
    errorCorrectionLevel: 'H',
    color: { dark: '#000000', light: '#FFFFFF' },
  };
  const participants = await Promise.all(workerData.order.participants.map(async participant => ({
    ...participant,
    qrImageDataUrl: await QRCode.toDataURL(participant.qrPayload, qrOptions),
  })));
  const order = {
    ...workerData.order,
    participants,
    masterQrImageDataUrl: workerData.order.masterQrPayload
      ? await QRCode.toDataURL(workerData.order.masterQrPayload, qrOptions) : null,
  };
  const browser = await chromium.launch({ executablePath: await browserExecutable(), headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 1100, height: 900 },
      locale: 'id-ID',
      timezoneId: 'Asia/Jakarta',
      serviceWorkers: 'block',
    });
    const page = await context.newPage();
    const errors = [];
    let ticketServed = false;
    let settingsServed = false;
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', async route => {
      const request = route.request();
      const url = new URL(request.url());
      if (request.method() === 'GET' && url.pathname.startsWith('/api/tickets/e-ticket/')) {
        ticketServed = true;
        return route.fulfill({ json: { status: 'success', data: order } });
      }
      if (request.method() === 'GET' && url.pathname === '/api/settings/website') {
        settingsServed = true;
        return route.fulfill({ json: { status: 'success', data: workerData.websiteSettings } });
      }
      if (request.method() === 'GET' && url.origin === origin) {
        const relative = url.pathname === '/e-ticket.html' ? 'e-ticket.html'
          : /^\/assets\/[a-zA-Z0-9._-]+$/.test(url.pathname) ? url.pathname.slice(1) : null;
        if (relative) {
          try {
            const body = await readFile(path.join(frontendDist, relative));
            const ext = path.extname(relative);
            const contentType = ({
              '.html': 'text/html; charset=utf-8',
              '.js': 'text/javascript; charset=utf-8',
              '.css': 'text/css; charset=utf-8',
              '.woff2': 'font/woff2',
              '.woff': 'font/woff',
              '.ttf': 'font/ttf',
            })[ext] || 'application/octet-stream';
            return route.fulfill({ status: 200, contentType, body });
          } catch (error) {
            errors.push(`Aset e-ticket tidak tersedia: ${relative} (${error.message})`);
          }
        }
      }
      await route.abort('blockedbyclient');
    });
    await page.emulateMedia({ media: 'print' });
    await page.goto(`${origin}/e-ticket.html?orderId=pdf`, { waitUntil: 'load', timeout: 30_000 });
    await page.waitForFunction(() => document.getElementById('ticketMount')?.dataset.renderStatus, null, { timeout: 30_000 });
    const state = await page.evaluate(async () => {
      await document.fonts.ready;
      const images = [...document.querySelectorAll('#ticketMount img')];
      await Promise.all(images.map(image => image.decode()));
      return {
        status: document.getElementById('ticketMount')?.dataset.renderStatus,
        tickets: document.querySelectorAll('.e-ticket-card').length,
      };
    });
    if (!ticketServed || !settingsServed || state.status !== 'ready' || state.tickets !== workerData.order.participants.length || errors.length) {
      throw new Error(`Gagal merender E-Tiket: ${errors.join('; ') || `status ${state.status}, tiket ${state.tickets}`}`);
    }
    return await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }
}

render().then(buffer => parentPort.postMessage({ buffer }), error => {
  parentPort.postMessage({ error: error.message });
});
