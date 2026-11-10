import http from 'http';
import app from '../src/app';
import prisma from '../src/config/database';

function randomNik(): string {
  let num = '3328';
  for (let i = 0; i < 12; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

const firstNames = ['Budi', 'Ahmad', 'Dimas', 'Eko', 'Rian', 'Fajar', 'Siti', 'Dewi', 'Ratna', 'Nur', 'Indah', 'Lestari', 'Bagus', 'Hendra', 'Surya', 'Ilham', 'Reza', 'Gilang', 'Yusuf', 'Aris'];
const lastNames = ['Prasetyo', 'Hidayat', 'Santoso', 'Wijaya', 'Kusuma', 'Saputra', 'Nugroho', 'Wibowo', 'Pratama', 'Utomo', 'Siregar', 'Setiawan', 'Ramadhan', 'Firmansyah', 'Purnomo'];
const bloodTypes: Array<'A' | 'B' | 'AB' | 'O'> = ['A', 'B', 'AB', 'O'];

function randomPerson(index: number) {
  const first = firstNames[index % firstNames.length]!;
  const last = lastNames[(index * 3) % lastNames.length]!;
  const fullNameKtp = `${first} ${last} ${Math.floor(Math.random() * 900 + 100)}`;
  const bibName = `${first.toUpperCase()} ${last.charAt(0)}`;
  const gender: 'MALE' | 'FEMALE' = index % 2 === 0 ? 'MALE' : 'FEMALE';
  const bloodType = bloodTypes[index % bloodTypes.length]!;
  const nik = randomNik();
  const phoneSuffix = Math.floor(Math.random() * 90000000 + 10000000);
  const emergencyPhone = `+6281${phoneSuffix}`;

  return {
    fullNameKtp,
    bibName: bibName.slice(0, 15),
    nik,
    gender,
    birthPlace: 'Tegal',
    birthDate: '1998-07-21',
    fullAddress: `Jl. Veteran No. ${index + 1}, Kota Tegal`,
    bloodType,
    emergencyContactName: `Keluarga ${first}`,
    emergencyContactPhone: emergencyPhone,
    communityName: index % 3 === 0 ? 'Tegal Runners' : null,
  };
}

async function run() {
  console.log('================================================================');
  console.log('🧪 PENGUJIAN KETAHANAN BACKEND (20x POST /api/register)');
  console.log('================================================================\n');

  // 1. Dapatkan Event ID dan User ID valid dari database
  const event = await prisma.event.findFirst({
    where: { stock: { gt: 0 } },
  });

  if (!event) {
    console.error('❌ Tidak ada event dengan stok aktif di database.');
    process.exit(1);
  }

  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        fullName: 'Peserta Uji Ketahanan',
        email: 'stress-tester@tegalrun.id',
        phoneNumber: '+6281234567890',
      },
    });
  }

  console.log(`📌 Target Event : ${event.ticketName} (Stok Saat Ini: ${event.stock})`);
  console.log(`📌 User Pemesan : ${user.fullName} (${user.id})\n`);

  // 2. Jalankan HTTP server di port 3000
  const PORT = 3000;
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`🚀 Server HTTP menyala di http://localhost:${PORT}`);
      console.log(`⚡ Mengirimkan 20 request pendaftaran acak bertubi-tubi...\n`);
      resolve();
    });
  });

  const results: Array<{
    reqNo: number;
    participant: string;
    nik: string;
    status: number;
    durationMs: number;
    response: any;
  }> = [];

  const startTimeAll = Date.now();

  for (let i = 1; i <= 20; i++) {
    const person = randomPerson(i);
    const payload = {
      userId: user.id,
      eventId: event.id,
      participants: [person],
    };

    const payloadStr = JSON.stringify(payload);
    const startReq = Date.now();

    const res = await new Promise<{ status: number; body: any }>((resolve) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: PORT,
          path: '/api/register',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payloadStr).toString(),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        },
        (r) => {
          let data = '';
          r.on('data', (c) => (data += c));
          r.on('end', () => {
            let parsed = data;
            try {
              parsed = JSON.parse(data);
            } catch {}
            resolve({ status: r.statusCode || 500, body: parsed });
          });
        }
      );

      req.on('error', (err) => resolve({ status: 500, body: { error: err.message } }));
      req.write(payloadStr);
      req.end();
    });

    const durationMs = Date.now() - startReq;
    results.push({
      reqNo: i,
      participant: person.fullNameKtp,
      nik: person.nik,
      status: res.status,
      durationMs,
      response: res.body,
    });

    const icon = res.status === 201 ? '🟢 [201 Created]' : res.status === 429 ? '🛡️ [429 Throttled]' : `⚠️ [${res.status}]`;
    const detailMsg = res.status === 201
      ? `Order ID: ${res.body.data?.midtransOrderId} (Token Midtrans Diterbitkan)`
      : res.body.message || JSON.stringify(res.body);

    console.log(`Req #${String(i).padStart(2, '0')} | ${icon} | ${person.fullNameKtp.padEnd(25)} | ${durationMs}ms | ${detailMsg}`);
  }

  const totalDuration = Date.now() - startTimeAll;

  // 3. Cek sisa stok di database setelah pengetesan
  const updatedEvent = await prisma.event.findUnique({ where: { id: event.id } });
  const totalOrders = await prisma.order.count({ where: { eventId: event.id } as any });
  const totalParticipantsInDb = await prisma.participant.count({ where: { eventId: event.id } });

  console.log('\n================================================================');
  console.log('📊 REKAPITULASI UJI KETAHANAN SISTEM (WAR TIKET)');
  console.log('================================================================');
  const count201 = results.filter((r) => r.status === 201).length;
  const count429 = results.filter((r) => r.status === 429).length;
  const countOther = results.filter((r) => r.status !== 201 && r.status !== 429).length;

  console.log(`⏱️ Total Waktu Eksekusi     : ${totalDuration} ms (Rata-rata: ${Math.round(totalDuration / 20)} ms / request)`);
  console.log(`✅ Berhasil Checkout (201)  : ${count201} transaksi`);
  console.log(`🛡️ Tertahan Rate-Limit (429): ${count429} request (Mencegah Bot Spam)`);
  console.log(`⚠️ Status Lainnya           : ${countOther}`);
  console.log(`📦 Stok Event Awal          : ${event.stock}`);
  console.log(`📦 Sisa Stok di Database    : ${updatedEvent?.stock}`);
  console.log(`👥 Total Peserta di DB      : ${totalParticipantsInDb}`);
  console.log('================================================================');

  server.close();
  await prisma.$disconnect();
}

run().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
