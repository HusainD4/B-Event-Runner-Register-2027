import { z } from 'zod';
import prisma from '../config/database';

export const DEFAULT_INSTRUCTIONS = {
  title: 'Petunjuk Pengambilan Racepack & Race Day:',
  points: [
    'Tunjukkan E-Tiket ini (versi cetak atau layar ponsel) beserta KTP asli saat pengambilan Racepack (RPC).',
    'Pengambilan paket lomba dilaksanakan pada H-2 s/d H-1 perlombaan di Sekretariat Race Village Alun-Alun Kota Tegal.',
    'Nomor BIB dada wajib disematkan di bagian depan jersey selama lomba agar terdeteksi oleh timing system.',
    'Apabila berhalangan mengambil langsung, pengambilan dapat diwakilkan dengan menyertakan Surat Kuasa dan fotokopi KTP peserta bersangkutan.',
  ],
};

const instructionsSchema = z.object({
  title: z.string(),
  points: z.array(z.string()),
});

export async function loadRacepackInstructions() {
  const setting = await prisma.appSetting.findUnique({
    where: { key: 'racepack_instructions' },
  });
  if (!setting) return DEFAULT_INSTRUCTIONS;
  return instructionsSchema.parse(JSON.parse(setting.value));
}
