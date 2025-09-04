const fs = require('fs');
const path = require('path');
const prisma = require('../src/prisma');
const { parseExcel } = require('../utils/excelParser');

async function uploadExcel(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'File tidak ditemukan' });
        }
        const filePath = path.join(process.cwd(), req.file.path);

        const { peserta, klaim } = parseExcel(filePath);

        if (peserta.length) {
            const chunkSize = 1000;
            for (let i = 0; i < peserta.length; i += chunkSize) {
                const chunk = peserta.slice(i, i + chunkSize);
                await prisma.peserta.createMany({ data: chunk, skipDuplicates: true });
            }
        }

        if (klaim.length) {
            const chunkSize = 1000;
            for (let i = 0; i < klaim.length; i += chunkSize) {
                const chunk = klaim.slice(i, i + chunkSize);
                await prisma.klaim.createMany({ data: chunk });
            }
        }

        fs.unlink(filePath, () => {});

        return res.json({
            message: 'Upload berhasil',
            imported: { peserta: peserta.length, klaim: klaim.length }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Gagal memproses file Excel' });
    }
}

module.exports = { uploadExcel };