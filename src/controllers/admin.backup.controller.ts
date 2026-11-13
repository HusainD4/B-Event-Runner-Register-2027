import type { Response } from 'express';
import prisma from '../config/database';
import type { Prisma } from '../generated/client';
import type { AuthenticatedRequest } from '../middlewares/auth';
import { logger } from '../utils/logger';

const BACKUP_PAGE_SIZE = 500;
const BACKUP_TIMEOUT_MS = 15 * 60 * 1000;

class NonTransactionalTablesError extends Error {
  constructor(tableNames: string[]) {
    super(`Consistent backup requires InnoDB tables: ${tableNames.join(', ')}`);
  }
}

interface DatabaseTable {
  tableName: string;
  engine: string | null;
}

interface DatabaseColumn {
  Field: string;
  Extra: string;
  Type: string;
}

interface DatabaseIndex {
  Key_name: string;
  Seq_in_index: number | bigint;
  Column_name: string | null;
}

function quoteIdentifier(identifier: string): string {
  return `\`${identifier.replace(/`/g, '``')}\``;
}

async function getDatabaseTables(db: Prisma.TransactionClient): Promise<DatabaseTable[]> {
  return db.$queryRaw<DatabaseTable[]>`
    SELECT TABLE_NAME AS tableName, ENGINE AS engine
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_TYPE = 'BASE TABLE'
    ORDER BY TABLE_NAME
  `;
}

async function getTableColumns(db: Prisma.TransactionClient, tableName: string): Promise<DatabaseColumn[]> {
  return db.$queryRawUnsafe<DatabaseColumn[]>(
    `SHOW COLUMNS FROM ${quoteIdentifier(tableName)}`
  );
}

async function getPrimaryKey(db: Prisma.TransactionClient, tableName: string): Promise<string[]> {
  const indexes = await db.$queryRawUnsafe<DatabaseIndex[]>(`SHOW INDEX FROM ${quoteIdentifier(tableName)}`);
  return indexes.filter(index => index.Key_name === 'PRIMARY' && index.Column_name !== null)
    .sort((a, b) => Number(a.Seq_in_index) - Number(b.Seq_in_index))
    .map(index => index.Column_name!);
}

async function getRows(db: Prisma.TransactionClient, tableName: string, columns: DatabaseColumn[], primaryKey: string[], offset: number): Promise<Record<string, unknown>[]> {
  const orderAndPage = primaryKey.length
    ? ` ORDER BY ${primaryKey.map(quoteIdentifier).join(', ')} LIMIT ${BACKUP_PAGE_SIZE} OFFSET ${offset}`
    : '';
  const projection = columns.map(column => {
    const name = quoteIdentifier(column.Field);
    return /^(date|datetime|timestamp|time)(?:\(|$)/i.test(column.Type)
      ? `CAST(${name} AS CHAR) AS ${name}`
      : name;
  }).join(', ');
  return db.$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT ${projection} FROM ${quoteIdentifier(tableName)}${orderAndPage}`
  );
}

function asSqlText(value: string): string {
  return `CONVERT(X'${Buffer.from(value, 'utf8').toString('hex')}' USING utf8mb4)`;
}

function sqlValue(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('Database returned a non-finite numeric value.');
    return String(value);
  }
  if (typeof value === 'bigint') return value.toString();
  if (typeof value === 'string') return asSqlText(value);
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) throw new Error('Database returned an invalid date.');
    return asSqlText(value.toISOString().replace('T', ' ').replace('Z', ''));
  }
  if (value instanceof Uint8Array) return `X'${Buffer.from(value).toString('hex')}'`;
  if (Array.isArray(value) || typeof value === 'object') {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null && !Array.isArray(value)) {
      return asSqlText(String(value));
    }
    return asSqlText(JSON.stringify(value));
  }
  throw new Error(`Unsupported database value type: ${typeof value}.`);
}

function normalizeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') {
    return /^[\uFEFF\s]*[=+\-@]/.test(value) ? `'${value}` : value;
  }
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Uint8Array) return `base64:${Buffer.from(value).toString('base64')}`;
  if (Array.isArray(value) || typeof value === 'object') {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null && !Array.isArray(value)) {
      return String(value);
    }
    return JSON.stringify(value, (_key, nestedValue: unknown) =>
      typeof nestedValue === 'bigint' ? nestedValue.toString() : nestedValue
    );
  }
  throw new Error(`Unsupported database value type: ${typeof value}.`);
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

async function writeChunk(res: Response, chunk: string): Promise<void> {
  if (res.destroyed) throw new Error('Backup download was disconnected.');
  if (res.write(chunk)) return;
  await new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      res.removeListener('drain', onDrain);
      res.removeListener('close', onClose);
      res.removeListener('error', onError);
    };
    const onDrain = () => { cleanup(); resolve(); };
    const onClose = () => { cleanup(); reject(new Error('Backup download was disconnected.')); };
    const onError = (error: Error) => { cleanup(); reject(error); };
    res.once('drain', onDrain);
    res.once('close', onClose);
    res.once('error', onError);
    if (res.destroyed) onClose();
  });
}

async function auditBackupDownload(
  req: AuthenticatedRequest,
  format: 'sql' | 'csv',
  tableCount: number
): Promise<void> {
  if (!req.admin) throw new Error('Admin authentication is required for database backup.');
  await prisma.log.create({
    data: {
      action: 'ADMIN_BACKUP_DOWNLOAD',
      description: `Admin mengunduh backup database format ${format.toUpperCase()}.`,
      adminId: req.admin.adminId,
      entityType: 'DatabaseBackup',
      metadata: { format, tableCount },
    },
  });
}

function prepareDownload(res: Response, format: 'sql' | 'csv'): void {
  const date = new Date().toISOString().slice(0, 10);
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', `attachment; filename="tegal-run-backup-${date}.${format}"`);
  res.type(format === 'sql' ? 'text/plain' : 'text/csv');
}

async function streamExport(
  req: AuthenticatedRequest,
  res: Response,
  format: 'sql' | 'csv'
): Promise<void> {
  try {
    const overview = await getDatabaseTables(prisma);
    await auditBackupDownload(req, format, overview.length);
    await prisma.$transaction(async tx => {
      const timeZones = await tx.$queryRaw<Array<{ timeZone: string }>>`SELECT @@session.time_zone AS timeZone`;
      const originalTimeZone = timeZones[0]?.timeZone;
      if (typeof originalTimeZone !== 'string') throw new Error('Could not read the database session time zone.');
      await tx.$executeRaw`SET SESSION time_zone = '+00:00'`;
      try {
        const tables = await getDatabaseTables(tx);
        if (!tables.length) throw new Error('No base tables found in the selected database.');
        const unsupported = tables.filter(table => table.engine?.toUpperCase() !== 'INNODB');
        if (unsupported.length) {
          throw new NonTransactionalTablesError(unsupported.map(table => table.tableName));
        }
        const metadata = new Map<string, { columns: DatabaseColumn[]; primaryKey: string[] }>();
        for (const { tableName } of tables) {
          const columns = await getTableColumns(tx, tableName);
          if (!columns.length) throw new Error(`No columns found for ${tableName}.`);
          metadata.set(tableName, { columns, primaryKey: await getPrimaryKey(tx, tableName) });
        }
        prepareDownload(res, format);

        if (format === 'sql') {
          await writeChunk(res, [
            '-- Tegal Run full database backup',
            '-- Contains InnoDB base-table schemas and records, including sensitive participant/admin data.',
            '-- Does not include views, triggers, routines, events, or external files.',
            '-- Store securely and restore only into a trusted, empty database.',
            'SET NAMES utf8mb4;',
            "SET time_zone = '+00:00';",
            'SET FOREIGN_KEY_CHECKS = 0;',
            '',
          ].join('\n'));

          for (const { tableName: table } of tables) {
            if (res.destroyed) throw new Error('Backup download was disconnected.');
            const definition = await tx.$queryRawUnsafe<Record<string, unknown>[]>(
              `SHOW CREATE TABLE ${quoteIdentifier(table)}`
            );
            const createStatement = definition[0] && Object.entries(definition[0])
              .find(([key]) => key.toLowerCase() === 'create table')?.[1];
            if (typeof createStatement !== 'string') {
              throw new Error(`Could not read the CREATE TABLE statement for ${table}.`);
            }
            await writeChunk(res, `\n-- Table ${table}\n${createStatement};\n`);

            const info = metadata.get(table);
            if (!info) throw new Error(`Missing metadata for ${table}.`);
            const columns = info.columns.filter(column => !/\b(?:VIRTUAL|STORED) GENERATED\b/i.test(column.Extra)).map(column => column.Field);
            const quotedColumns = columns.map(quoteIdentifier).join(', ');
            let offset = 0;
            while (true) {
              const rows = await getRows(tx, table, info.columns, info.primaryKey, offset);
              if (rows.length === 0) break;
              for (const row of rows) {
                if (columns.some(column => !(column in row))) throw new Error(`Missing column in ${table}.`);
                const values = columns.map((column) => sqlValue(row[column])).join(', ');
                await writeChunk(
                  res,
                  `INSERT INTO ${quoteIdentifier(table)} (${quotedColumns}) VALUES (${values});\n`
                );
              }
              offset += rows.length;
              if (!info.primaryKey.length || rows.length < BACKUP_PAGE_SIZE) break;
            }
          }

          await writeChunk(res, '\nSET FOREIGN_KEY_CHECKS = 1;\n');
        } else {
          const allColumns = [...new Set([...metadata.values()].flatMap(info => info.columns.map(column => column.Field)))];
          await writeChunk(res, `\uFEFF${['table_name', ...allColumns].map(csvCell).join(',')}\r\n`);
          for (const { tableName: table } of tables) {
            if (res.destroyed) throw new Error('Backup download was disconnected.');
            const info = metadata.get(table);
            if (!info) throw new Error(`Missing metadata for ${table}.`);
            const columns = info.columns.map(column => column.Field);
            let offset = 0;
            while (true) {
              const rows = await getRows(tx, table, info.columns, info.primaryKey, offset);
              if (rows.length === 0) break;
              for (const row of rows) {
                if (columns.some(column => !(column in row))) throw new Error(`Missing column in ${table}.`);
                const cells = [table, ...allColumns.map((column) =>
                  columns.includes(column) ? normalizeCsvValue(row[column]) : ''
                )];
                await writeChunk(res, `${cells.map(csvCell).join(',')}\r\n`);
              }
              offset += rows.length;
              if (!info.primaryKey.length || rows.length < BACKUP_PAGE_SIZE) break;
            }
          }
        }
      } finally {
        await tx.$executeRaw`SET SESSION time_zone = ${originalTimeZone}`;
      }
    }, { isolationLevel: 'RepeatableRead', maxWait: 10_000, timeout: BACKUP_TIMEOUT_MS });
    if (!res.destroyed) res.end();
  } catch (error) {
    logger.error(`Database ${format.toUpperCase()} backup export failed:`, error);
    if (res.headersSent) {
      res.destroy(error instanceof Error ? error : undefined);
      return;
    }
    res.removeHeader('Content-Disposition');
    res.status(500).json({
      status: 'error',
      message: error instanceof NonTransactionalTablesError
        ? 'Backup konsisten memerlukan semua tabel menggunakan InnoDB. Periksa engine tabel di server.'
        : 'Backup database gagal dibuat. Periksa log server dan koneksi database.',
    });
  }
}

export const getBackupOverview = async (_req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tables = await getDatabaseTables(prisma);
    return res.status(200).json({
      status: 'success',
      data: { tableCount: tables.length, tables: tables.map(table => table.tableName) },
    });
  } catch (error) {
    logger.error('Failed to inspect database tables for backup:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Daftar tabel database gagal dimuat.',
    });
  }
};

export const downloadSqlBackup = (req: AuthenticatedRequest, res: Response): Promise<void> =>
  streamExport(req, res, 'sql');

export const downloadCsvBackup = (req: AuthenticatedRequest, res: Response): Promise<void> =>
  streamExport(req, res, 'csv');
