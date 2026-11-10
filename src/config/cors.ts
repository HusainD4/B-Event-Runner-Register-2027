import type { CorsOptions } from 'cors';

// Daftar domain yang diizinkan untuk menembak API ini
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://haisen.my.id',
  'https://www.haisen.my.id',
  'https://tegalrun2027.com',
  'https://pendaftaran-running.haisen.my.id'
];

export const corsConfig: CorsOptions = {
  // Logika pengecekan asal request (origin)
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Izinkan request tanpa origin (seperti Postman, server-to-server)
    // atau jika origin ada di daftar / berasal dari localhost / local IP
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+)(:\d+)?$/.test(origin)
    ) {
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