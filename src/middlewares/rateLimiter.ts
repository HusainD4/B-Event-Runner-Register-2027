import rateLimit from 'express-rate-limit';
import { createHmac, randomBytes } from 'crypto';
import type { Request, RequestHandler, Response } from 'express';
import { env } from '../config/env';
import { readCookie } from '../config/admin-session';

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

const ADMIN_LOGIN_RATE_COOKIE = 'tegal_admin_login_rate';
const ADMIN_LOGIN_RATE_WINDOW_MS = 30 * 60 * 1000;
const ADMIN_LOGIN_ACCOUNT_KEY_SECRET = randomBytes(32);

interface AdminLoginRequest extends Request {
  adminLoginBrowserKey?: string;
}

const identifyAdminLoginBrowser: RequestHandler = (req, res, next) => {
  const existingKey = readCookie(req.headers.cookie, ADMIN_LOGIN_RATE_COOKIE);
  const browserKey = existingKey && /^[a-f0-9]{64}$/.test(existingKey)
    ? existingKey
    : randomBytes(32).toString('hex');

  (req as AdminLoginRequest).adminLoginBrowserKey = browserKey;
  if (browserKey !== existingKey) {
    res.cookie(ADMIN_LOGIN_RATE_COOKIE, browserKey, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/api/admin/auth/login',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
  next();
};

/**
 * Limit failed admin logins per browser, rather than locking out everyone
 * behind a shared network address.
 */
const adminLoginRateLimiter = rateLimit({
  windowMs: ADMIN_LOGIN_RATE_WINDOW_MS,
  max: 5,
  keyGenerator: req => (req as AdminLoginRequest).adminLoginBrowserKey || 'missing-browser-key',
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    return res.status(429).json({
      status: 'error',
      message: '🚨 Terlalu banyak percobaan login admin yang gagal di browser ini. Silakan coba kembali setelah 30 menit.',
    });
  },
});

const adminLoginAccountRateLimiter = rateLimit({
  windowMs: ADMIN_LOGIN_RATE_WINDOW_MS,
  max: 10,
  keyGenerator: req => {
    const request = req as AdminLoginRequest;
    const identifier = typeof req.body?.identifier === 'string'
      ? req.body.identifier.trim().toLocaleLowerCase()
      : '';
    const accountKey = identifier || `invalid:${request.adminLoginBrowserKey || 'unknown'}`;
    return createHmac('sha256', ADMIN_LOGIN_ACCOUNT_KEY_SECRET).update(accountKey).digest('hex');
  },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => res.status(429).json({
    status: 'error',
    message: '🚨 Terlalu banyak percobaan login untuk akun ini. Silakan coba kembali setelah 30 menit.',
  }),
});

export const adminAuthLimiter: RequestHandler = (req, res, next) => {
  identifyAdminLoginBrowser(req, res, error => {
    if (error) return next(error);
    adminLoginRateLimiter(req, res, error => {
      if (error) return next(error);
      adminLoginAccountRateLimiter(req, res, next);
    });
  });
};

export const backupExportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Batas unduhan backup tercapai. Coba kembali setelah 15 menit.',
  },
});
