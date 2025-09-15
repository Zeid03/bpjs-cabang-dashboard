const { z } = require('zod');
const prisma = require('../src/prisma');

const monthStr = z.string().regex(/^\d{4}-\d{2}$/);
const nonneg = z.coerce.number().int().min(0);

const idParam = z.object({ id: z.coerce.number().int().positive() });
const listQuery = z.object({ bulan: monthStr.optional() });
const bodySchema = z.object({
  bulan: monthStr,
  jumlah: nonneg,
  sla1: nonneg.default(0),
  sla2: nonneg.default(0),
  sla3: nonneg.default(0),
  slagt3: nonneg.default(0),
});

async function list(req, res) {
  try {
    const pq = listQuery.safeParse(req.query);
    if (!pq.success) return res.status(400).json({ message: 'Query tidak valid', issues: pq.error.flatten() });
    const where = pq.data.bulan ? { bulan: pq.data.bulan } : {};
    const rows = await prisma.indeksPengaduan.findMany({ where, orderBy: { bulan: 'desc' } });
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal mengambil data' });
  }
}

async function create(req, res) {
  try {
    const p = bodySchema.safeParse(req.body);
    if (!p.success) return res.status(400).json({ message: 'Input tidak valid', issues: p.error.flatten() });
    const row = await prisma.indeksPengaduan.create({ data: p.data });
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal membuat data Pengaduan' });
  }
}

async function update(req, res) {
  try {
    const pid = idParam.safeParse(req.params);
    if (!pid.success) return res.status(400).json({ message: 'Param tidak valid', issues: pid.error.flatten() });

    const p = bodySchema.partial().safeParse(req.body);
    if (!p.success) return res.status(400).json({ message: 'Input tidak valid', issues: p.error.flatten() });

    const row = await prisma.indeksPengaduan.update({ where: { id: pid.data.id }, data: p.data });
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal mengubah data Pengaduan' });
  }
}

async function remove(req, res) {
  try {
    const pid = idParam.safeParse(req.params);
    if (!pid.success) return res.status(400).json({ message: 'Param tidak valid', issues: pid.error.flatten() });
    await prisma.indeksPengaduan.delete({ where: { id: pid.data.id } });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal menghapus data Pengaduan' });
  }
}

module.exports = { list, create, update, remove };
