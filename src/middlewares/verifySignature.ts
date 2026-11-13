import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { env } from '../config/env';

/**
 * Middleware untuk memverifikasi keaslian signature key dari notifikasi webhook Midtrans.
 * Mencegah serangan pemalsuan payload (spoofing) dari pihak luar.
 */
export const verifyMidtransSignature = (req: Request, res: Response, next: NextFunction): any => {
  try {
    const { order_id, status_code, gross_amount, signature_key } = req.body;

    // Jika di mode development dan tidak ada signature key dikirim (misal testing manual), boleh dilompati
    if (process.env.NODE_ENV === 'development' && !signature_key) {
      console.warn('⚠️ [DEV WARNING] Midtrans signature dilewati karena mode development.');
      return next();
    }

    if (
      typeof order_id !== 'string' || order_id.length === 0 ||
      typeof status_code !== 'string' || status_code.length === 0 ||
      (typeof gross_amount !== 'string' && typeof gross_amount !== 'number') ||
      !Number.isFinite(Number(gross_amount)) ||
      typeof signature_key !== 'string' || !/^[a-f\d]{128}$/i.test(signature_key)
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Payload webhook Midtrans tidak lengkap (parameter verifikasi hilang).',
      });
    }

    // Midtrans Signature Key dibuat dengan algoritma SHA512 dari: order_id + status_code + gross_amount + ServerKey
    const serverKey = env.MIDTRANS_SERVER_KEY || '';
    const rawString = `${order_id}${status_code}${gross_amount}${serverKey}`;
    
    const computedSignatureKey = crypto
      .createHash('sha512')
      .update(rawString)
      .digest('hex');

    // Bandingkan signature yang dihitung dengan yang dikirim oleh Midtrans
    const expected = Buffer.from(computedSignatureKey, 'hex');
    const received = Buffer.from(signature_key, 'hex');
    if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
      console.error('🚨 [SECURITY WARNING] Signature key Midtrans tidak valid!');
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak: Signature key webhook tidak valid.',
      });
    }

    return next();
  } catch (error) {
    console.error('🚨 [SIGNATURE ERROR] Gagal memverifikasi signature Midtrans:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memverifikasi keamanan webhook.',
    });
  }
};