const prisma = require('../src/prisma')

// Comparator aman untuk objek { month: 'YYYY-MM', ... }
function cmpMonthObj(a, b) {
  const ma = a?.month ?? ''
  const mb = b?.month ?? ''
  if (ma === mb) return 0
  return ma > mb ? 1 : -1
}

async function stats(req, res) {
  try {
    const [kel, vio, prima, peng] = await Promise.all([
      prisma.kegiatanKeliling.findMany(),
      prisma.viola.findMany(),
      prisma.indeksPrima.findMany(),
      prisma.indeksPengaduan.findMany(),
    ])

    // Keliling → freq & totalPeserta
    const kelMap = {}
    for (const r of kel) {
      if (!r.tanggal) continue
      const y = r.tanggal.getFullYear()
      const m = String(r.tanggal.getMonth() + 1).padStart(2, '0')
      const k = `${y}-${m}`
      kelMap[k] = kelMap[k] || { freq: 0, total: 0 }
      kelMap[k].freq += 1
      kelMap[k].total += Number(r.peserta) || 0
    }
    const kelilingTrend = Object.entries(kelMap)
      .map(([month, v]) => ({ month, freq: v.freq, totalPeserta: v.total }))
      .sort(cmpMonthObj)

    // VIOLA → freq & skor rata-rata
    const vioMap = {}
    for (const v of vio) {
      if (!v.bulan) continue
      vioMap[v.bulan] = vioMap[v.bulan] || { freq: 0, sum: 0 }
      vioMap[v.bulan].freq += 1
      vioMap[v.bulan].sum += Number(v.skor) || 0
    }
    const violaTrend = Object.entries(vioMap)
      .map(([month, v]) => ({ month, freq: v.freq, skor: +(v.sum / v.freq).toFixed(2) }))
      .sort(cmpMonthObj)

    // Prima
    const primaBar = (prima || [])
      .map((r) => ({ month: r.bulan, nilai: r.nilai }))
      .sort(cmpMonthObj)

    // Pengaduan + SLA breakdown
    const pengaduanBar = (peng || [])
      .map((r) => ({
        month: r.bulan,
        jumlah: r.jumlah,
        sla1: r.sla1 ?? 0,
        sla2: r.sla2 ?? 0,
        sla3: r.sla3 ?? 0,
        slagt3: r.slagt3 ?? 0,
      }))
      .sort(cmpMonthObj)

    res.json({ kelilingTrend, violaTrend, primaBar, pengaduanBar })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Gagal ambil data dashboard' })
  }
}

module.exports = { stats }
