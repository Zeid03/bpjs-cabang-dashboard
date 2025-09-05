const fs = require('fs')
const path = require('path')
const prisma = require('../src/prisma')
const { parseExcel } = require('../utils/excelParser')

async function uploadExcel(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: 'File tidak ditemukan' })
    const filePath = path.join(process.cwd(), req.file.path)

    const { kegiatanKeliling, viola, indeksPrima, indeksPengaduan } = parseExcel(filePath)

    // simpan
    if (kegiatanKeliling.length) await prisma.kegiatanKeliling.createMany({ data: kegiatanKeliling })
    if (viola.length) await prisma.viola.createMany({ data: viola })
    if (indeksPrima.length) await prisma.indeksPrima.createMany({ data: indeksPrima })
    if (indeksPengaduan.length) await prisma.indeksPengaduan.createMany({ data: indeksPengaduan })

    fs.unlink(filePath, () => {})
    return res.json({
      message: 'Upload berhasil',
      imported: {
        kegiatanKeliling: kegiatanKeliling.length,
        viola: viola.length,
        indeksPrima: indeksPrima.length,
        indeksPengaduan: indeksPengaduan.length,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Gagal memproses file Excel' })
  }
}

module.exports = { uploadExcel }
