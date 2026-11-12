import { env } from './env';

export const ADMIN_SESSION_COOKIE = 'tegal_admin_session';
export const ADMIN_SESSION_MAX_AGE = 24 * 60 * 60 * 1000;

export const adminSessionCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
  path: '/',
  maxAge: ADMIN_SESSION_MAX_AGE,
};

export const adminSessionClearOptions = {
  httpOnly: adminSessionCookieOptions.httpOnly,
  secure: adminSessionCookieOptions.secure,
  sameSite: adminSessionCookieOptions.sameSite,
  path: adminSessionCookieOptions.path,
};

export function readCookie(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) return null;

  for (const cookie of cookieHeader.split(';')) {
    const separatorIndex = cookie.indexOf('=');
    if (separatorIndex < 0 || cookie.slice(0, separatorIndex).trim() !== name) continue;

    const value = cookie.slice(separatorIndex + 1).trim();
    try {
      return decodeURIComponent(value);
    } catch {
      return null;
    }
  }

  return null;
}
