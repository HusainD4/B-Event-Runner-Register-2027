import type { Request, Response, NextFunction } from 'express';

/**
 * Fungsi rekursif sederhana untuk membersihkan string dari potensi injeksi karakter berbahaya (XSS / Sanitization dasar)
 */
const sanitizeValue = (value: any): any => {
  if (typeof value === 'string') {
    // Hilangkan tag HTML dasar yang berbahaya atau karakter escape yang mencurigakan
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .trim();
  }
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      value[key] = sanitizeValue(value[key]);
    }
  }
  return value;
};

/**
 * Middleware untuk membersihkan input body, query, dan params secara otomatis
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): any => {
  try {
    if (req.body) {
      req.body = sanitizeValue(req.body);
    }
    if (req.query) {
      req.query = sanitizeValue(req.query);
    }
    if (req.params) {
      req.params = sanitizeValue(req.params);
    }
    return next();
  } catch (error) {
    console.error('🚨 [SANITIZE ERROR] Gagal membersihkan input:', error);
    return res.status(400).json({
      status: 'error',
      message: 'Format input tidak valid atau mengandung karakter terlarang.',
    });
  }
};