import { PrismaClient } from '@prisma/client';

// Mendeklarasikan variabel global untuk mencegah Prisma membuat koneksi berulang 
// saat proses hot-reloading di mode development (ts-node-dev / nodemon).
declare global {
  var prismaGlobal: PrismaClient | undefined;
}

// Opsi logging: Tampilkan query SQL di console hanya jika sedang dalam mode development
const prismaOptions = {
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] as const 
    : ['error'] as const,
};

// Gunakan instance global jika sudah ada, jika belum maka buat instance baru
const prisma = global.prismaGlobal || new PrismaClient(prismaOptions);

// Simpan ke global object jika BUKAN di mode production
if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}

// =======================================================================
// MANAJEMEN SIKLUS HIDUP DATABASE (LIFECYCLE)
// =======================================================================

/**
 * Fungsi untuk menginisialisasi dan mengecek koneksi database saat server menyala.
 * Nantinya fungsi ini dipanggil di dalam file `server.ts`.
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    // $connect() akan memaksa Prisma melakukan ping ke MySQL
    await prisma.$connect();
    console.log('✅ [DATABASE] Berhasil terhubung ke MySQL (Prisma ORM)');
  } catch (error) {
    console.error('🚨 [DATABASE FATAL ERROR] Gagal terhubung ke MySQL:', error);
    // Jika database mati, aplikasi backend tidak ada gunanya hidup.
    // Matikan proses Node.js secara paksa (Fail-Fast)
    process.exit(1); 
  }
};

/**
 * Fungsi untuk memutus koneksi database secara aman.
 * Berguna untuk "Graceful Shutdown" saat server dimatikan (Ctrl+C atau oleh Vercel/PM2).
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('🛑 [DATABASE] Koneksi diputus secara aman (Graceful Shutdown)');
  } catch (error) {
    console.error('🚨 [DATABASE] Error saat memutus koneksi:', error);
  }
};

export default prisma;