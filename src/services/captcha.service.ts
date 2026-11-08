import axios from 'axios';
import { env } from '../config/env';

/**
 * Interface untuk respons verifikasi CAPTCHA
 */
interface CaptchaVerifyResult {
  success: boolean;
  score?: number; // Digunakan jika menggunakan reCAPTCHA v3 (skor 0.0 - 1.0)
  errorCodes?: string[];
}

/**
 * Layanan Verifikasi CAPTCHA (Server-Side)
 * Mendukung Google reCAPTCHA (v2/v3) atau layanan alternatif seperti Turnstile.
 */
export class CaptchaService {
  private static secretKey: string = process.env.CAPTCHA_SECRET_KEY || "dummy_secret_key_for_dev";
  private static verifyUrl: string = 'https://www.google.com/recaptcha/api/siteverify';

  /**
     * Memverifikasi token CAPTCHA yang dikirimkan oleh klien (frontend)
     * @param token Token string dari widget CAPTCHA di frontend
     * @param minScore (Opsional) Skor minimum untuk reCAPTCHA v3 (default: 0.5)
     */
  public static async verifyToken(token: string, minScore: number = 0.5): Promise<boolean> {
    try {
      // Jika di mode development dan token diset bypass khusus testing
      if (env.NODE_ENV === 'development' && token === 'BYPASS_CAPTCHA_DEV') {
        console.warn('⚠️ [CAPTCHA] Melewati verifikasi CAPTCHA karena menggunakan token bypass development.');
        return true;
      }

      if (!token) {
        console.warn('🚨 [CAPTCHA] Token CAPTCHA tidak ditemukan dalam permintaan.');
        return false;
      }

      // Kirim permintaan verifikasi ke server Google reCAPTCHA
      const response = await axios.post(
        this.verifyUrl,
        null,
        {
          params: {
            secret: this.secretKey,
            response: token,
          },
          timeout: 5000, // Timeout 5 detik agar tidak menggantung server saat war tiket
        }
      );

      const data = response.data;

      if (!data.success) {
        console.warn('🚨 [CAPTCHA] Verifikasi gagal oleh provider:', data['error-codes'] || 'Unknown error');
        return false;
      }

      // Jika reCAPTCHA v3 digunakan, periksa skor keaktifan bot (0.0 = bot, 1.0 = manusia)
      if (data.score !== undefined && data.score < minScore) {
        console.warn(`🚨 [CAPTCHA] Skor terlalu rendah (${data.score}), diduga bot.`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('🚨 [ERROR] CaptchaService verification error:', error);
      // Fail-open atau Fail-closed tergantung kebijakan keamanan. 
      // Untuk war tiket, mengembalikan false saat API eksternal down lebih aman untuk mencegah bot menjebol sistem.
      return false;
    }
  }
}