import 'dotenv/config';
import { PrismaClient } from '../src/generated/client/index.js';
import { hashPassword } from '../src/utils/password.js';

async function main(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Seed dengan password default tidak boleh dijalankan di production.');
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL tidak tersedia.');
  }

  const databaseUrl = new URL(process.env.DATABASE_URL);
  if (!['localhost', '127.0.0.1', '[::1]'].includes(databaseUrl.hostname)) {
    throw new Error('Seed dengan password default hanya boleh dijalankan pada database lokal.');
  }

  const prisma = new PrismaClient();
  try {
    await prisma.$transaction(async tx => {
      if (await tx.admin.count() > 0) {
        throw new Error('Database sudah memiliki admin; seed dibatalkan tanpa perubahan.');
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
          password: await hashPassword('12345678'),
          fullName: 'Super Administrator Utama',
          roleId: role.id,
          isActive: true,
        },
      });
    });

    console.log('Seed Superadmin berhasil dibuat.');
    console.log('Username: superadmin');
    console.log('Email: superadmin@tegalrun.id');
    console.warn('Segera ganti password default setelah login.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error('Seed Superadmin gagal:', error);
  process.exitCode = 1;
});
