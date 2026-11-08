import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware untuk menambahkan custom security headers tambahan pada setiap respons HTTP
 */
export const setSecurityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // Mencegah Clickjacking (iframe embedding)
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Mencegah MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Mengaktifkan proteksi XSS bawaan browser
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Kebijakan Referrer
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  return next();
};