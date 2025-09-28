// backend/controllers/primaController.js
const { z } = require('zod');
const prisma = require('../src/prisma');

const periodSchema = z.object({
  tahun: z.coerce.number().int().min(2000).max(2100),
  bulan: z.coerce.number().int().min(1).max(12),
});

const wavesSchema = z.object({
  wave1: z.coerce.number().min(0).default(0),
  wave2: z.coerce.number().min(0).default(0),
  wave3: z.coerce.number().min(0).default(0),
  wave4: z.coerce.number().min(0).default(0),
});

const listQuery = z.object({
  tahun: z.coerce.number().int().min(2000).max(2100).optional(),
  bulan: z.coerce.number().int().min(1).max(12).optional(),
  order: z.enum(['asc','desc']).optional(), // opsional: urutan
});

const idParam = z.object({ id: z.coerce.number().int().positive() });

function hitungNilaiAvg({ wave1, wave2, wave3, wave4 }) {
  const w1 = Number(wave1) || 0;
  const w2 = Number(wave2) || 0;
  const w3 = Number(wave3) || 0;
  const w4 = Number(wave4) || 0;
  const avg = (w1 + w2 + w3 + w4) / 4;
  return parseFloat(avg.toFixed(2));
}

async function list(req, res) {
  try {
    const pq = listQuery.safeParse(req.query);
    if (!pq.success) {
      return res.status(400).json({ message: 'Query tidak valid', issues: pq.error.flatten() });
    }

    const where = {
      ...(pq.data.tahun ? { tahun: pq.data.tahun } : {}),
      ...(pq.data.bulan ? { bulan: pq.data.bulan } : {}),
    };
    const orderBy = (pq.data.order === 'asc')
      ? [{ tahun: 'asc' }, { bulan: 'asc' }]
      : [{ tahun: 'desc' }, { bulan: 'desc' }];

    // Ambil semua prima rows
    const rows = await prisma.indeksPrima.findMany({ where, orderBy });

    // Ambil target tahunan untuk tahun-tahun yang ada di rows
    const tahunSet = Array.from(new Set(rows.map(r => r.tahun)));
    const targets = await prisma.primaTarget.findMany({
      where: { tahun: { in: tahunSet } }
    });
    const mapTarget = new Map(targets.map(t => [t.tahun, t.target]));

    // Gabungkan target per tahun + format nilai 2 desimal
    const formatted = rows.map(r => ({
      ...r,
      nilai: r.nilai != null ? parseFloat(Number(r.nilai).toFixed(2)) : null,
      target: mapTarget.has(r.tahun)
        ? parseFloat(Number(mapTarget.get(r.tahun)).toFixed(2))
        : 0,
    }));

    res.json(formatted);
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
      return res.status(400).json({
        message: 'Input tidak valid',
        issues: { ...p1.error?.flatten?.(), ...p2.error?.flatten?.() },
      });
    }

    const { tahun, bulan } = p1.data;
    const { wave1, wave2, wave3, wave4 } = p2.data;
    const nilai = hitungNilaiAvg({ wave1, wave2, wave3, wave4 });

    const row = await prisma.indeksPrima.create({
      data: { tahun, bulan, wave1, wave2, wave3, wave4, nilai },
    });

    res.status(201).json({
      ...row,
      nilai: parseFloat(Number(row.nilai).toFixed(2)),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal membuat data Prima' });
  }
}

async function update(req, res) {
  try {
    const pid = idParam.safeParse(req.params);
    if (!pid.success) {
      return res.status(400).json({ message: 'Param tidak valid', issues: pid.error.flatten() });
    }

    const periodPartial = periodSchema.partial().safeParse(req.body);
    const wavesPartial = wavesSchema.partial().safeParse(req.body);
    if (!periodPartial.success || !wavesPartial.success) {
      return res.status(400).json({
        message: 'Input tidak valid',
        issues: { ...periodPartial.error?.flatten?.(), ...wavesPartial.error?.flatten?.() },
      });
    }

    const id = pid.data.id;
    const before = await prisma.indeksPrima.findUnique({ where: { id } });
    if (!before) return res.status(404).json({ message: 'Data tidak ditemukan' });

    const merged = {
      tahun: periodPartial.data.tahun ?? before.tahun,
      bulan: periodPartial.data.bulan ?? before.bulan,
      wave1: wavesPartial.data.wave1 ?? before.wave1,
      wave2: wavesPartial.data.wave2 ?? before.wave2,
      wave3: wavesPartial.data.wave3 ?? before.wave3,
      wave4: wavesPartial.data.wave4 ?? before.wave4,
    };
    const nilai = hitungNilaiAvg(merged);

    const row = await prisma.indeksPrima.update({
      where: { id },
      data: {
        tahun: merged.tahun,
        bulan: merged.bulan,
        wave1: merged.wave1,
        wave2: merged.wave2,
        wave3: merged.wave3,
        wave4: merged.wave4,
        nilai,
      },
    });

    res.json({
      ...row,
      nilai: parseFloat(Number(row.nilai).toFixed(2)),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal mengubah data Prima' });
  }
}

async function remove(req, res) {
  try {
    const pid = idParam.safeParse(req.params);
    if (!pid.success) {
      return res.status(400).json({ message: 'Param tidak valid', issues: pid.error.flatten() });
    }

    await prisma.indeksPrima.delete({ where: { id: pid.data.id } });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal menghapus data Prima' });
  }
}

module.exports = { list, create, update, remove };
