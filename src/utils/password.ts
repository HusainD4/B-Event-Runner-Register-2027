import crypto from 'crypto';

/**
 * Hash password menggunakan algoritma Scrypt bawaan Node.js dengan salt kriptografis acak.
 * Format output: `${salt}:${hash}`
 */
export const hashPassword = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
};

/**
 * Verifikasi kecocokan password mentah dengan format hash yang tersimpan.
 * Menggunakan crypto.timingSafeEqual untuk mencegah timing attacks.
 */
export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const parts = storedHash.split(':');
      if (parts.length !== 2) return resolve(false);

      const salt = parts[0];
      const key = parts[1];

      if (!salt || !key) return resolve(false);

      const keyBuffer = Buffer.from(key, 'hex');

      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return resolve(false);
        try {
          const match = crypto.timingSafeEqual(keyBuffer, derivedKey);
          resolve(match);
        } catch {
          resolve(false);
        }
      });
    } catch {
      resolve(false);
    }
  });
};
