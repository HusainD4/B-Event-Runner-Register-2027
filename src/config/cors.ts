import type { CorsOptions } from 'cors';

// Daftar domain yang diizinkan untuk menembak API ini
const allowedOrigins = [
  'http://localhost:3000',     // Frontend Vue/Next.js di komputer lokal Anda
  'http://localhost:5173',     // Port default Vite (jika Anda pakai Vite)
  'https://haisen.my.id',      // Website utama Anda
  'https://www.haisen.my.id',
  'https://tegalrun2027.com',  // (Contoh) Ganti dengan domain resmi event nanti
  // Tambahkan domain frontend Vercel/Cloudflare Anda di sini nantinya
];

export const corsConfig: CorsOptions = {
  // Logika pengecekan asal request (origin)
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Izinkan request tanpa origin (seperti Postman, Insomnia, atau server-to-server) 
    // ATAU jika origin-nya ada di dalam daftar allowedOrigins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error: Akses dari domain ${origin} diblokir oleh server.`));
    }
  },
  
  // Metode HTTP yang diizinkan
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  
  // Header yang diizinkan masuk
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  
  // Izinkan pengiriman cookies / credentials
  credentials: true,
  
  // Cache hasil preflight (OPTIONS) selama 10 menit
  maxAge: 600, 
};