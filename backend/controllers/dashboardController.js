const prisma = require('../src/prisma')

function sortByMonth(a, b) { return a.month > b.month ? 1 : -1 }

async function stats(req, res) {
  try {
    const [kel, vio, pri, peng] = await Promise.all([
      prisma.kegiatanKeliling.findMany({ select: { tanggal: true, peserta: true } }),
      prisma.viola.findMany({ select: { bulan: true, skor: true } }),
      prisma.indeksPrima.findMany({ select: { bulan: true, nilai: true } }),
      prisma.indeksPengaduan.findMany({ select: { bulan: true, jumlah: true } }),
    ])

    // Keliling → agregasi per bulan: total peserta
    const kelMap = {}
    for (const r of kel) {
      const y = r.tanggal.getFullYear()
      const m = String(r.tanggal.getMonth() + 1).padStart(2, '0')
      const key = `${y}-${m}`
      kelMap[key] = (kelMap[key] || 0) + r.peserta
    }
    const kelilingTrend = Object.entries(kelMap).map(([month, totalPeserta]) => ({ month, totalPeserta })).sort(sortByMonth)

    // VIOLA (langsung)
    const violaTrend = vio.map((v) => ({ month: v.bulan, skor: v.skor })).sort(sortByMonth)

    // Indeks Prima (langsung)
    const primaBar = pri.map((v) => ({ month: v.bulan, nilai: v.nilai })).sort(sortByMonth)

    // Pengaduan (langsung)
    const pengaduanBar = peng.map((v) => ({ month: v.bulan, jumlah: v.jumlah })).sort(sortByMonth)

    return res.json({ kelilingTrend, violaTrend, primaBar, pengaduanBar })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: 'Gagal mengambil statistik' })
  }
}

module.exports = { stats }
