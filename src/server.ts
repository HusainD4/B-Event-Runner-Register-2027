import http from 'http';
import app from './app';
import { env } from './config/env';
import prisma from './config/database';
import { redis } from './config/redis';
import { initSocketServer } from './sockets';
import { logger } from './utils/logger';
import { ensureDefaultRolesInDatabase } from './controllers/admin.rbac.controller';
import { expirePendingOrders } from './services/order-expiration.service';

// 1. Buat HTTP Server menggunakan instance Express (app)
const httpServer = http.createServer(app);

// 2. Inisialisasi WebSocket (Socket.IO) menempel pada HTTP Server
initSocketServer(httpServer);

const PORT = env.PORT || 3000;
let orderExpiryInterval: NodeJS.Timeout | null = null;

/**
 * Fungsi utama untuk menyalakan server dengan pengecekan koneksi database & Redis terlebih dahulu
 */
const startServer = async () => {
  try {
    // A. Tes koneksi Database Prisma (MySQL)
    try {
      await prisma.$connect();
      logger.info('✅ [DATABASE] Koneksi ke database MySQL berhasil terhubung.');
      await ensureDefaultRolesInDatabase();
    } catch (dbError: any) {
      logger.warn('⚠️ [DATABASE WARNING] Belum terhubung ke MySQL di localhost:3306. Pastikan MySQL di XAMPP sudah aktif.');
    }

    // B. Tes koneksi Redis
    try {
      if (redis.status === 'wait') {
        await redis.connect();
      }
      logger.info('✅ [REDIS] Koneksi ke server Redis berhasil terhubung.');
    } catch (redisError: any) {
      logger.warn('⚠️ [REDIS WARNING] Server Redis tidak aktif. Cache realtime dilewati.');
    }

    // Tangkap error jika Port sudah digunakan (EADDRINUSE)
    httpServer.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n🚨 [PORT CONFLICT] Port ${PORT} sedang dipakai oleh proses lain!`);
        console.error(`💡 Cara membebaskan Port ${PORT} di terminal PowerShell:`);
        console.error(`   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force\n`);
        process.exit(1);
      } else {
        logger.error('🚨 [SERVER HTTP ERROR]:', error);
        process.exit(1);
      }
    });

    // C. Jalankan HTTP & WebSocket Server
    httpServer.listen(Number(PORT), '0.0.0.0', () => {
      orderExpiryInterval = setInterval(() => {
        expirePendingOrders().catch(error => {
          logger.error('[ORDER EXPIRY] Gagal memproses pesanan kedaluwarsa:', error);
        });
      }, 15_000);
      orderExpiryInterval.unref();
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
  if (orderExpiryInterval) clearInterval(orderExpiryInterval);
  
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