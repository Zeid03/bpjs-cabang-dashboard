const { z } = require('zod');
const prisma = require('../src/prisma');

const periodSchema = z.object({
  tahun: z.coerce.number().int().min(2000).max(2100),
  bulan: z.coerce.number().int().min(1).max(12),
});

const wavesSchema = z.object({
  wave1: z.coerce.number().int().min(0).default(0),
  wave2: z.coerce.number().int().min(0).default(0),
  wave3: z.coerce.number().int().min(0).default(0),
  wave4: z.coerce.number().int().min(0).default(0),
});

const listQuery = z.object({
  tahun: z.coerce.number().int().min(2000).max(2100).optional(),
  bulan: z.coerce.number().int().min(1).max(12).optional(),
});

const idParam = z.object({ id: z.coerce.number().int().positive() });

async function list(req, res) {
  try {
    const pq = listQuery.safeParse(req.query);
    if (!pq.success) return res.status(400).json({ message: 'Query tidak valid', issues: pq.error.flatten() });
    const where = { ...(pq.data.tahun ? { tahun: pq.data.tahun } : {}), ...(pq.data.bulan ? { bulan: pq.data.bulan } : {}) };
    const rows = await prisma.indeksPrima.findMany({ where, orderBy: [{ tahun: 'desc' }, { bulan: 'desc' }] });
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal mengambil data' });
  }
}

async function create(req, res) {
  try {
    const p1 = periodSchema.safeParse(req.body);
    const p2 = wavesSchema.safeParse(req.body);
    if (!p1.success || !p2.success) {
      return res.status(400).json({ message: 'Input tidak valid', issues: { ...p1.error?.flatten?.(), ...p2.error?.flatten?.() } });
    }
    const { tahun, bulan } = p1.data;
    const { wave1, wave2, wave3, wave4 } = p2.data;
    const nilai = wave1 + wave2 + wave3 + wave4;

    const row = await prisma.indeksPrima.create({ data: { tahun, bulan, wave1, wave2, wave3, wave4, nilai } });
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal membuat data Prima' });
  }
}

async function update(req, res) {
  try {
    const pid = idParam.safeParse(req.params);
    if (!pid.success) return res.status(400).json({ message: 'Param tidak valid', issues: pid.error.flatten() });

    const periodPartial = periodSchema.partial().safeParse(req.body);
    const wavesPartial = wavesSchema.partial().safeParse(req.body);
    if (!periodPartial.success || !wavesPartial.success) {
      return res.status(400).json({ message: 'Input tidak valid', issues: { ...periodPartial.error?.flatten?.(), ...wavesPartial.error?.flatten?.() } });
    }

    const id = pid.data.id;
    const before = await prisma.indeksPrima.findUnique({ where: { id } });
    if (!before) return res.status(404).json({ message: 'Data tidak ditemukan' });

    const wave1 = wavesPartial.data.wave1 ?? before.wave1;
    const wave2 = wavesPartial.data.wave2 ?? before.wave2;
    const wave3 = wavesPartial.data.wave3 ?? before.wave3;
    const wave4 = wavesPartial.data.wave4 ?? before.wave4;
    const nilai = wave1 + wave2 + wave3 + wave4;

    const row = await prisma.indeksPrima.update({
      where: { id },
      data: {
        tahun: periodPartial.data.tahun ?? before.tahun,
        bulan: periodPartial.data.bulan ?? before.bulan,
        wave1, wave2, wave3, wave4, nilai,
      },
    });
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal mengubah data Prima' });
  }
}

async function remove(req, res) {
  try {
    const pid = idParam.safeParse(req.params);
    if (!pid.success) return res.status(400).json({ message: 'Param tidak valid', issues: pid.error.flatten() });

    await prisma.indeksPrima.delete({ where: { id: pid.data.id } });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal menghapus data Prima' });
  }
}

module.exports = { list, create, update, remove };
