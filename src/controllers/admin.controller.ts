import type { Response } from 'express';
import type { OrderStatus } from '../generated/client';
import prisma from '../config/database';
import type { AuthenticatedRequest } from '../middlewares/auth';
import { coreApi } from '../config/midtrans';
import { getIo } from '../sockets';
import { queueAutomaticPdfDeliveries } from '../services/pdf-delivery.service';

/**
 * Controller untuk mengambil ringkasan statistik dashboard admin (Total Pendaftar, Total Pemasukan, Sisa Kuota, Rekonsiliasi Midtrans)
 */
export const getAdminStats = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const permissions = req.admin?.permissions || [];
    const isSuperAdmin = req.admin?.roleName === 'SUPERADMIN';
    const dashboardConfigured = permissions.includes('dashboard:configured');
    const canViewWidget = (widget: string) =>
      isSuperAdmin || !dashboardConfigured || permissions.includes(widget);
    const canViewEvents = isSuperAdmin || permissions.includes('events:read') || permissions.includes('events:*');
    const canViewFinance = [
      'dashboard:revenue',
      'dashboard:service-fee',
      'dashboard:net-revenue',
      'dashboard:finance-breakdown',
    ].some(canViewWidget);
    const canReadParticipants = isSuperAdmin || permissions.includes('participants:read') || permissions.includes('participants:*');
    const canReadOrders = isSuperAdmin || permissions.includes('orders:read') || permissions.includes('orders:*');
    const canReadLogs = isSuperAdmin || permissions.includes('logs:read') || permissions.includes('logs:*');
    const canReadFinance = isSuperAdmin || permissions.includes('finance:read') || permissions.includes('finance:*');
    const canViewRegistrationTrend = canViewWidget('dashboard:registration-trend') && canReadParticipants;
    const canViewRevenueTrend = canViewWidget('dashboard:revenue-trend') && (canReadOrders || canReadFinance);
    const canViewPaymentStatus = canViewWidget('dashboard:payment-status') && canReadOrders;
    const canViewConversion = canViewWidget('dashboard:conversion') && canReadOrders;
    const canViewEventPerformance = canViewWidget('dashboard:event-performance') && canViewEvents;
    const canViewCategoryPerformance = canViewWidget('dashboard:category-performance') && canViewEvents;
    const canViewParticipantProfile = canViewWidget('dashboard:participant-profile') && canReadParticipants;
    const canViewJerseySizes = canViewWidget('dashboard:jersey-sizes') && canReadParticipants;
    const canViewRacepackCheckin = canViewWidget('dashboard:racepack-checkin') && canReadParticipants;
    const canViewTeamPresence = canViewWidget('dashboard:team-presence') && Boolean(req.admin);
    const canViewRecentOrders = canViewWidget('dashboard:recent-orders') && canReadOrders;
    const canViewRecentActivity = canViewWidget('dashboard:recent-activity') && canReadLogs;

    if (canViewFinance) {
      try {
        const pendingOrders = await prisma.order.findMany({
          where: {
            status: 'PENDING',
            midtransOrderId: { not: null },
            NOT: { midtransOrderId: { startsWith: 'OFFLINE-' } },
          },
          take: 15,
          orderBy: { createdAt: 'desc' },
        });

        for (const ord of pendingOrders) {
          if (!ord.midtransOrderId) continue;
          try {
            const statusRes = await coreApi.transaction.status(ord.midtransOrderId);
            const mStatus = statusRes?.transaction_status?.toLowerCase();
            const fStatus = statusRes?.fraud_status || 'accept';

            if (mStatus === 'settlement' || (mStatus === 'capture' && fStatus === 'accept')) {
              await prisma.$transaction(async tx => {
                const updated = await tx.order.updateMany({
                  where: { id: ord.id, status: 'PENDING' },
                  data: { status: 'SETTLEMENT' },
                });
                if (updated.count) await queueAutomaticPdfDeliveries(tx, ord.id);
              });
            } else if (['cancel', 'deny'].includes(mStatus)) {
              await prisma.order.update({
                where: { id: ord.id },
                data: { status: 'CANCEL' },
              });
            } else if (mStatus === 'expire') {
              await prisma.order.update({
                where: { id: ord.id },
                data: { status: 'EXPIRE' },
              });
            }
          } catch (error) {
            console.warn('[DASHBOARD SYNC] Gagal memproses order:', ord.id, error);
          }
        }
      } catch {
        // Abaikan jika Midtrans offline
      }
    }

    const totalEvents = canViewEvents ? await prisma.event.count() : undefined;
    const totalParticipants = canViewWidget('dashboard:participants')
      ? await prisma.participant.count()
      : undefined;
    
    // 2. Query seluruh order beserta tiket peserta untuk rincian finansial & biaya layanan komprehensif
    const allOrders = canViewFinance ? await prisma.order.findMany({
      select: {
        id: true,
        status: true,
        totalAmount: true,
        participants: {
          select: {
            event: {
              select: { price: true }
            }
          }
        }
      },
    }) : [];

    let settledCount = 0;
    let settledGrossAmount = 0; // Omzet kotor sukses / lunas
    let settledServiceFee = 0;   // Akumulasi biaya layanan dari order lunas

    let pendingCount = 0;
    let pendingGrossAmount = 0; // Menunggu pembayaran

    let cancelledCount = 0;
    let cancelledGrossAmount = 0; // Dibatalkan / Kadaluarsa

    for (const o of allOrders) {
      const totalAmt = Number(o.totalAmount || 0);
      let ticketSubtotal = 0;
      if (Array.isArray(o.participants) && o.participants.length > 0) {
        ticketSubtotal = o.participants.reduce((sum, p) => sum + Number(p.event?.price || 0), 0);
      }
      const feeAmt = Math.max(0, totalAmt - ticketSubtotal);

      if (o.status === 'SETTLEMENT' || o.status === 'CAPTURE') {
        settledCount++;
        settledGrossAmount += totalAmt;
        settledServiceFee += feeAmt;
      } else if (o.status === 'PENDING') {
        pendingCount++;
        pendingGrossAmount += totalAmt;
      } else if (['CANCEL', 'EXPIRE', 'DENY', 'REFUND'].includes(o.status)) {
        cancelledCount++;
        cancelledGrossAmount += totalAmt;
      }
    }

    // HASIL AKHIR MURNI (BERSIH) = Total Transaksi Lunas - Total Biaya Layanan
    const netRevenue = Math.max(0, settledGrossAmount - settledServiceFee);

    // Ambil daftar event beserta sisa stok dan jumlah peserta
    const events = canViewEvents ? await prisma.event.findMany({
      include: {
        _count: { select: { participants: true } },
      },
    }) : [];

    const activeOrderStatuses: OrderStatus[] = ['PENDING', 'SETTLEMENT', 'CAPTURE'];
    const paidOrderStatuses: OrderStatus[] = ['SETTLEMENT', 'CAPTURE'];
    const trendWindowStart = new Date();
    trendWindowStart.setUTCHours(0, 0, 0, 0);
    trendWindowStart.setUTCDate(trendWindowStart.getUTCDate() - 29);
    const comparisonWindowStart = new Date(trendWindowStart);
    comparisonWindowStart.setUTCDate(comparisonWindowStart.getUTCDate() - 30);
    const now = new Date();
    const ageCutoffs = [18, 25, 35, 45].map((years) => {
      const cutoff = new Date(now);
      cutoff.setFullYear(cutoff.getFullYear() - years);
      return cutoff;
    });
    const activeParticipantsWhere = { order: { status: { in: activeOrderStatuses } } };

    const [registrationRecords, revenueRecords, paymentStatuses, paidOrderMetrics, activeParticipantsByEvent, participantGenders, ageUnder18, age18To24, age25To34, age35To44, age45Plus, jerseySizes, recentOrders, recentActivity] = await Promise.all([
      canViewRegistrationTrend ? prisma.participant.findMany({
        where: {
          createdAt: { gte: comparisonWindowStart },
          order: { status: { in: activeOrderStatuses } },
        },
        select: { createdAt: true },
      }) : Promise.resolve([]),
      canViewRevenueTrend ? prisma.order.findMany({
        where: {
          createdAt: { gte: trendWindowStart },
          status: { in: paidOrderStatuses },
        },
        select: { createdAt: true, totalAmount: true },
      }) : Promise.resolve([]),
      (canViewPaymentStatus || canViewConversion) ? prisma.order.groupBy({
        by: ['status'],
        _count: { _all: true },
      }) : Promise.resolve([]),
      canViewConversion ? prisma.order.aggregate({
        where: { status: { in: paidOrderStatuses } },
        _avg: { totalAmount: true },
      }) : Promise.resolve(null),
      (canViewEventPerformance || canViewCategoryPerformance) ? prisma.participant.groupBy({
        by: ['eventId'],
        where: activeParticipantsWhere,
        _count: { _all: true },
      }) : Promise.resolve([]),
      canViewParticipantProfile ? prisma.participant.groupBy({
        by: ['gender'],
        where: activeParticipantsWhere,
        _count: { _all: true },
      }) : Promise.resolve([]),
      canViewParticipantProfile ? prisma.participant.count({
        where: { ...activeParticipantsWhere, birthDate: { gt: ageCutoffs[0] } },
      }) : Promise.resolve(0),
      canViewParticipantProfile ? prisma.participant.count({
        where: { ...activeParticipantsWhere, birthDate: { lte: ageCutoffs[0], gt: ageCutoffs[1] } },
      }) : Promise.resolve(0),
      canViewParticipantProfile ? prisma.participant.count({
        where: { ...activeParticipantsWhere, birthDate: { lte: ageCutoffs[1], gt: ageCutoffs[2] } },
      }) : Promise.resolve(0),
      canViewParticipantProfile ? prisma.participant.count({
        where: { ...activeParticipantsWhere, birthDate: { lte: ageCutoffs[2], gt: ageCutoffs[3] } },
      }) : Promise.resolve(0),
      canViewParticipantProfile ? prisma.participant.count({
        where: { ...activeParticipantsWhere, birthDate: { lte: ageCutoffs[3] } },
      }) : Promise.resolve(0),
      canViewJerseySizes ? prisma.participant.groupBy({
        by: ['selectedSize'],
        where: {
          selectedSize: { not: null },
          ...activeParticipantsWhere,
        },
        _count: { _all: true },
      }) : Promise.resolve([]),
      canViewRecentOrders ? prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          _count: { select: { participants: true } },
        },
      }) : Promise.resolve([]),
      canViewRecentActivity ? prisma.log.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        select: { action: true, entityType: true, createdAt: true },
      }) : Promise.resolve([]),
    ]);

    const registrationTrend = canViewRegistrationTrend
      ? Array.from({ length: 30 }, (_, index) => {
        const date = new Date(trendWindowStart);
        date.setUTCDate(date.getUTCDate() + index);
        const dateKey = date.toISOString().slice(0, 10);
        const count = registrationRecords.filter((record) => record.createdAt.toISOString().slice(0, 10) === dateKey).length;
        return { date: dateKey, count };
      })
      : undefined;
    const currentPeriodStart = trendWindowStart.getTime();
    const registrationCurrentPeriod = canViewRegistrationTrend
      ? registrationRecords.filter((record) => record.createdAt.getTime() >= currentPeriodStart).length
      : undefined;
    const registrationPreviousPeriod = canViewRegistrationTrend
      ? registrationRecords.length - registrationCurrentPeriod!
      : undefined;
    const registrationGrowth = canViewRegistrationTrend
      ? {
        current: registrationCurrentPeriod,
        previous: registrationPreviousPeriod,
        changePercent: registrationPreviousPeriod
          ? Math.round(((registrationCurrentPeriod! - registrationPreviousPeriod) / registrationPreviousPeriod) * 100)
          : null,
      }
      : undefined;

    const revenueTrend = canViewRevenueTrend
      ? Array.from({ length: 30 }, (_, index) => {
        const date = new Date(trendWindowStart);
        date.setUTCDate(date.getUTCDate() + index);
        const dateKey = date.toISOString().slice(0, 10);
        const amount = revenueRecords
          .filter((record) => record.createdAt.toISOString().slice(0, 10) === dateKey)
          .reduce((sum, record) => sum + Number(record.totalAmount), 0);
        return { date: dateKey, amount };
      })
      : undefined;

    const eventCounts = new Map(activeParticipantsByEvent.map((item) => [item.eventId, item._count._all]));
    const eventAnalytics = events.map((event) => {
      const registeredCount = eventCounts.get(event.id) || 0;
      return {
        id: event.id,
        ticketName: event.ticketName,
        category: event.category,
        capacity: event.stock,
        registeredCount,
        remainingStock: Math.max(0, event.stock - registeredCount),
        occupancyPercent: event.stock > 0 ? Math.min(100, Math.round((registeredCount / event.stock) * 100)) : 0,
        isClosed: event.isClosed,
      };
    });
    const eventPerformance = canViewEventPerformance
      ? eventAnalytics
      : undefined;

    const paymentStatusCounts = canViewPaymentStatus
      ? paymentStatuses.map((item) => ({
        status: item.status,
        count: typeof item._count === 'object' ? item._count._all || 0 : 0,
      }))
      : undefined;
    const conversionSummary = canViewConversion
      ? (() => {
        const totalOrders = paymentStatuses.reduce((sum, item) => sum + (typeof item._count === 'object' ? item._count._all || 0 : 0), 0);
        const paidOrders = paymentStatuses
          .filter((item) => item.status === 'SETTLEMENT' || item.status === 'CAPTURE')
          .reduce((sum, item) => sum + (typeof item._count === 'object' ? item._count._all || 0 : 0), 0);
        return {
          totalOrders,
          paidOrders,
          conversionPercent: totalOrders ? Math.round((paidOrders / totalOrders) * 100) : 0,
          averagePaidOrder: Math.round(Number(paidOrderMetrics?._avg.totalAmount || 0)),
        };
      })()
      : undefined;

    const categoryPerformance = canViewCategoryPerformance
      ? eventAnalytics.reduce<Array<{
        category: string;
        participants: number;
        capacity: number;
        occupancyPercent: number;
      }>>((result, event) => {
        const current = result.find((item) => item.category === event.category);
        if (current) {
          current.participants += event.registeredCount;
          current.capacity += event.capacity;
          current.occupancyPercent = current.capacity > 0
            ? Math.min(100, Math.round((current.participants / current.capacity) * 100))
            : 0;
        } else {
          result.push({
            category: event.category,
            participants: event.registeredCount,
            capacity: event.capacity,
            occupancyPercent: event.occupancyPercent,
          });
        }
        return result;
      }, []).sort((a, b) => b.participants - a.participants)
      : undefined;

    const participantProfile = canViewParticipantProfile
      ? (() => {
        const gender = participantGenders.map((item) => ({
          label: item.gender,
          count: typeof item._count === 'object' ? item._count._all || 0 : 0,
        }));
        return {
          total: gender.reduce((sum, item) => sum + item.count, 0),
          gender,
          ageGroups: [
            { label: '< 18', count: ageUnder18 },
            { label: '18–24', count: age18To24 },
            { label: '25–34', count: age25To34 },
            { label: '35–44', count: age35To44 },
            { label: '45+', count: age45Plus },
          ],
        };
      })()
      : undefined;

    const jerseySizeCounts = canViewJerseySizes
      ? jerseySizes
        .map((item) => ({
          size: item.selectedSize || 'Tidak ditentukan',
          count: typeof item._count === 'object' ? item._count._all || 0 : 0,
        }))
        .sort((a, b) => a.size.localeCompare(b.size, 'id'))
      : undefined;
    const racepackCheckinSummary = canViewRacepackCheckin
      ? await (async () => {
        const [paidParticipantIds, checkinSetting] = await Promise.all([
          prisma.participant.findMany({
            where: { order: { status: { in: paidOrderStatuses } } },
            select: { id: true },
          }),
          prisma.appSetting.findUnique({ where: { key: 'racepack_checkins' } }),
        ]);
        let checkins: Record<string, { checkedIn?: boolean }> = {};
        if (checkinSetting?.value) {
          const parsed: unknown = JSON.parse(checkinSetting.value);
          if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new Error('Data status check-in racepack tidak valid.');
          }
          checkins = parsed as Record<string, { checkedIn?: boolean }>;
        }
        const checkedInCount = paidParticipantIds.reduce(
          (count, participant) => count + (checkins[participant.id]?.checkedIn === true ? 1 : 0),
          0,
        );
        const paidCount = paidParticipantIds.length;
        return {
          paidParticipants: paidCount,
          checkedInCount,
          remainingToCheckIn: Math.max(0, paidCount - checkedInCount),
          percentage: paidCount ? Math.round((checkedInCount / paidCount) * 100) : 0,
        };
      })()
      : undefined;

    const teamPresence = canViewTeamPresence
      ? await (async () => {
        const roles = await prisma.role.findMany({
          where: {
            ...(isSuperAdmin ? {} : { id: req.admin!.roleId }),
          },
          select: {
            id: true,
            name: true,
            admins: {
              where: { isActive: true },
              select: { id: true, fullName: true },
              orderBy: { fullName: 'asc' },
            },
          },
          orderBy: { name: 'asc' },
        });
        const connectedAdminSockets = await getIo().in('admin').fetchSockets();
        const onlineAdminIds = new Set(
          connectedAdminSockets
            .map((socket) => socket.data.adminId as string | undefined)
            .filter((adminId): adminId is string => Boolean(adminId)),
        );
        const teams = roles.map((role) => {
          const members = role.admins.map((admin) => ({
            name: admin.fullName,
            online: onlineAdminIds.has(admin.id),
          }));
          return {
            roleName: role.name,
            memberCount: members.length,
            onlineCount: members.filter((member) => member.online).length,
            members,
          };
        });
        const totalMembers = teams.reduce((sum, team) => sum + team.memberCount, 0);
        return {
          scope: isSuperAdmin ? 'all' : 'role',
          teams,
          totalMembers,
          onlineCount: teams.reduce((sum, team) => sum + team.onlineCount, 0),
        };
      })()
      : undefined;

    const showFinanceBreakdown = canViewWidget('dashboard:finance-breakdown');
    const financials: Record<string, unknown> = {};
    if (showFinanceBreakdown || canViewWidget('dashboard:revenue')) {
      financials.settled = { count: settledCount, amount: settledGrossAmount };
    }
    if (showFinanceBreakdown) {
      financials.pending = { count: pendingCount, amount: pendingGrossAmount };
      financials.cancelled = { count: cancelledCount, amount: cancelledGrossAmount };
    }
    if (showFinanceBreakdown || canViewWidget('dashboard:service-fee')) {
      financials.serviceFee = { count: settledCount, amount: settledServiceFee };
    }
    if (showFinanceBreakdown || canViewWidget('dashboard:net-revenue')) {
      financials.netRevenue = netRevenue;
    }

    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mengambil data statistik dashboard admin.',
      data: {
        totalParticipants,
        ...(canViewEvents ? { totalEvents } : {}),
        ...(canViewWidget('dashboard:revenue') ? { totalRevenue: settledGrossAmount } : {}),
        ...(canViewWidget('dashboard:service-fee') ? { totalServiceFee: settledServiceFee } : {}),
        ...(canViewWidget('dashboard:net-revenue') ? { netRevenue } : {}),
        financials,
        ...(canViewEvents ? { events: events.map((e) => ({
          id: e.id,
          ticketName: e.ticketName,
          category: e.category,
          stock: e.stock,
          registeredCount: e._count.participants,
          remainingStock: Math.max(0, e.stock - e._count.participants),
          price: Number(e.price),
        })) } : {}),
        ...(canViewRegistrationTrend ? { registrationTrend } : {}),
        ...(canViewRegistrationTrend ? { registrationGrowth } : {}),
        ...(canViewRevenueTrend ? { revenueTrend } : {}),
        ...(canViewPaymentStatus ? { paymentStatusCounts } : {}),
        ...(canViewConversion ? { conversionSummary } : {}),
        ...(canViewEventPerformance ? { eventPerformance } : {}),
        ...(canViewCategoryPerformance ? { categoryPerformance } : {}),
        ...(canViewParticipantProfile ? { participantProfile } : {}),
        ...(canViewJerseySizes ? { jerseySizeCounts } : {}),
        ...(canViewRacepackCheckin ? { racepackCheckinSummary } : {}),
        ...(canViewTeamPresence ? { teamPresence } : {}),
        ...(canViewRecentOrders ? {
          recentOrders: recentOrders.map((order) => ({
            reference: order.id.slice(-8).toUpperCase(),
            status: order.status,
            totalAmount: Number(order.totalAmount),
            participantCount: order._count.participants,
            createdAt: order.createdAt,
          })),
        } : {}),
        ...(canViewRecentActivity ? { recentActivity } : {}),
      },
    });
  } catch (error: any) {
    console.error('🚨 [ADMIN ERROR] Gagal mengambil statistik admin:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan internal pada server.',
    });
  }
};

/**
 * Controller untuk mengambil daftar seluruh peserta yang terdaftar (ringkas / backward compatible)
 */
export const getAllParticipants = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const participants = await prisma.participant.findMany({
      include: {
        event: { select: { ticketName: true, category: true } },
        order: { select: { midtransOrderId: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mengambil daftar seluruh peserta.',
      data: participants,
    });
  } catch (error: any) {
    console.error('🚨 [ADMIN ERROR] Gagal mengambil daftar peserta:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan internal pada server.',
    });
  }
};

/**
 * Controller untuk mengenerate nomor BIB peserta secara otomatis berdasarkan BibConfiguration event
 */
export const generateBibNumbers = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ status: 'error', message: 'Event ID wajib disertakan.' });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { bibConfig: true },
    });

    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event tidak ditemukan.' });
    }

    // Ambil semua peserta pada event tersebut yang belum memiliki BIB number
    const participants = await prisma.participant.findMany({
      where: { eventId, bibNumber: null },
      orderBy: { createdAt: 'asc' },
    });

    if (participants.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Semua peserta pada event ini sudah memiliki nomor BIB.',
      });
    }

    // Konfigurasi format BIB
    const prefix = event.bibConfig?.prefix || (event.ticketName.toLowerCase().includes('10k') ? '10' : '05');
    const digitLength = event.bibConfig?.digitLength || 4;
    const startNumber = event.bibConfig?.startNumber || 1;
    const suffix = event.bibConfig?.suffix || '';

    // Cari nomor terakhir yang sudah dipakai agar tidak duplikat
    let counter = startNumber;
    let generatedCount = 0;

    for (const p of participants) {
      let bibNumber = '';
      let isDuplicate = true;

      // Cari nomor berikutnya yang belum terpakai di DB
      while (isDuplicate) {
        const paddedNum = String(counter).padStart(digitLength, '0');
        bibNumber = `${prefix}${paddedNum}${suffix}`;

        const existing = await prisma.participant.findUnique({ where: { bibNumber } });
        if (!existing) {
          isDuplicate = false;
        }
        counter++;
      }

      await prisma.participant.update({
        where: { id: p.id },
        data: { bibNumber },
      });

      generatedCount++;
    }

    await prisma.log.create({
      data: {
        action: 'GENERATE_BIB',
        description: `Admin mengenerate ${generatedCount} nomor BIB untuk event ${event.ticketName}.`,
        adminId: req.admin?.adminId,
        entityType: 'Event',
        entityId: event.id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: `Berhasil mengenerate ${generatedCount} nomor BIB untuk peserta event ${event.ticketName}.`,
    });
  } catch (error: any) {
    console.error('🚨 [ADMIN ERROR] Gagal mengenerate nomor BIB:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan internal pada server saat mengenerate BIB.',
    });
  }
};
