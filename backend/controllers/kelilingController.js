const prisma = require('../src/prisma')

// GET /keliling?bulan=YYYY-MM (opsional)
async function list(req, res) {
  const { bulan } = req.query
  const where = bulan
    ? { tanggal: { gte: new Date(`${bulan}-01T00:00:00Z`), lt: new Date(`${bulan}-31T23:59:59Z`) } }
    : {}
  const rows = await prisma.kegiatanKeliling.findMany({ where, orderBy: { tanggal: 'desc' } })
  res.json(rows)
}

// POST /keliling
async function create(req, res) {
  const { kabupaten = '', kecamatan = '', tanggal, lokasi, peserta } = req.body
  const row = await prisma.kegiatanKeliling.create({
    data: {
      kabupaten,
      kecamatan,
      tanggal: new Date(tanggal),
      lokasi,
      peserta: Number(peserta) || 0
    }
  })
  res.status(201).json(row)
}

// PUT /keliling/:id
async function update(req, res) {
  const id = Number(req.params.id)
  const { kabupaten, kecamatan, tanggal, lokasi, peserta } = req.body
  const data = {}
  if (kabupaten != null) data.kabupaten = kabupaten
  if (kecamatan != null) data.kecamatan = kecamatan
  if (tanggal) data.tanggal = new Date(tanggal)
  if (lokasi != null) data.lokasi = lokasi
  if (peserta != null) data.peserta = Number(peserta)
  const row = await prisma.kegiatanKeliling.update({ where: { id }, data })
  res.json(row)
}

// DELETE /keliling/:id
async function remove(req, res) {
  const id = Number(req.params.id)
  await prisma.kegiatanKeliling.delete({ where: { id } })
  res.json({ ok: true })
}

module.exports = { list, create, update, remove }
