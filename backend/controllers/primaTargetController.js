// backend/controllers/primaTargetController.js
const { z } = require('zod');
const prisma = require('../src/prisma');

const upsertSchema = z.object({
  tahun: z.coerce.number().int().min(2000).max(2100),
  target: z.coerce.number().min(0).default(0),
});

async function list(req, res) {
  try {
    const rows = await prisma.primaTarget.findMany({ orderBy: { tahun: 'asc' } });
    res.json(rows.map(r => ({ ...r, target: parseFloat(Number(r.target).toFixed(2)) })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal mengambil target tahunan' });
  }
}

async function getByYear(req, res) {
  try {
    const tahun = Number(req.params.tahun);
    if (!tahun) return res.status(400).json({ message: 'Tahun tidak valid' });
    const row = await prisma.primaTarget.findUnique({ where: { tahun } });
    if (!row) return res.json({ tahun, target: 0 });
    res.json({ tahun: row.tahun, target: parseFloat(Number(row.target).toFixed(2)) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal mengambil target tahun' });
  }
}

async function upsert(req, res) {
  try {
    const p = upsertSchema.safeParse(req.body);
    if (!p.success) return res.status(400).json({ message: 'Input tidak valid', issues: p.error.flatten() });

    const { tahun, target } = p.data;
    const row = await prisma.primaTarget.upsert({
      where: { tahun },
      update: { target },
      create: { tahun, target },
    });
    res.json({ ...row, target: parseFloat(Number(row.target).toFixed(2)) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal menyimpan target tahunan' });
  }
}

module.exports = { list, getByYear, upsert };
