const prisma = require('../src/prisma')

// GET /viola?bulan=YYYY-MM (opsional)
async function list(req, res) {
  const { bulan } = req.query
  const where = bulan ? { bulan } : {}
  const rows = await prisma.viola.findMany({
    where,
    orderBy: { bulan: 'desc' },
  })
  res.json(rows)
}

// POST /viola
// jumlahPeserta akan dihitung: administrasi + permintaanInformasi + penangananPengaduan
async function create(req, res) {
  try {
    const { bulan, administrasi = 0, permintaanInformasi = 0, penangananPengaduan = 0, kabupaten = '', kecamatan = '' } = req.body
    if (!bulan) return res.status(400).json({ message: 'bulan wajib' })

    const a = Math.max(0, Number(administrasi) || 0)
    const i = Math.max(0, Number(permintaanInformasi) || 0)
    const p = Math.max(0, Number(penangananPengaduan) || 0)
    const jumlahPeserta = a + i + p

    const row = await prisma.viola.create({
      data: {
        bulan,
        kabupaten,
        kecamatan,
        administrasi: a,
        permintaanInformasi: i,
        penangananPengaduan: p,
        jumlahPeserta,
      },
    })
    res.status(201).json(row)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Gagal membuat data VIOLA' })
  }
}

// PUT /viola/:id
// Selalu hitung ulang jumlahPeserta berdasarkan field komponen
async function update(req, res) {
  try {
    const id = Number(req.params.id)
    const { bulan, administrasi, permintaanInformasi, penangananPengaduan, kabupaten, kecamatan } = req.body

    const data = {}
    if (bulan) data.bulan = bulan
    if (kabupaten != null) data.kabupaten = kabupaten
    if (kecamatan != null) data.kecamatan = kecamatan

    const aSet = administrasi != null
    const iSet = permintaanInformasi != null
    const pSet = penangananPengaduan != null
    if (aSet) data.administrasi = Math.max(0, Number(administrasi) || 0)
    if (iSet) data.permintaanInformasi = Math.max(0, Number(permintaanInformasi) || 0)
    if (pSet) data.penangananPengaduan = Math.max(0, Number(penangananPengaduan) || 0)

    // ambil state terbaru untuk menghitung jumlahPeserta
    const cur = await prisma.viola.findUnique({ where: { id } })
    if (!cur) return res.status(404).json({ message: 'Data tidak ditemukan' })

    const a = aSet ? data.administrasi : cur.administrasi
    const i = iSet ? data.permintaanInformasi : cur.permintaanInformasi
    const p = pSet ? data.penangananPengaduan : cur.penangananPengaduan
    data.jumlahPeserta = (a || 0) + (i || 0) + (p || 0)

    const row = await prisma.viola.update({ where: { id }, data })
    res.json(row)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Gagal mengubah data VIOLA' })
  }
}

// DELETE /viola/:id
async function remove(req, res) {
  try {
    const id = Number(req.params.id)
    await prisma.viola.delete({ where: { id } })
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Gagal menghapus data VIOLA' })
  }
}

module.exports = { list, create, update, remove }
