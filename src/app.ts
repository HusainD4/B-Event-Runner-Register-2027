// import express from 'express';
// import type { Request, Response } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';

// // Import Konfigurasi & Rute Utama
// import { corsConfig } from './config/cors';
// import routes from './routes/index';

// // Import Middleware Keamanan Tambahan & Jaring Pengaman
// import { setSecurityHeaders } from './middlewares/security';
// import { globalErrorHandler, notFoundHandler } from './middlewares/errorHandler';
// import { emitDataChanged } from './sockets';

// // Inisialisasi Aplikasi Express
// const app = express();

// const getChangedTopics = (path: string, body: Record<string, unknown> = {}): string[] => {
//   path = path.replace(/^\/api(?=\/|$)/, '');
//   if (path.startsWith('/webhook') || path.startsWith('/register') || path.startsWith('/orders/')) {
//     return ['dashboard', 'orders', 'participants', 'racepack', 'notif-logs', 'logs', 'public:events'];
//   }
//   if (path.includes('/bib') || path.includes('/generate-bib')) return ['bib-settings', 'participants'];
//   if (path.includes('/events') || path.includes('/benefits') || path.includes('/jerseys')) {
//     return ['events', 'dashboard', 'public:events'];
//   }
//   if (path.includes('/participants')) return ['participants', 'racepack', 'dashboard', 'logs'];
//   if (path.includes('/orders') || path.includes('/finance')) return ['orders', 'dashboard', 'participants', 'logs'];
//   if (path.includes('/racepack')) return ['racepack', 'participants', 'dashboard', 'logs'];
//   if (path.includes('/settings/countdown')) {
//     const topics = ['countdown', 'public:countdown'];
//     if (body.eventCountdownDate !== undefined || body.isRegistrationClosed !== undefined) {
//       topics.push('events', 'public:events');
//     }
//     return topics;
//   }
//   if (path.includes('/settings/website')) return ['cms', 'public:cms'];
//   if (path.includes('/routes')) return ['routes', 'public:routes'];
//   if (path.includes('/notifications')) return ['notifications', 'notif-logs', 'whatsapp-web'];
//   if (path.includes('/users-management') || path.includes('/roles') || path.includes('/admin/users')) return ['admins', 'logs'];
//   return ['dashboard', 'logs'];
// };

// const emitChangesAfterSuccessfulMutation: express.RequestHandler = (req, res, next) => {
//   if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase())) return next();

//   res.on('finish', () => {
//     if (res.statusCode >= 200 && res.statusCode < 300) {
//       emitDataChanged(getChangedTopics(req.path, req.body));
//     }
//   });
//   next();
// };

// // ==============================================================
// // 1. MIDDLEWARE KEAMANAN & PARSER (HARUS PALING ATAS)
// // ==============================================================

// // Mengamankan header HTTP standar dari celah kerentanan umum
// app.use(helmet()); 

// // Menerapkan Custom Security Headers (X-Content-Type-Options, X-Frame-Options, dll)
// app.use(setSecurityHeaders);

// // Menerapkan konfigurasi CORS ketat yang sudah terpusat
// app.use(cors(corsConfig)); 

// // Parsing Payload JSON dengan batas maksimal 500kb untuk mencegah serangan DoS payload raksasa
// app.use(express.json({ limit: '500kb' })); 

// // Parsing format form-data tradisional (URL Encoded) dengan batas ukuran yang sama
// app.use(express.urlencoded({ extended: true, limit: '500kb' }));

// // ==============================================================
// // 2. REGISTRASI RUTE API
// // ==============================================================

// // Endpoint Root (Uji Coba Kesehatan Server / Health Check)
// app.get('/', (req: Request, res: Response) => {
//   return res.status(200).json({ 
//     status: "success", 
//     message: "🚀 Backend Server Tegal Run 2026 berjalan dengan lancar!",
//     timestamp: new Date().toISOString()
//   });
// });

// // Mendaftarkan terminal pusat rute kita dengan prefiks /api
// app.use('/api', emitChangesAfterSuccessfulMutation);
// app.use('/api', routes);

// // ==============================================================
// // 3. JARING PENGAMAN (HARUS PALING BAWAH SEBELUM EXPORT)
// // ==============================================================

// // Menangkap request yang mengarah ke URL / endpoint yang tidak terdaftar (404 Not Found)
// app.use(notFoundHandler);

// // Menangkap semua error internal yang terlempar dari controller atau layanan (Global Error Handler)
// app.use(globalErrorHandler);

// export default app;

import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import Konfigurasi & Rute Utama (Wajib tambahkan ekstensi .js di akhir untuk ESM Node.js/Vercel)
import { corsConfig } from './config/cors.js';
import routes from './routes/index.js';

// Import Middleware Keamanan Tambahan & Jaring Pengaman
import { setSecurityHeaders } from './middlewares/security.js';
import { globalErrorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { emitDataChanged } from './sockets/index.js';
import { env } from './config/env.js';

// Inisialisasi Aplikasi Express
const app = express();

// ==============================================================
// TRUST PROXY CONFIGURATION (Diletakkan paling atas setelah inisialisasi app)
// ==============================================================
// Mengatasi error express-rate-limit karena menggunakan Reverse Proxy (Nginx/PM2)
app.set('trust proxy', 1);

const getChangedTopics = (path: string, body: Record<string, unknown> = {}): string[] => {
  path = path.replace(/^\/api(?=\/|$)/, '');
  if (path.startsWith('/webhook') || path.startsWith('/register') || path.startsWith('/orders/')) {
    return ['dashboard', 'orders', 'participants', 'racepack', 'notif-logs', 'logs', 'public:events'];
  }
  if (path.includes('/bib') || path.includes('/generate-bib')) return ['bib-settings', 'participants'];
  if (path.includes('/events') || path.includes('/benefits') || path.includes('/jerseys')) {
    return ['events', 'dashboard', 'public:events'];
  }
  if (path.includes('/participants')) return ['participants', 'racepack', 'dashboard', 'logs'];
  if (path.includes('/orders') || path.includes('/finance')) return ['orders', 'dashboard', 'participants', 'logs'];
  if (path.includes('/racepack')) return ['racepack', 'participants', 'dashboard', 'logs'];
  if (path.includes('/settings/countdown')) {
    const topics = ['countdown', 'public:countdown'];
    if (body.eventCountdownDate !== undefined || body.isRegistrationClosed !== undefined) {
      topics.push('events', 'public:events');
    }
    return topics;
  }
  if (path.includes('/settings/website')) return ['cms', 'public:cms'];
  if (path.includes('/routes')) return ['routes', 'public:routes'];
  if (path.includes('/notifications')) return ['notifications', 'notif-logs', 'whatsapp-web'];
  if (path.includes('/users-management') || path.includes('/roles') || path.includes('/admin/users')) return ['admins', 'logs'];
  return ['dashboard', 'logs'];
};

const emitChangesAfterSuccessfulMutation: express.RequestHandler = (req, res, next) => {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase())) return next();

  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      emitDataChanged(getChangedTopics(req.path, req.body));
    }
  });
  next();
};

// ==============================================================
// 1. MIDDLEWARE KEAMANAN & PARSER (HARUS PALING ATAS)
// ==============================================================

// Mengamankan header HTTP standar dari celah kerentanan umum
app.use(helmet()); 

// Menerapkan Custom Security Headers (X-Content-Type-Options, X-Frame-Options, dll)
app.use(setSecurityHeaders);

// Menerapkan konfigurasi CORS ketat yang sudah terpusat
app.use(cors(corsConfig)); 

// Parsing Payload JSON dengan batas maksimal 500kb untuk mencegah serangan DoS payload raksasa
app.use(express.json({ limit: '500kb' })); 

// Parsing format form-data tradisional (URL Encoded) dengan batas ukuran yang sama
app.use(express.urlencoded({ extended: true, limit: '500kb' }));

// ==============================================================
// 2. REGISTRASI RUTE API
// ==============================================================

// Endpoint Root (Uji Coba Kesehatan Server / Health Check)
app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({ 
    status: "success", 
    message: "🚀 Backend Server Tegal Run 2026 berjalan dengan lancar!",
    timestamp: new Date().toISOString()
  });
});

// Mendaftarkan terminal pusat rute kita dengan prefiks /api
app.use('/api', emitChangesAfterSuccessfulMutation);
app.use('/api', routes);

// ==============================================================
// 3. JARING PENGAMAN (HARUS PALING BAWAH SEBELUM EXPORT)
// ==============================================================

// Menangkap request yang mengarah ke URL / endpoint yang tidak terdaftar (404 Not Found)
app.use(notFoundHandler);

// Menangkap semua error internal yang terlempar dari controller atau layanan (Global Error Handler)
app.use(globalErrorHandler);

export default app;