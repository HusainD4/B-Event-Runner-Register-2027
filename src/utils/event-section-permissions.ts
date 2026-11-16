import type { AdminTokenPayload } from '../middlewares/auth';

export const EVENT_SECTION_CONFIGURED = 'section:event-configured';
export const EVENT_SECTIONS = [
  { key: 'section:event-catalog', label: 'Manajemen kategori lomba & tiket' },
  { key: 'section:event-racepack', label: 'Pengaturan perlengkapan racepack' },
] as const;

export function canAccessEventSection(admin: AdminTokenPayload | undefined, section: string): boolean {
  if (!admin) return false;
  if (admin.roleName === 'SUPERADMIN') return true;
  return !admin.permissions.includes(EVENT_SECTION_CONFIGURED) || admin.permissions.includes(section);
}
