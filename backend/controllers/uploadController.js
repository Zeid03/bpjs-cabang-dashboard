const fs = require('fs');
const path = require('path');
const { z } = require('zod');
const prisma = require('../src/prisma');
const { parseExcel } = require('../utils/excelParser');

const fileSchema = z.object({
  originalname: z.string().min(1),
  mimetype: z.string().regex(/(spreadsheetml|excel|officedocument|application\/octet-stream)/i),
  path: z.string().min(1),
  size: z.number().max(10 * 1024 * 1024, 'File terlalu besar (maks 10MB)'),
});

async function uploadExcel(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: 'File tidak ditemukan' });

    const pf = fileSchema.safeParse(req.file);
    if (!pf.success) {
      return res.status(400).json({ message: 'File tidak valid', issues: pf.error.flatten() });
    }
    const filePath = path.join(process.cwd(), pf.data.path);

    const { kegiatanKeliling, viola, indeksPrima, indeksPengaduan } = parseExcel(filePath);

    if (kegiatanKeliling.length) await prisma.kegiatanKeliling.createMany({ data: kegiatanKeliling });
    if (viola.length) await prisma.viola.createMany({ data: viola });
    if (indeksPrima.length) await prisma.indeksPrima.createMany({ data: indeksPrima });
    if (indeksPengaduan.length) await prisma.indeksPengaduan.createMany({ data: indeksPengaduan });

    fs.unlink(filePath, () => {});
    return res.json({
      message: 'Upload berhasil',
      imported: {
        kegiatanKeliling: kegiatanKeliling.length,
        viola: viola.length,
        indeksPrima: indeksPrima.length,
        pengaduan: indeksPengaduan.length,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal memproses file Excel' });
  }
}

module.exports = { uploadExcel };
