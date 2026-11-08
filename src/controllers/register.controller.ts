import type { Request, Response } from 'express';
import { snap } from '../config/midtrans';
import prisma from '../config/database'; // Menggunakan singleton database terpusat

export const registerEvent = async (req: Request, res: Response): Promise<any> => {
  try {
    // 1. Ambil data dari body (yang sudah dipastikan aman oleh Zod)
    const { userId, eventId, participants } = req.body;
    const participantCount = participants.length;

    // 2. Ambil data Event untuk mendapatkan Harga dan Nama Tiket
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    
    if (!event) {
      return res.status(404).json({ status: "error", message: "Event tidak ditemukan" });
    }

    // Pastikan totalAmount adalah Integer bulat (Midtrans menolak desimal untuk Rupiah)
    const totalAmount = Math.round(Number(event.price) * participantCount);
    
    // Generate Order ID Unik untuk Midtrans (Format: TR-Waktu-Random)
    const midtransOrderId = `TR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // =========================================================================
    // 3. MULAI DATABASE TRANSACTION (ATOMIC)
    // =========================================================================
    const orderResult = await prisma.$transaction(async (tx) => {
      
      // A. PENGURANGAN KUOTA SUPER AMAN (Anti Race-Condition)
      const updateStock = await tx.event.updateMany({
        where: { 
          id: eventId,
          stock: { gte: participantCount } // "gte" = Greater Than or Equal
        },
        data: { 
          stock: { decrement: participantCount } 
        }
      });

      if (updateStock.count === 0) {
        throw new Error("SOLD_OUT"); 
      }

      // B. Buat Order & Sisipkan Semua Peserta sekaligus (Nested Create)
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          midtransOrderId,
          status: "PENDING",
          participants: {
            create: participants.map((p: any) => ({
              eventId,
              fullNameKtp: p.fullNameKtp,
              bibName: p.bibName,
              nik: p.nik,
              gender: p.gender,
              birthPlace: p.birthPlace,
              birthDate: new Date(p.birthDate), 
              fullAddress: p.fullAddress,
              
              // Tangani default value dan undefined
              country: p.country || "Indonesia", 
              bloodType: p.bloodType,
              medicalHistory: p.medicalHistory || null,
              emergencyContactName: p.emergencyContactName,
              emergencyContactPhone: p.emergencyContactPhone,
              jerseyId: p.jerseyId || null,
              selectedSize: p.selectedSize || null,
              communityName: p.communityName || null,
              
              // bibNumber otomatis tidak disertakan agar bernilai null di database
            }))
          }
        },
        include: { user: true } // Sertakan data user pemesan
      });

      // C. Catat Aktivitas ke Tabel Audit Log
      await tx.log.create({
        data: {
          action: "ORDER_CREATED",
          description: `${order.user.fullName} melakukan checkout untuk ${participantCount} tiket ${event.ticketName}`,
          userId,
          entityType: "Order",
          entityId: order.id,
          metadata: { participantCount, totalAmount, midtransOrderId }
        }
      });

      return order; 
    });
    // ================== TRANSAKSI DATABASE SELESAI ===========================

    // 4. GENERATE TOKEN PEMBAYARAN MIDTRANS (SNAP)
    const midtransPayload = {
      transaction_details: {
        order_id: orderResult.midtransOrderId,
        gross_amount: totalAmount // Sudah dipastikan integer
      },
      customer_details: {
        first_name: orderResult.user.fullName,
        email: orderResult.user.email,
        phone: orderResult.user.phoneNumber
      },
      item_details: [{
        id: event.id,
        price: Math.round(Number(event.price)),
        quantity: participantCount,
        name: event.ticketName.substring(0, 50) 
      }]
    };

    const snapResponse = await snap.createTransaction(midtransPayload);

    // 5. Kembalikan Response ke Frontend
    return res.status(201).json({
      status: "success",
      message: "Pendaftaran diamankan! Silakan selesaikan pembayaran.",
      data: {
        orderId: orderResult.id,
        midtransOrderId: orderResult.midtransOrderId,
        paymentToken: snapResponse.token,
        paymentUrl: snapResponse.redirect_url
      }
    });

  } catch (error: any) {
    if (error.message === "SOLD_OUT") {
      return res.status(400).json({ 
        status: "error", 
        message: "Maaf, kuota tiket tidak mencukupi atau sudah habis terjual." 
      });
    }
    
    console.error("🚨 [ERROR] Register Controller:", error);
    return res.status(500).json({ 
      status: "error", 
      message: "Terjadi kesalahan internal pada server. Coba beberapa saat lagi." 
    });
  }
};