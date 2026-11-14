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
    'admin/js/core/utils.js', 'admin/js/core/rbac.js', 'admin/js/core/tabs.js',
    'admin/modals/modals.html', 'css/style.css', 'css/admin.css'];
  const contents = Object.fromEntries(await Promise.all(files.map(async file => [`/${file}`, await readFile(new URL(file, base), 'utf8')])));
  const browser = await chromium.launch({ executablePath: await browserExecutable(), headless: true });
  try {
    const page = await browser.newPage();
    await page.route('**/*', async route => {
      const pathname = new URL(route.request().url()).pathname;
      const mocks = {
        '/admin/js/core/state.js': 'export const adminState = window.state;',
        '/admin/js/core/auth.js': 'export function handleLogout() {}',
        '/js/api.js': `export async function apiFetch(url, options) {
          window.exportRequest = { url, options };
          return new Response('\\uFEFFNama,Status\\r\\n"Pelari","LUNAS"\\r\\n', { headers: { 'Content-Type': 'text/csv' } });
        }`,
        '/admin/js/core/sidebar.js': 'export function switchAdminTab() {}',
        '/admin/js/pages/racepack.js': 'export function verifyRacepackByCode() {}',
        '/admin/js/core/api.js': `export async function fetchAdmin(endpoint) {
          window.calls.push(endpoint);
          await new Promise(resolve => setTimeout(resolve, 200));
          if (window.response.status !== 'success') return window.response;
          const query = new URL(endpoint, location.href).searchParams;
          const search = (query.get('search') || '').toLowerCase().trim();
          const category = query.get('category');
          const tab = query.get('tab');
          const base = window.response.data.filter(p => (!category || p.event.category.includes(category)) && (!search || p.fullNameKtp.toLowerCase().includes(search)));
          const match = (p, key) => key === 'ALL' || (key === 'SETTLED' && p.order.status === 'SETTLEMENT') ||
            (key === 'PENDING' && p.order.status === 'PENDING') || (key === 'CANCELLED' && p.order.status === 'EXPIRE') ||
            (key === 'RACEPACK_DONE' && p.racepack?.checkedIn) || (key === 'RACEPACK_PENDING' && !p.racepack?.checkedIn);
          const keys = ['ALL', 'SETTLED', 'PENDING', 'CANCELLED', 'RACEPACK_DONE', 'RACEPACK_PENDING'];
          const tabCounts = Object.fromEntries(keys.map(key => [key, base.filter(p => match(p, key)).length]));
          const list = base.filter(p => match(p, tab));
          const page = Number(query.get('page')), limit = Number(query.get('limit'));
          return { status: 'success', data: list.slice((page - 1) * limit, page * limit),
            meta: { total: list.length, totalPages: Math.ceil(list.length / limit), tabCounts } };
        }`,
      };
      if (mocks[pathname]) return route.fulfill({ contentType: 'text/javascript', body: mocks[pathname] });
      if (contents[pathname]) return route.fulfill({ contentType: pathname.endsWith('.js') ? 'text/javascript' : 'text/css', body: contents[pathname] });
      return route.fulfill({ contentType: 'text/html', body: `<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/css/style.css"><link rel="stylesheet" href="/css/admin.css">
        ${contents['/admin/pages/participants.html']}${contents['/admin/modals/modals.html']}<div id="adminToastContainer"></div><span id="kpiTotalParticipants"></span>` });
    });
    await page.goto('http://test.internal/');
    await page.evaluate(async () => {
      document.querySelector('#pane-participants').classList.add('active');
      window.calls = [];
      window.state = { participants: [], profile: { role: { name: 'ADMIN', permissions: ['participants:read'] } } };
      window.response = { status: 'success', data: [
        { id:'1', fullNameKtp:'Pelari Satu', nik:'123', event:{category:'5K'}, order:{status:'SETTLEMENT'} },
        { id:'2', fullNameKtp:'Pelari Dua', nik:'456', event:{category:'10K'}, order:{status:'PENDING'} },
        { id:'3', fullNameKtp:'Pelari Tiga', nik:'789', event:{category:'5K'}, order:{status:'EXPIRE'} },
      ], meta: { total: 3 } };
      window.participants = await import('/admin/js/pages/participants.js');
      window.participants.initParticipantFilterTabs(document.querySelector('.participant-tabs-nav'));
      document.querySelector('#btnRefreshParticipants').addEventListener('click', window.participants.handleRefreshParticipants);
      document.querySelector('#btnParticipantNext').addEventListener('click', () => window.participants.changeParticipantPage(1));
      document.querySelector('#btnParticipantPrevious').addEventListener('click', () => window.participants.changeParticipantPage(-1));
      document.querySelector('#participantPageSize').addEventListener('change', window.participants.changeParticipantPageSize);
      document.querySelector('#btnExportCsv').addEventListener('click', window.participants.exportParticipantsCsv);
      window.applyRbacUi = (await import('/admin/js/core/rbac.js')).applyRbacUi;
      await window.participants.loadParticipants();
      window.participants.switchParticipantFilterTab('SETTLED');
      document.querySelector('#searchParticipant').value = 'pelari';
      document.querySelector('#filterParticipantCategory').value = '5K';
      window.participants.applyParticipantFilters();
    });
    await page.waitForFunction(() => document.querySelector('#participantFilteredCount').textContent === '1');
    await page.evaluate(() => {
      window.response.data[0].fullNameKtp = 'Pelari Terbaru';
      window.response.data[0].racepack = { checkedIn: true };
    });
    await page.locator('#btnRefreshParticipants').click();
    assert.equal(await page.locator('#btnRefreshParticipants').isDisabled(), true);
    await page.waitForFunction(() => !document.querySelector('#btnRefreshParticipants').disabled);
    assert.match(await page.locator('#adminParticipantsTableBody').textContent(), /Pelari Terbaru/);
    assert.doesNotMatch(await page.locator('#adminParticipantsTableBody').textContent(), /Pelari Dua/);
    assert.equal(await page.locator('#countPartRacepackDone').textContent(), '1');
    assert.equal(await page.locator('#participantFilteredCount').textContent(), '1');
    assert.equal(await page.locator('#searchParticipant').inputValue(), 'pelari');
    assert.equal(await page.locator('#filterParticipantCategory').inputValue(), '5K');
    assert.equal(await page.locator('#partTabSettled').getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('#participantResults').getAttribute('aria-labelledby'), 'partTabSettled');
    await page.evaluate(() => {
      window.applyRbacUi({ role: { name: 'ADMIN', permissions: ['participants:read'] } });
    });
    assert.equal(await page.locator('#btnExportCsv').isVisible(), false);
    await page.evaluate(() => {
      window.applyRbacUi({ role: { name: 'ADMIN', permissions: ['participants:read', 'orders:read'] } });
    });
    assert.equal(await page.locator('#btnExportCsv').isVisible(), true);
    await page.locator('#btnExportCsv').click();
    assert.equal(await page.locator('#confirmModalBackdrop').isVisible(), true);
    assert.match(await page.locator('#confirmModalMessage').textContent(), /riwayat kesehatan/);
    await page.locator('#btnConfirmCancel').click();
    assert.equal(await page.evaluate(() => !!window.exportRequest), false);
    assert.equal(await page.locator('#btnExportCsv').isDisabled(), false);
    await page.locator('#btnExportCsv').click();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#btnConfirmOk').click(),
    ]);
    assert.match(download.suggestedFilename(), /^peserta-transaksi-.*\.csv$/);
    assert.deepEqual(await page.evaluate(() => JSON.parse(window.exportRequest.options.body)), {
      tab: 'SETTLED', category: '5K', search: 'pelari',
    });
    await page.evaluate(() => { window.response = { status:'error', message:'Server gagal' }; });
    await page.locator('#btnRefreshParticipants').click();
    await page.waitForFunction(() => !document.querySelector('#btnRefreshParticipants').disabled);
    assert.match(await page.locator('#adminToastContainer').textContent(), /Server gagal/);
    assert.match(await page.locator('#adminParticipantsTableBody').textContent(), /Pelari Terbaru/);
    assert.ok((await page.evaluate(() => window.calls)).every(url => url.includes('/admin/participants?') && url.includes('limit=100')));
    await page.evaluate(() => { window.response = { status:'success', data: window.state.participants }; });
    await page.evaluate(() => { window.response.data = [
      { id:'1', fullNameKtp:'Pelari Terbaru', nik:'123', event:{category:'5K'}, order:{status:'SETTLEMENT'}, racepack:{checkedIn:true} },
      { id:'2', fullNameKtp:'Pelari Dua', nik:'456', event:{category:'10K'}, order:{status:'PENDING'} },
      { id:'3', fullNameKtp:'Pelari Tiga', nik:'789', event:{category:'5K'}, order:{status:'EXPIRE'} },
    ]; });
    await page.locator('#searchParticipant').fill('');
    await page.locator('#filterParticipantCategory').selectOption('');
    await page.locator('#partTabSettled').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#partTabPending').getAttribute('aria-selected'), 'true');
    await page.waitForFunction(() => document.querySelector('#adminParticipantsTableBody').textContent.includes('Pelari Dua'));
    assert.match(await page.locator('#adminParticipantsTableBody').textContent(), /Pelari Dua/);
    await page.keyboard.press('End');
    assert.equal(await page.locator('#partTabRacepackPending').getAttribute('aria-selected'), 'true');
    await page.waitForFunction(() => document.querySelector('#adminParticipantsTableBody').textContent.includes('Pelari Tiga'));
    assert.match(await page.locator('#adminParticipantsTableBody').textContent(), /Pelari Tiga/);
    assert.doesNotMatch(await page.locator('#adminParticipantsTableBody').textContent(), /Pelari Terbaru/);
    await page.keyboard.press('Home');
    assert.equal(await page.locator('#partTabAll').getAttribute('aria-selected'), 'true');
    await page.locator('#partTabCancelled').click();
    await page.waitForFunction(() => document.querySelector('#participantFilteredCount').textContent === '1');
    assert.match(await page.locator('#adminParticipantsTableBody').textContent(), /Pelari Tiga/);
    assert.doesNotMatch(await page.locator('#adminParticipantsTableBody').textContent(), /Pelari Dua/);
    await page.locator('#partTabRacepackDone').click();
    await page.waitForFunction(() => document.querySelector('#adminParticipantsTableBody').textContent.includes('Pelari Terbaru'));
    assert.match(await page.locator('#adminParticipantsTableBody').textContent(), /Pelari Terbaru/);
    assert.doesNotMatch(await page.locator('#adminParticipantsTableBody').textContent(), /Pelari Tiga/);
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const id of ['partTabAll', 'partTabSettled', 'partTabPending', 'partTabCancelled', 'partTabRacepackDone', 'partTabRacepackPending']) {
        await page.locator(`#${id}`).click();
        assert.equal(await page.locator(`#${id}`).getAttribute('aria-selected'), 'true');
        assert.equal(await page.locator('#participantResults').getAttribute('aria-labelledby'), id);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `page overflow at ${width}`);
      }
    }
    await page.evaluate(() => {
      window.response.data = Array.from({length: 520}, (_, i) => ({
        id: String(i), fullNameKtp: 'Peserta ' + i, nik: String(i), event: {category:'5K'}, order: {status:'PENDING'}
      }));
    });
    await page.locator('#partTabAll').click();
    await page.waitForFunction(() => document.querySelector('#participantPageInfo').textContent.includes('dari 6'));
    assert.equal(await page.locator('#participantPageSize').inputValue(), '100');
    assert.equal(await page.locator('#adminParticipantsTableBody tr').count(), 100);
    assert.match(await page.locator('#adminParticipantsTableBody').textContent(), /Peserta 0/);
    await page.locator('#btnParticipantNext').click();
    await page.waitForFunction(() => document.querySelector('#participantPageInfo').textContent.includes('Halaman 2'));
    assert.match(await page.locator('#adminParticipantsTableBody').textContent(), /Peserta 100/);
    assert.equal(await page.locator('#adminParticipantsTableBody tr').first().locator('td').first().textContent(), '101');
    await page.locator('#btnParticipantPrevious').click();
    await page.waitForFunction(() => document.querySelector('#participantPageInfo').textContent.includes('Halaman 1'));
    for (const [size, pages] of [[10, 52], [50, 11], [500, 2]]) {
      await page.locator('#participantPageSize').selectOption(String(size));
      await page.waitForFunction(({ size, pages }) => document.querySelector('#participantPageInfo').textContent.includes(`dari ${pages}`) &&
        document.querySelectorAll('#adminParticipantsTableBody tr').length === size, { size, pages });
      assert.equal(await page.locator('#adminParticipantsTableBody tr').count(), size);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    }
  } finally { await browser.close(); }
});
