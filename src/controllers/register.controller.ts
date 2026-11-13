import type { Request, Response } from 'express';
import { snap } from '../config/midtrans';
import prisma from '../config/database'; // Menggunakan singleton database terpusat
import { sendOrderNotification } from '../services/notification.service';
import { getEventRegistrationStatus, getEventTimerPhase } from '../utils/event-timing';

export const registerEvent = async (req: Request, res: Response): Promise<any> => {
  try {
    // 1. Ambil data dari body (yang sudah dipastikan aman oleh Zod)
    // userId dari frontend diabaikan — user selalu di-resolve dari bookerEmail
    const { eventId, participants, bookerName, bookerEmail, bookerPhone } = req.body;
    const participantCount = participants.length;

    // 2. Ambil data Event untuk mendapatkan Harga dan Nama Tiket
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    
    if (!event) {
      return res.status(404).json({ status: "error", message: "Event tidak ditemukan" });
    }

    // Periksa apakah pendaftaran ditutup secara global atau per event oleh panitia
    const registrationSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: [
            'IS_REGISTRATION_CLOSED',
            'event_registration_closed',
            'EVENT_COUNTDOWN_DATE',
            'event_countdown_date',
            'registration_operating_hours',
            'registration_closed_message',
            'maintenance_enabled',
            'maintenance_message'
          ]
        }
      },
      select: { key: true, value: true },
    });
    const findRegistrationSetting = (key: string) => registrationSettings.find(setting => setting.key === key)?.value || '';
    if (findRegistrationSetting('maintenance_enabled') === 'true') {
      return res.status(503).json({
        status: 'error',
        code: 'MAINTENANCE_MODE',
        message: findRegistrationSetting('maintenance_message') || 'Pendaftaran sedang tidak tersedia karena website dalam pemeliharaan.'
      });
    }
    const globalClosedSetting = registrationSettings.find(setting => setting.key === 'IS_REGISTRATION_CLOSED')
      || registrationSettings.find(setting => setting.key === 'event_registration_closed');
    const countdownSetting = registrationSettings.find(setting => setting.key === 'EVENT_COUNTDOWN_DATE')
      || registrationSettings.find(setting => setting.key === 'event_countdown_date');
    const globalTimerPhase = getEventTimerPhase(countdownSetting?.value ? new Date(countdownSetting.value) : null);
    if (globalClosedSetting?.value === 'true' || globalTimerPhase !== 'UPCOMING') {
      const operatingHours = findRegistrationSetting('registration_operating_hours');
      const customMessage = findRegistrationSetting('registration_closed_message');
      const closureMessage = globalTimerPhase === 'RACE_DAY'
        ? 'Pendaftaran ditutup otomatis karena acara telah dimulai.'
        : globalTimerPhase === 'COMPLETED'
          ? 'Pendaftaran ditutup karena hari pelaksanaan acara telah lewat.'
          : customMessage || 'Pendaftaran Tegal Run 2026 sedang ditutup.';
      return res.status(400).json({ 
        status: "error", 
        message: `${closureMessage}${operatingHours ? ` Jam operasional pendaftaran: ${operatingHours}.` : ''}`
      });
    }

    function normalizePhone(p: string | null | undefined): string {
      if (!p) return '';
      let cleaned = String(p).trim().replace(/[\s\-()]/g, '');
      if (cleaned.startsWith('08')) {
        return '+628' + cleaned.slice(2);
      } else if (cleaned.startsWith('628')) {
        return '+' + cleaned;
      }
      return cleaned;
    }

    // Ambil Pengaturan Biaya Layanan & Timer Pembayaran dari Database
    const [feeEnabledSetting, feeTypeSetting, feeAmountSetting, timerSetting] = await Promise.all([
      prisma.appSetting.findUnique({ where: { key: 'fee_enabled' } }),
      prisma.appSetting.findUnique({ where: { key: 'fee_type' } }),
      prisma.appSetting.findUnique({ where: { key: 'fee_amount' } }),
      prisma.appSetting.findUnique({ where: { key: 'payment_timer_minutes' } }),
    ]);

    const feeEnabled = feeEnabledSetting ? feeEnabledSetting.value === 'true' : true;
    const feeType = feeTypeSetting?.value || 'PER_TRANSACTION';
    const feeAmount = feeEnabled ? (feeAmountSetting ? Math.max(0, Number(feeAmountSetting.value)) : 5000) : 0;
    const paymentTimerMinutes = timerSetting ? Math.max(5, parseInt(timerSetting.value, 10) || 30) : 30;

    // Kumpulkan seluruh eventId unik yang didaftarkan (default ke eventId pemesan jika peserta tidak spesifik)
    const distinctEventIds = Array.from(new Set(participants.map((p: any) => p.eventId || eventId)));
    const events = await prisma.event.findMany({
      where: { id: { in: distinctEventIds as string[] } },
      include: { jerseys: true }
    });
    const eventMap = new Map<string, any>(events.map(ev => [ev.id, ev]));

    // Validasi kuota dan status tutup untuk setiap kategori
    const eventCounts: Record<string, number> = {};
    let subtotalTickets = 0;

    for (const p of participants) {
      const pEventId = p.eventId || eventId;
      const targetEv = eventMap.get(pEventId);
      if (!targetEv) {
        return res.status(404).json({ status: "error", message: "Kategori event tiket peserta tidak ditemukan." });
      }
      const eventRegistrationStatus = getEventRegistrationStatus(targetEv.eventDate, targetEv.isClosed);
      if (eventRegistrationStatus.registrationClosed && !eventRegistrationStatus.registrationClosedByTimer) {
        return res.status(400).json({ 
          status: "error", 
          message: `Pendaftaran untuk kategori ${targetEv.ticketName} telah resmi ditutup oleh panitia.` 
        });
      }
      if (eventRegistrationStatus.registrationClosedByTimer) {
        return res.status(400).json({
          status: 'error',
          message: eventRegistrationStatus.registrationPhase === 'RACE_DAY'
            ? `Pendaftaran kategori ${targetEv.ticketName} ditutup karena acara telah dimulai.`
            : `Pendaftaran kategori ${targetEv.ticketName} ditutup karena hari pelaksanaan telah lewat.`
        });
      }
      const eventJerseys = targetEv.jerseys || [];
      if (eventJerseys.length > 0 && !p.jerseyId) {
        return res.status(400).json({
          status: 'error',
          message: `Pilih tipe jersey untuk kategori ${targetEv.ticketName}.`
        });
      }
      if (p.jerseyId) {
        const selectedJersey = eventJerseys.find((jersey: { id: string }) => jersey.id === p.jerseyId);
        if (!selectedJersey) {
          return res.status(400).json({
            status: 'error',
            message: `Pilihan jersey peserta tidak sesuai dengan kategori ${targetEv.ticketName}.`
          });
        }
        const availableSizes = Array.isArray(selectedJersey.sizes) ? selectedJersey.sizes : [];
        if (!p.selectedSize || !availableSizes.includes(p.selectedSize)) {
          return res.status(400).json({
            status: 'error',
            message: `Ukuran jersey peserta tidak tersedia untuk tipe ${selectedJersey.type}.`
          });
        }
      }
      eventCounts[pEventId] = (eventCounts[pEventId] || 0) + 1;
      subtotalTickets += Number(targetEv.price);
    }

    // Hitung Biaya Layanan
    let serviceFee = 0;
    if (feeEnabled && feeAmount > 0) {
      if (feeType === 'PER_TICKET') {
        serviceFee = feeAmount * participantCount;
      } else {
        serviceFee = feeAmount;
      }
    }

    // Total Amount Bulat Integer
    const totalAmount = Math.round(subtotalTickets + serviceFee);
    
    // Kelola Identitas User Pemesan
    const cleanEmail = bookerEmail ? String(bookerEmail).toLowerCase().trim() : (participants[0]?.email ? String(participants[0].email).toLowerCase().trim() : null);
    const cleanPhone = normalizePhone(bookerPhone || participants[0]?.phoneNumber || participants[0]?.emergencyContactPhone || '081234567890');
    const cleanName = bookerName ? String(bookerName).trim() : (participants[0]?.fullNameKtp || 'Peserta Tegal Run 2026');

    let targetUser: any = null;
    if (cleanEmail) {
      targetUser = await prisma.user.findFirst({ where: { email: cleanEmail } });
    }

    if (!targetUser) {
      targetUser = await prisma.user.create({
        data: {
          fullName: cleanName,
          email: cleanEmail || `peserta_${Date.now()}@tegalrun.id`,
          phoneNumber: cleanPhone,
        },
      });
    } else {
      targetUser = await prisma.user.update({
        where: { id: targetUser.id },
        data: {
          fullName: cleanName,
          phoneNumber: cleanPhone,
        },
      });
    }

    const finalUserId = targetUser.id;

    // Generate Order ID Unik untuk Midtrans (Format: TR-Waktu-Random)
    const midtransOrderId = `TR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const paymentExpiresAt = new Date(Date.now() + paymentTimerMinutes * 60_000);

    // =========================================================================
    // 3. MULAI DATABASE TRANSACTION (ATOMIC)
    // =========================================================================
    const orderResult = await prisma.$transaction(async (tx) => {
      const currentSettings = await tx.appSetting.findMany({
        where: {
          key: {
            in: [
              'IS_REGISTRATION_CLOSED',
              'event_registration_closed',
              'EVENT_COUNTDOWN_DATE',
              'event_countdown_date',
              'registration_operating_hours',
              'registration_closed_message',
              'maintenance_enabled',
              'maintenance_message'
            ]
          }
        },
        select: { key: true, value: true }
      });
      const findCurrentSetting = (key: string) => currentSettings.find(setting => setting.key === key)?.value || '';
      if (findCurrentSetting('maintenance_enabled') === 'true') {
        throw new Error('REGISTRATION_MAINTENANCE');
      }
      const currentClosedSetting = currentSettings.find(setting => setting.key === 'IS_REGISTRATION_CLOSED')
        || currentSettings.find(setting => setting.key === 'event_registration_closed');
      const currentCountdownSetting = currentSettings.find(setting => setting.key === 'EVENT_COUNTDOWN_DATE')
        || currentSettings.find(setting => setting.key === 'event_countdown_date');
      const currentTimerPhase = getEventTimerPhase(
        currentCountdownSetting?.value ? new Date(currentCountdownSetting.value) : null
      );
      if (currentClosedSetting?.value === 'true' || currentTimerPhase !== 'UPCOMING') {
        if (currentClosedSetting?.value === 'true' && currentTimerPhase === 'UPCOMING') {
          throw new Error('REGISTRATION_CLOSED_MANUAL');
        }
        throw new Error(currentTimerPhase === 'RACE_DAY'
          ? 'REGISTRATION_CLOSED_RACE_DAY'
          : currentTimerPhase === 'COMPLETED'
            ? 'REGISTRATION_CLOSED_COMPLETED'
            : 'REGISTRATION_CLOSED_MANUAL');
      }

      const currentEvents = await tx.event.findMany({
        where: { id: { in: distinctEventIds as string[] } },
        include: { jerseys: true }
      });
      const currentEventMap = new Map(currentEvents.map(currentEvent => [currentEvent.id, currentEvent]));
      for (const [currentEventId] of Object.entries(eventCounts)) {
        const currentEvent = currentEventMap.get(currentEventId);
        if (!currentEvent) throw new Error('REGISTRATION_CLOSED_CATEGORY');
        const eventRegistrationStatus = getEventRegistrationStatus(currentEvent.eventDate, currentEvent.isClosed);
        if (eventRegistrationStatus.registrationClosed && !eventRegistrationStatus.registrationClosedByTimer) {
          throw new Error('REGISTRATION_CLOSED_CATEGORY');
        }
        if (eventRegistrationStatus.registrationClosedByTimer) {
          throw new Error(eventRegistrationStatus.registrationPhase === 'RACE_DAY'
            ? 'REGISTRATION_CLOSED_RACE_DAY'
            : 'REGISTRATION_CLOSED_COMPLETED');
        }
      }
      for (const participant of participants) {
        const participantEventId = participant.eventId || eventId;
        const currentEvent = currentEventMap.get(participantEventId);
        if (!currentEvent) throw new Error('REGISTRATION_CLOSED_CATEGORY');
        const eventJerseys = currentEvent.jerseys || [];
        if (eventJerseys.length > 0 && !participant.jerseyId) {
          throw new Error('JERSEY_SELECTION_REQUIRED');
        }
        if (participant.jerseyId) {
          const selectedJersey = eventJerseys.find((jersey: { id: string }) => jersey.id === participant.jerseyId);
          const availableSizes = selectedJersey && Array.isArray(selectedJersey.sizes) ? selectedJersey.sizes : [];
          if (!selectedJersey || !participant.selectedSize || !availableSizes.includes(participant.selectedSize)) {
            throw new Error('JERSEY_SELECTION_INVALID');
          }
        }
      }
      
      // A. PENGURANGAN KUOTA SUPER AMAN UNTUK TIAP KATEGORI (Anti Race-Condition)
      for (const [evId, count] of Object.entries(eventCounts)) {
        const updateStock = await tx.event.updateMany({
          where: { 
            id: evId,
            stock: { gte: count }
          },
          data: { 
            stock: { decrement: count } 
          }
        });

        if (updateStock.count === 0) {
          throw new Error("SOLD_OUT"); 
        }
      }

      // B. Buat Order & Sisipkan Semua Peserta sekaligus (Nested Create)
      const order = await tx.order.create({
        data: {
          userId: finalUserId,
          totalAmount,
          midtransOrderId,
          status: "PENDING",
          participants: {
            create: participants.map((p: any) => ({
              eventId: p.eventId || eventId,
              fullNameKtp: p.fullNameKtp,
              bibName: p.bibName,
              phoneNumber: normalizePhone(p.phoneNumber) || null,
              nik: p.nik,
              gender: p.gender,
              birthPlace: p.birthPlace,
              birthDate: new Date(p.birthDate), 
              fullAddress: p.fullAddress,
              country: p.country || "Indonesia", 
              bloodType: p.bloodType,
              medicalHistory: p.medicalHistory || null,
              emergencyContactName: p.emergencyContactName,
              emergencyContactPhone: normalizePhone(p.emergencyContactPhone),
              jerseyId: p.jerseyId || null,
              selectedSize: p.selectedSize || null,
              communityName: p.communityName || null,
            }))
          }
        },
        include: { user: true, participants: { include: { event: true } } }
      });

      // C. Catat Aktivitas ke Tabel Audit Log
      await tx.log.create({
        data: {
          action: "ORDER_CREATED",
          description: `${order.user.fullName} melakukan checkout untuk ${participantCount} tiket (Total: Rp ${totalAmount.toLocaleString('id-ID')})`,
          userId: finalUserId,
          entityType: "Order",
          entityId: order.id,
          metadata: { participantCount, totalAmount, midtransOrderId, serviceFee }
        }
      });

      await tx.appSetting.create({
        data: {
          key: `payment_expiry_${order.id}`,
          value: paymentExpiresAt.toISOString(),
          description: 'Batas waktu pembayaran untuk pesanan',
        },
      });

      return order; 
    });
    // ================== TRANSAKSI DATABASE SELESAI ===========================

    // 4. GENERATE TOKEN PEMBAYARAN MIDTRANS (SNAP)
    const midtransItemDetails: any[] = [];
    for (const [evId, count] of Object.entries(eventCounts)) {
      const ev = eventMap.get(evId)!;
      midtransItemDetails.push({
        id: ev.id,
        price: Math.round(Number(ev.price)),
        quantity: count,
        name: ev.ticketName.substring(0, 50)
      });
    }

    if (serviceFee > 0) {
      midtransItemDetails.push({
        id: 'SERVICE_FEE',
        price: Math.round(serviceFee),
        quantity: 1,
        name: 'Biaya Layanan & Administrasi'
      });
    }

    const midtransPayload: any = {
      transaction_details: {
        order_id: orderResult.midtransOrderId,
        gross_amount: totalAmount
      },
      customer_details: {
        first_name: orderResult.user.fullName,
        email: orderResult.user.email,
        phone: orderResult.user.phoneNumber
      },
      item_details: midtransItemDetails,
      custom_expiry: {
        expiry_duration: paymentTimerMinutes,
        unit: 'minute'
      }
    };

    const snapResponse = await snap.createTransaction(midtransPayload);

    // Simpan token Snap ke kolom snapToken tabel Order secara persisten
    if (snapResponse?.token) {
      await prisma.order.update({
        where: { id: orderResult.id },
        data: { snapToken: snapResponse.token }
      });
    }

    // Kirim notifikasi transaksi baru (menunggu pembayaran)
    sendOrderNotification({
      orderId: orderResult.id,
      type: 'PENDING',
      siteOrigin: req.get('origin'),
    }).catch((err) => console.warn('⚠️ Pending notification dispatch:', err.message));

    // 5. Kembalikan Response ke Frontend
    return res.status(201).json({
      status: "success",
      message: "Pendaftaran diamankan! Silakan selesaikan pembayaran.",
      data: {
        orderId: orderResult.id,
        midtransOrderId: orderResult.midtransOrderId,
        paymentToken: snapResponse.token,
        paymentUrl: snapResponse.redirect_url,
        paymentTimerMinutes,
        paymentExpiresAt: paymentExpiresAt.toISOString(),
        serviceFee
      }
    });

  } catch (error: any) {
    if (error.message === "SOLD_OUT") {
      return res.status(400).json({ 
        status: "error", 
        message: "Maaf, kuota tiket tidak mencukupi atau sudah habis terjual." 
      });
    }
    if (error.message === 'REGISTRATION_CLOSED_RACE_DAY') {
      return res.status(400).json({ status: 'error', message: 'Pendaftaran ditutup otomatis karena acara telah dimulai.' });
    }
    if (error.message === 'REGISTRATION_CLOSED_COMPLETED') {
      return res.status(400).json({ status: 'error', message: 'Pendaftaran ditutup karena hari pelaksanaan acara telah lewat.' });
    }
    if (error.message === 'REGISTRATION_CLOSED_CATEGORY') {
      return res.status(400).json({ status: 'error', message: 'Kategori tiket telah ditutup oleh panitia.' });
    }
    if (error.message === 'REGISTRATION_CLOSED_MANUAL') {
      const [hoursSetting, messageSetting] = await Promise.all([
        prisma.appSetting.findUnique({ where: { key: 'registration_operating_hours' } }),
        prisma.appSetting.findUnique({ where: { key: 'registration_closed_message' } })
      ]);
      const hours = hoursSetting?.value;
      return res.status(400).json({
        status: 'error',
        message: `${messageSetting?.value || 'Pendaftaran sedang ditutup.'}${hours ? ` Jam operasional pendaftaran: ${hours}.` : ''}`
      });
    }
    if (error.message === 'REGISTRATION_MAINTENANCE') {
      const maintenanceMessage = await prisma.appSetting.findUnique({ where: { key: 'maintenance_message' } });
      return res.status(503).json({
        status: 'error',
        code: 'MAINTENANCE_MODE',
        message: maintenanceMessage?.value || 'Pendaftaran sedang tidak tersedia karena website dalam pemeliharaan.'
      });
    }
    
    console.error("🚨 [ERROR] Register Controller:", error);
    return res.status(500).json({ 
      status: "error", 
      message: "Terjadi kesalahan internal pada server. Coba beberapa saat lagi." 
    });
  }
};