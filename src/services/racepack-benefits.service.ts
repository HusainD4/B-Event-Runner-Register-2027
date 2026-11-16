import prisma from '../config/database';

const prefix = 'racepack_benefits_';

export function racepackBenefitsKey(eventId: string): string {
  return `${prefix}${eventId}`;
}

export function parseRacepackBenefitIds(value: string | null | undefined): string[] {
  if (value == null) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || !parsed.every(id => typeof id === 'string')) {
    throw new Error('Konfigurasi racepack tidak valid. Hubungi administrator.');
  }
  return parsed;
}

export async function getRacepackBenefits(eventId: string) {
  const setting = await prisma.appSetting.findUnique({ where: { key: racepackBenefitsKey(eventId) } });
  const ids = parseRacepackBenefitIds(setting?.value);
  if (!ids.length) return [];
  return prisma.eventBenefit.findMany({
    where: { eventId, id: { in: ids } },
    select: { id: true, name: true, description: true },
    orderBy: { name: 'asc' },
  });
}
