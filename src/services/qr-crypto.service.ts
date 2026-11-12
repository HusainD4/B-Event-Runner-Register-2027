import crypto from 'crypto';
import prisma from '../config/database';
import { env } from '../config/env';

// Secret key untuk enkripsi QR code (32 bytes untuk aes-256-cbc)
const CIPHER_KEY = crypto.createHash('sha256').update(env.JWT_SECRET).digest();
const ALGORITHM = 'aes-256-cbc';

export interface SingleQrPayload {
  t: 'single';
  o: string; // Order ID / midtransOrderId
  p: string; // Participant ID
  b?: string | null; // BIB Number (opsional / omit)
  n: string; // NIK
}

export interface MasterQrPayload {
  t: 'master';
  o: string; // Order ID / midtransOrderId
  c: number; // Participant count
}

export type DecryptedQrPayload = SingleQrPayload | MasterQrPayload;

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
}

async function getOrCreateQrToken(target: { participantId: string } | { orderId: string }): Promise<string> {
  const findExisting = () => 'participantId' in target
    ? prisma.qrToken.findUnique({
        where: { participantId: target.participantId },
        select: { token: true },
      })
    : prisma.qrToken.findUnique({
        where: { orderId: target.orderId },
        select: { token: true },
      });

  const existing = await findExisting();
  if (existing) return existing.token;

  for (let attempt = 0; attempt < 8; attempt++) {
    const token = String(crypto.randomInt(0, 10_000_000_000)).padStart(10, '0');
    try {
      const created = await prisma.qrToken.create({
        data: { token, ...target },
        select: { token: true },
      });
      return created.token;
    } catch (error) {
      if (!isUniqueConstraintError(error)) throw error;
      const concurrentlyCreated = await findExisting();
      if (concurrentlyCreated) return concurrentlyCreated.token;
    }
  }

  throw new Error('Gagal membuat token QR unik setelah beberapa percobaan.');
}

/**
 * Ambil awalan (prefix) QR code dari database AppSetting
 */
export async function getQrPrefix(): Promise<string> {
  try {
    const setting = await prisma.appSetting.findUnique({
      where: { key: 'qr_prefix' },
    });
    if (setting && setting.value && setting.value.trim()) {
      return setting.value.trim().toUpperCase();
    }
  } catch (err) {
    console.warn('Gagal membaca qr_prefix dari DB:', err);
  }
  return 'TEGALRUN';
}

/**
 * Simpan awalan (prefix) QR code ke database AppSetting
 */
export async function saveQrPrefix(prefix: string): Promise<string> {
  const cleanPrefix = (prefix || 'TEGALRUN').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  await prisma.appSetting.upsert({
    where: { key: 'qr_prefix' },
    update: { value: cleanPrefix },
    create: {
      key: 'qr_prefix',
      value: cleanPrefix,
      description: 'Awalan QR E-Tiket baru (format: PREFIX|token_acak_10_digit)',
    },
  });
  return cleanPrefix;
}

/**
 * Enkripsi payload menjadi string URL-safe Base64
 */
export function encryptQrPayload(payload: DecryptedQrPayload): string {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, CIPHER_KEY, iv);
    const jsonStr = JSON.stringify(payload);
    let encrypted = cipher.update(jsonStr, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    // Gabungkan IV + Encrypted Data dengan pemisah titik (.) lalu jadikan Base64URL
    const combined = `${iv.toString('base64')}.${encrypted}`;
    return Buffer.from(combined, 'utf8').toString('base64url');
  } catch (err) {
    console.error('encryptQrPayload error:', err);
    throw new Error('Enkripsi payload QR gagal.');
  }
}

/**
 * Dekripsi string enkripsi kembali menjadi object payload
 */
export function decryptQrPayload(encryptedStr: string): DecryptedQrPayload | null {
  if (!encryptedStr) return null;

  try {
    // 1. Coba dekripsi AES-256-CBC
    const rawCombined = Buffer.from(encryptedStr, 'base64url').toString('utf8');
    if (rawCombined.includes('.')) {
      const [ivB64, encB64] = rawCombined.split('.');
      const iv = Buffer.from(ivB64, 'base64');
      const decipher = crypto.createDecipheriv(ALGORITHM, CIPHER_KEY, iv);
      let decrypted = decipher.update(encB64, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      const parsed = JSON.parse(decrypted);
      if (parsed && parsed.t) return parsed;
    }

    // 2. Fallback: direct json parse jika raw base64url
    const directJson = Buffer.from(encryptedStr, 'base64url').toString('utf8');
    const parsedDirect = JSON.parse(directJson);
    if (parsedDirect && parsedDirect.t) return parsedDirect;
  } catch {
    // Abaikan jika bukan format enkripsi kita
  }

  return null;
}

/**
 * Generate a compact, database-backed QR code for one participant.
 */
export async function generateSingleQrString(participantId: string): Promise<string> {
  const prefix = await getQrPrefix();
  const token = await getOrCreateQrToken({ participantId });
  return `${prefix}|${token}`;
}

/**
 * Generate a compact, database-backed master QR code for one order.
 */
export async function generateMasterQrString(orderId: string): Promise<string> {
  const prefix = await getQrPrefix();
  const token = await getOrCreateQrToken({ orderId });
  return `${prefix}|${token}`;
}
