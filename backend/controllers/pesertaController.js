const prisma = require('../src/prisma');

// Fungsi untuk mengambil daftar peserta dengan filter dan pagination
async function listPeserta(req, res) {
  try {
    const { q, jenis, page = 1, pageSize = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    // Bangun kondisi pencarian
    const where = {
      AND: [
        q
          ? {
              OR: [
                { nama: { contains: q, mode: 'insensitive' } },
                { nik: { contains: q, mode: 'insensitive' } },
                { faskes: { contains: q, mode: 'insensitive' } },
                { kabupaten: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {},
        jenis ? { jenisKepesertaan: { equals: jenis } } : {},
      ],
    };

    // Ambil data peserta dan total count secara paralel
    const [rows, total] = await Promise.all([
      prisma.peserta.findMany({
        where,
        orderBy: { tanggalDaftar: 'desc' },
        skip,
        take,
      }),
      prisma.peserta.count({ where }),
    ]);

    return res.json({
      rows,
      total,
      page: Number(page),
      pageSize: take,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal mengambil data peserta' });
  }
}

// Fungsi untuk mengambil statistik peserta dan klaim
async function statsPeserta(req, res) {
  try {
    const peserta = await prisma.peserta.findMany({
      select: { tanggalDaftar: true, jenisKepesertaan: true },
    });

    const klaim = await prisma.klaim.findMany({
      select: { rumahSakit: true, jumlah: true },
    });

    // Statistik bulanan pendaftaran peserta
    const monthly = {};
    for (const p of peserta) {
      const year = p.tanggalDaftar.getFullYear();
      const month = String(p.tanggalDaftar.getMonth() + 1).padStart(2, '0');
      const key = `${year}-${month}`;
      monthly[key] = (monthly[key] || 0) + 1;
    }

    const lineTrend = Object.entries(monthly)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([month, count]) => ({ month, count }));

    // Statistik jenis kepesertaan
    const jenisMap = {};
    for (const p of peserta) {
      jenisMap[p.jenisKepesertaan] = (jenisMap[p.jenisKepesertaan] || 0) + 1;
    }

    const pieJenis = Object.entries(jenisMap).map(([name, value]) => ({
      name,
      value,
    }));

    // Statistik klaim per rumah sakit
    const rsMap = {};
    for (const k of klaim) {
      rsMap[k.rumahSakit] = (rsMap[k.rumahSakit] || 0) + k.jumlah;
    }

    const barKlaimRS = Object.entries(rsMap).map(([name, total]) => ({
      name,
      total,
    }));

    return res.json({ lineTrend, pieJenis, barKlaimRS });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal mengambil statistik' });
  }
}

module.exports = {
  listPeserta,
  statsPeserta,
};