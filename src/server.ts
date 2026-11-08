import http from 'http';
import app from './app';
import { env } from './config/env';
import prisma from './config/database';
import { redis } from './config/redis';
import { initSocketServer } from './sockets';
import { logger } from './utils/logger';

// 1. Buat HTTP Server menggunakan instance Express (app)
const httpServer = http.createServer(app);

// 2. Inisialisasi WebSocket (Socket.IO) menempel pada HTTP Server
initSocketServer(httpServer);

const PORT = env.PORT || 3000;

/**
 * Fungsi utama untuk menyalakan server dengan pengecekan koneksi database & Redis terlebih dahulu
 */
const startServer = async () => {
  try {
    // A. Tes koneksi Database Prisma (MySQL)
    await prisma.$connect();
    logger.info('✅ [DATABASE] Koneksi ke database MySQL berhasil terhubung.');

    // B. Tes koneksi Redis
    if (redis.status === 'wait') {
      await redis.connect();
    }
    logger.info('✅ [REDIS] Koneksi ke server Redis berhasil terhubung.');

    // C. Jalankan HTTP & WebSocket Server
    httpServer.listen(Number(PORT), () => {
      console.log(`==================================================`);
      console.log(`🚀 Server Tegal Run 2027 menyala di Port ${PORT}`);
      console.log(`🔗 Akses API: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
      console.log(`==================================================`);
    });

  } catch (error) {
    logger.error('🚨 [SERVER STARTUP ERROR] Gagal menyalakan server:', error);
    process.exit(1);
  }
};

// Tangkap sinyal terminasi untuk penutupan koneksi yang aman (Graceful Shutdown)
const handleGracefulShutdown = async (signal: string) => {
  logger.warn(`⚠️ [SHUTDOWN] Menerima sinyal ${signal}. Menutup server secara aman...`);
  
  try {
    // Tutup koneksi HTTP/Socket
    httpServer.close(async () => {
      logger.info('🔌 HTTP Server ditutup.');
      
      // Putuskan koneksi database dan Redis secara rapi
      await prisma.$disconnect();
      logger.info('🗄️ Koneksi database diputus.');
      
      await redis.quit();
      logger.info('🔴 Koneksi Redis diputus.');
      
      process.exit(0);
    });
  } catch (err) {
    logger.error('🚨 Error saat graceful shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

// Jalankan server
startServer();