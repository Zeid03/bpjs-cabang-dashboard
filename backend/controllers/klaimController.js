const prisma = require('../src/prisma');


async function listKlaim(req, res) {
    try {
        const { rs, page = 1, pageSize = 20 } = req.query;
        const take = Number(pageSize);
        const skip = (Number(page) - 1) * take;


        const where = rs
            ? { rumahSakit: { contains: rs, mode: 'insensitive' } }
            : {};


        const [rows, total] = await Promise.all([
            prisma.klaim.findMany({
                where,
                orderBy: { bulan: 'desc' },
                skip,
                take,
            }),
            prisma.klaim.count({ where }),
        ]);


        return res.json({
            rows,
            total,
            page: Number(page),
            pageSize: take,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Gagal mengambil data klaim' });
    }
}


module.exports = { listKlaim };