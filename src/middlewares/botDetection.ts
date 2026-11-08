import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware untuk mendeteksi bot atau script otomatis berdasarkan User-Agent atau header mencurigakan.
 */
export const botDetectionMiddleware = (req: Request, res: Response, next: NextFunction): any => {
  const userAgent = req.headers['user-agent'] || '';

  // Daftar pola string User-Agent yang biasanya diasumsikan sebagai bot atau web scraper berbahaya
  const suspiciousBots = ['curl', 'wget', 'python-requests', 'postmanruntime', 'scrapy', 'axios'];

  // Jika di mode development, kita bisa longgarkan pengecekan Postman agar mudah diuji
  const isPostman = userAgent.toLowerCase().includes('postmanruntime');
  if (process.env.NODE_ENV === 'development' && isPostman) {
    return next();
  }

  const isSuspicious = suspiciousBots.some(bot => 
    userAgent.toLowerCase().includes(bot)
  );

  if (isSuspicious && !userAgent.includes('Mozilla')) {
    console.warn(`🚨 [BOT DETECTION] Akses diblokir dari User-Agent mencurigakan: ${userAgent}`);
    return res.status(403).json({
      status: 'error',
      message: 'Akses ditolak: Terdeteksi aktivitas otomatis atau bot.',
    });
  }

  return next();
};