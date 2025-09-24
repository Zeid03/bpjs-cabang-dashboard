const { z } = require('zod');
const prisma = require('../src/prisma');

const idParam = z.object({ id: z.coerce.number().int().positive() });
const listQuery = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
});

const bodySchema = z.object({
  kabupaten: z.string().trim().optional().default(''),
  kecamatan: z.string().trim().optional().default(''),
  desa: z.string().trim().optional().default(''),
  tanggal: z.union([z.string(), z.date(), z.number()]), // di DB tetap Date
  lokasi: z.string().trim().min(1),
  peserta: z.coerce.number().int().min(0),
});

// Parse tanggal yang aman dari offset (YYYY-MM-DD)
function toDate(val) {
  if (val instanceof Date) {
    if (Number.isNaN(val.getTime())) throw new Error('Tanggal tidak valid');
    return val;
  }
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const [y, m, d] = val.split('-').map(Number);
    const dt = new Date(y, m - 1, d); // local time, hindari offset UTC
    if (Number.isNaN(dt.getTime())) throw new Error('Tanggal tidak valid');
    return dt;
  }
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) throw new Error('Tanggal tidak valid');
  return d;
}

// Hitung rentang bulan [start, nextStart)
function monthRange(ym) {
  const [y, m] = ym.split('-').map(Number); // m = 1..12
  const start = new Date(y, m - 1, 1);
  const next = new Date(y, m, 1);
  return { start, next };
}

async function list(req, res) {
  try {
    const pq = listQuery.safeParse(req.query);
    if (!pq.success) {
      return res.status(400).json({ message: 'Query tidak valid', issues: pq.error.flatten() });
    }

    let where = {};
    if (pq.data.month) {
      const { start, next } = monthRange(pq.data.month);
      where = { tanggal: { gte: start, lt: next } };
    }

    const rows = await prisma.kegiatanKeliling.findMany({
      where,
      orderBy: { tanggal: 'desc' },
    });

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
    const data = { ...p.data, tanggal: toDate(p.data.tanggal) };
    const row = await prisma.kegiatanKeliling.create({ data });
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal membuat data Keliling' });
  }
}

async function update(req, res) {
  try {
    const pid = idParam.safeParse(req.params);
    if (!pid.success) return res.status(400).json({ message: 'Param tidak valid', issues: pid.error.flatten() });

    const p = bodySchema.partial().safeParse(req.body);
    if (!p.success) return res.status(400).json({ message: 'Input tidak valid', issues: p.error.flatten() });

    const data = { ...p.data };
    if (data.tanggal != null) data.tanggal = toDate(data.tanggal);
    const row = await prisma.kegiatanKeliling.update({ where: { id: pid.data.id }, data });
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal mengubah data Keliling' });
  }
}

async function remove(req, res) {
  try {
    const pid = idParam.safeParse(req.params);
    if (!pid.success) return res.status(400).json({ message: 'Param tidak valid', issues: pid.error.flatten() });
    await prisma.kegiatanKeliling.delete({ where: { id: pid.data.id } });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal menghapus data Keliling' });
  }
}

module.exports = { list, create, update, remove };
