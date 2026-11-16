import type { AdminTokenPayload } from '../middlewares/auth';

export const CMS_SECTION_CONFIGURED = 'section:cms-configured';
export const CMS_SECTIONS = [
  { key: 'section:cms-visibility', label: 'Tampilan website', fields: ['cms_visibility'] },
  { key: 'section:cms-hero', label: 'Identitas, hero & warna', fields: [
    'site_title', 'site_tagline', 'navbar_title', 'navbar_icon_mode', 'navbar_icon', 'navbar_icon_url', 'favicon_url',
    'hero_badge', 'hero_title', 'hero_animation', 'hero_subtitle', 'hero_bg_image', 'theme_primary_color',
    'theme_background_color', 'theme_surface_color', 'theme_border_color', 'theme_heading_color', 'theme_text_color',
    'theme_muted_color', 'theme_nav_color', 'theme_button_color', 'theme_button_text_color', 'theme_glow_color',
    'theme_ambient_color', 'theme_shadow_color', 'theme_secondary_button_color', 'theme_secondary_text_color',
    'theme_input_color', 'theme_input_text_color', 'theme_nav_text_color', 'theme_section_colors',
  ] },
  { key: 'section:cms-stats', label: 'Statistik', fields: [
    'stats_banner_items', ...[1, 2, 3, 4].flatMap(index => ['val', 'unit', 'desc'].map(field => `stat_${index}_${field}`)),
  ] },
  { key: 'section:cms-route', label: 'Informasi rute', fields: [
    'route_badge_label', 'route_title', 'route_desc', 'route_gpx_url', 'route_map_mode', 'route_checkpoint_mode',
    'route_gmaps_url', 'gmaps_embed_url', 'route_map_image', 'route_checkpoint_image',
  ] },
  { key: 'section:cms-faq', label: 'FAQ', fields: ['faq_items'] },
  { key: 'section:cms-coming-soon', label: 'Coming Soon', fields: ['coming_soon_title', 'coming_soon_message', 'coming_soon_image_url'] },
  { key: 'section:cms-media', label: 'Fasilitas & tiket', fields: [
    'facilities_items', 'facilities_title', 'facilities_desc', 'facilities_image', 'tickets_title', 'tickets_desc',
    'medal_image', 'medal_preview_image', 'jersey_gallery_images', 'bib_preview_image_url',
  ] },
  { key: 'section:cms-legal', label: 'Legalitas', fields: [
    'legal_items', 'legal_badge_label', 'legal_title', 'legal_desc', 'legal_privacy_button', 'legal_terms_button',
    ...[1, 2, 3, 4].flatMap(index => ['title', 'desc'].map(field => `legal_item_${index}_${field}`)),
  ] },
  { key: 'section:cms-documents', label: 'Dokumen legal', fields: [
    'privacy_modal_title', 'privacy_modal_subtitle', 'privacy_modal_content',
    'terms_modal_title', 'terms_modal_subtitle', 'terms_modal_content',
  ] },
  { key: 'section:cms-contact', label: 'Kontak & footer', fields: [
    'contact_email', 'contact_phone', 'contact_address', 'footer_copyright',
  ] },
] as const;

export function canAccessCmsSection(admin: AdminTokenPayload | undefined, section: string, readOnly = false): boolean {
  if (!admin) return false;
  if (admin.roleName === 'SUPERADMIN') return true;
  const permissions = admin.permissions;
  if (!permissions.includes('cms:manage') && !permissions.includes('cms:*') && !(readOnly && permissions.includes('page:cms'))) return false;
  return !permissions.includes(CMS_SECTION_CONFIGURED) || permissions.includes(section);
}

export function allowedCmsFields(admin: AdminTokenPayload | undefined, readOnly = false): string[] {
  const canManageRoutes = admin?.roleName === 'SUPERADMIN' || admin?.permissions.includes('routes:manage') ||
    admin?.permissions.includes('routes:*') || (readOnly && admin?.permissions.includes('routes:read'));
  return CMS_SECTIONS.flatMap(section =>
    canAccessCmsSection(admin, section.key, readOnly) || (section.key === 'section:cms-route' && canManageRoutes)
      ? [...section.fields] : []);
}
