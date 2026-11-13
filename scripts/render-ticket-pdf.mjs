import { parentPort, workerData } from 'node:worker_threads';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import QRCode from 'qrcode';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const frontendDist = path.resolve(process.env.PDF_FRONTEND_DIST || path.join(root, 'frontend', 'dist'));
const origin = 'http://ticket.internal';

function getFrontendOrigin() {
  if (!process.env.PDF_FRONTEND_URL) return null;
  const url = new URL(process.env.PDF_FRONTEND_URL);
  const localHttp = url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if ((!localHttp && url.protocol !== 'https:') || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('PDF_FRONTEND_URL harus berupa origin HTTPS tanpa path, kredensial, query, atau fragment.');
  }
  return url.origin;
}

async function fetchFrontendAsset(frontendOrigin, relative) {
  const response = await fetch(new URL(`/${relative}`, frontendOrigin), {
    redirect: 'error',
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const declaredLength = Number(response.headers.get('content-length'));
  const maxBytes = 10 * 1024 * 1024;
  if (declaredLength > maxBytes) throw new Error('Ukuran aset melebihi 10 MB.');
  const chunks = [];
  let length = 0;
  for await (const chunk of response.body) {
    length += chunk.length;
    if (length > maxBytes) {
      throw new Error('Ukuran aset melebihi 10 MB.');
    }
    chunks.push(chunk);
  }
  const contentType = response.headers.get('content-type') || '';
  if ((relative.endsWith('.html') && !contentType.toLowerCase().includes('text/html'))
    || (relative.endsWith('.js') && !/javascript|ecmascript/i.test(contentType))
    || (relative.endsWith('.css') && !contentType.toLowerCase().includes('text/css'))) {
    throw new Error(`Tipe konten tidak sesuai untuk ${relative}: ${contentType || 'tidak tersedia'}.`);
  }
  return Buffer.concat(chunks);
}

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
  const frontendOrigin = getFrontendOrigin();
  const allowedAssets = new Set();
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
        if (relative && (!frontendOrigin || relative === 'e-ticket.html' || allowedAssets.has(relative))) {
          try {
            const body = frontendOrigin
              ? await fetchFrontendAsset(frontendOrigin, relative)
              : await readFile(path.join(frontendDist, relative));
            if (frontendOrigin && /\.(?:html|js|css)$/.test(relative)) {
              const matches = body.toString('utf8').matchAll(/(?:\/assets\/|\.\/)([a-zA-Z0-9._-]+\.(?:js|css|woff2?|ttf|svg|png|jpe?g|webp))/g);
              for (const match of matches) allowedAssets.add(`assets/${match[1]}`);
            }
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
        } else if (relative && frontendOrigin) {
          errors.push(`Aset e-ticket tidak terdaftar dalam build: ${relative}`);
        }
      }
      await route.abort('blockedbyclient');
    });
    await page.emulateMedia({ media: 'print' });
    try {
      await page.goto(`${origin}/e-ticket.html?orderId=pdf`, { waitUntil: 'load', timeout: 30_000 });
    } catch (error) {
      throw new Error(errors.length ? errors.join('; ') : `Gagal membuka halaman E-Tiket: ${error.message}`);
    }
    try {
      await page.waitForFunction(() => document.getElementById('ticketMount')?.dataset.renderStatus, null, { timeout: 30_000 });
    } catch (error) {
      throw new Error(errors.length ? errors.join('; ') : `E-Tiket belum siap dirender: ${error.message}`);
    }
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
