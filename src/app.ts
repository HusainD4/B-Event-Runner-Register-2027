import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import Konfigurasi & Rute Utama
import { corsConfig } from './config/cors';
import routes from './routes';

// Import Middleware Keamanan Tambahan & Jaring Pengaman
import { setSecurityHeaders } from './middlewares/security';
import { globalErrorHandler, notFoundHandler } from './middlewares/errorHandler';

// Inisialisasi Aplikasi Express
const app = express();

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
    message: "🚀 Backend Server Tegal Run 2027 berjalan dengan lancar!",
    timestamp: new Date().toISOString()
  });
});

// Mendaftarkan terminal pusat rute kita dengan prefiks /api
app.use('/api', routes);

// ==============================================================
// 3. JARING PENGAMAN (HARUS PALING BAWAH SEBELUM EXPORT)
// ==============================================================

// Menangkap request yang mengarah ke URL / endpoint yang tidak terdaftar (404 Not Found)
app.use(notFoundHandler);

// Menangkap semua error internal yang terlempar dari controller atau layanan (Global Error Handler)
app.use(globalErrorHandler);

export default app;