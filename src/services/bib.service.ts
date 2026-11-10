import prisma from '../config/database';

export type BibGenerationTiming = 'PAYMENT_SUCCESS' | 'RACEPACK_CHECKIN' | 'MANUAL';

export interface BibSettings {
  timing: BibGenerationTiming;
  defaultPrefix: string;
  digitLength: number;
  startNumber: number;
  suffix: string;
}

const DEFAULT_BIB_SETTINGS: BibSettings = {
  timing: 'PAYMENT_SUCCESS',
  defaultPrefix: '10-',
  digitLength: 4,
  startNumber: 1001,
  suffix: '',
};

/**
 * Ambil konfigurasi global penomoran BIB dari AppSetting
 */
export async function getGlobalBibSettings(): Promise<BibSettings> {
  try {
    const setting = await prisma.appSetting.findUnique({
      where: { key: 'bib_generation_settings' },
    });
    if (setting && setting.value) {
      const parsed = JSON.parse(setting.value);
      return {
        ...DEFAULT_BIB_SETTINGS,
        ...parsed,
      };
    }
  } catch (err) {
    console.warn('Gagal membaca bib_generation_settings:', err);
  }
  return DEFAULT_BIB_SETTINGS;
}

/**
 * Simpan konfigurasi global penomoran BIB ke AppSetting
 */
export async function saveGlobalBibSettings(settings: Partial<BibSettings>): Promise<BibSettings> {
  const current = await getGlobalBibSettings();
  const updated: BibSettings = {
    timing: settings.timing || current.timing,
    defaultPrefix: settings.defaultPrefix !== undefined ? settings.defaultPrefix : current.defaultPrefix,
    digitLength: Number(settings.digitLength) || current.digitLength,
    startNumber: Number(settings.startNumber) || current.startNumber,
    suffix: settings.suffix !== undefined ? settings.suffix : current.suffix,
  };

  await prisma.appSetting.upsert({
    where: { key: 'bib_generation_settings' },
    update: { value: JSON.stringify(updated) },
    create: {
      key: 'bib_generation_settings',
      value: JSON.stringify(updated),
      description: 'Pengaturan global nomor BIB (Waktu generate: PAYMENT_SUCCESS, RACEPACK_CHECKIN, MANUAL)',
    },
  });

  return updated;
}

/**
 * Generate nomor BIB unik untuk satu peserta
 */
export async function assignBibToParticipant(participantId: string): Promise<string | null> {
  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    include: {
      event: { include: { bibConfig: true } },
    },
  });

  if (!participant) return null;
  if (participant.bibNumber) return participant.bibNumber; // sudah punya BIB

  const globalSettings = await getGlobalBibSettings();
  const event = participant.event;
  const eventConfig = event?.bibConfig;

  // Prefix prioritas: event.bibConfig > kategori event > default global
  let prefix = globalSettings.defaultPrefix;
  if (eventConfig?.prefix) {
    prefix = eventConfig.prefix;
  } else if (event?.category) {
    const cat = event.category.toUpperCase().replace(/\s+/g, '');
    prefix = cat.includes('21K') ? '21-' : cat.includes('10K') ? '10-' : cat.includes('5K') ? '05-' : `${cat}-`;
  }

  const digitLength = eventConfig?.digitLength || globalSettings.digitLength || 4;
  const startNumber = eventConfig?.startNumber || globalSettings.startNumber || 1001;
  const suffix = eventConfig?.suffix || globalSettings.suffix || '';

  // Cari nomor unik
  let counter = startNumber;
  let isUnique = false;
  let candidateBib = '';

  while (!isUnique) {
    const padded = String(counter).padStart(digitLength, '0');
    candidateBib = `${prefix}${padded}${suffix}`;

    const existing = await prisma.participant.findUnique({
      where: { bibNumber: candidateBib },
    });

    if (!existing) {
      isUnique = true;
    } else {
      counter++;
    }
  }

  await prisma.participant.update({
    where: { id: participantId },
    data: { bibNumber: candidateBib },
  });

  return candidateBib;
}

/**
 * Generate BIB massal untuk peserta lunas yang belum punya BIB
 */
export async function bulkGenerateBibs(eventId?: string): Promise<{ generated: number; message: string }> {
  const whereClause: any = {
    bibNumber: null,
    order: {
      status: { in: ['SETTLEMENT', 'CAPTURE'] },
    },
  };

  if (eventId) {
    whereClause.eventId = eventId;
  }

  const participants = await prisma.participant.findMany({
    where: whereClause,
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  });

  if (participants.length === 0) {
    return {
      generated: 0,
      message: 'Tidak ada peserta lunas yang membutuhkan generate nomor BIB.',
    };
  }

  let count = 0;
  for (const p of participants) {
    const bib = await assignBibToParticipant(p.id);
    if (bib) count++;
  }

  return {
    generated: count,
    message: `Berhasil mengenerate ${count} nomor BIB untuk peserta lunas.`,
  };
}

