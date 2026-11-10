import { Router } from 'express';

// Middlewares
import { verifyAuthToken, verifyAdminRole, requirePermission, requireSuperAdmin } from '../middlewares/auth';
import { adminAuthLimiter } from '../middlewares/rateLimiter';

// Controllers
import {
  adminLogin,
  getAdminProfile,
  changeAdminPassword,
} from '../controllers/admin.auth.controller';

import {
  getSystemPermissions,
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  resetDefaultRoles,
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from '../controllers/admin.rbac.controller';

import {
  getPublicCountdownSettings,
  updateAdminCountdownSettings,
  getWebsiteSettings,
  updateWebsiteSettings,
} from '../controllers/settings.controller';

import {
  getAdminEvents,
  getAdminEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventBenefits,
  addEventBenefit,
  updateEventBenefit,
  deleteEventBenefit,
  getAllJerseys,
  createJersey,
  updateJersey,
  deleteJersey,
  getBibConfig,
  saveBibConfig,
} from '../controllers/admin.event.controller';

import {
  getAdminParticipants,
  getParticipantById,
  createManualParticipant,
  updateParticipant,
  deleteParticipant,
  updateParticipantBib,
} from '../controllers/admin.participant.controller';

import {
  getAdminOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getFinancialSummary,
  syncAllMidtransOrders,
} from '../controllers/admin.order.controller';

import {
  getAdminUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAuditLogs,
} from '../controllers/admin.user.controller';

import {
  getAdminStats,
  getAllParticipants,
  generateBibNumbers,
} from '../controllers/admin.controller';

import {
  getRoutePoints,
  createRoutePoint,
  updateRoutePoint,
  deleteRoutePoint,
} from '../controllers/route.controller';
import {
  getNotificationSettings,
  updateNotificationSettings,
  sendTestNotification,
  getWhatsAppSessionStatus,
  generateWhatsAppQr,
  disconnectWhatsAppSession,
  getNotificationLogs,
  dispatchSingleNotification,
  dispatchBatchNotifications,
  sendWhatsAppDirectMessage,
} from '../controllers/admin.notification.controller';

import {
  verifyRacepackCode,
  checkinRacepack,
  revertRacepack,
  getRacepackStats,
  batchCheckinRacepack,
} from '../controllers/admin.racepack.controller';

import {
  getAdminBibSettings,
  saveAdminBibSettings,
  triggerBulkGenerateBib,
  getAdminQrSettings,
  saveAdminQrSettings,
  getRacepackInstructions,
  saveRacepackInstructions,
  getPaymentAndFeeSettings,
  savePaymentAndFeeSettings,
} from '../controllers/admin.bib.controller';

const router = Router();

// ==============================================================
// 1. PUBLIC AUTH ROUTE (Rate Limited)
// ==============================================================
router.post('/auth/login', adminAuthLimiter, adminLogin);

// ==============================================================
// 2. SEMUA RUTE DI BAWAH INI MEMERLUKAN AUTENTIKASI ADMIN
// ==============================================================
router.use(verifyAuthToken, verifyAdminRole);

// --- Profil Admin Sendiri ---
router.get('/auth/me', getAdminProfile);
router.put('/auth/change-password', changeAdminPassword);

// --- Ringkasan Dashboard & Keuangan ---
router.get('/stats', getAdminStats);
router.get('/finance/summary', requirePermission('finance:read', 'orders:read', 'page:orders'), getFinancialSummary);
router.post('/finance/sync-midtrans', syncAllMidtransOrders);

// --- Pengaturan Global Countdown & Tutup Pendaftaran ---
router.get('/settings/countdown', getPublicCountdownSettings);
router.put('/settings/countdown', requirePermission('events:update'), updateAdminCountdownSettings);

// --- Pengaturan CMS Konten Website, Google Maps, Gambar Banner ---
router.get('/settings/website', getWebsiteSettings);
router.put('/settings/website', requirePermission('events:update'), updateWebsiteSettings);

// ==============================================================
// 3. SUPERADMIN ONLY (ROLES, PERMISSIONS & ADMIN ACCOUNTS)
// ==============================================================
// Hak Akses / Permissions
router.get('/roles/permissions', requireSuperAdmin, getSystemPermissions);

// Manajemen Roles
router.get('/roles', requireSuperAdmin, getAllRoles);
router.post('/roles/reset-defaults', requireSuperAdmin, resetDefaultRoles);
router.get('/roles/:id', requireSuperAdmin, getRoleById);
router.post('/roles', requireSuperAdmin, createRole);
router.put('/roles/:id', requireSuperAdmin, updateRole);
router.delete('/roles/:id', requireSuperAdmin, deleteRole);

// Manajemen Akun Admin
router.get('/users-management', requireSuperAdmin, getAllAdmins);
router.get('/users-management/:id', requireSuperAdmin, getAdminById);
router.post('/users-management', requireSuperAdmin, createAdmin);
router.put('/users-management/:id', requireSuperAdmin, updateAdmin);
router.delete('/users-management/:id', requireSuperAdmin, deleteAdmin);

// ==============================================================
// 4. EVENTS CRUD & RELATIONS
// ==============================================================
router.get('/events', requirePermission('events:read'), getAdminEvents);
router.get('/events/:id', requirePermission('events:read'), getAdminEventById);
router.post('/events', requirePermission('events:create'), createEvent);
router.put('/events/:id', requirePermission('events:update'), updateEvent);
router.delete('/events/:id', requirePermission('events:delete'), deleteEvent);

// Benefits
router.get('/events/:eventId/benefits', requirePermission('benefits:manage'), getEventBenefits);
router.post('/events/:eventId/benefits', requirePermission('benefits:manage'), addEventBenefit);
router.put('/benefits/:id', requirePermission('benefits:manage'), updateEventBenefit);
router.delete('/benefits/:id', requirePermission('benefits:manage'), deleteEventBenefit);

// Jerseys
router.get('/jerseys', requirePermission('jerseys:manage'), getAllJerseys);
router.post('/jerseys', requirePermission('jerseys:manage'), createJersey);
router.put('/jerseys/:id', requirePermission('jerseys:manage'), updateJersey);
router.delete('/jerseys/:id', requirePermission('jerseys:manage'), deleteJersey);

// BIB Configurations & Auto-Generation
router.get('/events/:eventId/bib-config', requirePermission('bib:manage'), getBibConfig);
router.post('/events/:eventId/bib-config', requirePermission('bib:manage'), saveBibConfig);
router.post('/generate-bib', requirePermission('bib:manage'), generateBibNumbers);

// ==============================================================
// 5. PARTICIPANTS CRUD
// ==============================================================
router.get('/participants', requirePermission('participants:read'), getAdminParticipants);
router.get('/participants/all', requirePermission('participants:read'), getAllParticipants); // kompatibilitas
router.get('/participants/:id', requirePermission('participants:read'), getParticipantById);
router.post('/participants', requirePermission('participants:create'), createManualParticipant);
router.put('/participants/:id', requirePermission('participants:update'), updateParticipant);
router.delete('/participants/:id', requirePermission('participants:delete'), deleteParticipant);
router.put('/participants/:id/bib', requirePermission('bib:manage'), updateParticipantBib);

// ==============================================================
// 6. ORDERS CRUD
// ==============================================================
router.get('/orders', requirePermission('orders:read'), getAdminOrders);
router.get('/orders/:id', requirePermission('orders:read'), getOrderById);
router.put('/orders/:id/status', requirePermission('orders:update'), updateOrderStatus);
router.delete('/orders/:id', requirePermission('orders:delete'), deleteOrder);

// ==============================================================
// 7. REGISTERED USERS (PEMESAN) CRUD
// ==============================================================
router.get('/users', requirePermission('users:read'), getAdminUsers);
router.get('/users/:id', requirePermission('users:read'), getUserById);
router.put('/users/:id', requirePermission('users:update'), updateUser);
router.delete('/users/:id', requirePermission('users:delete'), deleteUser);

// ==============================================================
// 9. CHECKPOINTS & TITIK KUMPUL RUTE LARI CRUD
// ==============================================================
router.get('/routes/points', requirePermission('events:update'), getRoutePoints);
router.post('/routes/points', requirePermission('events:update'), createRoutePoint);
router.put('/routes/points/:id', requirePermission('events:update'), updateRoutePoint);
router.delete('/routes/points/:id', requirePermission('events:update'), deleteRoutePoint);

// ==============================================================
// 10. AUDIT LOGS
// ==============================================================
router.get('/logs', requirePermission('logs:read'), getAuditLogs);

// ==============================================================
// 11. NOTIFIKASI & OTOMASI WHATSAPP / EMAIL
// ==============================================================
router.get('/notifications/settings', requirePermission('events:update'), getNotificationSettings);
router.put('/notifications/settings', requirePermission('events:update'), updateNotificationSettings);
router.post('/notifications/test', requirePermission('events:update'), sendTestNotification);

// WhatsApp Web Session Endpoints
router.get('/notifications/whatsapp/session', requirePermission('events:update'), getWhatsAppSessionStatus);
router.post('/notifications/whatsapp/qr', requirePermission('events:update'), generateWhatsAppQr);
router.post('/notifications/whatsapp/disconnect', requirePermission('events:update'), disconnectWhatsAppSession);
router.post('/notifications/whatsapp/send-direct', requirePermission('events:update'), sendWhatsAppDirectMessage);

// Log Notifikasi & Dispatch Manual
router.get('/notifications/logs', requirePermission('events:update'), getNotificationLogs);
router.post('/notifications/dispatch-single', requirePermission('events:update'), dispatchSingleNotification);
router.post('/notifications/dispatch-batch', requirePermission('events:update'), dispatchBatchNotifications);

// ==============================================================
// 12. RACEPACK COLLECTION & CHECK-IN (RPC)
// ==============================================================
router.get('/racepack/verify/:code', requirePermission('participants:read', 'page:racepack', 'page:participants'), verifyRacepackCode);
router.post('/racepack/checkin', requirePermission('participants:update', 'page:racepack', 'page:participants'), checkinRacepack);
router.post('/racepack/batch-checkin', requirePermission('participants:update', 'page:racepack', 'page:participants'), batchCheckinRacepack);
router.post('/racepack/revert', requirePermission('participants:update', 'page:racepack', 'page:participants'), revertRacepack);
router.get('/racepack/stats', requirePermission('participants:read', 'page:racepack', 'page:participants'), getRacepackStats);

// ==============================================================
// 13. PENGATURAN BIB, QR CODE & PETUNJUK RACEPACK
// ==============================================================
router.get('/bib/settings', requirePermission('participants:read', 'events:read', 'page:bib-settings'), getAdminBibSettings);
router.put('/bib/settings', requirePermission('participants:update', 'events:update', 'page:bib-settings'), saveAdminBibSettings);
router.post('/bib/bulk-generate', requirePermission('participants:update', 'events:update', 'page:bib-settings'), triggerBulkGenerateBib);

router.get('/settings/qr', requirePermission('events:read', 'page:bib-settings'), getAdminQrSettings);
router.put('/settings/qr', requirePermission('events:update', 'page:bib-settings'), saveAdminQrSettings);

router.get('/settings/racepack-instructions', requirePermission('events:read', 'page:bib-settings'), getRacepackInstructions);
router.put('/settings/racepack-instructions', requirePermission('events:update', 'page:bib-settings'), saveRacepackInstructions);

router.get('/settings/payment-fee', requirePermission('events:read', 'page:bib-settings'), getPaymentAndFeeSettings);
router.put('/settings/payment-fee', requirePermission('events:update', 'page:bib-settings'), savePaymentAndFeeSettings);

export default router;
