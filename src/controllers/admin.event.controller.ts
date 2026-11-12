import type { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import type { AuthenticatedRequest } from '../middlewares/auth';
import { getEventRegistrationStatus } from '../utils/event-timing';

const jerseyBannerImagesSchema = z.array(z.string().url().refine(value => {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
})).max(5, 'Maksimal 5 banner gambar jersey')
  .transform(images => [...new Set(images)]);

const createEventSchema = z.object({
  ticketName: z.string().min(3, 'Nama tiket minimal 3 karakter'),
  category: z.string().min(2, 'Kategori minimal 2 karakter'),
  stock: z.number().int().positive('Stok harus bilangan bulat positif'),
  price: z.number().nonnegative('Harga tidak boleh negatif'),
  ticketImage: z.string().url('URL gambar tiket tidak valid').nullable().optional(),
  medalImage: z.string().url('URL gambar medali tidak valid').nullable().optional(),
  eventDate: z.string().datetime().nullable().optional().or(z.string().nullable().optional()),
  followGlobalTimer: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  benefits: z.array(z.object({
    name: z.string().min(2),
    description: z.string().min(2),
    image: z.string().url().nullable().optional(),
  })).optional(),
  jerseys: z.array(z.object({
    name: z.string().min(2),
    type: z.string().min(2),
    sizes: z.array(z.string()).min(1),
    image: z.string().url().nullable().optional(),
    bannerImages: jerseyBannerImagesSchema.optional(),
  })).optional(),
  bibConfig: z.object({
    prefix: z.string().min(1),
    digitLength: z.number().int().min(1).max(8).default(4),
    startNumber: z.number().int().min(1).default(1),
    suffix: z.string().nullable().optional(),
  }).optional(),
});

const updateEventSchema = z.object({
  ticketName: z.string().min(3).optional(),
  category: z.string().min(2).optional(),
  stock: z.number().int().nonnegative().optional(),
  price: z.number().nonnegative().optional(),
  ticketImage: z.string().url().nullable().optional(),
  medalImage: z.string().url().nullable().optional(),
  eventDate: z.string().nullable().optional(),
  followGlobalTimer: z.boolean().optional(),
  isClosed: z.boolean().optional(),
});

const benefitSchema = z.object({
  name: z.string().min(2, 'Nama benefit minimal 2 karakter'),
  description: z.string().min(2, 'Deskripsi benefit minimal 2 karakter'),
  image: z.string().url().nullable().optional(),
});

const jerseySchema = z.object({
  name: z.string().trim().min(2, 'Nama jersey minimal 2 karakter'),
  type: z.string().trim().min(2, 'Tipe jersey minimal 2 karakter'),
  sizes: z.array(z.string().trim().min(1).max(24)).min(1, 'Minimal satu pilihan ukuran').max(20),
  image: z.string().url().refine(value => {
    try {
      return ['http:', 'https:'].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }).nullable().optional(),
  bannerImages: jerseyBannerImagesSchema.optional(),
  eventId: z.string().uuid('Event ID tidak valid').optional(),
});

const bibConfigSchema = z.object({
  prefix: z.string().min(1, 'Prefix BIB wajib diisi'),
  digitLength: z.number().int().min(1).max(8).default(4),
  startNumber: z.number().int().min(1).default(1),
  suffix: z.string().nullable().optional(),
});

async function getGlobalCountdownDate(): Promise<Date | null> {
  const settings = await prisma.appSetting.findMany({
    where: { key: { in: ['EVENT_COUNTDOWN_DATE', 'event_countdown_date'] } },
    select: { key: true, value: true }
  });
  const setting = settings.find(item => item.key === 'EVENT_COUNTDOWN_DATE')
    || settings.find(item => item.key === 'event_countdown_date');
  if (!setting?.value) return null;
  const date = new Date(setting.value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// ==========================================
// 1. EVENT CRUD
// ==========================================

export const getAdminEvents = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const events: any[] = await prisma.event.findMany({
      include: {
        benefits: true,
        jerseys: true,
        bibConfig: true,
        _count: {
          select: { participants: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = events.map((event) => ({
      ...event,
      ...getEventRegistrationStatus(event.eventDate, event.isClosed),
      price: Number(event.price),
      registeredCount: event._count?.participants || 0,
      remainingStock: Math.max(0, event.stock),
    }));

    return res.status(200).json({ status: 'success', data: formatted });
  } catch (error) {
    console.error('🚨 [GET ADMIN EVENTS ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil daftar event.' });
  }
};

export const getAdminEventById = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const event: any = await prisma.event.findUnique({
      where: { id },
      include: {
        benefits: true,
        jerseys: true,
        bibConfig: true,
        _count: { select: { participants: true } },
      },
    });

    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event tidak ditemukan.' });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        ...event,
        ...getEventRegistrationStatus(event.eventDate, event.isClosed),
        price: Number(event.price),
        registeredCount: event._count?.participants || 0,
        remainingStock: Math.max(0, event.stock),
      },
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil detail event.' });
  }
};

export const createEvent = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const parseResult = createEventSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi data event gagal.',
        errors: parseResult.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const {
      ticketName, category, stock, price, ticketImage, medalImage, benefits, jerseys, bibConfig,
      eventDate, followGlobalTimer = false
    } = parseResult.data;
    const globalCountdownDate = followGlobalTimer ? await getGlobalCountdownDate() : null;
    if (followGlobalTimer && !globalCountdownDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Tanggal countdown acara belum diatur. Atur timer terlebih dahulu sebelum mengaktifkan ikuti timer.'
      });
    }

    const newEvent = await prisma.event.create({
      data: {
        ticketName,
        category,
        stock,
        price,
        ticketImage: ticketImage || null,
        medalImage: medalImage || null,
        eventDate: followGlobalTimer ? globalCountdownDate : (eventDate ? new Date(eventDate) : null),
        followGlobalTimer,
        benefits: benefits && benefits.length > 0 ? { create: benefits } : undefined,
        jerseys: jerseys && jerseys.length > 0 ? { create: jerseys } : undefined,
        bibConfig: bibConfig ? { create: bibConfig } : undefined,
      },
      include: {
        benefits: true,
        jerseys: true,
        bibConfig: true,
      },
    });

    await prisma.log.create({
      data: {
        action: 'EVENT_CREATE',
        description: `Admin membuat event baru: ${newEvent.ticketName}`,
        adminId: req.admin?.adminId,
        entityType: 'Event',
        entityId: newEvent.id,
      },
    }).catch(() => null);

    return res.status(201).json({
      status: 'success',
      message: 'Event berhasil dibuat.',
      data: { ...newEvent, price: Number(newEvent.price) },
    });
  } catch (error) {
    console.error('🚨 [CREATE EVENT ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal membuat event baru.' });
  }
};

export const updateEvent = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const parseResult = updateEventSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi data event gagal.',
        errors: parseResult.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Event tidak ditemukan.' });
    }

    const updateData: any = { ...parseResult.data };
    if (updateData.followGlobalTimer === true) {
      const globalCountdownDate = await getGlobalCountdownDate();
      if (!globalCountdownDate && !existing.followGlobalTimer) {
        return res.status(400).json({
          status: 'error',
          message: 'Tanggal countdown acara belum diatur. Atur timer terlebih dahulu sebelum mengaktifkan ikuti timer.'
        });
      }
      updateData.eventDate = globalCountdownDate;
    } else if (updateData.eventDate !== undefined) {
      updateData.eventDate = updateData.eventDate ? new Date(updateData.eventDate) : null;
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
      include: { benefits: true, jerseys: true, bibConfig: true },
    });

    await prisma.log.create({
      data: {
        action: 'EVENT_UPDATE',
        description: `Admin memperbarui event: ${updatedEvent.ticketName}`,
        adminId: req.admin?.adminId,
        entityType: 'Event',
        entityId: updatedEvent.id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: 'Event berhasil diperbarui.',
      data: {
        ...updatedEvent,
        ...getEventRegistrationStatus(updatedEvent.eventDate, updatedEvent.isClosed),
        price: Number(updatedEvent.price),
      },
    });
  } catch (error) {
    console.error('🚨 [UPDATE EVENT ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal memperbarui event.' });
  }
};

export const deleteEvent = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;

    const event: any = await prisma.event.findUnique({
      where: { id },
      include: { _count: { select: { participants: true } } },
    });

    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event tidak ditemukan.' });
    }

    if (event._count?.participants > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Tidak dapat menghapus event karena sudah ada ${event._count.participants} peserta yang terdaftar.`,
      });
    }

    await prisma.event.delete({ where: { id } });

    await prisma.log.create({
      data: {
        action: 'EVENT_DELETE',
        description: `Admin menghapus event: ${event.ticketName}`,
        adminId: req.admin?.adminId,
        entityType: 'Event',
        entityId: id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: `Event '${event.ticketName}' berhasil dihapus.`,
    });
  } catch (error) {
    console.error('🚨 [DELETE EVENT ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal menghapus event.' });
  }
};

// ==========================================
// 2. BENEFIT & JERSEY CRUD
// ==========================================

export const getEventBenefits = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const eventId = req.params.eventId as string;
    const benefits = await prisma.eventBenefit.findMany({
      where: { eventId },
      orderBy: { name: 'asc' },
    });
    return res.status(200).json({ status: 'success', data: benefits });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil benefit event.' });
  }
};

export const addEventBenefit = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const eventId = req.params.eventId as string;
    const parseResult = benefitSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi gagal.',
        errors: parseResult.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const eventExists = await prisma.event.findUnique({ where: { id: eventId } });
    if (!eventExists) {
      return res.status(404).json({ status: 'error', message: 'Event tidak ditemukan.' });
    }

    const benefit = await prisma.eventBenefit.create({
      data: {
        eventId,
        ...parseResult.data,
      },
    });

    return res.status(201).json({ status: 'success', message: 'Benefit berhasil ditambahkan.', data: benefit });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal menambahkan benefit.' });
  }
};

export const updateEventBenefit = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const parseResult = benefitSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ status: 'error', message: 'Validasi gagal.' });
    }

    const updated = await prisma.eventBenefit.update({
      where: { id },
      data: parseResult.data,
    });

    return res.status(200).json({ status: 'success', message: 'Benefit berhasil diubah.', data: updated });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengubah benefit.' });
  }
};

export const deleteEventBenefit = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    await prisma.eventBenefit.delete({ where: { id } });
    return res.status(200).json({ status: 'success', message: 'Benefit berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal menghapus benefit.' });
  }
};

export const getAllJerseys = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const jerseys = await prisma.jersey.findMany({
      include: { event: { select: { id: true, ticketName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ status: 'success', data: jerseys });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil data jersey.' });
  }
};

export const createJersey = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const parseResult = jerseySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ status: 'error', message: 'Validasi jersey gagal.' });
    }

    const { eventId, name, type, sizes, image, bannerImages = [] } = parseResult.data;
    if (!eventId) {
      return res.status(400).json({ status: 'error', message: 'Event ID wajib disertakan.' });
    }
    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true } });
    if (!event) return res.status(404).json({ status: 'error', message: 'Kategori event tidak ditemukan.' });

    const jersey = await prisma.jersey.create({
      data: {
        eventId,
        name: name.trim(),
        type: type.trim(),
        sizes: [...new Set(sizes.map(size => size.trim()))],
        image: image || null,
        bannerImages: [...new Set(bannerImages)],
      },
    });

    await prisma.log.create({
      data: {
        action: 'JERSEY_CREATE',
        description: `Admin menambahkan jersey "${jersey.name}" (${jersey.type}).`,
        adminId: req.admin?.adminId,
        entityType: 'Jersey',
        entityId: jersey.id,
      },
    }).catch(() => null);
    return res.status(201).json({ status: 'success', message: 'Jersey berhasil dibuat.', data: jersey });
  } catch (error) {
    console.error('🚨 [CREATE JERSEY ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal membuat jersey.' });
  }
};

export const updateJersey = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const parseResult = jerseySchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ status: 'error', message: 'Validasi jersey gagal.' });
    }

    const updateData = {
      ...parseResult.data,
      ...(parseResult.data.name !== undefined ? { name: parseResult.data.name.trim() } : {}),
      ...(parseResult.data.type !== undefined ? { type: parseResult.data.type.trim() } : {}),
      ...(parseResult.data.sizes !== undefined ? { sizes: [...new Set(parseResult.data.sizes.map(size => size.trim()))] } : {}),
    };
    const existing = await prisma.jersey.findUnique({ where: { id }, select: { id: true, eventId: true } });
    if (!existing) return res.status(404).json({ status: 'error', message: 'Jersey tidak ditemukan.' });
    if (updateData.eventId && !await prisma.event.findUnique({ where: { id: updateData.eventId }, select: { id: true } })) {
      return res.status(404).json({ status: 'error', message: 'Kategori event tidak ditemukan.' });
    }
    if (updateData.eventId && updateData.eventId !== existing.eventId) {
      const participantCount = await prisma.participant.count({ where: { jerseyId: id } });
      if (participantCount > 0) {
        return res.status(409).json({
          status: 'error',
          message: 'Jersey sudah dipilih peserta dan tidak dapat dipindahkan ke kategori lain.',
        });
      }
    }

    const updated = await prisma.jersey.update({
      where: { id },
      data: updateData,
    });

    await prisma.log.create({
      data: {
        action: 'JERSEY_UPDATE',
        description: `Admin memperbarui jersey "${updated.name}" (${updated.type}).`,
        adminId: req.admin?.adminId,
        entityType: 'Jersey',
        entityId: updated.id,
      },
    }).catch(() => null);
    return res.status(200).json({ status: 'success', message: 'Jersey berhasil diperbarui.', data: updated });
  } catch (error) {
    console.error('🚨 [UPDATE JERSEY ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal memperbarui jersey.' });
  }
};

export const deleteJersey = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const participantCount = await prisma.participant.count({ where: { jerseyId: id } });
    if (participantCount > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'Jersey sudah dipilih peserta dan tidak dapat dihapus. Nonaktifkan atau ubah detail jersey agar data peserta tetap utuh.',
      });
    }
    const jersey = await prisma.jersey.findUnique({ where: { id }, select: { id: true, name: true, type: true } });
    if (!jersey) return res.status(404).json({ status: 'error', message: 'Jersey tidak ditemukan.' });
    await prisma.jersey.delete({ where: { id } });
    await prisma.log.create({
      data: {
        action: 'JERSEY_DELETE',
        description: `Admin menghapus jersey "${jersey.name}" (${jersey.type}).`,
        adminId: req.admin?.adminId,
        entityType: 'Jersey',
        entityId: jersey.id,
      },
    }).catch(() => null);
    return res.status(200).json({ status: 'success', message: 'Jersey berhasil dihapus.' });
  } catch (error) {
    console.error('🚨 [DELETE JERSEY ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal menghapus jersey.' });
  }
};

// ==========================================
// 3. BIB CONFIGURATION
// ==========================================

export const getBibConfig = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const eventId = req.params.eventId as string;
    const config = await prisma.bibConfiguration.findUnique({
      where: { eventId },
      include: { event: { select: { ticketName: true } } },
    });

    if (!config) {
      return res.status(404).json({ status: 'error', message: 'Konfigurasi BIB untuk event ini belum diset.' });
    }

    return res.status(200).json({ status: 'success', data: config });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil konfigurasi BIB.' });
  }
};

export const saveBibConfig = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const eventId = req.params.eventId as string;
    const parseResult = bibConfigSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi konfigurasi BIB gagal.',
        errors: parseResult.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const { prefix, digitLength, startNumber, suffix } = parseResult.data;

    const config = await prisma.bibConfiguration.upsert({
      where: { eventId },
      update: { prefix, digitLength, startNumber, suffix: suffix || null },
      create: { eventId, prefix, digitLength, startNumber, suffix: suffix || null },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Konfigurasi format nomor BIB berhasil disimpan.',
      data: config,
    });
  } catch (error) {
    console.error('🚨 [SAVE BIB CONFIG ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal menyimpan konfigurasi BIB.' });
  }
};
