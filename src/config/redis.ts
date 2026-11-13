import Redis from 'ioredis';
import { env } from './env';

// Inisialisasi Redis client dengan penanganan error yang aman
const RedisClient = (Redis as any).default || Redis;

export const redis = new RedisClient({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  retryStrategy(times: number) {
    // Batasi percobaan ulang atau matikan reconnect otomatis jika Redis lokal mati
    if (times > 3) {
      console.warn('⚠️ [REDIS] Melewati koneksi Redis karena server tidak aktif.');
      return null; // Berhenti mencoba menyambung ulang
    }
    return Math.min(times * 50, 2000);
  },
});

redis.on('connect', () => {
  console.log('✅ [REDIS] Berhasil terhubung ke server Redis.');
});

redis.on('error', (err: any) => {
  // Cegah aplikasi crash total saat koneksi gagal
  console.warn('⚠️ [REDIS WARNING] Gagal terhubung ke Redis:', err.message);
});
