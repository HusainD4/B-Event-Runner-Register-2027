import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

/**
 * Rate limiter umum untuk semua endpoint API umum 
 * (Maksimal 100 request per 15 menit per IP)
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Terlalu banyak permintaan dari IP Anda, silakan coba lagi setelah 15 menit.',
  },
});

/**
 * Rate limiter khusus untuk proses War Tiket atau Pendaftaran 
 * (Maksimal 5 request per 1 menit per IP untuk mencegah spam script/bot)
 */
export const warTicketLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 5, 
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    return res.status(429).json({
      status: 'error',
      message: '🚨 Terlalu banyak percobaan pendaftaran. Harap tunggu 1 menit sebelum mencoba kembali.',
    });
  },
});