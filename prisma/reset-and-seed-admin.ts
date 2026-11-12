import 'dotenv/config';
import { randomBytes } from 'crypto';
import { existsSync } from 'fs';
import { unlink, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { PrismaClient } from '../src/generated/client/index.js';
import { DEFAULT_SYSTEM_ROLES } from '../src/controllers/admin.rbac.controller.js';
import { hashPassword } from '../src/utils/password.js';

const expectedDatabase = 'tegal_run_db';
const confirmation = process.env.CONFIRM_DATABASE_RESET;
const databaseUrl = process.env.DATABASE_URL;
const credentialsPath = fileURLToPath(new URL('../.env.admin-seed-credentials.json', import.meta.url));

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
  if (existsSync(credentialsPath)) {
    throw new Error(`File kredensial sudah ada (${credentialsPath}); amankan atau pindahkan file tersebut sebelum reset.`);
  }

  const prisma = new PrismaClient();
  try {
    const roles = DEFAULT_SYSTEM_ROLES.map(({ name, description, permissions }) => ({
      name,
      description,
      permissions,
    }));
    const credentials = roles.flatMap(role => {
      const usernamePrefix = role.name.toLowerCase();
      const emailPrefix = usernamePrefix.replace(/_/g, '-');
      return [1, 2].map(number => ({
        role: role.name,
        username: `${usernamePrefix}_${String(number).padStart(2, '0')}`,
        email: `${emailPrefix}${String(number).padStart(2, '0')}@tegalrun.id`,
        fullName: `${role.name.replace(/_/g, ' ')} ${number}`,
        password: randomBytes(24).toString('base64url'),
      }));
    });

    const credentialFile = {
      warning: 'SIMPAN FILE INI SECARA AMAN. Password ditampilkan sekali dan tidak disimpan dalam database sebagai teks biasa.',
      createdAt: new Date().toISOString(),
      accounts: credentials,
    };
    await writeFile(credentialsPath, `${JSON.stringify(credentialFile, null, 2)}\n`, {
      encoding: 'utf8',
      flag: 'wx',
      mode: 0o600,
    });

    let resetCommitted = false;
    try {
      const passwordHashes = await Promise.all(credentials.map(account => hashPassword(account.password)));
      await prisma.$transaction(async tx => {
        await tx.qrToken.deleteMany();
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

        await tx.role.createMany({ data: roles });
        const createdRoles = await tx.role.findMany({ select: { id: true, name: true } });
        const roleIds = new Map(createdRoles.map(role => [role.name, role.id]));

        await tx.admin.createMany({
          data: credentials.map((account, index) => {
            const roleId = roleIds.get(account.role);
            if (!roleId) throw new Error(`Role ${account.role} tidak ditemukan setelah dibuat.`);
            return {
              username: account.username,
              email: account.email,
              password: passwordHashes[index],
              fullName: account.fullName,
              roleId,
              isActive: true,
            };
          }),
        });
      }, { maxWait: 10_000, timeout: 60_000 });
      resetCommitted = true;

      const counts = {
        users: await prisma.user.count(),
        events: await prisma.event.count(),
        benefits: await prisma.eventBenefit.count(),
        jerseys: await prisma.jersey.count(),
        orders: await prisma.order.count(),
        participants: await prisma.participant.count(),
        qrTokens: await prisma.qrToken.count(),
        logs: await prisma.log.count(),
        bibConfigurations: await prisma.bibConfiguration.count(),
        routePoints: await prisma.routePoint.count(),
        appSettings: await prisma.appSetting.count(),
        roles: await prisma.role.count(),
        admins: await prisma.admin.count(),
        adminRoles: await prisma.role.count({ where: { admins: { some: {} } } }),
        accountsPerRole: await prisma.role.findMany({
          select: { name: true, _count: { select: { admins: true } } },
          orderBy: { name: 'asc' },
        }),
      };

      const hasOnlyAdminSeed = Object.entries(counts)
        .filter(([key]) => !['roles', 'admins', 'adminRoles', 'accountsPerRole'].includes(key))
        .every(([, count]) => count === 0);
      if (
        !hasOnlyAdminSeed ||
        counts.roles !== roles.length ||
        counts.admins !== roles.length * 2 ||
        counts.adminRoles !== roles.length ||
        counts.accountsPerRole.some(role => role._count.admins !== 2)
      ) {
        throw new Error(`Reset selesai tetapi verifikasi data tidak sesuai: ${JSON.stringify(counts)}`);
      }

      console.log(`Reset database ${database} berhasil. ${roles.length} role dan ${credentials.length} akun dibuat.`);
      console.log('Seluruh tabel data aplikasi selain roles/admins sudah kosong; ledger migration dipertahankan.');
      console.log(`Kredensial awal disimpan di: ${credentialsPath}`);
      console.log('Simpan file itu di tempat aman lalu hapus salinan lokal setelah distribusi kredensial.');
    } catch (error) {
      if (!resetCommitted) {
        try {
          await unlink(credentialsPath);
        } catch (cleanupError) {
          console.error(`Gagal menghapus file kredensial sementara ${credentialsPath}:`, cleanupError);
        }
      }
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error('Reset dan seed admin gagal:', error);
  process.exitCode = 1;
});
