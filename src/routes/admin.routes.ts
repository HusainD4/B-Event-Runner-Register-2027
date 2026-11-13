import { Router } from 'express';

// Middlewares
import { verifyAuthToken, verifyAdminRole, requirePermission, requireSuperAdmin } from '../middlewares/auth';
import { adminAuthLimiter, backupExportLimiter } from '../middlewares/rateLimiter';

// Controllers
import {
  adminLogin,
  adminLogout,
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
import { forceLogoutAdmin, getRoleMonitoring } from '../controllers/admin.monitoring.controller';
import { downloadCsvBackup, downloadSqlBackup, getBackupOverview } from '../controllers/admin.backup.controller';

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
  clearParticipantData,
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
  dispatchManualPdf,
  dispatchBatchNotifications,
  sendWhatsAppDirectMessage,
  getWhatsAppHistory,
  clearWhatsAppHistory,
} from '../controllers/admin.notification.controller';

import {
  verifyRacepackCode,
  checkinRacepack,
  enqueueRacepackCheckin,
  getRacepackQueue,
  getRacepackConfirmationList,
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
router.post('/auth/logout', adminLogout);
router.post('/participants/clear', requireSuperAdmin, clearParticipantData);

// --- Profil Admin Sendiri ---
router.get('/auth/me', getAdminProfile);
router.put('/auth/change-password', changeAdminPassword);
router.get('/backups', requireSuperAdmin, getBackupOverview);
router.post('/backups/sql', backupExportLimiter, requireSuperAdmin, downloadSqlBackup);
router.post('/backups/csv', backupExportLimiter, requireSuperAdmin, downloadCsvBackup);

// --- Ringkasan Dashboard & Keuangan ---
router.get('/stats', requirePermission('page:dashboard'), getAdminStats);
router.get('/finance/summary', requirePermission('finance:read'), getFinancialSummary);
router.post('/finance/sync-midtrans', requirePermission('finance:read'), syncAllMidtransOrders);

// --- Pengaturan Global Countdown & Tutup Pendaftaran ---
router.get('/settings/countdown', requirePermission('countdown:manage', 'page:countdown', 'events:read'), getPublicCountdownSettings);
router.put('/settings/countdown', requirePermission('countdown:manage'), updateAdminCountdownSettings);

// --- Pengaturan CMS Konten Website, Google Maps, Gambar Banner ---
router.get('/settings/website', requirePermission('cms:manage', 'page:cms', 'routes:read', 'routes:manage'), getWebsiteSettings);
router.put('/settings/website', requirePermission('cms:manage', 'routes:manage'), updateWebsiteSettings);

// ==============================================================
// 3. SUPERADMIN ONLY (ROLES, PERMISSIONS & ADMIN ACCOUNTS)
// ==============================================================
// Hak Akses / Permissions
router.get('/roles/permissions', requireSuperAdmin, getSystemPermissions);

// Manajemen Roles
router.get('/role-monitoring', requireSuperAdmin, getRoleMonitoring);
router.post('/role-monitoring/:roleId/admins/:adminId/force-logout', requireSuperAdmin, forceLogoutAdmin);
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
router.get('/routes/points', requirePermission('routes:read', 'routes:manage'), getRoutePoints);
router.post('/routes/points', requirePermission('routes:manage'), createRoutePoint);
router.put('/routes/points/:id', requirePermission('routes:manage'), updateRoutePoint);
router.delete('/routes/points/:id', requirePermission('routes:manage'), deleteRoutePoint);

// ==============================================================
// 10. AUDIT LOGS
// ==============================================================
router.get('/logs', requirePermission('logs:read'), getAuditLogs);

// ==============================================================
// 11. NOTIFIKASI & OTOMASI WHATSAPP / EMAIL
// ==============================================================
router.get('/notifications/settings', requirePermission('notifications:manage'), getNotificationSettings);
router.put('/notifications/settings', requirePermission('notifications:manage'), updateNotificationSettings);
router.post('/notifications/test', requirePermission('notifications:manage'), sendTestNotification);

// WhatsApp Web Session Endpoints
router.get('/notifications/whatsapp/session', requirePermission('whatsapp:session'), getWhatsAppSessionStatus);
router.post('/notifications/whatsapp/qr', requirePermission('whatsapp:session'), generateWhatsAppQr);
router.post('/notifications/whatsapp/disconnect', requirePermission('whatsapp:session'), disconnectWhatsAppSession);
router.post('/notifications/whatsapp/send-direct', requirePermission('whatsapp:chat'), sendWhatsAppDirectMessage);
router.get('/notifications/whatsapp/history/:orderId', requirePermission('whatsapp:chat'), getWhatsAppHistory);
router.delete('/notifications/whatsapp/history/:orderId', requirePermission('whatsapp:chat'), clearWhatsAppHistory);

// Log Notifikasi & Dispatch Manual
router.get('/notifications/logs', requirePermission('notifications:read'), getNotificationLogs);
router.post('/notifications/dispatch-single', requirePermission('notifications:dispatch'), dispatchSingleNotification);
router.post('/notifications/dispatch-pdf', requirePermission('notifications:dispatch'), dispatchManualPdf);
router.post('/notifications/dispatch-batch', requirePermission('notifications:dispatch'), dispatchBatchNotifications);

// ==============================================================
// 12. RACEPACK COLLECTION & CHECK-IN (RPC)
// ==============================================================
router.get('/racepack/verify/:code', requirePermission('participants:read'), verifyRacepackCode);
router.get('/racepack/queue', requirePermission('participants:read'), getRacepackQueue);
router.get('/racepack/confirmations', requirePermission('participants:read'), getRacepackConfirmationList);
router.post('/racepack/queue', requirePermission('racepack:checkin'), enqueueRacepackCheckin);
router.post('/racepack/checkin', requirePermission('racepack:checkin'), checkinRacepack);
router.post('/racepack/batch-checkin', requirePermission('racepack:checkin'), batchCheckinRacepack);
router.post('/racepack/revert', requirePermission('racepack:checkin'), revertRacepack);
router.get('/racepack/stats', requirePermission('participants:read'), getRacepackStats);

// ==============================================================
// 13. PENGATURAN BIB, QR CODE & PETUNJUK RACEPACK
// ==============================================================
router.get('/bib/settings', requirePermission('bib:manage'), getAdminBibSettings);
router.put('/bib/settings', requirePermission('bib:manage'), saveAdminBibSettings);
router.post('/bib/bulk-generate', requirePermission('bib:manage'), triggerBulkGenerateBib);

router.get('/settings/qr', requirePermission('bib:manage'), getAdminQrSettings);
router.put('/settings/qr', requirePermission('bib:manage'), saveAdminQrSettings);

router.get('/settings/racepack-instructions', requirePermission('bib:manage'), getRacepackInstructions);
router.put('/settings/racepack-instructions', requirePermission('bib:manage'), saveRacepackInstructions);

router.get('/settings/payment-fee', requirePermission('bib:manage'), getPaymentAndFeeSettings);
router.put('/settings/payment-fee', requirePermission('bib:manage'), savePaymentAndFeeSettings);

export default router;
