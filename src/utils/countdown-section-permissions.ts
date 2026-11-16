import type { AdminTokenPayload } from '../middlewares/auth';

export const COUNTDOWN_SECTION_CONFIGURED = 'section:countdown-configured';
export const COUNTDOWN_SECTIONS = [
  { key: 'section:countdown-timer', label: 'Tanggal event & status pendaftaran' },
  { key: 'section:countdown-registration-info', label: 'Informasi pendaftaran ditutup' },
  { key: 'section:countdown-maintenance', label: 'Halaman under maintenance' },
] as const;

export function canAccessCountdownSection(admin: AdminTokenPayload | undefined, section: string): boolean {
  if (!admin) return false;
  if (admin.roleName === 'SUPERADMIN') return true;
  if (!admin.permissions.includes('countdown:manage') && !admin.permissions.includes('countdown:*')) return false;
  return !admin.permissions.includes(COUNTDOWN_SECTION_CONFIGURED) || admin.permissions.includes(section);
}

export function countdownSectionsForUpdate(body: Record<string, unknown>): string[] {
  const sections = new Set<string>();
  const fields: Record<string, string> = {
    eventCountdownDate: 'section:countdown-timer',
    isRegistrationClosed: 'section:countdown-timer',
    eventTitle: 'section:countdown-timer',
    registrationOperatingHours: 'section:countdown-registration-info',
    registrationClosedMessage: 'section:countdown-registration-info',
    maintenanceEnabled: 'section:countdown-maintenance',
    maintenanceType: 'section:countdown-maintenance',
    maintenanceTitle: 'section:countdown-maintenance',
    maintenanceMessage: 'section:countdown-maintenance',
    maintenanceExpectedEnd: 'section:countdown-maintenance',
  };
  for (const key of Object.keys(body)) {
    if (fields[key]) sections.add(fields[key]);
  }
  return [...sections];
}
