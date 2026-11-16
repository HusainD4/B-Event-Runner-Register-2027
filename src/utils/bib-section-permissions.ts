import type { AdminTokenPayload } from '../middlewares/auth';

export const BIB_SECTION_CONFIGURED = 'section:bib-configured';
export const BIB_SECTIONS = [
  { key: 'section:bib-generation', label: 'Aturan Generate Nomor BIB' },
  { key: 'section:bib-qr', label: 'Pengaturan Awalan & Token QR Code' },
  { key: 'section:bib-instructions', label: 'Petunjuk Pengambilan Racepack & Race Day' },
  { key: 'section:bib-payment-fee', label: 'Batas Waktu Pembayaran & Biaya Layanan' },
] as const;

export function canAccessBibSection(admin: AdminTokenPayload | undefined, section: string): boolean {
  if (!admin) return false;
  if (admin.roleName === 'SUPERADMIN') return true;
  if (!admin.permissions.includes('bib:manage') && !admin.permissions.includes('bib:*')) return false;
  return !admin.permissions.includes(BIB_SECTION_CONFIGURED) || admin.permissions.includes(section);
}
