import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import prisma from '../src/config/database.ts';
import { downloadSqlBackup, downloadCsvBackup, getBackupOverview } from '../src/controllers/admin.backup.controller.ts';

class MockResponse extends EventEmitter {
  constructor() {
    super();
    this.headers = {};
    this.headersSent = false;
    this.destroyed = false;
    this.chunks = [];
  }
  setHeader(key, value) { this.headers[key] = value; }
  removeHeader(key) { delete this.headers[key]; }
  type(value) { this.contentType = value; }
  write(chunk) { this.headersSent = true; this.chunks.push(chunk); return true; }
  end() { this.ended = true; }
  status(code) { this.code = code; return this; }
  json(body) { this.body = body; return this; }
  destroy(error) { this.destroyed = true; this.failure = error; }
}

function setup({ nonInnoDB = false, failRows = false } = {}) {
  const tables = [
    { tableName: 'admins', engine: nonInnoDB ? 'MyISAM' : 'InnoDB' },
    { tableName: 'settings', engine: 'InnoDB' },
  ];
  const columns = {
    admins: [
      { Field: 'id', Type: 'int', Extra: '' },
      { Field: 'password', Type: 'varchar(255)', Extra: '' },
      { Field: 'createdAt', Type: 'datetime(6)', Extra: '' },
      { Field: 'generated', Type: 'int', Extra: 'STORED GENERATED' },
    ],
    settings: [
      { Field: 'key', Type: 'varchar(255)', Extra: '' },
      { Field: 'value', Type: 'blob', Extra: '' },
    ],
  };
  const original = {
    admins: Array.from({ length: 501 }, (_, i) => ({
      id: i + 1, password: i === 0 ? '=SECRET' : 'hash', createdAt: '2026-01-02 03:04:05.123456', generated: i + 2,
    })),
    settings: [{ key: 'binary', value: new Uint8Array([0, 255]) }],
  };
  const calls = [];
  prisma.$queryRaw = async () => tables;
  prisma.log.create = async ({ data }) => { calls.push(['audit', data.action]); };
  prisma.$transaction = async (fn, options) => {
    assert.equal(options.isolationLevel, 'RepeatableRead');
    const snapshot = structuredClone(original);
    const tx = {
      $queryRaw: async strings => strings.join('').includes('time_zone') ? [{ timeZone: 'SYSTEM' }] : tables,
      $executeRaw: async (strings, ...values) => { calls.push(['timezone', strings.join('?'), values]); },
      $queryRawUnsafe: async sql => {
        calls.push(['query', sql]);
        const table = sql.includes('`admins`') ? 'admins' : 'settings';
        if (sql.startsWith('SHOW COLUMNS')) return columns[table];
        if (sql.startsWith('SHOW INDEX')) return table === 'admins' ? [{ Key_name: 'PRIMARY', Seq_in_index: 1n, Column_name: 'id' }] : [];
        if (sql.startsWith('SHOW CREATE')) return [{ 'Create Table': `CREATE TABLE \`${table}\` (id INT)` }];
        if (failRows) throw new Error('row failure');
        if (sql.startsWith('SELECT')) {
          const offset = Number(sql.match(/OFFSET (\d+)/)?.[1] || 0);
          const count = sql.includes(' LIMIT ') ? 500 : snapshot[table].length;
          original.admins.push({ id: 9999, password: 'later', createdAt: '', generated: 0 });
          return snapshot[table].slice(offset, offset + count);
        }
        throw new Error('Unexpected query: ' + sql);
      },
    };
    return fn(tx);
  };
  return calls;
}

const request = { admin: { adminId: 'admin' } };

test('SQL exports all snapshot rows and tables with correct values and no generated-column inserts', async () => {
  const calls = setup();
  const res = new MockResponse();
  await downloadSqlBackup(request, res);
  assert.equal(res.ended, true);
  const sql = res.chunks.join('');
  assert.equal((sql.match(/INSERT INTO `admins`/g) || []).length, 501);
  assert.equal((sql.match(/INSERT INTO `settings`/g) || []).length, 1);
  assert.match(sql, /SET FOREIGN_KEY_CHECKS = 1;/);
  assert.match(sql, /SET time_zone = '\+00:00';/);
  assert.match(sql, /X'00ff'/);
  assert.match(sql, /323032362d30312d30322030333a30343a30352e313233343536/);
  assert.match(sql, /INSERT INTO `admins` \(`id`, `password`, `createdAt`\)/);
  assert.ok(calls.some(([, query]) => typeof query === 'string' && query.includes('CAST(`createdAt` AS CHAR)')));
  assert.ok(calls.some(([, query]) => typeof query === 'string' && query.includes('ORDER BY `id` LIMIT 500 OFFSET 500')));
  assert.deepEqual(calls.at(-1)[2], ['SYSTEM']);
});

test('CSV includes every row, generated values, safe formula escaping and binary', async () => {
  setup();
  const res = new MockResponse();
  await downloadCsvBackup(request, res);
  assert.equal(res.ended, true);
  const csv = res.chunks.join('');
  assert.equal((csv.match(/"admins"/g) || []).length, 501);
  assert.match(csv, /"'=SECRET"/);
  assert.match(csv, /"base64:AP8="/);
  assert.match(csv, /"generated"/);
});

test('non-InnoDB table aborts before output and restores time zone', async () => {
  const calls = setup({ nonInnoDB: true });
  const res = new MockResponse();
  await downloadSqlBackup(request, res);
  assert.equal(res.code, 500);
  assert.match(res.body.message, /InnoDB/);
  assert.equal(res.chunks.length, 0);
  assert.deepEqual(calls.at(-1)[2], ['SYSTEM']);
});

test('partial download is terminated when a query fails', async () => {
  const calls = setup({ failRows: true });
  const res = new MockResponse();
  await downloadSqlBackup(request, res);
  assert.equal(res.destroyed, true);
  assert.equal(res.ended, undefined);
  assert.deepEqual(calls.at(-1)[2], ['SYSTEM']);
});

test('overview lists every base table', async () => {
  setup();
  const res = new MockResponse();
  await getBackupOverview(request, res);
  assert.deepEqual(res.body.data, { tableCount: 2, tables: ['admins', 'settings'] });
});
