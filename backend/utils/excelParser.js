const XLSX = require('xlsx')

const SHEETS = {
  keliling: ['Kegiatan BPJS KesehatanKeliling'],
  viola: ['VIOLA'],
  prima: ['Indeks Performa Pelayanan Prima', 'Indeks Peforma Pelayanan  Prima', 'Indeks Peforma Pelayanan Prima'],
  pengaduan: ['IndekPenangananPengaduanPeserta', 'Indeks Penanganan Pengaduan Peserta'],
}

const toMonth = (v) => {
  if (v instanceof Date) {
    const y = v.getFullYear()
    const m = String(v.getMonth() + 1).padStart(2, '0')
    return `${y}-${m}`
  }
  // "YYYY-MM" | "YYYY/MM" | "YYYY-MM-DD"
  const s = String(v).trim()
  const m1 = s.match(/^(\d{4})[-/](\d{2})/)
  if (m1) return `${m1[1]}-${m1[2]}`
  // fallback: try Date
  const d = new Date(s)
  if (!isNaN(d)) return toMonth(d)
  return s
}

const excelDateToJSDate = (serial) => new Date(Math.round((serial - 25569) * 86400 * 1000))

const normalizeKeys = (row) => {
  const map = {
    // keliling
    Tanggal: 'tanggal', tgl: 'tanggal', tanggal: 'tanggal',
    Lokasi: 'lokasi', lokasi: 'lokasi', Tempat: 'lokasi',
    Peserta: 'peserta', peserta: 'peserta', jumlahPeserta: 'peserta',

    // umum
    Bulan: 'bulan', bulan: 'bulan',
    Skor: 'skor', skor: 'skor',
    Nilai: 'nilai', nilai: 'nilai',
    Jumlah: 'jumlah', jumlah: 'jumlah',
  }
  const out = {}
  for (const k in row) out[map[k] || map[k?.trim()] || k] = row[k]
  return out
}

function getSheet(workbook, targets) {
  const norm = (s) => s.toLowerCase().replace(/\s+/g, '')
  const wanted = targets.map(norm)
  const foundName = workbook.SheetNames.find((n) => wanted.includes(norm(n)))
  return foundName ? XLSX.utils.sheet_to_json(workbook.Sheets[foundName], { defval: null }) : []
}

function parseExcel(filePath) {
  const wb = XLSX.readFile(filePath)

  // Sheet 1: Keliling
  const rawKel = getSheet(wb, SHEETS.keliling).map(normalizeKeys)
  const kegiatanKeliling = rawKel.map((r) => {
    let t = r.tanggal
    if (typeof t === 'number') t = excelDateToJSDate(t)
    else if (!(t instanceof Date)) { const d = new Date(t); if (!isNaN(d)) t = d }
    return {
      tanggal: t,
      lokasi: (r.lokasi || '').toString().trim(),
      peserta: Number(r.peserta || 0),
    }
  }).filter((x) => x.tanggal && x.lokasi)

  // Sheet 2: VIOLA
  const rawViola = getSheet(wb, SHEETS.viola).map(normalizeKeys)
  const viola = rawViola.map((r) => ({
    bulan: toMonth(r.bulan),
    skor: parseFloat(r.skor ?? r.nilai ?? 0),
  })).filter((x) => x.bulan)

  // Sheet 3: Indeks Prima
  const rawPrima = getSheet(wb, SHEETS.prima).map(normalizeKeys)
  const indeksPrima = rawPrima.map((r) => ({
    bulan: toMonth(r.bulan),
    nilai: parseFloat(r.nilai ?? r.skor ?? 0),
  })).filter((x) => x.bulan)

  // Sheet 4: Pengaduan
  const rawPeng = getSheet(wb, SHEETS.pengaduan).map(normalizeKeys)
  const indeksPengaduan = rawPeng.map((r) => ({
    bulan: toMonth(r.bulan),
    jumlah: parseInt(r.jumlah ?? 0, 10),
  })).filter((x) => x.bulan)

  return { kegiatanKeliling, viola, indeksPrima, indeksPengaduan }
}

module.exports = { parseExcel }
