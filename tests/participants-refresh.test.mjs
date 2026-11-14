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

test('refresh participants preserves filters and reports failures without clearing data', async () => {
  const base = new URL('../../frontend/', import.meta.url);
  const files = ['admin/pages/participants.html', 'admin/js/pages/participants.js',
    'admin/js/core/utils.js', 'admin/js/core/rbac.js', 'css/style.css', 'css/admin.css'];
  const contents = Object.fromEntries(await Promise.all(files.map(async file => [`/${file}`, await readFile(new URL(file, base), 'utf8')])));
  const browser = await chromium.launch({ executablePath: await browserExecutable(), headless: true });
  try {
    const page = await browser.newPage();
    await page.route('**/*', async route => {
      const pathname = new URL(route.request().url()).pathname;
      const mocks = {
        '/admin/js/core/state.js': 'export const adminState = window.state;',
        '/admin/js/core/sidebar.js': 'export function switchAdminTab() {}',
        '/admin/js/pages/racepack.js': 'export function verifyRacepackByCode() {}',
        '/admin/js/core/api.js': `export async function fetchAdmin(endpoint) {
          window.calls.push(endpoint);
          await new Promise(resolve => setTimeout(resolve, 100));
          return window.response;
        }`,
      };
      if (mocks[pathname]) return route.fulfill({ contentType: 'text/javascript', body: mocks[pathname] });
      if (contents[pathname]) return route.fulfill({ contentType: pathname.endsWith('.js') ? 'text/javascript' : 'text/css', body: contents[pathname] });
      return route.fulfill({ contentType: 'text/html', body: `<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/css/style.css"><link rel="stylesheet" href="/css/admin.css">
        ${contents['/admin/pages/participants.html']}<div id="adminToastContainer"></div><span id="kpiTotalParticipants"></span>` });
    });
    await page.goto('http://test.internal/');
    await page.evaluate(async () => {
      document.querySelector('#pane-participants').classList.add('active');
      window.calls = [];
      window.state = { participants: [], profile: { role: { name: 'ADMIN', permissions: ['participants:read'] } } };
      window.response = { status: 'success', data: [
        { id:'1', fullNameKtp:'Pelari Satu', nik:'123', event:{category:'5K'}, order:{status:'SETTLEMENT'} },
        { id:'2', fullNameKtp:'Pelari Dua', nik:'456', event:{category:'10K'}, order:{status:'PENDING'} },
      ], meta: { total: 2 } };
      window.participants = await import('/admin/js/pages/participants.js');
      document.querySelector('#btnRefreshParticipants').addEventListener('click', window.participants.handleRefreshParticipants);
      await window.participants.loadParticipants();
      window.participants.switchParticipantFilterTab('SETTLED');
      document.querySelector('#searchParticipant').value = 'pelari';
      document.querySelector('#filterParticipantCategory').value = '5K';
      window.participants.applyParticipantFilters();
    });
    await page.evaluate(() => {
      window.response.data[0].fullNameKtp = 'Pelari Terbaru';
      window.response.data[0].racepack = { checkedIn: true };
    });
    await page.locator('#btnRefreshParticipants').click();
    assert.equal(await page.locator('#btnRefreshParticipants').isDisabled(), true);
    await page.waitForFunction(() => window.calls.length === 2 && !document.querySelector('#btnRefreshParticipants').disabled);
    assert.match(await page.locator('#adminParticipantsTableBody').textContent(), /Pelari Terbaru/);
    assert.doesNotMatch(await page.locator('#adminParticipantsTableBody').textContent(), /Pelari Dua/);
    assert.equal(await page.locator('#countPartRacepackDone').textContent(), '1');
    assert.equal(await page.locator('#participantFilteredCount').textContent(), '1');
    assert.equal(await page.locator('#searchParticipant').inputValue(), 'pelari');
    assert.equal(await page.locator('#filterParticipantCategory').inputValue(), '5K');
    assert.equal(await page.locator('#partTabSettled').getAttribute('class'), 'btn btn-primary btn-sm part-tab-btn active');
    await page.evaluate(() => { window.response = { status:'error', message:'Server gagal' }; });
    await page.locator('#btnRefreshParticipants').click();
    await page.waitForFunction(() => window.calls.length === 3 && !document.querySelector('#btnRefreshParticipants').disabled);
    assert.match(await page.locator('#adminToastContainer').textContent(), /Server gagal/);
    assert.match(await page.locator('#adminParticipantsTableBody').textContent(), /Pelari Terbaru/);
    assert.ok((await page.evaluate(() => window.calls)).every(url => url === '/admin/participants?limit=100'));
  } finally { await browser.close(); }
});
