import { PrismaClient } from '../src/generated/client/index.js';
import crypto from 'crypto';

const prisma = new PrismaClient();

const hashPasswordHelper = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
};

async function main() {
  console.log('🌱 Memulai proses seeding database ke MySQL...');

  // 1. Hapus data lama dengan urutan relasi aman
  await prisma.participant.deleteMany();
  await prisma.order.deleteMany();
  await prisma.eventBenefit.deleteMany();
  await prisma.jersey.deleteMany();
  await prisma.bibConfiguration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.routePoint.deleteMany();
  await prisma.user.deleteMany();
  await prisma.log.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.role.deleteMany();
  await prisma.appSetting.deleteMany();

  console.log('🧹 Data lama berhasil dibersihkan.');

  // 2. Buat Default 12 Roles
  const defaultRolesData = [
    {
      name: 'SUPERADMIN',
      description: 'Pemegang kendali tertinggi seluruh sistem, server, database, dan konfigurasi hak akses.',
      permissions: ['*'],
    },
    {
      name: 'ADMINISTRATOR',
      description: 'Koordinator operasional utama event. Mengelola kuota, peserta, rute, dan publikasi website.',
      permissions: [
        'page:dashboard', 'page:events', 'page:participants', 'page:orders', 'page:notif-logs', 'page:whatsapp-web', 'page:cms', 'page:countdown', 'page:routes',
        'events:*', 'participants:*', 'orders:read', 'orders:update', 'benefits:*', 'jerseys:*', 'bib:*', 'routes:*', 'cms:*', 'countdown:*', 'notifications:*'
      ],
    },
    {
      name: 'FINANCE',
      description: 'Divisi keuangan & bendahara. Mengaudit pembayaran, rekonsiliasi Midtrans, settlement manual & refund.',
      permissions: [
        'page:dashboard', 'page:orders', 'page:logs',
        'orders:*', 'finance:read', 'logs:read'
      ],
    },
    {
      name: 'SPONSORSHIP',
      description: 'Divisi sponsorship & mitra. Mengelola logo/exposure sponsor di CMS, benefit tiket, dan laporan pendaftar.',
      permissions: [
        'page:dashboard', 'page:cms', 'page:events', 'page:notif-logs',
        'cms:*', 'events:read', 'benefits:manage', 'notifications:read'
      ],
    },
    {
      name: 'RACEPACK_OFFICER',
      description: 'Petugas Race Pack Collection (RPC). Verifikasi E-Tiket, serah terima jersey & nomor BIB pelari.',
      permissions: [
        'page:dashboard', 'page:participants', 'page:whatsapp-web',
        'participants:read', 'participants:update', 'jerseys:manage', 'bib:manage', 'whatsapp:chat'
      ],
    },
    {
      name: 'GATE_OPERATOR',
      description: 'Petugas gerbang & pintu masuk venue. Scan QR/Barcode tiket pelari dan validasi akses masuk.',
      permissions: [
        'page:dashboard', 'page:participants',
        'participants:read', 'orders:read'
      ],
    },
    {
      name: 'RACE_DIRECTOR',
      description: 'Direktur teknis perlombaan. Mengawasi rute marathon, pos evakuasi, timing COT, dan status countdown.',
      permissions: [
        'page:dashboard', 'page:routes', 'page:countdown', 'page:participants', 'page:events',
        'routes:*', 'countdown:*', 'events:read', 'participants:read'
      ],
    },
    {
      name: 'TIMING_JUDGE',
      description: 'Juri pencatat waktu & komisi timing PASI. Mengelola BIB RFID, checkpoint waktu lintasan, dan finisher.',
      permissions: [
        'page:dashboard', 'page:participants', 'page:routes',
        'participants:read', 'bib:manage', 'routes:manage'
      ],
    },
    {
      name: 'MEDICAL_OFFICER',
      description: 'Tim dokter & medis darurat. Akses cepat data kesehatan peserta, kontak darurat, dan pos medis.',
      permissions: [
        'page:dashboard', 'page:participants', 'page:routes',
        'participants:read', 'routes:manage'
      ],
    },
    {
      name: 'VOLUNTEER',
      description: 'Relawan operasional lapangan. Pengecekan data peserta di helpdesk dan informasi umum event (read-only).',
      permissions: [
        'page:dashboard', 'page:participants',
        'participants:read'
      ],
    },
    {
      name: 'BAG_DROP_OFFICER',
      description: 'Petugas penitipan barang (Bag Drop). Pencocokan BIB & identitas pelari untuk titip dan ambil barang.',
      permissions: [
        'page:dashboard', 'page:participants',
        'participants:read'
      ],
    },
    {
      name: 'CUSTOMER_SERVICE',
      description: 'Layanan bantuan peserta (Helpdesk). Layanan chat WhatsApp Web Console, cek status tiket & kirim ulang pesan.',
      permissions: [
        'page:dashboard', 'page:whatsapp-web', 'page:notif-logs', 'page:participants', 'page:orders',
        'whatsapp:chat', 'whatsapp:session', 'notifications:read', 'participants:read', 'orders:read'
      ],
    },
  ];

  const createdRolesMap: Record<string, string> = {};
  for (const r of defaultRolesData) {
    const role = await prisma.role.create({ data: r });
    createdRolesMap[r.name] = role.id;
  }

  const superadminRoleId = createdRolesMap['SUPERADMIN'];
  const administratorRoleId = createdRolesMap['ADMINISTRATOR'];
  const financeRoleId = createdRolesMap['FINANCE'];

  console.log('✅ 12 Roles resmi berhasil dibuat: SUPERADMIN, ADMINISTRATOR, FINANCE, SPONSORSHIP, RACEPACK_OFFICER, GATE_OPERATOR, RACE_DIRECTOR, TIMING_JUDGE, MEDICAL_OFFICER, VOLUNTEER, BAG_DROP_OFFICER, CUSTOMER_SERVICE');

  // 3. Buat Akun Admin Default
  const hashedSuperPassword = await hashPasswordHelper('SuperAdmin2027!');
  const superadmin = await prisma.admin.create({
    data: {
      username: 'superadmin',
      email: 'superadmin@tegalrun.id',
      password: hashedSuperPassword,
      fullName: 'Super Administrator Utama',
      roleId: superadminRoleId,
      isActive: true,
    },
  });

  const hashedAdminPassword = await hashPasswordHelper('AdminOps2027!');
  await prisma.admin.create({
    data: {
      username: 'admin_ops',
      email: 'admin@tegalrun.id',
      password: hashedAdminPassword,
      fullName: 'Staff Operasional Event',
      roleId: administratorRoleId,
      isActive: true,
    },
  });

  const hashedFinancePassword = await hashPasswordHelper('Finance2027!');
  await prisma.admin.create({
    data: {
      username: 'admin_finance',
      email: 'finance@tegalrun.id',
      password: hashedFinancePassword,
      fullName: 'Staff Keuangan Tegal Run',
      roleId: financeRoleId,
      isActive: true,
    },
  });

  console.log('✅ Akun Admin berhasil dibuat:');
  console.log('   - superadmin (password: SuperAdmin2027!)');
  console.log('   - admin_ops (password: AdminOps2027!)');
  console.log('   - admin_finance (password: Finance2027!)');

  // 3b. Membuat User Default Pembeli / Pemesan Tiket
  await prisma.user.create({
    data: {
      id: '469f99cc-9e06-434f-a3a1-c1b086c2b3c0',
      fullName: 'Pelari Tegal 2027',
      email: 'pelari@tegalrun.id',
      phoneNumber: '081234567890',
    },
  });
  console.log('✅ User default checkout berhasil dibuat.');

  // 4. Membuat Event 5K (Fun Run)
  const event5k = await prisma.event.create({
    data: {
      ticketName: 'Tegal Run 2027 - 5K Fun Run',
      category: '5K',
      stock: 1000,
      price: 150000.0,
      ticketImage: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80',
      medalImage: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80',
      benefits: {
        create: [
          { name: 'Medali Finisher 5K', description: 'Medali zinc alloy eksklusif untuk penamat 5K' },
          { name: 'Racepack Dasar', description: 'Tas serut, BIB, dan refreshment' },
          { name: 'Refreshment & Isotonik', description: 'Minuman isotonik dingin dan buah segar di finish line' },
        ],
      },
      jerseys: {
        create: [
          {
            name: '5K Official T-Shirt',
            type: 'T-Shirt',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          },
        ],
      },
      bibConfig: {
        create: {
          prefix: '05',
          digitLength: 4,
          startNumber: 1,
          suffix: null,
        },
      },
    },
  });
  console.log(`✅ Event dibuat: ${event5k.ticketName} (Stok: ${event5k.stock})`);

  // 5. Membuat Event 10K (Competitive)
  const event10k = await prisma.event.create({
    data: {
      ticketName: 'Tegal Run 2027 - 10K Competitive',
      category: '10K',
      stock: 500,
      price: 250000.0,
      ticketImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80',
      medalImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
      benefits: {
        create: [
          { name: 'Medali Finisher 10K', description: 'Medali zinc alloy ukiran khusus 10K dengan lanyard batik' },
          { name: 'Racepack Premium', description: 'Tas serut, BIB dengan RFID timing chip akurat, goodies sponsor' },
          { name: 'Asuransi Lari & Medis', description: 'Perlindungan medis selama acara berlangsung standar PASI' },
          { name: 'Recovery Hydration Zone', description: 'Fasilitas recovery massage & hydro station' },
        ],
      },
      jerseys: {
        create: [
          {
            name: '10K Official Singlet',
            type: 'Singlet',
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
          },
          {
            name: '10K Official Lengan Panjang',
            type: 'Lengan Panjang',
            sizes: ['S', 'M', 'L', 'XL'],
          },
        ],
      },
      bibConfig: {
        create: {
          prefix: '10',
          digitLength: 4,
          startNumber: 1,
          suffix: null,
        },
      },
    },
  });
  console.log(`✅ Event dibuat: ${event10k.ticketName} (Stok: ${event10k.stock})`);

  // 6. Membuat Checkpoint & Titik Kumpul Rute Resmi (RoutePoint)
  const routePointsData = [
    {
      orderIndex: 1,
      name: 'Start & Finish: Alun-Alun Kota Tegal (Titik Kumpul Utama)',
      distanceKm: 'Km 0.0 & Finish',
      category: 'ALL',
      description: 'Area Race Village, mushola, loker penitipan barang, panggung utama, dan tenda fisioterapi.',
      icon: 'fa-flag-checkered',
      image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
      isWaterStation: true,
      isMedicalSpot: true,
    },
    {
      orderIndex: 2,
      name: 'Km 2.5: Water Station 1 & Pos Pertolongan Medis',
      distanceKm: 'Km 2.5',
      category: 'ALL',
      description: 'Air mineral dingin, spons basah pendingin tubuh, dan tim medis ambulans siaga.',
      icon: 'fa-faucet-water',
      image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
      isWaterStation: true,
      isMedicalSpot: true,
    },
    {
      orderIndex: 3,
      name: 'Km 5.0: Pantai Alam Indah (PAI) & Cheering Point',
      distanceKm: 'Km 5.0',
      category: 'ALL',
      description: 'Titik putar balik 5K & lintasan lurus 10K dengan panorama laut utara Jawa dan sajian isotonik.',
      icon: 'fa-water',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      isWaterStation: true,
      isMedicalSpot: false,
    },
    {
      orderIndex: 4,
      name: 'Km 7.5: Hydration Station 3 & Semangka Segar 10K',
      distanceKm: 'Km 7.5',
      category: '10K',
      description: 'Minuman elektrolit isotonik dingin, semangka potong segar, dan hiburan musik pengobar semangat.',
      icon: 'fa-bolt',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
      isWaterStation: true,
      isMedicalSpot: true,
    },
  ];

  for (const pt of routePointsData) {
    await prisma.routePoint.create({ data: pt });
  }
  console.log('✅ 4 Titik Kumpul & Checkpoint Rute Resmi berhasil dibuat di database.');

  // 7. Pengaturan Sistem AppSetting (BIB, QR Prefix & Petunjuk Racepack)
  await prisma.appSetting.createMany({
    data: [
      {
        key: 'qr_prefix',
        value: 'TEGALRUN',
        description: 'Awalan / Prefix untuk QR Code E-Tiket (Format: PREFIX|enkripsi_teks)',
      },
      {
        key: 'bib_generation_settings',
        value: JSON.stringify({
          timing: 'PAYMENT_SUCCESS',
          defaultPrefix: '10-',
          digitLength: 4,
          startNumber: 1001,
          suffix: '',
        }),
        description: 'Pengaturan global nomor BIB (Waktu generate: PAYMENT_SUCCESS, RACEPACK_CHECKIN, MANUAL)',
      },
      {
        key: 'racepack_instructions',
        value: JSON.stringify({
          title: 'Petunjuk Pengambilan Racepack & Race Day:',
          points: [
            'Tunjukkan E-Tiket ini (versi cetak atau layar ponsel) beserta KTP asli saat pengambilan Racepack (RPC).',
            'Pengambilan paket lomba dilaksanakan pada H-2 s/d H-1 perlombaan di Sekretariat Race Village Alun-Alun Kota Tegal.',
            'Nomor BIB dada wajib disematkan di bagian depan jersey selama lomba agar terbaca oleh timing system resmi.',
            'Apabila berhalangan mengambil racepack secara langsung, pengambilan dapat diwakilkan dengan menyertakan Surat Kuasa dan fotokopi KTP peserta.',
          ],
        }),
        description: 'Petunjuk Pengambilan Racepack & Race Day pada E-Tiket',
      },
      {
        key: 'event_countdown_date',
        value: '2027-02-28T06:00:00.000Z',
        description: 'Target waktu countdown perlombaan Tegal Run 2027',
      },
      {
        key: 'event_registration_closed',
        value: 'false',
        description: 'Status penutupan pendaftaran event secara manual',
      },
    ],
  });
  console.log('✅ AppSetting (BIB Rules, QR Prefix, Racepack Instructions, Countdown) berhasil diinisialisasi.');

  console.log('🎉 Seeding database sukses! Sistem siap digunakan.');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
