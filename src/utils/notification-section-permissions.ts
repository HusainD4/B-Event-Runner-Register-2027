import type { AdminTokenPayload } from '../middlewares/auth';

export const NOTIFICATION_SECTION_CONFIGURED = 'section:notification-configured';
export const NOTIFICATION_SECTIONS = [
  { key: 'section:notification-gateway', label: 'Koneksi WhatsApp', fields: ['wa_gateway_url', 'wa_api_token', 'wa_sender_number'] },
  { key: 'section:notification-mode', label: 'Mode pengiriman', fields: ['wa_dispatch_mode'] },
  { key: 'section:notification-channel', label: 'Saluran notifikasi', fields: ['notif_channel'] },
  { key: 'section:notification-pdf', label: 'Pengiriman PDF', fields: ['pdf_delivery_channel'] },
  { key: 'section:notification-smtp', label: 'SMTP email', fields: ['email_smtp_host', 'email_smtp_port', 'email_smtp_user', 'email_smtp_pass', 'email_from_name'] },
  { key: 'section:notification-wa-template', label: 'Template WhatsApp', fields: ['template_msg_paid', 'template_msg_pending', 'template_msg_cancel'] },
  { key: 'section:notification-email-template', label: 'Template email', fields: ['template_email_paid', 'template_email_pending', 'template_email_cancel'] },
  { key: 'section:notification-test', label: 'Uji kirim', fields: [] },
] as const;

export function canAccessNotificationSection(admin: AdminTokenPayload | undefined, section: string): boolean {
  if (!admin) return false;
  if (admin.roleName === 'SUPERADMIN') return true;
  if (!admin.permissions.includes('notifications:manage') && !admin.permissions.includes('notifications:*')) return false;
  return !admin.permissions.includes(NOTIFICATION_SECTION_CONFIGURED) || admin.permissions.includes(section);
}

export function allowedNotificationFields(admin: AdminTokenPayload | undefined): string[] {
  return NOTIFICATION_SECTIONS.flatMap(section =>
    canAccessNotificationSection(admin, section.key) ? [...section.fields] : []);
}
