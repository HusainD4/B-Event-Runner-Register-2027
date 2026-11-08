import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding database ke MySQL...');

  // 1. Hapus data lama (Wajib dari "anak" ke "induk" untuk menghindari error Foreign Key)
  await prisma.participant.deleteMany();
  await prisma.order.deleteMany();
  await prisma.eventBenefit.deleteMany();
  await prisma.jersey.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('🧹 Data lama berhasil dibersihkan.');

  // 2. Membuat Event 5K (Fun Run)
  const event5k = await prisma.event.create({
    data: {
      ticketName: "Tegal Run 2027 - 5K Fun Run",
      category: "5K",
      stock: 1000,
      price: 150000.00,
      ticketImage: "https://via.placeholder.com/600x400?text=Tiket+5K",
      medalImage: "https://via.placeholder.com/400x400?text=Medali+5K",
      // Memasukkan Benefits sekaligus
      benefits: {
        create: [
          { name: "Medali Finisher 5K", description: "Medali zinc alloy eksklusif untuk penamat 5K" },
          { name: "Racepack Dasar", description: "Tas serut, BIB, dan refreshment" }
        ]
      },
      // Memasukkan opsi Jersey sekaligus (sizes otomatis dikonversi ke JSON di MySQL)
      jerseys: {
        create: [
          { 
            name: "5K Official T-Shirt", 
            type: "T-Shirt", 
            sizes: ["S", "M", "L", "XL", "XXL"] 
          }
        ]
      }
    }
  });
  console.log(`✅ Event dibuat: ${event5k.ticketName} (Stok: ${event5k.stock})`);

  // 3. Membuat Event 10K (Competitive)
  const event10k = await prisma.event.create({
    data: {
      ticketName: "Tegal Run 2027 - 10K Competitive",
      category: "10K",
      stock: 500,
      price: 250000.00,
      ticketImage: "https://via.placeholder.com/600x400?text=Tiket+10K",
      medalImage: "https://via.placeholder.com/400x400?text=Medali+10K",
      benefits: {
        create: [
          { name: "Medali Finisher 10K", description: "Medali zinc alloy ukiran khusus 10K" },
          { name: "Racepack Premium", description: "Tas serut, BIB dengan timing chip, goodies" },
          { name: "Asuransi Lari", description: "Perlindungan medis selama acara berlangsung" }
        ]
      },
      jerseys: {
        create: [
          { 
            name: "10K Official Singlet", 
            type: "Singlet", 
            sizes: ["XS", "S", "M", "L", "XL"] 
          },
          { 
            name: "10K Official Lengan Panjang", 
            type: "Lengan Panjang", 
            sizes: ["S", "M", "L", "XL"] 
          }
        ]
      }
    }
  });
  console.log(`✅ Event dibuat: ${event10k.ticketName} (Stok: ${event10k.stock})`);

  console.log('🎉 Seeding database sukses! Data siap digunakan.');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });