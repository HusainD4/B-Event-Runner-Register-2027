import type { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { hashPassword } from '../utils/password';
import type { AuthenticatedRequest } from '../middlewares/auth';

/**
 * Daftar seluruh izin (permissions) yang tersedia dalam sistem
 */
export const AVAILABLE_PERMISSIONS = [
  { key: '*', label: 'Semua Hak Akses (Akses Penuh Tanpa Batas)' },
  { key: 'events:*', label: 'Semua izin event' },
  { key: 'events:read', label: 'Melihat Daftar & Detail Event' },
  { key: 'events:create', label: 'Menambah Event Baru' },
  { key: 'events:update', label: 'Mengubah Data Event' },
  { key: 'events:delete', label: 'Menghapus Event' },
  { key: 'benefits:manage', label: 'Kelola Manfaat/Benefit Event' },
  { key: 'benefits:*', label: 'Semua izin benefit event' },
  { key: 'jerseys:manage', label: 'Kelola Jersey & Ukuran' },
  { key: 'jerseys:*', label: 'Semua izin jersey' },
  { key: 'bib:manage', label: 'Kelola Konfigurasi & Generate BIB' },
  { key: 'bib:*', label: 'Semua izin BIB' },
  { key: 'routes:manage', label: 'Kelola Peta & Checkpoint' },
  { key: 'routes:read', label: 'Melihat Peta & Checkpoint' },
  { key: 'routes:*', label: 'Semua izin rute' },
  { key: 'cms:manage', label: 'Kelola Konten Website & CMS' },
  { key: 'cms:*', label: 'Semua izin CMS' },
  { key: 'countdown:manage', label: 'Kelola Countdown & Status Event' },
  { key: 'countdown:*', label: 'Semua izin countdown' },
  { key: 'notifications:manage', label: 'Kelola Pengaturan Notifikasi' },
  { key: 'notifications:*', label: 'Semua izin notifikasi' },
  { key: 'notifications:read', label: 'Melihat Log Notifikasi' },
  { key: 'notifications:dispatch', label: 'Mengirim Notifikasi' },
  { key: 'whatsapp:chat', label: 'Mengirim Pesan WhatsApp' },
  { key: 'whatsapp:session', label: 'Mengelola Sesi WhatsApp' },
  { key: 'whatsapp:*', label: 'Semua izin WhatsApp' },
  { key: 'racepack:checkin', label: 'Validasi & Check-in Racepack' },
  { key: 'racepack:*', label: 'Semua izin racepack' },
  { key: 'participants:read', label: 'Melihat Data Peserta' },
  { key: 'participants:*', label: 'Semua izin peserta' },
  { key: 'participants:create', label: 'Mendaftarkan Peserta Manual' },
  { key: 'participants:update', label: 'Mengubah Data Peserta' },
  { key: 'participants:delete', label: 'Menghapus Peserta' },
  { key: 'orders:read', label: 'Melihat Data Pesanan/Transaksi' },
  { key: 'orders:*', label: 'Semua izin transaksi' },
  { key: 'orders:update', label: 'Mengubah Status Transaksi (Settlement/Cancel/Refund)' },
  { key: 'orders:delete', label: 'Menghapus Transaksi' },
  { key: 'finance:read', label: 'Melihat Ringkasan Keuangan & Pendapatan' },
  { key: 'finance:*', label: 'Semua izin keuangan' },
  { key: 'users:read', label: 'Melihat Data User Terdaftar' },
  { key: 'users:update', label: 'Mengubah Data User' },
  { key: 'users:delete', label: 'Menghapus User' },
  { key: 'users:*', label: 'Semua izin user' },
  { key: 'logs:read', label: 'Melihat Log Aktivitas Sistem' },
  { key: 'logs:*', label: 'Semua izin log' },
  { key: 'admins:manage', label: 'Kelola Akun Admin & Hak Akses (Superadmin)' },
];

export const DASHBOARD_WIDGETS = [
  { key: 'dashboard:participants', label: 'Jumlah peserta', desc: 'Total peserta terdaftar' },
  { key: 'dashboard:revenue', label: 'Omzet kotor', desc: 'Total transaksi lunas' },
  { key: 'dashboard:service-fee', label: 'Biaya layanan', desc: 'Akumulasi biaya layanan' },
  { key: 'dashboard:net-revenue', label: 'Pendapatan bersih', desc: 'Omzet setelah potongan biaya layanan' },
  { key: 'dashboard:finance-breakdown', label: 'Rincian rekonsiliasi', desc: 'Lunas, pending, batal, dan perhitungan akhir' },
  { key: 'dashboard:registration-trend', label: 'Grafik pendaftaran', desc: 'Tren dan pertumbuhan pendaftaran selama 30 hari terakhir' },
  { key: 'dashboard:revenue-trend', label: 'Grafik pemasukan', desc: 'Tren omzet transaksi lunas selama 30 hari terakhir' },
  { key: 'dashboard:payment-status', label: 'Status pembayaran', desc: 'Ringkasan jumlah order berdasarkan status pembayaran' },
  { key: 'dashboard:conversion', label: 'Konversi & nilai transaksi', desc: 'Rasio transaksi lunas dan rata-rata nilai transaksi' },
  { key: 'dashboard:event-performance', label: 'Performa event & kuota', desc: 'Peserta terdaftar, kapasitas, dan sisa kuota setiap event' },
  { key: 'dashboard:category-performance', label: 'Performa kategori', desc: 'Perbandingan pendaftar dan kapasitas per kategori event' },
  { key: 'dashboard:participant-profile', label: 'Profil peserta', desc: 'Distribusi gender dan kelompok usia peserta aktif' },
  { key: 'dashboard:jersey-sizes', label: 'Distribusi ukuran jersey', desc: 'Jumlah peserta aktif pada setiap ukuran jersey' },
  { key: 'dashboard:racepack-checkin', label: 'Status check-in racepack', desc: 'Perbandingan peserta lunas yang sudah dan belum mengambil racepack' },
  { key: 'dashboard:team-presence', label: 'Kru & status online', desc: 'Jumlah anggota aktif sesuai role dan siapa yang sedang online' },
  { key: 'dashboard:recent-orders', label: 'Transaksi terbaru', desc: 'Daftar ringkas transaksi terbaru' },
  { key: 'dashboard:recent-activity', label: 'Aktivitas terbaru', desc: 'Riwayat aktivitas admin terbaru' },
  { key: 'dashboard:quicklinks', label: 'Pintasan cepat', desc: 'Kartu navigasi ke modul admin' },
];

/**
 * Halaman yang tersedia pada navigasi Portal Admin.
 */
export const SYSTEM_MODULES = [
  {
    key: 'page:dashboard',
    label: 'Dashboard Overview',
    group: 'MENU UTAMA',
    icon: 'fa-gauge-high',
    desc: 'Melihat ringkasan statistik, kuota, omzet, dan pintasan cepat operasional',
    apiPermissions: [],
  },
  {
    key: 'page:events',
    label: 'Manajemen Event & Tiket',
    group: 'MENU UTAMA',
    icon: 'fa-calendar-days',
    desc: 'Kelola kategori tiket, harga, kuota, benefit racepack, dan ukuran jersey',
    apiPermissions: ['events:read', 'events:create', 'events:update', 'events:delete', 'benefits:manage', 'jerseys:manage'],
  },
  {
    key: 'page:participants',
    label: 'Manajemen Peserta',
    group: 'MENU UTAMA',
    icon: 'fa-users',
    desc: 'Melihat pendaftar, edit data, generate BIB, status pembayaran & status racepack',
    apiPermissions: ['participants:read', 'participants:create', 'participants:update', 'participants:delete', 'bib:manage'],
  },
  {
    key: 'page:racepack',
    label: 'Pengambilan Racepack & Check-in',
    group: 'MENU UTAMA',
    icon: 'fa-box-open',
    desc: 'Validasi E-Tiket via kamera HP/scanner QR, serah terima racepack, jersey, BIB & check-in',
    apiPermissions: ['participants:read', 'participants:update', 'racepack:checkin'],
  },
  {
    key: 'page:racepack-view',
    label: 'Live View Antrean Racepack',
    group: 'MENU UTAMA',
    icon: 'fa-list-check',
    desc: 'Pantau antrean check-in racepack secara langsung',
    apiPermissions: ['participants:read'],
  },
  {
    key: 'page:orders',
    label: 'Transaksi & Keuangan',
    group: 'MENU UTAMA',
    icon: 'fa-receipt',
    desc: 'Audit order transaksi, rekonsiliasi Midtrans, settlement manual, dan refund',
    apiPermissions: ['orders:read', 'orders:update', 'orders:delete', 'finance:read'],
  },
  {
    key: 'page:notif-logs',
    label: 'Log Notifikasi Peserta',
    group: 'MENU UTAMA',
    icon: 'fa-paper-plane',
    desc: 'Riwayat pengiriman E-Tiket dan pengingat via WhatsApp & Email',
    apiPermissions: ['notifications:read', 'notifications:dispatch'],
  },
  {
    key: 'page:whatsapp-web',
    label: 'WhatsApp Web Console',
    group: 'MENU UTAMA',
    icon: 'fa-brands fa-whatsapp',
    desc: 'Pusat interaksi langsung WhatsApp Web, CS, dan kirim pesan ke peserta',
    apiPermissions: ['notifications:manage', 'whatsapp:chat', 'whatsapp:session'],
  },
  {
    key: 'page:cms',
    label: 'Konten Website & CMS',
    group: 'KONFIGURASI',
    icon: 'fa-pen-ruler',
    desc: 'Kelola teks landing page, daftar sponsor, FAQ, dan informasi publik',
    apiPermissions: ['cms:manage'],
  },
  {
    key: 'page:countdown',
    label: 'Countdown & Status Event',
    group: 'KONFIGURASI',
    icon: 'fa-stopwatch-20',
    desc: 'Atur tanggal target lomba, buka/tutup pendaftaran darurat',
    apiPermissions: ['countdown:manage'],
  },
  {
    key: 'page:notifications',
    label: 'Konfigurasi Notifikasi',
    group: 'KONFIGURASI',
    icon: 'fa-bell',
    desc: 'Koneksi WhatsApp Web backend, scan QR, konfigurasi SMTP, template pesan',
    apiPermissions: ['notifications:manage'],
  },
  {
    key: 'page:routes',
    label: 'Rute & Checkpoint',
    group: 'KONFIGURASI',
    icon: 'fa-map-pin',
    desc: 'Kelola peta jalur 5K/10K/Half/Full, water station, pos medis, marshall point',
    apiPermissions: ['routes:read', 'routes:manage'],
  },
  {
    key: 'page:bib-settings',
    label: 'Pengaturan BIB & E-Tiket',
    group: 'KONFIGURASI',
    icon: 'fa-id-badge',
    desc: 'Konfigurasi BIB, QR, instruksi racepack, dan biaya tiket',
    apiPermissions: ['bib:manage'],
  },
  {
    key: 'page:admins',
    label: 'Kelola Admin & RBAC',
    group: 'KONFIGURASI',
    icon: 'fa-shield-halved',
    desc: 'Manajemen akun staf/petugas dan penyesuaian hak akses role dinamis',
    apiPermissions: ['admins:manage'],
  },
  {
    key: 'page:role-monitoring',
    label: 'Pemantauan Semua Role',
    group: 'KONFIGURASI',
    icon: 'fa-users-viewfinder',
    desc: 'Pantau sesi online seluruh role dan cabut sesi akun admin',
    apiPermissions: [],
  },
  {
    key: 'page:logs',
    label: 'Log Audit Sistem',
    group: 'KONFIGURASI',
    icon: 'fa-clock-rotate-left',
    desc: 'Catatan jejak audit aktivitas seluruh staf dan perubahan data kritis',
    apiPermissions: ['logs:read'],
  },
];

/**
 * 12 Role Resmi Penyelenggara Event beserta deskripsi tugas & default akses halaman
 */
export const DEFAULT_SYSTEM_ROLES = [
  {
    name: 'SUPERADMIN',
    description: 'Pemegang kendali tertinggi seluruh sistem, server, database, dan konfigurasi hak akses.',
    pages: ['page:dashboard', 'page:events', 'page:participants', 'page:racepack', 'page:racepack-view', 'page:orders', 'page:notif-logs', 'page:whatsapp-web', 'page:bib-settings', 'page:cms', 'page:countdown', 'page:notifications', 'page:routes', 'page:admins', 'page:role-monitoring', 'page:logs'],
    permissions: ['*', 'dashboard:configured', 'dashboard:participants', 'dashboard:revenue', 'dashboard:service-fee', 'dashboard:net-revenue', 'dashboard:finance-breakdown', 'dashboard:registration-trend', 'dashboard:revenue-trend', 'dashboard:payment-status', 'dashboard:conversion', 'dashboard:event-performance', 'dashboard:category-performance', 'dashboard:participant-profile', 'dashboard:jersey-sizes', 'dashboard:racepack-checkin', 'dashboard:team-presence', 'dashboard:recent-orders', 'dashboard:recent-activity', 'dashboard:quicklinks'],
  },
  {
    name: 'ADMINISTRATOR',
    description: 'Koordinator operasional utama event. Mengelola kuota, peserta, rute, dan publikasi website.',
    pages: ['page:dashboard', 'page:events', 'page:participants', 'page:racepack', 'page:racepack-view', 'page:orders', 'page:notif-logs', 'page:whatsapp-web', 'page:bib-settings', 'page:cms', 'page:countdown', 'page:routes'],
    permissions: [
      'page:dashboard', 'page:events', 'page:participants', 'page:racepack', 'page:racepack-view', 'page:orders', 'page:notif-logs', 'page:whatsapp-web', 'page:bib-settings', 'page:cms', 'page:countdown', 'page:routes',
      'dashboard:configured', 'dashboard:participants', 'dashboard:revenue', 'dashboard:service-fee', 'dashboard:net-revenue', 'dashboard:finance-breakdown', 'dashboard:registration-trend', 'dashboard:revenue-trend', 'dashboard:payment-status', 'dashboard:conversion', 'dashboard:event-performance', 'dashboard:category-performance', 'dashboard:participant-profile', 'dashboard:jersey-sizes', 'dashboard:racepack-checkin', 'dashboard:team-presence', 'dashboard:recent-orders', 'dashboard:recent-activity', 'dashboard:quicklinks',
      'events:*', 'participants:*', 'orders:read', 'orders:update', 'benefits:*', 'jerseys:*', 'bib:*', 'routes:*', 'cms:*', 'countdown:*', 'notifications:*'
    ],
  },
  {
    name: 'FINANCE',
    description: 'Divisi keuangan & bendahara. Mengaudit pembayaran, rekonsiliasi Midtrans, settlement manual & refund.',
    pages: ['page:dashboard', 'page:orders', 'page:logs'],
    permissions: [
      'page:dashboard', 'page:orders', 'page:logs',
      'dashboard:configured', 'dashboard:participants', 'dashboard:revenue', 'dashboard:service-fee', 'dashboard:net-revenue', 'dashboard:finance-breakdown', 'dashboard:revenue-trend', 'dashboard:payment-status', 'dashboard:conversion', 'dashboard:recent-orders', 'dashboard:recent-activity', 'dashboard:team-presence', 'dashboard:quicklinks',
      'orders:*', 'finance:read', 'logs:read'
    ],
  },
  {
    name: 'SPONSORSHIP',
    description: 'Divisi sponsorship & mitra. Mengelola logo/exposure sponsor di CMS, benefit tiket, dan laporan pendaftar.',
    pages: ['page:dashboard', 'page:cms', 'page:events', 'page:notif-logs'],
    permissions: [
      'page:dashboard', 'page:cms', 'page:events', 'page:notif-logs',
      'dashboard:configured', 'dashboard:participants', 'dashboard:event-performance', 'dashboard:category-performance', 'dashboard:team-presence', 'dashboard:quicklinks',
      'cms:*', 'events:read', 'benefits:manage', 'notifications:read'
    ],
  },
  {
    name: 'RACEPACK_OFFICER',
    description: 'Petugas Race Pack Collection (RPC). Verifikasi E-Tiket via scan kamera HP, serah terima jersey & nomor BIB pelari.',
    pages: ['page:dashboard', 'page:racepack', 'page:participants', 'page:whatsapp-web'],
    permissions: [
      'page:dashboard', 'page:racepack', 'page:participants', 'page:whatsapp-web',
      'dashboard:configured', 'dashboard:participants', 'dashboard:registration-trend', 'dashboard:participant-profile', 'dashboard:jersey-sizes', 'dashboard:racepack-checkin', 'dashboard:team-presence', 'dashboard:quicklinks',
      'participants:read', 'participants:update', 'racepack:checkin', 'jerseys:manage', 'bib:manage', 'whatsapp:chat', 'whatsapp:session'
    ],
  },
  {
    name: 'GATE_OPERATOR',
    description: 'Petugas gerbang & pintu masuk venue. Scan QR/Barcode tiket pelari dan validasi akses masuk.',
    pages: ['page:dashboard', 'page:participants'],
    permissions: [
      'page:dashboard', 'page:participants',
      'dashboard:configured', 'dashboard:participants', 'dashboard:payment-status', 'dashboard:conversion', 'dashboard:racepack-checkin', 'dashboard:team-presence', 'dashboard:quicklinks',
      'participants:read', 'orders:read'
    ],
  },
  {
    name: 'RACE_DIRECTOR',
    description: 'Direktur teknis perlombaan. Mengawasi rute marathon, pos evakuasi, timing COT, dan status countdown.',
    pages: ['page:dashboard', 'page:routes', 'page:countdown', 'page:participants', 'page:events'],
    permissions: [
      'page:dashboard', 'page:routes', 'page:countdown', 'page:participants', 'page:events',
      'dashboard:configured', 'dashboard:participants', 'dashboard:registration-trend', 'dashboard:participant-profile', 'dashboard:event-performance', 'dashboard:category-performance', 'dashboard:racepack-checkin', 'dashboard:team-presence', 'dashboard:quicklinks',
      'routes:*', 'countdown:*', 'events:read', 'participants:read'
    ],
  },
  {
    name: 'TIMING_JUDGE',
    description: 'Juri pencatat waktu & komisi timing PASI. Mengelola BIB RFID, checkpoint waktu lintasan, dan finisher.',
    pages: ['page:dashboard', 'page:participants', 'page:routes'],
    permissions: [
      'page:dashboard', 'page:participants', 'page:routes',
      'dashboard:configured', 'dashboard:participants', 'dashboard:registration-trend', 'dashboard:participant-profile', 'dashboard:jersey-sizes', 'dashboard:racepack-checkin', 'dashboard:team-presence', 'dashboard:quicklinks',
      'participants:read', 'bib:manage', 'routes:manage'
    ],
  },
  {
    name: 'MEDICAL_OFFICER',
    description: 'Tim dokter & medis darurat. Akses cepat data kesehatan peserta, kontak darurat, dan pos medis.',
    pages: ['page:dashboard', 'page:participants', 'page:routes'],
    permissions: [
      'page:dashboard', 'page:participants', 'page:routes',
      'dashboard:configured', 'dashboard:participants', 'dashboard:registration-trend', 'dashboard:participant-profile', 'dashboard:jersey-sizes', 'dashboard:racepack-checkin', 'dashboard:team-presence', 'dashboard:quicklinks',
      'participants:read', 'routes:manage'
    ],
  },
  {
    name: 'VOLUNTEER',
    description: 'Relawan operasional lapangan. Pengecekan data peserta di helpdesk dan informasi umum event (read-only).',
    pages: ['page:dashboard', 'page:participants'],
    permissions: [
      'page:dashboard', 'page:participants',
      'dashboard:configured', 'dashboard:participants', 'dashboard:registration-trend', 'dashboard:participant-profile', 'dashboard:jersey-sizes', 'dashboard:racepack-checkin', 'dashboard:team-presence', 'dashboard:quicklinks',
      'participants:read'
    ],
  },
  {
    name: 'BAG_DROP_OFFICER',
    description: 'Petugas penitipan barang (Bag Drop). Pencocokan BIB & identitas pelari untuk titip dan ambil barang.',
    pages: ['page:dashboard', 'page:participants'],
    permissions: [
      'page:dashboard', 'page:participants',
      'dashboard:configured', 'dashboard:participants', 'dashboard:registration-trend', 'dashboard:participant-profile', 'dashboard:jersey-sizes', 'dashboard:racepack-checkin', 'dashboard:team-presence', 'dashboard:quicklinks',
      'participants:read'
    ],
  },
  {
    name: 'CUSTOMER_SERVICE',
    description: 'Layanan bantuan peserta (Helpdesk). Layanan chat WhatsApp Web Console, cek status tiket & kirim ulang pesan.',
    pages: ['page:dashboard', 'page:whatsapp-web', 'page:notif-logs', 'page:participants', 'page:orders'],
    permissions: [
      'page:dashboard', 'page:whatsapp-web', 'page:notif-logs', 'page:participants', 'page:orders',
      'dashboard:configured', 'dashboard:participants', 'dashboard:registration-trend', 'dashboard:participant-profile', 'dashboard:jersey-sizes', 'dashboard:racepack-checkin', 'dashboard:payment-status', 'dashboard:conversion', 'dashboard:team-presence', 'dashboard:quicklinks',
      'whatsapp:chat', 'whatsapp:session', 'notifications:read', 'participants:read', 'orders:read'
    ],
  },
];

/**
 * Memastikan ke-12 role default tersimpan di Database MySQL
 */
export async function ensureDefaultRolesInDatabase() {
  try {
    for (const roleDef of DEFAULT_SYSTEM_ROLES) {
      const existing = await prisma.role.findUnique({
        where: { name: roleDef.name },
      });

      if (!existing) {
        // Cek jika ada role lama (seperti 'KEUANGAN' yang perlu dimigrasikan ke 'FINANCE')
        if (roleDef.name === 'FINANCE') {
          const legacy = await prisma.role.findUnique({ where: { name: 'KEUANGAN' } });
          if (legacy) {
            await prisma.role.update({
              where: { id: legacy.id },
              data: {
                name: 'FINANCE',
                description: roleDef.description,
                permissions: roleDef.permissions,
              },
            });
            continue;
          }
        }

        await prisma.role.create({
          data: {
            name: roleDef.name,
            description: roleDef.description,
            permissions: roleDef.permissions,
          },
        });
      }
    }

    // Pastikan setidaknya ada 1 akun Superadmin bila database baru/kosong
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      const superRole = await prisma.role.findUnique({ where: { name: 'SUPERADMIN' } });
      const initialPassword = process.env.INITIAL_SUPERADMIN_PASSWORD;
      if (!superRole) throw new Error('Role SUPERADMIN belum tersedia untuk bootstrap akun.');
      if (!initialPassword || initialPassword.length < 16) {
        throw new Error('Database belum memiliki admin. Atur INITIAL_SUPERADMIN_PASSWORD (minimal 16 karakter) secara aman untuk membuat akun awal.');
      }

      const passwordHash = await hashPassword(initialPassword);
      await prisma.admin.create({
        data: {
          username: 'superadmin',
          email: 'superadmin@tegalrun.id',
          password: passwordHash,
          fullName: 'Super Administrator Utama',
          roleId: superRole.id,
          isActive: true,
        },
      });
    }
  } catch (err: any) {
    console.warn('⚠️ Gagal sinkronisasi role default ke database:', err.message);
  }
}

const createRoleSchema = z.object({
  name: z.string().min(2, 'Nama role minimal 2 karakter').toUpperCase(),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'Role harus memiliki minimal 1 hak akses').max(100)
    .refine(permissions => permissions.every(permission => isKnownRolePermission(permission)), 'Daftar hak akses berisi izin yang tidak dikenal.'),
});

const updateRoleSchema = z.object({
  name: z.string().min(2, 'Nama role minimal 2 karakter').toUpperCase().optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'Role harus memiliki minimal 1 hak akses').max(100)
    .refine(permissions => permissions.every(permission => isKnownRolePermission(permission)), 'Daftar hak akses berisi izin yang tidak dikenal.')
    .optional(),
});

function isKnownRolePermission(permission: string): boolean {
  return permission === '*' ||
    permission === 'dashboard:configured' ||
    AVAILABLE_PERMISSIONS.some(item => item.key === permission && item.key !== '*') ||
    SYSTEM_MODULES.some(module => module.key === permission) ||
    DASHBOARD_WIDGETS.some(widget => widget.key === permission);
}

const createAdminSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter').regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  roleId: z.string().uuid('Role ID tidak valid'),
  isActive: z.boolean().default(true),
});

const updateAdminSchema = z.object({
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  fullName: z.string().min(3).optional(),
  roleId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
});

// ==========================================
// 1. PERMISSIONS & ROLES MANAGEMENT
// ==========================================

export const getSystemPermissions = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  return res.status(200).json({
    status: 'success',
    data: {
      permissions: AVAILABLE_PERMISSIONS,
      modules: SYSTEM_MODULES,
      dashboardWidgets: DASHBOARD_WIDGETS,
      defaultRoles: DEFAULT_SYSTEM_ROLES,
    },
  });
};

export const getAllRoles = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    // Pastikan 12 role sistem selalu tersedia
    await ensureDefaultRolesInDatabase();

    const roles: any[] = await prisma.role.findMany({
      include: {
        _count: {
          select: { admins: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const enrichedRoles = roles.map((r) => {
      const perms: string[] = Array.isArray(r.permissions) ? r.permissions : [];
      const activePages = r.name === 'SUPERADMIN'
        ? SYSTEM_MODULES.map((m) => m.key)
        : perms.filter((p: string) => p.startsWith('page:'));

      return {
        ...r,
        pages: activePages,
        isSuperAdmin: r.name === 'SUPERADMIN',
      };
    });

    return res.status(200).json({
      status: 'success',
      data: enrichedRoles,
      modules: SYSTEM_MODULES,
      permissions: AVAILABLE_PERMISSIONS,
      dashboardWidgets: DASHBOARD_WIDGETS,
    });
  } catch (error) {
    console.error('🚨 [GET ROLES ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil data role.' });
  }
};

export const resetDefaultRoles = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    for (const roleDef of DEFAULT_SYSTEM_ROLES) {
      await prisma.role.upsert({
        where: { name: roleDef.name },
        update: {
          description: roleDef.description,
          permissions: roleDef.permissions,
        },
        create: {
          name: roleDef.name,
          description: roleDef.description,
          permissions: roleDef.permissions,
        },
      });
    }

    await prisma.log.create({
      data: {
        action: 'ROLES_RESET_DEFAULT',
        description: `Superadmin (${req.admin?.username || 'admin'}) mereset seluruh 12 role default ke pengaturan standar.`,
        adminId: req.admin?.adminId,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: '12 Role Akses Resmi berhasil disinkronkan ke default sistem.',
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message || 'Gagal reset role.' });
  }
};

export const getRoleById = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        admins: {
          select: { id: true, username: true, email: true, fullName: true, isActive: true },
        },
      },
    });

    if (!role) {
      return res.status(404).json({ status: 'error', message: 'Role tidak ditemukan.' });
    }

    return res.status(200).json({ status: 'success', data: role });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil detail role.' });
  }
};

export const createRole = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const parseResult = createRoleSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi gagal.',
        errors: parseResult.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const { name, description, permissions } = parseResult.data;
    if (permissions.includes('*') && name !== 'SUPERADMIN') {
      return res.status(400).json({ status: 'error', message: 'Akses penuh hanya dapat diberikan kepada role SUPERADMIN.' });
    }
    if (name !== 'SUPERADMIN' && !permissions.some(permission => permission.startsWith('page:'))) {
      return res.status(400).json({ status: 'error', message: 'Role harus memiliki minimal satu halaman yang diizinkan.' });
    }
    if (name !== 'SUPERADMIN' && (
      permissions.includes('admins:manage')
      || permissions.includes('page:admins')
      || permissions.includes('page:role-monitoring')
    )) {
      return res.status(400).json({ status: 'error', message: 'Pengelolaan admin dan pemantauan semua role hanya dapat diberikan kepada role SUPERADMIN.' });
    }

    const existingRole = await prisma.role.findUnique({ where: { name } });
    if (existingRole) {
      return res.status(400).json({ status: 'error', message: `Role dengan nama '${name}' sudah ada.` });
    }

    const newRole = await prisma.role.create({
      data: {
        name,
        description,
        permissions,
      },
    });

    await prisma.log.create({
      data: {
        action: 'ROLE_CREATE',
        description: `Superadmin membuat role baru: ${newRole.name}`,
        adminId: req.admin?.adminId,
        entityType: 'Role',
        entityId: newRole.id,
        metadata: { permissions },
      },
    }).catch(() => null);

    return res.status(201).json({
      status: 'success',
      message: `Role '${newRole.name}' berhasil dibuat.`,
      data: newRole,
    });
  } catch (error) {
    console.error('🚨 [CREATE ROLE ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal membuat role baru.' });
  }
};

export const updateRole = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const parseResult = updateRoleSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi gagal.',
        errors: parseResult.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const existingRole = await prisma.role.findUnique({ where: { id } });
    if (!existingRole) {
      return res.status(404).json({ status: 'error', message: 'Role tidak ditemukan.' });
    }

    if (existingRole.name === 'SUPERADMIN' && parseResult.data.name && parseResult.data.name !== 'SUPERADMIN') {
      return res.status(400).json({ status: 'error', message: 'Nama role SUPERADMIN tidak boleh diubah.' });
    }
    if (parseResult.data.permissions?.includes('*') && (existingRole.name !== 'SUPERADMIN' || parseResult.data.name && parseResult.data.name !== 'SUPERADMIN')) {
      return res.status(400).json({ status: 'error', message: 'Akses penuh hanya dapat diberikan kepada role SUPERADMIN.' });
    }
    const updatedRoleName = parseResult.data.name || existingRole.name;
    if (updatedRoleName !== 'SUPERADMIN' && parseResult.data.permissions &&
      !parseResult.data.permissions.some(permission => permission.startsWith('page:'))) {
      return res.status(400).json({ status: 'error', message: 'Role harus memiliki minimal satu halaman yang diizinkan.' });
    }
    if (updatedRoleName !== 'SUPERADMIN' && parseResult.data.permissions && (
      parseResult.data.permissions.includes('admins:manage')
      || parseResult.data.permissions.includes('page:admins')
      || parseResult.data.permissions.includes('page:role-monitoring')
    )) {
      return res.status(400).json({ status: 'error', message: 'Pengelolaan admin dan pemantauan semua role hanya dapat diberikan kepada role SUPERADMIN.' });
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        ...(parseResult.data.name ? { name: parseResult.data.name } : {}),
        ...(parseResult.data.description !== undefined ? { description: parseResult.data.description } : {}),
        ...(parseResult.data.permissions ? { permissions: parseResult.data.permissions } : {}),
      },
    });

    await prisma.log.create({
      data: {
        action: 'ROLE_UPDATE',
        description: `Superadmin memperbarui role: ${updatedRole.name}`,
        adminId: req.admin?.adminId,
        entityType: 'Role',
        entityId: updatedRole.id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: `Role '${updatedRole.name}' berhasil diperbarui.`,
      data: updatedRole,
    });
  } catch (error) {
    console.error('🚨 [UPDATE ROLE ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal memperbarui role.' });
  }
};

export const deleteRole = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;

    const role: any = await prisma.role.findUnique({
      where: { id },
      include: { _count: { select: { admins: true } } },
    });

    if (!role) {
      return res.status(404).json({ status: 'error', message: 'Role tidak ditemukan.' });
    }

    if (role.name === 'SUPERADMIN') {
      return res.status(400).json({ status: 'error', message: 'Role SUPERADMIN tidak dapat dihapus.' });
    }

    if (role._count?.admins > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Role tidak dapat dihapus karena masih digunakan oleh ${role._count.admins} akun admin. Ubah role admin tersebut terlebih dahulu.`,
      });
    }

    await prisma.role.delete({ where: { id } });

    await prisma.log.create({
      data: {
        action: 'ROLE_DELETE',
        description: `Superadmin menghapus role: ${role.name}`,
        adminId: req.admin?.adminId,
        entityType: 'Role',
        entityId: id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: `Role '${role.name}' berhasil dihapus.`,
    });
  } catch (error) {
    console.error('🚨 [DELETE ROLE ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal menghapus role.' });
  }
};

// ==========================================
// 2. ADMIN ACCOUNTS MANAGEMENT
// ==========================================

export const getAllAdmins = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            permissions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      status: 'success',
      data: admins,
    });
  } catch (error) {
    console.error('🚨 [GET ADMINS ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil data akun admin.' });
  }
};

export const getAdminById = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });

    if (!admin) {
      return res.status(404).json({ status: 'error', message: 'Akun admin tidak ditemukan.' });
    }

    return res.status(200).json({ status: 'success', data: admin });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil detail admin.' });
  }
};

export const createAdmin = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const parseResult = createAdminSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi gagal.',
        errors: parseResult.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const { username, email, password, fullName, roleId, isActive } = parseResult.data;

    const duplicate = await prisma.admin.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (duplicate) {
      return res.status(400).json({
        status: 'error',
        message: 'Username atau email sudah digunakan oleh admin lain.',
      });
    }

    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      return res.status(404).json({ status: 'error', message: 'Role ID yang dipilih tidak ditemukan.' });
    }

    const hashedPassword = await hashPassword(password);

    const newAdmin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName,
        roleId,
        isActive,
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        isActive: true,
        createdAt: true,
        role: true,
      },
    });

    await prisma.log.create({
      data: {
        action: 'ADMIN_CREATE',
        description: `Superadmin membuat akun admin baru: ${newAdmin.username} (${role.name})`,
        adminId: req.admin?.adminId,
        entityType: 'Admin',
        entityId: newAdmin.id,
      },
    }).catch(() => null);

    return res.status(201).json({
      status: 'success',
      message: `Admin '${newAdmin.username}' dengan role '${role.name}' berhasil dibuat.`,
      data: newAdmin,
    });
  } catch (error) {
    console.error('🚨 [CREATE ADMIN ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal membuat akun admin baru.' });
  }
};

export const updateAdmin = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const parseResult = updateAdminSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi gagal.',
        errors: parseResult.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { id }, include: { role: true } });
    if (!existingAdmin) {
      return res.status(404).json({ status: 'error', message: 'Admin tidak ditemukan.' });
    }

    if (parseResult.data.username || parseResult.data.email) {
      const conflict = await prisma.admin.findFirst({
        where: {
          id: { not: id },
          OR: [
            ...(parseResult.data.username ? [{ username: parseResult.data.username }] : []),
            ...(parseResult.data.email ? [{ email: parseResult.data.email }] : []),
          ],
        },
      });
      if (conflict) {
        return res.status(400).json({ status: 'error', message: 'Username atau email sudah digunakan admin lain.' });
      }
    }

    if (parseResult.data.roleId) {
      const roleExists = await prisma.role.findUnique({ where: { id: parseResult.data.roleId } });
      if (!roleExists) {
        return res.status(404).json({ status: 'error', message: 'Role ID baru tidak ditemukan.' });
      }
    }

    if (req.admin?.adminId === id && parseResult.data.isActive === false) {
      return res.status(400).json({ status: 'error', message: 'Anda tidak dapat menonaktifkan akun Anda sendiri.' });
    }

    const updateData: any = {};
    if (parseResult.data.username) updateData.username = parseResult.data.username;
    if (parseResult.data.email) updateData.email = parseResult.data.email;
    if (parseResult.data.fullName) updateData.fullName = parseResult.data.fullName;
    if (parseResult.data.roleId) updateData.roleId = parseResult.data.roleId;
    if (parseResult.data.isActive !== undefined) updateData.isActive = parseResult.data.isActive;
    if (parseResult.data.password) {
      updateData.password = await hashPassword(parseResult.data.password);
    }

    const updated = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        isActive: true,
        updatedAt: true,
        role: true,
      },
    });

    await prisma.log.create({
      data: {
        action: 'ADMIN_UPDATE',
        description: `Superadmin memperbarui akun admin: ${updated.username}`,
        adminId: req.admin?.adminId,
        entityType: 'Admin',
        entityId: updated.id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: `Akun admin '${updated.username}' berhasil diperbarui.`,
      data: updated,
    });
  } catch (error) {
    console.error('🚨 [UPDATE ADMIN ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal memperbarui admin.' });
  }
};

export const deleteAdmin = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;

    if (req.admin?.adminId === id) {
      return res.status(400).json({ status: 'error', message: 'Anda tidak dapat menghapus akun Anda sendiri.' });
    }

    const target: any = await prisma.admin.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!target) {
      return res.status(404).json({ status: 'error', message: 'Admin tidak ditemukan.' });
    }

    if (target.role?.name === 'SUPERADMIN') {
      const superadminCount = await prisma.admin.count({
        where: { role: { name: 'SUPERADMIN' } },
      });
      if (superadminCount <= 1) {
        return res.status(400).json({
          status: 'error',
          message: 'Tidak dapat menghapus superadmin terakhir yang tersisa di sistem.',
        });
      }
    }

    await prisma.admin.delete({ where: { id } });

    await prisma.log.create({
      data: {
        action: 'ADMIN_DELETE',
        description: `Superadmin menghapus akun admin: ${target.username}`,
        adminId: req.admin?.adminId,
        entityType: 'Admin',
        entityId: id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: `Akun admin '${target.username}' berhasil dihapus.`,
    });
  } catch (error) {
    console.error('🚨 [DELETE ADMIN ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal menghapus akun admin.' });
  }
};
