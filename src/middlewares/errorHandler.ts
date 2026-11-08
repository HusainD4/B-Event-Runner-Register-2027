import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware untuk menangani URL / endpoint yang tidak ditemukan (404 Not Found)
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): any => {
  return res.status(404).json({
    status: 'error',
    message: `Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Global Error Handler untuk menangkap semua error internal yang tidak tertangkap di controller (500)
 */
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction): any => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server.';

  // Catat error menggunakan Winston Logger
  logger.error(`🚨 [GLOBAL ERROR] ${statusCode} - ${message} - Path: ${req.originalUrl} - Method: ${req.method}`, {
    stack: err.stack,
  });

  return res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Terjadi kesalahan pada server.' : message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};