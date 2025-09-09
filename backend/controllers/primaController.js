const prisma = require('../src/prisma')

// GET /prima?bulan=YYYY-MM (opsional)
async function list(req, res) {
  const { bulan } = req.query
  const where = bulan ? { bulan } : {}
  const rows = await prisma.indeksPrima.findMany({ where, orderBy: { bulan: 'desc' } })
  res.json(rows)
}

// POST /prima
async function create(req, res) {
  const { bulan, nilai } = req.body
  if (!bulan || nilai == null) return res.status(400).json({ message: 'bulan & nilai wajib' })
  const row = await prisma.indeksPrima.create({ data: { bulan, nilai: Number(nilai) } })
  res.status(201).json(row)
}

// PUT /prima/:id
async function update(req, res) {
  const id = Number(req.params.id)
  const { bulan, nilai } = req.body
  const row = await prisma.indeksPrima.update({
    where: { id },
    data: { ...(bulan ? { bulan } : {}), ...(nilai != null ? { nilai: Number(nilai) } : {}) },
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
