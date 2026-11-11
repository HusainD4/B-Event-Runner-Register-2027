import type { Request, Response } from 'express';
import prisma from '../config/database';
import type { AuthenticatedRequest } from '../middlewares/auth';
import { z } from 'zod';

const DEFAULT_EVENT_DATE = '2027-02-28T06:00:00.000Z';

export const DEFAULT_WEBSITE_SETTINGS: Record<string, string> = {
  // Website Identity & Hero
  site_title: "Tegal Run 2027 - Official Half Marathon & 5K Festival",
  site_tagline: "Lari Bersama Menembus Batas di Kota Bahari",
  hero_badge: "🔥 PENDAFTARAN RESMI DIBUKA",
  hero_title: "Tegal Run 2027: Lari Bersama Menembus Batas",
  hero_subtitle: "Kompetisi lari terbesar di Kota Bahari dengan standar race profesional, timing chip akurat, dan medali finisher eksklusif.",
  hero_bg_image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1920&q=80",

  // Rute & Google Maps
  route_title: "Rute Lari Resmi & Titik Kumpul",
  route_desc: "Jalur datar beraspal mulus melintasi landmark bersejarah Kota Tegal dengan pemandangan pesisir utara dan pengawalan lalu lintas steril.",
  gmaps_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.042735759714!2d109.13658237587522!3d-6.885483267375218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb9b95952db7d%3A0xe54d6fbbece0f07b!2sAlun-Alun%20Kota%20Tegal!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
  route_gmaps_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.042735759714!2d109.13658237587522!3d-6.885483267375218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb9b95952db7d%3A0xe54d6fbbece0f07b!2sAlun-Alun%20Kota%20Tegal!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
  route_map_image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80",

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
  stat_1_val: "2,500+",
  stat_1_unit: "Pelari Terdaftar",
  stat_1_desc: "Antusiasme komunitas nasional",
  stat_2_val: "2",
  stat_2_unit: "Kategori Utama",
  stat_2_desc: "Half Marathon 10K & Fun Run 5K",
  stat_3_val: "100%",
  stat_3_unit: "Steril & Aman",
  stat_3_desc: "Pengawalan Dishub & Polresta",
  stat_4_val: "Rp 75Jt",
  stat_4_unit: "Total Hadiah & Doorprize",
  stat_4_desc: "Podium juara & ratusan hadiah menarik",

  // File rute
  route_gpx_url: "#",

  // Legal & Perizinan
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

  // Countdown & Registrasi
  EVENT_COUNTDOWN_DATE: DEFAULT_EVENT_DATE,
  IS_REGISTRATION_CLOSED: "false",
  EVENT_TITLE: "Tegal Run 2027"
};

/**
 * Mengambil pengaturan global countdown & status pendaftaran (Public)
 */
export const getPublicCountdownSettings = async (req: Request, res: Response): Promise<any> => {
  try {
    const [dateSetting, closedSetting, titleSetting] = await Promise.all([
      prisma.appSetting.findFirst({
        where: { key: { in: ['EVENT_COUNTDOWN_DATE', 'event_countdown_date'] } }
      }),
      prisma.appSetting.findFirst({
        where: { key: { in: ['IS_REGISTRATION_CLOSED', 'event_registration_closed'] } }
      }),
      prisma.appSetting.findFirst({
        where: { key: { in: ['EVENT_TITLE', 'event_title'] } }
      }),
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        eventCountdownDate: dateSetting ? dateSetting.value : DEFAULT_EVENT_DATE,
        isRegistrationClosed: closedSetting ? closedSetting.value === 'true' : false,
        eventTitle: titleSetting ? titleSetting.value : ''
      }
    });
  } catch (error) {
    console.error('🚨 [GET SETTINGS ERROR]:', error);
    return res.status(200).json({
      status: 'success',
      data: {
        eventCountdownDate: null,
        isRegistrationClosed: false,
        eventTitle: ''
      }
    });
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
      },
    });
  } catch (error) {
    return res.status(200).json({
      status: 'success',
      data: {
        paymentTimerMinutes: 30,
        feeEnabled: true,
        feeType: 'PER_TRANSACTION',
        feeAmount: 0,
      },
    });
  }
};

/**
 * Mengambil seluruh pengaturan konten website CMS (Public)
 */
export const getWebsiteSettings = async (req: Request, res: Response): Promise<any> => {
  try {
    const dbSettings = await prisma.appSetting.findMany();
    const settingsMap: Record<string, string> = { ...DEFAULT_WEBSITE_SETTINGS };

    dbSettings.forEach((item) => {
      settingsMap[item.key] = item.value;
    });

    return res.status(200).json({
      status: 'success',
      data: settingsMap
    });
  } catch (error) {
    console.error('🚨 [GET WEBSITE SETTINGS ERROR]:', error);
    return res.status(200).json({
      status: 'success',
      data: { ...DEFAULT_WEBSITE_SETTINGS }
    });
  }
};

const updateCountdownSchema = z.object({
  eventCountdownDate: z.string().nullable().optional(),
  isRegistrationClosed: z.boolean().optional(),
  eventTitle: z.string().optional()
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

    const { eventCountdownDate, isRegistrationClosed, eventTitle } = parseResult.data;

    let savedCountdownIso: string | null = null;
    // Simpan atau Kosongkan Tanggal Countdown
    if (!eventCountdownDate || eventCountdownDate.trim() === '') {
      await prisma.appSetting.deleteMany({
        where: { key: { in: ['EVENT_COUNTDOWN_DATE', 'event_countdown_date'] } }
      });
    } else {
      const parsedDate = new Date(eventCountdownDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          status: 'error',
          message: 'Format tanggal countdown tidak valid.'
        });
      }
      savedCountdownIso = parsedDate.toISOString();
      await Promise.all([
        prisma.appSetting.upsert({
          where: { key: 'EVENT_COUNTDOWN_DATE' },
          update: { value: savedCountdownIso, description: 'Target tanggal hitung mundur utama event di landing page' },
          create: { key: 'EVENT_COUNTDOWN_DATE', value: savedCountdownIso, description: 'Target tanggal hitung mundur utama event di landing page' }
        }),
        prisma.appSetting.upsert({
          where: { key: 'event_countdown_date' },
          update: { value: savedCountdownIso, description: 'Target tanggal hitung mundur utama event di landing page' },
          create: { key: 'event_countdown_date', value: savedCountdownIso, description: 'Target tanggal hitung mundur utama event di landing page' }
        })
      ]);
    }

    // Simpan Status Tutup Pendaftaran jika disertakan
    if (isRegistrationClosed !== undefined) {
      await Promise.all([
        prisma.appSetting.upsert({
          where: { key: 'IS_REGISTRATION_CLOSED' },
          update: { value: String(isRegistrationClosed), description: 'Status penutupan pendaftaran event secara global' },
          create: { key: 'IS_REGISTRATION_CLOSED', value: String(isRegistrationClosed), description: 'Status penutupan pendaftaran event secara global' }
        }),
        prisma.appSetting.upsert({
          where: { key: 'event_registration_closed' },
          update: { value: String(isRegistrationClosed), description: 'Status penutupan pendaftaran event secara global' },
          create: { key: 'event_registration_closed', value: String(isRegistrationClosed), description: 'Status penutupan pendaftaran event secara global' }
        })
      ]);
    }

    // Simpan Judul Event jika disertakan
    if (eventTitle !== undefined) {
      await prisma.appSetting.upsert({
        where: { key: 'EVENT_TITLE' },
        update: { value: eventTitle },
        create: { key: 'EVENT_TITLE', value: eventTitle, description: 'Judul resmi event' }
      });
    }

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

    return res.status(200).json({
      status: 'success',
      message: 'Pengaturan tanggal countdown event berhasil diperbarui.',
      data: {
        eventCountdownDate: savedCountdownIso,
        isRegistrationClosed: isRegistrationClosed ?? false,
        eventTitle: eventTitle || 'Tegal Run 2027'
      }
    });
  } catch (error: any) {
    console.error('🚨 [UPDATE SETTINGS ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui pengaturan tanggal event.'
    });
  }
};

/**
 * Memperbarui pengaturan konten website CMS secara lengkap (Admin Only)
 */
export const updateWebsiteSettings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({
        status: 'error',
        message: 'Payload pengaturan tidak valid.'
      });
    }

    // Bersihkan link Google Maps jika admin mem-paste tag <iframe> lengkap
    const cleanGmaps = (raw: string) => {
      const match = raw.match(/src=["'](.*?)["']/);
      return (match && match[1]) ? match[1] : raw.trim();
    };

    if (payload.gmaps_embed_url && typeof payload.gmaps_embed_url === 'string') {
      payload.gmaps_embed_url = cleanGmaps(payload.gmaps_embed_url);
      payload.route_gmaps_url = payload.gmaps_embed_url;
    } else if (typeof payload.route_gmaps_url === 'string') {
      payload.route_gmaps_url = cleanGmaps(payload.route_gmaps_url);
      payload.gmaps_embed_url = payload.route_gmaps_url;
    }

    if (payload.medal_preview_image && !payload.medal_image) {
      payload.medal_image = payload.medal_preview_image;
    } else if (payload.medal_image && !payload.medal_preview_image) {
      payload.medal_preview_image = payload.medal_image;
    }

    // Simpan semua entri setting
    const updatePromises = Object.entries(payload).map(([key, val]) => {
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

    return res.status(200).json({
      status: 'success',
      message: 'Seluruh konten dan gambar website berhasil disimpan ke database.',
      data: settingsMap
    });
  } catch (error: any) {
    console.error('🚨 [UPDATE CMS ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui konten website.'
    });
  }
};
