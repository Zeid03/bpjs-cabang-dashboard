const prisma = require('../src/prisma')

// GET /pengaduan?bulan=YYYY-MM (opsional)
async function list(req, res) {
  const { bulan } = req.query
  const where = bulan ? { bulan } : {}
  const rows = await prisma.indeksPengaduan.findMany({
    where,
    orderBy: { bulan: 'desc' },
  })
  res.json(rows)
}

// POST /pengaduan
async function create(req, res) {
  const { bulan, jumlah, sla1 = 0, sla2 = 0, sla3 = 0, slagt3 = 0 } = req.body
  if (!bulan || jumlah == null) {
    return res.status(400).json({ message: 'bulan & jumlah wajib' })
  }
  const row = await prisma.indeksPengaduan.create({
    data: {
      bulan,
      jumlah: Number(jumlah),
      sla1: Number(sla1) || 0,
      sla2: Number(sla2) || 0,
      sla3: Number(sla3) || 0,
      slagt3: Number(slagt3) || 0,
    },
  })
  res.status(201).json(row)
}

// PUT /pengaduan/:id
async function update(req, res) {
  const id = Number(req.params.id)
  const { bulan, jumlah, sla1, sla2, sla3, slagt3 } = req.body

  const data = {}
  if (bulan) data.bulan = bulan
  if (jumlah != null) data.jumlah = Number(jumlah)
  if (sla1 != null) data.sla1 = Number(sla1)
  if (sla2 != null) data.sla2 = Number(sla2)
  if (sla3 != null) data.sla3 = Number(sla3)
  if (slagt3 != null) data.slagt3 = Number(slagt3)

  const row = await prisma.indeksPengaduan.update({
    where: { id },
    data,
  })
  res.json(row)
}

// DELETE /pengaduan/:id
async function remove(req, res) {
  const id = Number(req.params.id)
  await prisma.indeksPengaduan.delete({ where: { id } })
  res.json({ ok: true })
}

module.exports = { list, create, update, remove }
