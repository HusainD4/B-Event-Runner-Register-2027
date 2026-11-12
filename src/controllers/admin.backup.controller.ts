import { once } from 'node:events';
import type { Response } from 'express';
import prisma from '../config/database';
import type { AuthenticatedRequest } from '../middlewares/auth';
import { logger } from '../utils/logger';

const BACKUP_PAGE_SIZE = 500;

interface DatabaseTable {
  tableName: string;
}

interface DatabaseColumn {
  Field: string;
}

function quoteIdentifier(identifier: string): string {
  return `\`${identifier.replace(/`/g, '``')}\``;
}

async function getDatabaseTables(): Promise<string[]> {
  const tables = await prisma.$queryRaw<DatabaseTable[]>`
    SELECT TABLE_NAME AS tableName
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_TYPE = 'BASE TABLE'
    ORDER BY TABLE_NAME
  `;
  return tables.map(({ tableName }) => tableName);
}

async function getTableColumns(tableName: string): Promise<string[]> {
  const columns = await prisma.$queryRawUnsafe<DatabaseColumn[]>(
    `SHOW COLUMNS FROM ${quoteIdentifier(tableName)}`
  );
  return columns.map(({ Field }) => Field);
}

async function getRows(tableName: string, offset: number): Promise<Record<string, unknown>[]> {
  return prisma.$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT * FROM ${quoteIdentifier(tableName)} LIMIT ${BACKUP_PAGE_SIZE} OFFSET ${offset}`
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
  if (Buffer.isBuffer(value)) return `X'${value.toString('hex')}'`;
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
  if (Buffer.isBuffer(value)) return `base64:${value.toString('base64')}`;
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
  if (res.destroyed) return;
  if (!res.write(chunk)) await once(res, 'drain');
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
    const tables = await getDatabaseTables();
    const columnsByTable = new Map<string, string[]>();
    for (const table of tables) {
      columnsByTable.set(table, await getTableColumns(table));
    }
    await auditBackupDownload(req, format, tables.length);
    prepareDownload(res, format);

    if (format === 'sql') {
      await writeChunk(res, [
        '-- Tegal Run full database backup',
        '-- Contains all base-table schemas and records, including sensitive participant/admin data.',
        '-- Store securely and restore only into a trusted, empty database.',
        'SET NAMES utf8mb4;',
        'SET FOREIGN_KEY_CHECKS = 0;',
        '',
      ].join('\n'));

      for (const table of tables) {
        if (res.destroyed) return;
        const definition = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
          `SHOW CREATE TABLE ${quoteIdentifier(table)}`
        );
        const createStatement = definition[0] && Object.entries(definition[0])
          .find(([key]) => key.toLowerCase() === 'create table')?.[1];
        if (typeof createStatement !== 'string') {
          throw new Error(`Could not read the CREATE TABLE statement for ${table}.`);
        }
        await writeChunk(res, `\n-- Table ${table}\n${createStatement};\n`);

        const columns = columnsByTable.get(table) || [];
        if (columns.length === 0) continue;
        const quotedColumns = columns.map(quoteIdentifier).join(', ');
        let offset = 0;
        while (!res.destroyed) {
          const rows = await getRows(table, offset);
          if (rows.length === 0) break;
          for (const row of rows) {
            const values = columns.map((column) => sqlValue(row[column])).join(', ');
            await writeChunk(
              res,
              `INSERT INTO ${quoteIdentifier(table)} (${quotedColumns}) VALUES (${values});\n`
            );
          }
          offset += rows.length;
        }
      }

      await writeChunk(res, '\nSET FOREIGN_KEY_CHECKS = 1;\n');
    } else {
      const allColumns = [...new Set([...columnsByTable.values()].flat())];
      await writeChunk(res, `\uFEFF${['table_name', ...allColumns].map(csvCell).join(',')}\r\n`);
      for (const table of tables) {
        if (res.destroyed) return;
        const columns = columnsByTable.get(table) || [];
        let offset = 0;
        while (!res.destroyed) {
          const rows = await getRows(table, offset);
          if (rows.length === 0) break;
          for (const row of rows) {
            const cells = [table, ...allColumns.map((column) =>
              columns.includes(column) ? normalizeCsvValue(row[column]) : ''
            )];
            await writeChunk(res, `${cells.map(csvCell).join(',')}\r\n`);
          }
          offset += rows.length;
        }
      }
    }

    if (!res.destroyed) res.end();
  } catch (error) {
    logger.error(`Database ${format.toUpperCase()} backup export failed:`, error);
    if (res.headersSent) {
      res.destroy(error instanceof Error ? error : undefined);
      return;
    }
    res.status(500).json({
      status: 'error',
      message: 'Backup database gagal dibuat. Periksa log server dan koneksi database.',
    });
  }
}

export const getBackupOverview = async (_req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tables = await getDatabaseTables();
    return res.status(200).json({
      status: 'success',
      data: { tableCount: tables.length, tables },
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
