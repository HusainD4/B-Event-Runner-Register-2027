import 'dotenv/config';
import { PrismaClient } from '../src/generated/client/index.js';
import { hashPassword } from '../src/utils/password.js';

// Ubah expectedDatabase sesuai dengan nama database online Anda di Aiven (misal: 'defaultdb' atau nama baru Anda)
// const expectedDatabase = process.env.EXPECTED_DB_NAME || 'defaultdb';
const databaseUrl = process.env.DATABASE_URL;

function isPrivateOrLocalHost(hostname: string): boolean {
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') return true;
  
  // Izinkan juga hostname cloud/online seperti aivencloud.com
  // if (hostname.includes('aivencloud.com') || hostname.includes('upstash.io')) return true;

  const octets = hostname.split('.').map(Number);
  if (octets.length !== 4 || octets.some(value => !Number.isInteger(value) || value < 0 || value > 255)) {
    return false;
  }
  return octets[0] === 10
    || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31)
    || (octets[0] === 192 && octets[1] === 168);
}

async function main(): Promise<void> {
  if (!databaseUrl) throw new Error('DATABASE_URL tidak tersedia.');
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Bootstrap Superadmin melalui skrip ditolak ketika NODE_ENV=production.');
  }

  const target = new URL(databaseUrl);
  const database = target.pathname.replace(/^\/+/, '');
  
  // Validasi dilonggarkan untuk mendukung database online
  if (!isPrivateOrLocalHost(target.hostname) && !target.hostname.includes('aivencloud.com')) {
    throw new Error('Bootstrap host tidak dikenali atau tidak diizinkan.');
  }

  const initialPassword = process.env.INITIAL_SUPERADMIN_PASSWORD;
  if (!initialPassword || initialPassword.length < 16) {
    throw new Error('Atur INITIAL_SUPERADMIN_PASSWORD minimal 16 karakter di file .env sebelum menjalankan bootstrap.');
  }

  const prisma = new PrismaClient();
  try {
    const passwordHash = await hashPassword(initialPassword);
    await prisma.$transaction(async tx => {
      if (await tx.admin.count() > 0) {
        throw new Error('Database sudah memiliki akun admin; bootstrap Superadmin dibatalkan tanpa perubahan.');
      }

      const role = await tx.role.upsert({
        where: { name: 'SUPERADMIN' },
        update: {},
        create: {
          name: 'SUPERADMIN',
          description: 'Pemegang kendali tertinggi seluruh sistem.',
          permissions: ['*'],
        },
      });

      await tx.admin.create({
        data: {
          username: 'superadmin',
          email: 'superadmin@tegalrun.id',
          password: passwordHash,
          fullName: 'Super Administrator Utama',
          roleId: role.id,
          isActive: true,
        },
      });
    });

    const admin = await prisma.admin.findUnique({
      where: { username: 'superadmin' },
      select: { id: true, role: { select: { name: true, permissions: true } } },
    });
    if (!admin || admin.role.name !== 'SUPERADMIN' || !Array.isArray(admin.role.permissions)) {
      throw new Error('Verifikasi akun Superadmin gagal.');
    }

    console.log('Akun Superadmin berhasil dibuat dan diverifikasi di database cloud!');
    console.log('Username: superadmin');
    console.log('Email: superadmin@tegalrun.id');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error('Bootstrap Superadmin gagal:', error);
  process.exitCode = 1;
});