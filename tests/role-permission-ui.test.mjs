import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../../frontend/admin/js/pages/admins.js', import.meta.url), 'utf8');

function option(value, checked = false) {
  const classes = new Set(checked ? ['checked'] : []);
  return {
    value, checked, disabled: false,
    closest() {
      return { classList: {
        add: name => classes.add(name),
        remove: name => classes.delete(name),
        toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name),
      } };
    },
  };
}

test('all permission checkboxes follow wildcard without overriding shared page permissions', () => {
  const wildcard = option('participants:*');
  const read = option('participants:read');
  const update = option('participants:update');
  const unrelated = option('orders:read', true);
  const options = [wildcard, read, update, unrelated];
  const pages = [{ value: 'page:participants' }, { value: 'page:racepack' }];
  const messages = [];
  const context = {
    window: {},
    adminState: { systemModules: [
      { key: 'page:participants', apiPermissions: ['participants:read', 'participants:update'] },
      { key: 'page:racepack', apiPermissions: ['participants:read'] },
    ] },
    SYSTEM_MODULES_FALLBACK: [],
    document: { querySelectorAll: selector => selector.includes('role_page') ? pages : options },
    showAdminToast: (...args) => messages.push(args),
    Array,
  };
  const start = source.indexOf('window.toggleRolePermissionStyle =');
  const end = source.indexOf('\nfunction openCreateRoleModal', start);
  vm.runInNewContext(source.slice(start, end), context);
  wildcard.checked = true;
  context.window.toggleRolePermissionStyle(wildcard);
  assert.equal(read.checked, true);
  assert.equal(update.checked, true);
  wildcard.checked = false;
  context.window.toggleRolePermissionStyle(wildcard);
  assert.equal(read.checked, true);
  assert.equal(update.checked, false);
  assert.equal(unrelated.checked, true);
  assert.equal(messages.length, 1);
  wildcard.checked = true;
  context.window.toggleRolePermissionStyle(wildcard);
  update.checked = false;
  context.window.toggleRolePermissionStyle(update);
  assert.equal(wildcard.checked, false);
  assert.equal(read.checked, true);
});

test('existing wildcard grants appear as checked and Superadmin shows effective permissions', () => {
  const container = { innerHTML: '' };
  const start = source.indexOf('function renderRoleApiPermissions(');
  const end = source.indexOf('\nfunction renderRoleDashboardWidgets', start);
  const context = {
    adminState: { rolePermissions: [
      { key: 'participants:*', label: 'Semua izin peserta' },
      { key: 'participants:read', label: 'Melihat peserta' },
      { key: 'orders:read', label: 'Melihat transaksi' },
    ] },
    document: { getElementById: () => container },
    escapeHtml: value => value,
  };
  vm.runInNewContext(`${source.slice(start, end)}\nrenderRoleApiPermissions(['participants:*'], false)`, context);
  assert.match(container.innerHTML, /value="participants:read" checked/);
  assert.doesNotMatch(container.innerHTML, /value="orders:read" checked/);
  vm.runInNewContext(`${source.slice(start, end)}\nrenderRoleApiPermissions([], true)`, context);
  assert.match(container.innerHTML, /value="orders:read" checked disabled/);
});

test('BIB section editor preserves legacy access and displays saved restrictions', () => {
  const container = { innerHTML: '' };
  const all = {};
  const sourcePart = source.slice(source.indexOf('function updateBibSectionAllState()'), source.indexOf('window.toggleModuleCardStyle ='));
  const context = {
    window: {},
    adminState: { bibSections: [
      { key: 'section:bib-generation', label: 'BIB' },
      { key: 'section:bib-payment-fee', label: 'Biaya' },
    ] },
    document: {
      getElementById: id => id === 'roleBibAll' ? all : container,
      querySelectorAll: () => [],
    },
    escapeHtml: value => value,
  };
  vm.runInNewContext(`${sourcePart}\nrenderBibSections([], false)`, context);
  assert.match(container.innerHTML, /value="section:bib-payment-fee" checked/);
  vm.runInNewContext(`${sourcePart}\nrenderBibSections(['section:bib-configured', 'section:bib-generation'], false)`, context);
  assert.match(container.innerHTML, /value="section:bib-generation" checked/);
  assert.doesNotMatch(container.innerHTML, /value="section:bib-payment-fee" checked/);
  vm.runInNewContext(`${sourcePart}\nrenderBibSections([], true)`, context);
  assert.match(container.innerHTML, /value="section:bib-payment-fee" checked disabled/);
});
