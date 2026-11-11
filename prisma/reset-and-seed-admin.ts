import 'dotenv/config';
import { PrismaClient } from '../src/generated/client/index.js';
import { hashPassword } from '../src/utils/password.js';

const expectedDatabase = 'tegal_run_db';
const confirmation = process.env.CONFIRM_DATABASE_RESET;
const databaseUrl = process.env.DATABASE_URL;

function isPrivateOrLocalHost(hostname: string): boolean {
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') return true;
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
    throw new Error('Reset database ditolak ketika NODE_ENV=production.');
  }

  const target = new URL(databaseUrl);
  const database = target.pathname.replace(/^\/+/, '');
  if (database !== expectedDatabase || !isPrivateOrLocalHost(target.hostname)) {
    throw new Error('Reset hanya diizinkan untuk database tegal_run_db pada host lokal/private.');
  }
  if (confirmation !== expectedDatabase) {
    throw new Error(`Set CONFIRM_DATABASE_RESET=${expectedDatabase} untuk mengonfirmasi reset.`);
  }

  const prisma = new PrismaClient();
  try {
    const adminPassword = await hashPassword('SuperAdmin2027!');
    await prisma.$transaction(async tx => {
      await tx.participant.deleteMany();
      await tx.order.deleteMany();
      await tx.eventBenefit.deleteMany();
      await tx.bibConfiguration.deleteMany();
      await tx.jersey.deleteMany();
      await tx.event.deleteMany();
      await tx.routePoint.deleteMany();
      await tx.log.deleteMany();
      await tx.user.deleteMany();
      await tx.admin.deleteMany();
      await tx.role.deleteMany();
      await tx.appSetting.deleteMany();

      const superadminRole = await tx.role.create({
        data: {
          name: 'SUPERADMIN',
          description: 'Pemegang kendali tertinggi seluruh sistem.',
          permissions: ['*'],
        },
      });

      await tx.admin.create({
        data: {
          username: 'superadmin',
          email: 'superadmin@tegalrun.id',
          password: adminPassword,
          fullName: 'Super Administrator Utama',
          roleId: superadminRole.id,
          isActive: true,
        },
      });
    });

    const counts = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.eventBenefit.count(),
      prisma.jersey.count(),
      prisma.order.count(),
      prisma.participant.count(),
      prisma.log.count(),
      prisma.bibConfiguration.count(),
      prisma.routePoint.count(),
      prisma.appSetting.count(),
      prisma.role.count(),
      prisma.admin.count(),
    ]);
    const expectedCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1];
    if (counts.some((count, index) => count !== expectedCounts[index])) {
      throw new Error(`Verifikasi isi database gagal: ${JSON.stringify(counts)}`);
    }

    console.log('Database berhasil dikosongkan dan diverifikasi. Hanya role SUPERADMIN dan akun superadmin yang dibuat.');
    console.log('Login awal: superadmin / SuperAdmin2027! (segera ganti password setelah login).');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error('Reset database gagal:', error);
  process.exitCode = 1;
});
