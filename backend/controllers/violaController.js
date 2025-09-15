const { z } = require('zod');
const prisma = require('../src/prisma');

const monthStr = z.string().regex(/^\d{4}-\d{2}$/, 'Format bulan harus YYYY-MM');
const nonneg = z.coerce.number().int().min(0);

const listQuery = z.object({ bulan: monthStr.optional() });

const createBody = z.object({
  bulan: monthStr,
  kabupaten: z.string().trim().optional().default(''),
  kecamatan: z.string().trim().optional().default(''),
  administrasi: nonneg.default(0),
  permintaanInformasi: nonneg.default(0),
  penangananPengaduan: nonneg.default(0),
});

const idParam = z.object({ id: z.coerce.number().int().positive() });

const updateBody = z.object({
  bulan: monthStr.optional(),
  kabupaten: z.string().trim().optional(),
  kecamatan: z.string().trim().optional(),
  administrasi: nonneg.optional(),
  permintaanInformasi: nonneg.optional(),
  penangananPengaduan: nonneg.optional(),
});

async function list(req, res) {
  try {
    const parse = listQuery.safeParse(req.query);
    if (!parse.success) return res.status(400).json({ message: 'Query tidak valid', issues: parse.error.flatten() });
    const where = parse.data.bulan ? { bulan: parse.data.bulan } : {};
    const rows = await prisma.viola.findMany({ where, orderBy: { bulan: 'desc' } });
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal mengambil data' });
  }
}

// jumlahPeserta = a + i + p
async function create(req, res) {
  try {
    const parse = createBody.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: 'Input tidak valid', issues: parse.error.flatten() });

    const { bulan, kabupaten, kecamatan, administrasi, permintaanInformasi, penangananPengaduan } = parse.data;
    const jumlahPeserta = administrasi + permintaanInformasi + penangananPengaduan;

    const row = await prisma.viola.create({
      data: { bulan, kabupaten, kecamatan, administrasi, permintaanInformasi, penangananPengaduan, jumlahPeserta },
    });
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal membuat data VIOLA' });
  }
}

async function update(req, res) {
  try {
    const pid = idParam.safeParse(req.params);
    if (!pid.success) return res.status(400).json({ message: 'Param tidak valid', issues: pid.error.flatten() });
    const body = updateBody.safeParse(req.body);
    if (!body.success) return res.status(400).json({ message: 'Input tidak valid', issues: body.error.flatten() });

    const id = pid.data.id;
    const cur = await prisma.viola.findUnique({ where: { id } });
    if (!cur) return res.status(404).json({ message: 'Data tidak ditemukan' });

    const data = { ...body.data };
    const a = data.administrasi ?? cur.administrasi;
    const i = data.permintaanInformasi ?? cur.permintaanInformasi;
    const p = data.penangananPengaduan ?? cur.penangananPengaduan;
    data.jumlahPeserta = a + i + p;

    const row = await prisma.viola.update({ where: { id }, data });
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal mengubah data VIOLA' });
  }
}

async function remove(req, res) {
  try {
    const pid = idParam.safeParse(req.params);
    if (!pid.success) return res.status(400).json({ message: 'Param tidak valid', issues: pid.error.flatten() });

    const id = pid.data.id;
    await prisma.viola.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal menghapus data VIOLA' });
  }
}

module.exports = { list, create, update, remove };
