import type { Request, Response } from 'express';
import prisma from '../config/database';
import type { AuthenticatedRequest } from '../middlewares/auth';
import { z } from 'zod';
import { getEventTimerPhase } from '../utils/event-timing';
import { emitDataChanged } from '../sockets';
import { env } from '../config/env';

export const DEFAULT_WEBSITE_SETTINGS: Record<string, string> = {
  // Website Identity & Hero
  site_title: "Tegal Run 2027 - Official Half Marathon & 5K Festival",
  site_tagline: "Lari Bersama Menembus Batas di Kota Bahari",
  navbar_title: "TEGAL RUN 2027",
  navbar_icon_mode: "ICON",
  navbar_icon: "fa-person-running",
  navbar_icon_url: "",
  favicon_url: "",
  hero_badge: "🔥 PENDAFTARAN RESMI DIBUKA",
  hero_title: "Tegal Run 2027: Lari Bersama Menembus Batas",
  hero_subtitle: "Bergabung bersama komunitas pelari dan rayakan setiap langkah di Tegal Run 2027.",
  hero_bg_image: "",
  coming_soon_title: "COMING SOON EVENT!",
  coming_soon_message: "Informasi lengkap acara akan segera hadir. Nantikan kabar terbaru dari kami!",
  coming_soon_image_url: "",

  // Rute & Google Maps
  route_badge_label: "Jalur Lari Steril",
  route_title: "Rute Lari Resmi & Titik Kumpul",
  route_desc: "Jalur datar beraspal mulus melintasi landmark bersejarah Kota Tegal dengan pemandangan pesisir utara dan pengawalan lalu lintas steril.",
  route_map_mode: "GMAPS",
  gmaps_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.042735759714!2d109.13658237587522!3d-6.885483267375218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb9b95952db7d%3A0xe54d6fbbece0f07b!2sAlun-Alun%20Kota%20Tegal!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
  route_gmaps_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.042735759714!2d109.13658237587522!3d-6.885483267375218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb9b95952db7d%3A0xe54d6fbbece0f07b!2sAlun-Alun%20Kota%20Tegal!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
  route_map_image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80",
  route_checkpoint_mode: "MANUAL",
  route_checkpoint_image: "",
  faq_items: JSON.stringify([
    { question: "Apakah tiket atau BIB perlombaan dapat dipindahtangankan?", answer: "Demi alasan keselamatan medis dan validitas data peserta, tiket dan nomor BIB terdaftar resmi tidak dapat dipindahtangankan atau diwakilkan kepada orang lain tanpa persetujuan dari panitia.", enabled: true },
    { question: "Bagaimana prosedur pengambilan Race Pack (RPC)?", answer: "Informasi mengenai jadwal dan lokasi pengambilan racepack diumumkan melalui kanal resmi event. Peserta wajib membawa e-tiket resmi dan identitas diri yang sah saat pengambilan.", enabled: true },
    { question: "Apakah ada ketentuan kualifikasi fisik bagi peserta?", answer: "Setiap peserta bertanggung jawab atas kondisi fisik dan kesehatannya masing-masing. Peserta diimbau melakukan pemeriksaan medis mandiri dan memastikan stamina tubuh prima sebelum mengikuti perlombaan.", enabled: true },
    { question: "Bagaimana kebijakan acara jika terjadi keadaan kahar (Force Majeure)?", answer: "Jika terjadi cuaca ekstrem, kendala keamanan, atau situasi darurat yang tidak memungkinkan acara berlangsung, panitia berhak menyesuaikan jadwal atau rute demi keselamatan seluruh peserta sesuai regulasi yang berlaku.", enabled: true },
    { question: "Bagaimana kerahasiaan data pribadi peserta dilindungi?", answer: "Seluruh data pribadi yang dikumpulkan saat pendaftaran dijaga kerahasiaannya dan hanya digunakan untuk keperluan operasional acara, keselamatan medis, serta verifikasi tiket sesuai peraturan yang berlaku.", enabled: true }
  ]),

  // Fasilitas & Race Pack
  facilities_title: "Fasilitas & Layanan Unggulan",
  facilities_desc: "Kenyamanan dan keselamatan pelari adalah prioritas utama kami dengan standar perlombaan PASI.",
  facilities_image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",

  // Tiket & Lomba
  tickets_title: "Pilih Tantangan Jarak Lari Anda",
  tickets_desc: "Tersedia kategori kompetitif bagi atlet dan fun run santai bagi keluarga & komunitas.",
  medal_preview_image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
  medal_image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",

  // Kontak & Footer
  contact_email: "kontak@tegalrun.id",
  contact_phone: "+62 812-3456-7890",
  contact_address: "Alun-Alun Kota Tegal, Jawa Tengah, Indonesia",
  footer_copyright: "Hak Cipta Terpelihara © 2027 Panitia Resmi Tegal Run. Dilindungi Undang-Undang Republik Indonesia.",

  // Live Event Stats Grid
  stat_1_val: "",
  stat_1_unit: "",
  stat_1_desc: "",
  stat_2_val: "",
  stat_2_unit: "",
  stat_2_desc: "",
  stat_3_val: "",
  stat_3_unit: "",
  stat_3_desc: "",
  stat_4_val: "",
  stat_4_unit: "",
  stat_4_desc: "",

  // File rute
  route_gpx_url: "#",

  // Legal & Perizinan
  legal_badge_label: "Kepatuhan Regulasi Indonesia",
  legal_title: "Perizinan & Kepatuhan Hukum Resmi",
  legal_desc: "Tegal Run 2027 diselenggarakan dengan izin resmi pemerintah daerah, PASI, dan standar keselamatan medis internasional.",
  legal_item_1_title: "Rekomendasi Resmi PB PASI",
  legal_item_1_desc: "Tersertifikasi standar teknis rute dan aturan perlombaan atletik resmi nasional.",
  legal_item_2_title: "Izin Kepolisian & Dishub",
  legal_item_2_desc: "Pengamanan jalur dan rekayasa lalu lintas penuh demi keselamatan pelari.",
  legal_item_3_title: "Asuransi Medis Peserta",
  legal_item_3_desc: "Seluruh pelari terdaftar dilindungi asuransi kecelakaan diri selama perlombaan berlangsung.",
  legal_item_4_title: "Perlindungan Data Pribadi (UU PDP)",
  legal_item_4_desc: "Enkripsi data pendaftaran dan kepatuhan penuh perlindungan data konsumen.",
  legal_privacy_button: "Baca Kebijakan Privasi Lengkap (UU PDP)",
  legal_terms_button: "Ketentuan Perlombaan & Pelepasan Tanggung Jawab",
  privacy_modal_title: "Kebijakan Privasi Data Pribadi (UU PDP)",
  privacy_modal_subtitle: "Berdasarkan Undang-Undang Republik Indonesia Nomor 27 Tahun 2022",
  privacy_modal_content: `1. Pengendali Data Pribadi
Pengendali Data Pribadi untuk seluruh aktivitas pendaftaran Tegal Run 2027 adalah Komite Pelaksana yang berkedudukan di Tegal, Jawa Tengah. Kami berkomitmen melindungi data pribadi Anda sesuai UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP) dan UU No. 1 Tahun 2024 tentang ITE.

2. Data Pribadi yang Dikumpulkan
Data yang kami kumpulkan mencakup:
- Data Pribadi Umum: Nama Lengkap sesuai KTP, NIK 16 digit, tempat dan tanggal lahir, jenis kelamin, alamat domisili, nomor telepon/WhatsApp, dan alamat email.
- Data Pribadi Spesifik/Sensitif: Golongan darah dan riwayat penyakit/alergi medis yang diserahkan secara sukarela untuk penanganan darurat tim medis di rute perlombaan.

3. Dasar Hukum dan Tujuan Pemrosesan
Pemrosesan data pribadi dilakukan berdasarkan persetujuan eksplisit untuk tujuan:
- Verifikasi kepemilikan nomor BIB resmi guna mencegah pemalsuan identitas atau praktik joki.
- Penerbitan polis asuransi perlindungan kecelakaan olahraga selama perlombaan.
- Penyelamatan jiwa oleh tim medis darurat jika terjadi kondisi gawat darurat di lintasan.
- Pengiriman hasil waktu lomba (Race Timing) dan e-Certificate resmi.

4. Keamanan dan Masa Retensi Data
Data disimpan pada server dengan protokol SSL/TLS dan pembatasan akses. Masa simpan data maksimal satu tahun kalender setelah event selesai untuk kebutuhan audit keselamatan dan keuangan; setelah itu data dianonimkan atau dimusnahkan secara aman.

5. Hak Anda sebagai Subjek Data
Berdasarkan Pasal 5 s.d. Pasal 13 UU PDP, Anda berhak mengakses, memperbaiki kesalahan data, menolak pemrosesan otomatis, serta mengajukan permohonan penghapusan data. Hubungi Petugas Perlindungan Data melalui surel resmi: dpo@tegalrun.id.`,
  terms_modal_title: "Syarat & Ketentuan Peserta Lari",
  terms_modal_subtitle: "Regulasi Resmi Perlombaan",
  terms_modal_content: `1. Ketentuan Umum Kepesertaan
Pendaftaran terbuka untuk WNI dan WNA yang memiliki identitas resmi (KTP/SIM/Paspor). Peserta wajib memilih kategori sesuai kemampuan fisik dan mematuhi batas waktu Cut-Off Time (COT).

2. Larangan Praktik Joki & Pengalihan BIB
Nomor BIB bersifat personal dan tidak dapat diperjualbelikan atau dialihkan kepada pihak lain tanpa persetujuan tertulis panitia. Pelanggaran dapat mengakibatkan diskualifikasi, pencabutan hak medali finisher, dan hilangnya perlindungan asuransi.

3. Pelepasan Tanggung Jawab Medis (Waiver of Liability)
Dengan menyelesaikan pendaftaran, peserta menyadari bahwa lari maraton adalah aktivitas fisik berintensitas tinggi. Peserta bertanggung jawab atas kondisi kesehatannya dan membebaskan panitia, sponsor, serta aparat pengamanan dari tuntutan atas cedera, kehilangan harta benda, atau insiden akibat kondisi kesehatan bawaan yang tidak diungkapkan kepada tim medis.

4. Kebijakan Keadaan Kahar (Force Majeure)
Apabila terjadi bencana alam, kebakaran, kerusuhan sosial, atau kebijakan pemerintah terkait keamanan wilayah yang menyebabkan acara dibatalkan, panitia tidak berkewajiban mengembalikan biaya pendaftaran yang telah digunakan untuk produksi racepack dan operasional awal.`,

  // Countdown & Registrasi
  IS_REGISTRATION_CLOSED: "false",
  EVENT_TITLE: "Tegal Run 2027"
};

/**
 * Mengambil pengaturan global countdown & status pendaftaran (Public)
 */
export const getPublicCountdownSettings = async (req: Request, res: Response): Promise<any> => {
  try {
    const [settings, titleSettings, statusSettings] = await Promise.all([
      prisma.appSetting.findMany({
        where: { key: { in: ['EVENT_COUNTDOWN_DATE', 'event_countdown_date', 'IS_REGISTRATION_CLOSED', 'event_registration_closed'] } }
      }),
      prisma.appSetting.findMany({
        where: { key: { in: ['EVENT_TITLE', 'event_title'] } }
      }),
      prisma.appSetting.findMany({
        where: {
          key: {
            in: [
              'registration_operating_hours',
              'registration_closed_message',
              'maintenance_enabled',
              'maintenance_type',
              'maintenance_title',
              'maintenance_message',
              'maintenance_expected_end'
            ]
          }
        }
      }),
    ]);

    const findSetting = (canonicalKey: string, legacyKey: string) =>
      settings.find(setting => setting.key === canonicalKey)
      || settings.find(setting => setting.key === legacyKey);
    const dateSetting = findSetting('EVENT_COUNTDOWN_DATE', 'event_countdown_date');
    const closedSetting = findSetting('IS_REGISTRATION_CLOSED', 'event_registration_closed');
    const eventCountdownDate = dateSetting?.value ? new Date(dateSetting.value) : null;
    const manualRegistrationClosed = closedSetting?.value === 'true';
    const timerPhase = getEventTimerPhase(eventCountdownDate);
    const registrationPhase = timerPhase === 'UPCOMING' && manualRegistrationClosed
      ? 'CLOSED'
      : timerPhase;
    const titleSetting = titleSettings.find(setting => setting.key === 'EVENT_TITLE')
      || titleSettings.find(setting => setting.key === 'event_title');
    const getStatusSetting = (key: string) => statusSettings.find(setting => setting.key === key)?.value || '';

    return res.status(200).json({
      status: 'success',
      data: {
        eventCountdownDate: eventCountdownDate?.toISOString() || null,
        manualRegistrationClosed,
        isRegistrationClosed: manualRegistrationClosed || timerPhase !== 'UPCOMING',
        registrationPhase,
        eventTitle: titleSetting ? titleSetting.value : '',
        registrationOperatingHours: getStatusSetting('registration_operating_hours'),
        registrationClosedMessage: getStatusSetting('registration_closed_message'),
        maintenanceEnabled: getStatusSetting('maintenance_enabled') === 'true',
        maintenanceType: getStatusSetting('maintenance_type') || 'REPAIR',
        maintenanceTitle: getStatusSetting('maintenance_title'),
        maintenanceMessage: getStatusSetting('maintenance_message'),
        maintenanceExpectedEnd: getStatusSetting('maintenance_expected_end') || null,
      }
    });
  } catch (error) {
    console.error('🚨 [GET SETTINGS ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal memuat status countdown dari database.' });
  }
};

/**
 * Mengambil pengaturan biaya layanan & batas waktu pembayaran untuk publik checkout
 */
export const getPublicCheckoutConfig = async (req: Request, res: Response): Promise<any> => {
  try {
    const [timerSetting, feeEnabledSetting, feeTypeSetting, feeAmountSetting] = await Promise.all([
      prisma.appSetting.findUnique({ where: { key: 'payment_timer_minutes' } }),
      prisma.appSetting.findUnique({ where: { key: 'fee_enabled' } }),
      prisma.appSetting.findUnique({ where: { key: 'fee_type' } }),
      prisma.appSetting.findUnique({ where: { key: 'fee_amount' } }),
    ]);

    const feeEnabled = feeEnabledSetting ? feeEnabledSetting.value === 'true' : true;
    const feeType = feeTypeSetting?.value || 'PER_TRANSACTION';
    const feeAmount = feeEnabled ? (feeAmountSetting ? Math.max(0, Number(feeAmountSetting.value)) : 5000) : 0;

    return res.status(200).json({
      status: 'success',
      data: {
        paymentTimerMinutes: timerSetting ? parseInt(timerSetting.value, 10) || 30 : 30,
        feeEnabled,
        feeType,
        feeAmount,
        midtransClientKey: env.MIDTRANS_CLIENT_KEY,
        midtransIsProduction: env.MIDTRANS_IS_PRODUCTION === 'true' || env.MIDTRANS_IS_PRODUCTION === true,
      },
    });
  } catch (error) {
    console.error('🚨 [GET CHECKOUT CONFIG ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memuat konfigurasi checkout. Silakan coba kembali beberapa saat lagi.',
    });
  }
};

const PUBLIC_WEBSITE_SETTING_KEYS = [
  ...Object.keys(DEFAULT_WEBSITE_SETTINGS),
  'stats_banner_items',
  'facilities_items',
  'legal_items',
  'faq_items',
  'cms_visibility',
];

/**
 * Mengambil seluruh pengaturan konten website CMS (Public)
 */
export const getWebsiteSettings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const dbSettings = await prisma.appSetting.findMany();
    const settingsMap: Record<string, string> = { ...DEFAULT_WEBSITE_SETTINGS };
    const permissions = req.admin?.permissions || [];
    const canReadCms = req.admin?.roleName === 'SUPERADMIN' ||
      permissions.includes('cms:manage') ||
      permissions.includes('cms:*') ||
      permissions.includes('page:cms');
    const routeOnly = Boolean(req.admin) && !canReadCms;

    dbSettings.forEach((item) => {
      settingsMap[item.key] = item.value;
    });

    if (routeOnly) {
      const routeKeys = [
        'route_badge_label',
        'route_title',
        'route_desc',
        'route_gpx_url',
        'route_map_mode',
        'route_checkpoint_mode',
        'route_gmaps_url',
        'route_map_image',
        'route_checkpoint_image',
      ];
      return res.status(200).json({
        status: 'success',
        data: Object.fromEntries(routeKeys.map(key => [key, settingsMap[key] || '']))
      });
    }

    if (!req.admin) {
      return res.status(200).json({
        status: 'success',
        data: Object.fromEntries(PUBLIC_WEBSITE_SETTING_KEYS.map(key => [key, settingsMap[key] || '']))
      });
    }

    return res.status(200).json({
      status: 'success',
      data: settingsMap
    });
  } catch (error) {
    console.error('🚨 [GET WEBSITE SETTINGS ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memuat pengaturan website dari database.'
    });
  }
};

const updateCountdownSchema = z.object({
  eventCountdownDate: z.string().nullable().optional(),
  isRegistrationClosed: z.boolean().optional(),
  eventTitle: z.string().optional(),
  registrationOperatingHours: z.string().max(120).optional(),
  registrationClosedMessage: z.string().max(300).optional(),
  maintenanceEnabled: z.boolean().optional(),
  maintenanceType: z.enum(['REPAIR', 'ROUTINE', 'UPDATE', 'OTHER']).optional(),
  maintenanceTitle: z.string().max(120).optional(),
  maintenanceMessage: z.string().max(1000).optional(),
  maintenanceExpectedEnd: z.string().nullable().optional()
});

/**
 * Memperbarui pengaturan global countdown & status pendaftaran (Admin Only)
 */
export const updateAdminCountdownSettings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const parseResult = updateCountdownSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi pengaturan gagal.',
        errors: parseResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }

    const {
      eventCountdownDate,
      isRegistrationClosed,
      eventTitle,
      registrationOperatingHours,
      registrationClosedMessage,
      maintenanceEnabled,
      maintenanceType,
      maintenanceTitle,
      maintenanceMessage,
      maintenanceExpectedEnd
    } = parseResult.data;

    let savedCountdownIso: string | null = null;
    if (eventCountdownDate === undefined) {
      const currentCountdownSettings = await prisma.appSetting.findMany({
        where: { key: { in: ['EVENT_COUNTDOWN_DATE', 'event_countdown_date'] } },
        select: { key: true, value: true }
      });
      const currentCountdownSetting = currentCountdownSettings.find(setting => setting.key === 'EVENT_COUNTDOWN_DATE')
        || currentCountdownSettings.find(setting => setting.key === 'event_countdown_date');
      savedCountdownIso = currentCountdownSetting?.value || null;
    }
    // Simpan atau Kosongkan Tanggal Countdown
    if (eventCountdownDate !== undefined && (!eventCountdownDate || eventCountdownDate.trim() === '')) {
      await prisma.appSetting.deleteMany({
        where: { key: { in: ['EVENT_COUNTDOWN_DATE', 'event_countdown_date'] } }
      });
    } else if (eventCountdownDate !== undefined) {
      const parsedDate = new Date(eventCountdownDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          status: 'error',
          message: 'Format tanggal countdown tidak valid.'
        });
      }
      savedCountdownIso = parsedDate.toISOString();
      await prisma.appSetting.upsert({
        where: { key: 'EVENT_COUNTDOWN_DATE' },
        update: { value: savedCountdownIso, description: 'Target tanggal hitung mundur utama event di landing page' },
        create: { key: 'EVENT_COUNTDOWN_DATE', value: savedCountdownIso, description: 'Target tanggal hitung mundur utama event di landing page' }
      });
    }
    if (eventCountdownDate !== undefined) {
      await prisma.event.updateMany({
        where: { followGlobalTimer: true },
        data: { eventDate: savedCountdownIso ? new Date(savedCountdownIso) : null }
      });
    }

    // Simpan Status Tutup Pendaftaran jika disertakan
    if (isRegistrationClosed !== undefined) {
      await prisma.appSetting.upsert({
        where: { key: 'IS_REGISTRATION_CLOSED' },
        update: { value: String(isRegistrationClosed), description: 'Status penutupan pendaftaran event secara global' },
        create: { key: 'IS_REGISTRATION_CLOSED', value: String(isRegistrationClosed), description: 'Status penutupan pendaftaran event secara global' }
      });
    }

    // Simpan Judul Event jika disertakan
    if (eventTitle !== undefined) {
      await prisma.appSetting.upsert({
        where: { key: 'EVENT_TITLE' },
        update: { value: eventTitle },
        create: { key: 'EVENT_TITLE', value: eventTitle, description: 'Judul resmi event' }
      });
    }

    const statusSettings: Array<{ key: string; value: string; description: string }> = [];
    if (registrationOperatingHours !== undefined) {
      statusSettings.push({
        key: 'registration_operating_hours',
        value: registrationOperatingHours.trim(),
        description: 'Jam operasional pendaftaran yang ditampilkan saat pendaftaran ditutup'
      });
    }
    if (registrationClosedMessage !== undefined) {
      statusSettings.push({
        key: 'registration_closed_message',
        value: registrationClosedMessage.trim(),
        description: 'Pesan publik saat pendaftaran ditutup'
      });
    }
    if (maintenanceEnabled !== undefined) {
      statusSettings.push({
        key: 'maintenance_enabled',
        value: String(maintenanceEnabled),
        description: 'Status mode maintenance website'
      });
    }
    if (maintenanceType !== undefined) {
      statusSettings.push({
        key: 'maintenance_type',
        value: maintenanceType,
        description: 'Jenis maintenance website'
      });
    }
    if (maintenanceTitle !== undefined) {
      statusSettings.push({
        key: 'maintenance_title',
        value: maintenanceTitle.trim(),
        description: 'Judul halaman maintenance website'
      });
    }
    if (maintenanceMessage !== undefined) {
      statusSettings.push({
        key: 'maintenance_message',
        value: maintenanceMessage.trim(),
        description: 'Pesan halaman maintenance website'
      });
    }
    if (maintenanceExpectedEnd !== undefined) {
      let expectedEnd = '';
      if (maintenanceExpectedEnd) {
        const parsedExpectedEnd = new Date(maintenanceExpectedEnd);
        if (Number.isNaN(parsedExpectedEnd.getTime())) {
          return res.status(400).json({ status: 'error', message: 'Format perkiraan waktu maintenance selesai tidak valid.' });
        }
        expectedEnd = parsedExpectedEnd.toISOString();
      }
      statusSettings.push({
        key: 'maintenance_expected_end',
        value: expectedEnd,
        description: 'Perkiraan waktu selesai maintenance website'
      });
    }
    await Promise.all(statusSettings.map(setting => prisma.appSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: setting
    })));
    emitDataChanged(['countdown', 'public:countdown']);

    // Catat ke audit log
    await prisma.log.create({
      data: {
        action: 'SETTINGS_UPDATE',
        description: `Admin memperbarui tanggal countdown utama: ${savedCountdownIso || 'Dikosongkan'}${isRegistrationClosed !== undefined ? ` (Status Tutup: ${isRegistrationClosed})` : ''}`,
        adminId: req.admin?.adminId,
        entityType: 'AppSetting',
        entityId: 'EVENT_COUNTDOWN_DATE'
      }
    }).catch(() => null);

    const savedClosedSettings = isRegistrationClosed === undefined
      ? await prisma.appSetting.findMany({
        where: { key: { in: ['IS_REGISTRATION_CLOSED', 'event_registration_closed'] } },
        select: { key: true, value: true }
      })
      : [];
    const manualRegistrationClosed = isRegistrationClosed !== undefined
      ? isRegistrationClosed
      : (savedClosedSettings.find(setting => setting.key === 'IS_REGISTRATION_CLOSED')
        || savedClosedSettings.find(setting => setting.key === 'event_registration_closed'))?.value === 'true';
    const timerPhase = getEventTimerPhase(savedCountdownIso ? new Date(savedCountdownIso) : null);
    const refreshedStatusSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: [
            'registration_operating_hours',
            'registration_closed_message',
            'maintenance_enabled',
            'maintenance_type',
            'maintenance_title',
            'maintenance_message',
            'maintenance_expected_end'
          ]
        }
      }
    });
    const getStatusSetting = (key: string) => refreshedStatusSettings.find(setting => setting.key === key)?.value || '';
    return res.status(200).json({
      status: 'success',
      message: 'Pengaturan tanggal countdown event berhasil diperbarui.',
      data: {
        eventCountdownDate: savedCountdownIso,
        manualRegistrationClosed,
        isRegistrationClosed: manualRegistrationClosed || timerPhase !== 'UPCOMING',
        registrationPhase: timerPhase === 'UPCOMING' && manualRegistrationClosed
          ? 'CLOSED'
          : timerPhase,
        eventTitle: eventTitle || 'Tegal Run 2027',
        registrationOperatingHours: getStatusSetting('registration_operating_hours'),
        registrationClosedMessage: getStatusSetting('registration_closed_message'),
        maintenanceEnabled: getStatusSetting('maintenance_enabled') === 'true',
        maintenanceType: getStatusSetting('maintenance_type') || 'REPAIR',
        maintenanceTitle: getStatusSetting('maintenance_title'),
        maintenanceMessage: getStatusSetting('maintenance_message'),
        maintenanceExpectedEnd: getStatusSetting('maintenance_expected_end') || null,
      }
    });
  } catch (error: any) {
    console.error('🚨 [UPDATE SETTINGS ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui pengaturan tanggal event. Periksa koneksi database lalu coba kembali.'
    });
  }
};

/**
 * Memperbarui pengaturan konten website CMS secara lengkap (Admin Only)
 */
export const updateWebsiteSettings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return res.status(400).json({
        status: 'error',
        message: 'Payload pengaturan tidak valid.'
      });
    }

    const permissions = req.admin?.permissions || [];
    const canManageCms = req.admin?.roleName === 'SUPERADMIN' ||
      permissions.includes('cms:manage') ||
      permissions.includes('cms:*');
    const routeOnly = !canManageCms;
    const routeKeys = [
      'route_badge_label',
      'route_title',
      'route_desc',
      'route_gpx_url',
      'route_map_mode',
      'route_checkpoint_mode',
      'route_gmaps_url',
      'route_map_image',
      'route_checkpoint_image',
    ];
    if (routeOnly) {
      const allowedRouteKeys = new Set(routeKeys);
      const unsupportedKeys = Object.keys(payload).filter(key => !allowedRouteKeys.has(key));
      if (unsupportedKeys.length > 0) {
        return res.status(403).json({
          status: 'error',
          message: 'Akses rute hanya dapat mengubah pengaturan rute, bukan seluruh konten CMS.'
        });
      }
    }

    const navbarIconOptions = [
      'fa-person-running', 'fa-medal', 'fa-trophy', 'fa-flag-checkered', 'fa-bolt',
      'fa-fire', 'fa-star', 'fa-mountain-sun', 'fa-shoe-prints', 'fa-heart-pulse',
      'fa-stopwatch', 'fa-award', 'fa-dumbbell', 'fa-route', 'fa-location-dot',
      'fa-sun', 'fa-water', 'fa-compass', 'fa-crown', 'fa-leaf'
    ] as const;
    const navbarSettingsSchema = z.object({
      navbar_title: z.string().trim().max(80, 'Judul navbar maksimal 80 karakter.').optional(),
      navbar_icon_mode: z.enum(['ICON', 'IMAGE']).optional(),
      navbar_icon: z.enum(navbarIconOptions).optional(),
      navbar_icon_url: z.string().max(2048).refine((value) => {
        if (!value) return true;
        try {
          return ['http:', 'https:'].includes(new URL(value).protocol);
        } catch {
          return false;
        }
      }, 'URL ikon navbar harus menggunakan http:// atau https://.').optional(),
      favicon_url: z.string().max(2048).refine((value) => {
        if (!value) return true;
        try {
          return ['http:', 'https:'].includes(new URL(value).protocol);
        } catch {
          return false;
        }
      }, 'URL favicon harus menggunakan http:// atau https://.').optional()
    }).superRefine((settings, context) => {
      if (settings.navbar_icon_mode === 'IMAGE' && !settings.navbar_icon_url?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['navbar_icon_url'],
          message: 'URL gambar ikon wajib diisi saat mode link gambar dipilih.'
        });
      }
    }).safeParse(payload);
    if (!navbarSettingsSchema.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Pengaturan navbar tidak valid.',
        errors: navbarSettingsSchema.error.errors.map(error => ({
          field: error.path.join('.'),
          message: error.message
        }))
      });
    }

    const settingsPayload: Record<string, unknown> = { ...payload, ...navbarSettingsSchema.data };

    const comingSoonSettingsSchema = z.object({
      coming_soon_title: z.string().trim().min(1).max(100).optional(),
      coming_soon_message: z.string().trim().max(500).optional(),
      coming_soon_image_url: z.string().max(2048).refine(value => {
        if (!value) return true;
        try {
          return ['http:', 'https:'].includes(new URL(value).protocol);
        } catch {
          return false;
        }
      }, 'URL gambar Coming Soon harus menggunakan http:// atau https://.').optional(),
    }).safeParse(payload);
    if (!comingSoonSettingsSchema.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Pengaturan Coming Soon tidak valid.',
        errors: comingSoonSettingsSchema.error.errors.map(error => ({
          field: error.path.join('.'),
          message: error.message
        }))
      });
    }
    Object.assign(settingsPayload, comingSoonSettingsSchema.data);

    const legalContentSchema = z.object({
      legal_badge_label: z.string().trim().max(80).optional(),
      legal_title: z.string().trim().max(160).optional(),
      legal_desc: z.string().trim().max(2000).optional(),
      legal_privacy_button: z.string().trim().max(120).optional(),
      legal_terms_button: z.string().trim().max(120).optional(),
      privacy_modal_title: z.string().trim().max(160).optional(),
      privacy_modal_subtitle: z.string().trim().max(240).optional(),
      privacy_modal_content: z.string().max(12000).optional(),
      terms_modal_title: z.string().trim().max(160).optional(),
      terms_modal_subtitle: z.string().trim().max(240).optional(),
      terms_modal_content: z.string().max(12000).optional(),
      medal_image: z.string().max(2048).refine(value => {
        if (!value.trim()) return true;
        try {
          return ['http:', 'https:'].includes(new URL(value).protocol);
        } catch {
          return false;
        }
      }, 'URL gambar kategori tiket harus menggunakan http:// atau https://.').optional(),
      medal_preview_image: z.string().max(2048).refine(value => {
        if (!value.trim()) return true;
        try {
          return ['http:', 'https:'].includes(new URL(value).protocol);
        } catch {
          return false;
        }
      }, 'URL gambar kategori tiket harus menggunakan http:// atau https://.').optional(),
    }).safeParse(payload);
    if (!legalContentSchema.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Pengaturan konten legal tidak valid.',
        errors: legalContentSchema.error.errors.map(error => ({
          field: error.path.join('.'),
          message: error.message
        }))
      });
    }
    Object.assign(settingsPayload, legalContentSchema.data);

    const routeSettingsSchema = z.object({
      route_badge_label: z.string().max(80).optional(),
      route_title: z.string().max(120).optional(),
      route_desc: z.string().max(3000).optional(),
      route_gpx_url: z.string().max(2048).optional(),
      route_map_mode: z.enum(['GMAPS', 'IMAGE']).optional(),
      route_checkpoint_mode: z.enum(['MANUAL', 'IMAGE']).optional(),
      route_gmaps_url: z.string().max(2048).optional(),
      route_map_image: z.string().max(2048).optional(),
      route_checkpoint_image: z.string().max(2048).optional(),
    }).superRefine((settings, context) => {
      const isHttpUrlOrEmpty = (value: string | undefined) => {
        if (!value) return true;
        try {
          return ['http:', 'https:'].includes(new URL(value).protocol);
        } catch {
          return false;
        }
      };
      if (settings.route_gpx_url && settings.route_gpx_url !== '#' && !isHttpUrlOrEmpty(settings.route_gpx_url)) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['route_gpx_url'], message: 'Link file GPX harus menggunakan http:// atau https://.' });
      }
      if (settings.route_gmaps_url && !isHttpUrlOrEmpty(settings.route_gmaps_url)) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['route_gmaps_url'], message: 'Link Google Maps harus menggunakan http:// atau https://.' });
      }
      if (settings.route_map_image !== undefined && !isHttpUrlOrEmpty(settings.route_map_image)) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['route_map_image'], message: 'URL gambar peta harus menggunakan http:// atau https://.' });
      }
      if (settings.route_checkpoint_image !== undefined && !isHttpUrlOrEmpty(settings.route_checkpoint_image)) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['route_checkpoint_image'], message: 'URL gambar checkpoint harus menggunakan http:// atau https://.' });
      }
      if (settings.route_map_mode === 'IMAGE' && !settings.route_map_image?.trim()) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['route_map_image'], message: 'URL gambar peta wajib diisi untuk mode gambar.' });
      }
      if (settings.route_map_mode === 'GMAPS' && !settings.route_gmaps_url?.trim()) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['route_gmaps_url'], message: 'Link Google Maps wajib diisi untuk mode peta.' });
      }
      if (settings.route_checkpoint_mode === 'IMAGE' && !settings.route_checkpoint_image?.trim()) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['route_checkpoint_image'], message: 'URL gambar checkpoint wajib diisi untuk mode gambar.' });
      }
    }).safeParse(payload);
    if (!routeSettingsSchema.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Pengaturan tampilan rute tidak valid.',
        errors: routeSettingsSchema.error.errors.map(error => ({
          field: error.path.join('.'),
          message: error.message
        }))
      });
    }

    if (payload.faq_items !== undefined) {
      let faqItems: unknown = payload.faq_items;
      if (typeof faqItems === 'string') {
        try {
          faqItems = JSON.parse(faqItems);
        } catch {
          return res.status(400).json({ status: 'error', message: 'Data FAQ harus berupa JSON yang valid.' });
        }
      }
      const faqResult = z.array(z.object({
        question: z.string().trim().min(1).max(240),
        answer: z.string().trim().min(1).max(3000),
        enabled: z.boolean()
      })).max(50).safeParse(faqItems);
      if (!faqResult.success) {
        return res.status(400).json({
          status: 'error',
          message: 'Data FAQ tidak valid.',
          errors: faqResult.error.errors.map(error => ({
            field: error.path.join('.'),
            message: error.message
          }))
        });
      }
      settingsPayload.faq_items = JSON.stringify(faqResult.data);
    }

    // Bersihkan link Google Maps jika admin mem-paste tag <iframe> lengkap
    const cleanGmaps = (raw: string) => {
      const match = raw.match(/src=["'](.*?)["']/);
      return (match && match[1]) ? match[1] : raw.trim();
    };

    if (settingsPayload.gmaps_embed_url && typeof settingsPayload.gmaps_embed_url === 'string') {
      settingsPayload.gmaps_embed_url = cleanGmaps(settingsPayload.gmaps_embed_url);
      settingsPayload.route_gmaps_url = settingsPayload.gmaps_embed_url;
    } else if (typeof settingsPayload.route_gmaps_url === 'string') {
      settingsPayload.route_gmaps_url = cleanGmaps(settingsPayload.route_gmaps_url);
      settingsPayload.gmaps_embed_url = settingsPayload.route_gmaps_url;
    }

    if (settingsPayload.medal_preview_image && !settingsPayload.medal_image) {
      settingsPayload.medal_image = settingsPayload.medal_preview_image;
    } else if (settingsPayload.medal_image && !settingsPayload.medal_preview_image) {
      settingsPayload.medal_preview_image = settingsPayload.medal_image;
    }

    // Simpan semua entri setting
    const updatePromises = Object.entries(settingsPayload).map(([key, val]) => {
      const stringVal = typeof val === 'string' ? val : JSON.stringify(val);
      return prisma.appSetting.upsert({
        where: { key },
        update: { value: stringVal },
        create: { key, value: stringVal, description: `Pengaturan CMS untuk ${key}` }
      });
    });

    await Promise.all(updatePromises);

    // Catat ke audit log
    await prisma.log.create({
      data: {
        action: 'CMS_UPDATE',
        description: 'Admin memperbarui seluruh konten tampilan website, Google Maps, dan gambar banner.',
        adminId: req.admin?.adminId,
        entityType: 'AppSetting',
        entityId: 'WEBSITE_SETTINGS'
      }
    }).catch(() => null);

    // Ambil setting terbaru
    const dbSettings = await prisma.appSetting.findMany();
    const settingsMap: Record<string, string> = { ...DEFAULT_WEBSITE_SETTINGS };
    dbSettings.forEach(item => { settingsMap[item.key] = item.value; });
    const responseSettings = routeOnly
      ? Object.fromEntries(routeKeys.map(key => [key, settingsMap[key] || '']))
      : settingsMap;

    return res.status(200).json({
      status: 'success',
      message: 'Seluruh konten dan gambar website berhasil disimpan ke database.',
      data: responseSettings
    });
  } catch (error: any) {
    console.error('🚨 [UPDATE CMS ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui konten website.'
    });
  }
};
