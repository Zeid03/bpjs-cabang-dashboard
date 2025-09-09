const prisma = require('../src/prisma')

// GET /viola?bulan=YYYY-MM (opsional)
async function list(req, res) {
  const { bulan } = req.query
  const where = bulan ? { bulan } : {}
  const rows = await prisma.viola.findMany({ where, orderBy: { bulan: 'desc' } })
  res.json(rows)
}

// POST /viola
async function create(req, res) {
  const { bulan, skor } = req.body
  if (!bulan || skor == null) return res.status(400).json({ message: 'bulan & skor wajib' })
  const row = await prisma.viola.create({ data: { bulan, skor: Number(skor) } })
  res.status(201).json(row)
}

// PUT /viola/:id
async function update(req, res) {
  const id = Number(req.params.id)
  const { bulan, skor } = req.body
  const row = await prisma.viola.update({
    where: { id },
    data: { ...(bulan ? { bulan } : {}), ...(skor != null ? { skor: Number(skor) } : {}) },
  })
  res.json(row)
}

// DELETE /viola/:id
async function remove(req, res) {
  const id = Number(req.params.id)
  await prisma.viola.delete({ where: { id } })
  res.json({ ok: true })
}

module.exports = { list, create, update, remove }
