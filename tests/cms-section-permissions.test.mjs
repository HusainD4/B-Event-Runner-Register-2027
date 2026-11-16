import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
});

const { CMS_SECTIONS, allowedCmsFields, canAccessCmsSection } = await import('../src/utils/cms-section-permissions.ts');
const { getWebsiteSettings, updateWebsiteSettings } = await import('../src/controllers/settings.controller.ts');
const { default: prisma } = await import('../src/config/database.ts');

const admin = { adminId: 'admin', roleName: 'ADMINISTRATOR', permissions: [
  'page:cms', 'cms:manage', 'section:cms-configured', 'section:cms-hero',
] };
function response() {
  return { status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
}

test('CMS catalog has unique keys and fields, with legacy and superadmin access', () => {
  const keys = CMS_SECTIONS.map(section => section.key);
  const fields = CMS_SECTIONS.flatMap(section => section.fields);
  assert.equal(new Set(keys).size, keys.length);
  assert.equal(new Set(fields).size, fields.length);
  assert.equal(canAccessCmsSection({ ...admin, permissions: ['cms:*'] }, 'section:cms-contact'), true);
  assert.equal(canAccessCmsSection(admin, 'section:cms-contact'), false);
  assert.equal(canAccessCmsSection({ ...admin, roleName: 'SUPERADMIN', permissions: [] }, 'section:cms-contact'), true);
  assert.equal(allowedCmsFields(admin).includes('contact_email'), false);
  assert.equal(allowedCmsFields({ ...admin, permissions: [...admin.permissions, 'routes:manage'] }).includes('route_title'), true);
});

test('configured CMS role cannot read other admin settings or write forbidden or mixed fields', async () => {
  const originalFind = prisma.appSetting.findMany;
  const originalUpsert = prisma.appSetting.upsert;
  let writes = 0;
  prisma.appSetting.findMany = async () => [
    { key: 'site_title', value: 'Hero' },
    { key: 'contact_email', value: 'contact@example.test' },
    { key: 'secret_internal_setting', value: 'private' },
  ];
  prisma.appSetting.upsert = async () => { writes++; };
  try {
    const read = response();
    await getWebsiteSettings({ admin }, read);
    assert.equal(read.code, 200);
    assert.equal(read.body.data.site_title, 'Hero');
    assert.equal(read.body.data.contact_email, undefined);
    assert.equal(read.body.data.secret_internal_setting, undefined);
    assert.equal(read.body.cmsAllowedFields.includes('site_title'), true);
    assert.equal(read.body.cmsAllowedFields.includes('contact_email'), false);
    const legacy = response();
    await getWebsiteSettings({ admin: { ...admin, permissions: ['cms:manage'] } }, legacy);
    assert.equal(legacy.body.data.site_title, 'Hero');
    assert.equal(legacy.body.data.contact_email, 'contact@example.test');
    assert.equal(legacy.body.data.secret_internal_setting, undefined);
    for (const body of [{ contact_email: 'other@example.test' }, { site_title: 'OK', contact_email: 'other@example.test' }, { unknown_field: 'value' }]) {
      const res = response();
      await updateWebsiteSettings({ admin, body }, res);
      assert.equal(res.code, 403);
    }
    const legacyWrite = response();
    await updateWebsiteSettings({ admin: { ...admin, permissions: ['cms:manage'] }, body: { email_smtp_pass: 'new' } }, legacyWrite);
    assert.equal(legacyWrite.code, 403);
    assert.equal(writes, 0);
  } finally {
    prisma.appSetting.findMany = originalFind;
    prisma.appSetting.upsert = originalUpsert;
  }
});

test('allowed section update does not write other sections', async () => {
  const originalFind = prisma.appSetting.findMany;
  const originalUpsert = prisma.appSetting.upsert;
  const originalLog = prisma.log.create;
  const writes = [];
  prisma.appSetting.findMany = async () => [{ key: 'secret_internal_setting', value: 'private' }];
  prisma.appSetting.upsert = async value => { writes.push(value.where.key); };
  prisma.log.create = async () => ({});
  try {
    const res = response();
    await updateWebsiteSettings({ admin, body: { site_title: 'New title' } }, res);
    assert.equal(res.code, 200);
    assert.deepEqual(writes, ['site_title']);
    assert.equal(res.body.data.contact_email, undefined);
    const legacy = response();
    await updateWebsiteSettings({ admin: { ...admin, permissions: ['cms:manage'] }, body: { site_title: 'Another title' } }, legacy);
    assert.equal(legacy.code, 200);
    assert.equal(legacy.body.data.secret_internal_setting, undefined);
  } finally {
    prisma.appSetting.findMany = originalFind;
    prisma.appSetting.upsert = originalUpsert;
    prisma.log.create = originalLog;
  }
});

test('CMS save form covers every payload field in the permission catalog', async () => {
  const source = await readFile(new URL('../../frontend/admin/js/pages/cms.js', import.meta.url), 'utf8');
  const start = source.indexOf('  const payload = {', source.indexOf('async function handleCmsSubmit'));
  const end = source.indexOf('\n  };', start);
  const fields = [...source.slice(start, end).matchAll(/^\s{4}([a-z][a-z0-9_]+):/gm)].map(match => match[1]);
  const known = new Set(CMS_SECTIONS.flatMap(section => section.fields));
  assert.deepEqual(fields.filter(field => !known.has(field)), []);
  assert.ok(source.includes('if (!cmsAllowedFields.has(key)) delete payload[key]'));
});

test('CMS hides restricted tabs and selects an allowed tab without exposing forbidden panels', async () => {
  const source = await readFile(new URL('../../frontend/admin/js/core/rbac.js', import.meta.url), 'utf8');
  const ids = ['Visibility', 'Hero', 'Stats', 'Route', 'Faq', 'ComingSoon', 'Media', 'Legal', 'Documents', 'Contact'];
  const elements = {};
  for (const id of ids) {
    elements[`cmsTab${id}`] = { id: `cmsTab${id}`, disabled: false, style: {}, selected: id === 'Visibility' };
    elements[`cmsPanel${id}`] = { dataset: {}, hidden: id !== 'Visibility' };
  }
  const tabs = ids.map(id => elements[`cmsTab${id}`]);
  const tablist = { querySelector(selector) {
    return selector.includes('aria-selected')
      ? tabs.find(tab => tab.selected && !tab.disabled)
      : tabs.find(tab => !tab.disabled);
  } };
  const context = {
    window: { addEventListener() {}, innerWidth: 1200 },
    document: {
      getElementById: id => elements[id] || null,
      querySelector: selector => selector.startsWith('#pane-cms') ? tablist : null,
      querySelectorAll: () => [],
    },
    selectTab: (list, id) => {
      for (const tab of tabs) {
        tab.selected = tab.id === id;
        elements[tab.id.replace('Tab', 'Panel')].hidden = !tab.selected;
      }
    },
  };
  vm.runInNewContext(source.replace(/^import .*;\s*/m, '').replaceAll('export function ', 'function '), context);
  context.applyRbacUi({ role: { name: admin.roleName, permissions: admin.permissions } });
  assert.equal(elements.cmsTabVisibility.disabled, true);
  assert.equal(elements.cmsPanelVisibility.hidden, true);
  assert.equal(elements.cmsTabHero.selected, true);
  assert.equal(elements.cmsPanelHero.hidden, false);
  assert.equal(elements.cmsPanelContact.dataset.cmsDenied, 'true');
  context.applyRbacUi({ role: { name: 'SUPERADMIN', permissions: [] } });
  assert.ok(tabs.every(tab => !tab.disabled));
});
