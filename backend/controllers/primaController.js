const prisma = require('../src/prisma')

// GET /prima?tahun=2025&bulan=9 (opsional)
async function list(req, res) {
  const { tahun, bulan } = req.query
  const where = {
    ...(tahun ? { tahun: Number(tahun) } : {}),
    ...(bulan ? { bulan: Number(bulan) } : {}),
  }
  const rows = await prisma.indeksPrima.findMany({
    where,
    orderBy: [{ tahun: 'desc' }, { bulan: 'desc' }],
  })
  res.json(rows)
}

// POST /prima
async function create(req, res) {
  const {
    tahun, bulan,
    wave1 = 0, wave2 = 0, wave3 = 0, wave4 = 0,
  } = req.body

  if (tahun == null || bulan == null) {
    return res.status(400).json({ message: 'tahun & bulan wajib' })
  }

  const w1 = Number(wave1) || 0
  const w2 = Number(wave2) || 0
  const w3 = Number(wave3) || 0
  const w4 = Number(wave4) || 0
  const nilai = w1 + w2 + w3 + w4

  const row = await prisma.indeksPrima.create({
    data: {
      tahun: Number(tahun),
      bulan: Number(bulan),
      wave1: w1, wave2: w2, wave3: w3, wave4: w4,
      nilai,
    },
  })
  res.status(201).json(row)
}

// PUT /prima/:id
async function update(req, res) {
  const id = Number(req.params.id)
  const { tahun, bulan, wave1, wave2, wave3, wave4 } = req.body

  // ambil data lama utk hitung nilai baru
  const before = await prisma.indeksPrima.findUnique({ where: { id } })
  if (!before) return res.status(404).json({ message: 'Data tidak ditemukan' })

  const w1 = wave1 != null ? Number(wave1) : before.wave1
  const w2 = wave2 != null ? Number(wave2) : before.wave2
  const w3 = wave3 != null ? Number(wave3) : before.wave3
  const w4 = wave4 != null ? Number(wave4) : before.wave4
  const nilai = w1 + w2 + w3 + w4

  const row = await prisma.indeksPrima.update({
    where: { id },
    data: {
      ...(tahun != null ? { tahun: Number(tahun) } : {}),
      ...(bulan != null ? { bulan: Number(bulan) } : {}),
      wave1: w1, wave2: w2, wave3: w3, wave4: w4,
      nilai,
    },
  })
  res.json(row)
}

// DELETE /prima/:id
async function remove(req, res) {
  const id = Number(req.params.id)
  await prisma.indeksPrima.delete({ where: { id } })
  res.json({ ok: true })
}

module.exports = { list, create, update, remove }
