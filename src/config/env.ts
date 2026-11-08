import dotenv from 'dotenv';
import { z } from 'zod';

// Memuat file .env dari root direktori
dotenv.config();

// 1. Definisikan Skema Validasi menggunakan Zod untuk Environment Variables
const envSchema = z.object({
  // Mode Aplikasi
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('3000' as any),

  // Database XAMPP / MySQL
  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi di file .env"),

  // Kunci API Midtrans
  MIDTRANS_SERVER_KEY: z.string().min(1, "MIDTRANS_SERVER_KEY wajib diisi di file .env"),
  MIDTRANS_CLIENT_KEY: z.string().min(1, "MIDTRANS_CLIENT_KEY wajib diisi di file .env"),

  // Keamanan JWT (Untuk Auth Admin)
  JWT_SECRET: z.string().min(10, "JWT_SECRET minimal harus 10 karakter demi keamanan").default("SUPER_SECRET_KEY_TEGAL_RUN_2027"),
});

// 2. Parse dan Validasi process.env secara real-time
const envParseResult = envSchema.safeParse(process.env);

if (!envParseResult.success) {
  console.error("❌ [FATAL ERROR] Konfigurasi Environment (.env) Tidak Valid:");
  
  // Cetak rincian error secara rapi ke terminal
  const formattedErrors = envParseResult.error.format();
  console.error(JSON.stringify(formattedErrors, null, 2));
  
  // Matikan server agar tidak berjalan dengan konfigurasi yang salah
  process.exit(1);
}

// 3. Ekspor variabel yang sudah bersih dan bertipe data pasti (Type-Safe)
export const env = envParseResult.data;