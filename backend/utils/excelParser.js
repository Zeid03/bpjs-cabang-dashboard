// backend/utils/excelParser.js
const XLSX = require('xlsx')

const SHEETS = {
  keliling: ['Kegiatan BPJS KesehatanKeliling'], // <- perhatikan: nama persis tanpa spasi tambahan
  viola: ['VIOLA'],
  prima: [
    'Indeks Performa Pelayanan Prima',
    'Indeks Peforma Pelayanan  Prima',
    'Indeks Peforma Pelayanan Prima',
  ],
  pengaduan: [
    'IndekPenangananPengaduanPeserta',
    'Indeks Penanganan Pengaduan Peserta',
  ],
}

// --- Utils ---

const normalizeMonth = (v) => {
  if (v instanceof Date) {
    const y = v.getFullYear()
    const m = String(v.getMonth() + 1).padStart(2, '0')
    return `${y}-${m}`
  }
  const s = String(v ?? '').trim()
  // "YYYY-MM" | "YYYY/MM" | "YYYY-MM-DD" | "1/31/2025" dll
  const m1 = s.match(/^(\d{4})[-/](\d{1,2})/)
  if (m1) return `${m1[1]}-${String(m1[2]).padStart(2, '0')}`
  const d = new Date(s)
  if (!isNaN(d)) return normalizeMonth(d)
  return '' // jadikan kosong kalau gagal
}

const excelDateToJSDate = (serial) => new Date(Math.round((serial - 25569) * 86400 * 1000))

// ubah "Header Name" -> "header name" (lowercase), hapus extra-spaces, ganti banyak separator jadi spasi tunggal
const normStr = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[._-]+/g, ' ')
    .trim()

// peta alias -> nama kanonik
const KEY_ALIASES = {
  // umum
  'bulan': 'bulan',
  'periode': 'bulan',

  'tahun': 'tahun',
  'thn': 'tahun',

  'bln': 'bulan',

  'nilai': 'nilai',
  'skor': 'nilai', // jika ada file lama

  'jumlah': 'jumlah',

  // keliling
  'tanggal': 'tanggal',
  'tgl': 'tanggal',
  'date': 'tanggal',

  'lokasi': 'lokasi',
  'tempat': 'lokasi',
  'lokasi kegiatan': 'lokasi',

  'peserta': 'peserta',
  'jumlah peserta': 'peserta',
  'jumlahpeserta': 'peserta',

  'kabupaten': 'kabupaten',
  'kecamatan': 'kecamatan',

  // desa / kelurahan (beberapa file bisa pakai istilah berbeda)
   'desa': 'desa',
   'kelurahan': 'desa',
   'gampong': 'desa',

  // VIOLA
  'administrasi': 'administrasi',
  'permintaan informasi': 'permintaanInformasi',
  'informasi': 'permintaanInformasi',
  'penanganan pengaduan': 'penangananPengaduan',

  // PRIMA waves
  'wave 1': 'wave1',
  'wave1': 'wave1',
  'wave 2': 'wave2',
  'wave2': 'wave2',
  'wave 3': 'wave3',
  'wave3': 'wave3',
  'wave 4': 'wave4',
  'wave4': 'wave4',

  // Pengaduan SLA
  '1 hari': 'sla1',
  '≤1 hari': 'sla1',
  '<=1 hari': 'sla1',
  '2 hari': 'sla2',
  '3 hari': 'sla3',
  '>3 hari': 'slagt3',
  '> 3 hari': 'slagt3',
  'lebih dari 3 hari': 'slagt3',
}

// normalisasi key setiap kolom menjadi alias kanonik
const normalizeRowKeys = (row) => {
  const out = {}
  for (const rawKey in row) {
    const k = normStr(rawKey)
    const key = KEY_ALIASES[k] || k // fallback ke k kalau tak ada di alias
    out[key] = row[rawKey]
  }
  return out
}

function getSheetRows(workbook, targets) {
  const normName = (s) => String(s).toLowerCase().replace(/\s+/g, '')
  const wanted = targets.map(normName)
  const foundName = workbook.SheetNames.find((n) => wanted.includes(normName(n)))
  return foundName ? XLSX.utils.sheet_to_json(workbook.Sheets[foundName], { defval: null }) : []
}

function parseExcel(filePath) {
  const wb = XLSX.readFile(filePath)

  // --- Sheet 1: Keliling ---
  const rawKel = getSheetRows(wb, SHEETS.keliling).map(normalizeRowKeys)
  const kegiatanKeliling = rawKel
    .map((r) => {
      // tanggal bisa serial excel / string / Date
      let t = r.tanggal
      if (typeof t === 'number') t = excelDateToJSDate(t)
      else if (!(t instanceof Date)) {
        const d = new Date(t)
        if (!isNaN(d)) t = d
      }

      return {
        kabupaten: String(r.kabupaten ?? '').trim(),
        kecamatan: String(r.kecamatan ?? '').trim(),
        desa: String(r.desa ?? '').trim(),
        tanggal: t,
        lokasi: String(r.lokasi ?? '').trim(),
        peserta: Number(r.peserta ?? 0),
      }
    })
    .filter((x) => x.tanggal && x.lokasi)

  // --- Sheet 2: VIOLA ---
  const rawViola = getSheetRows(wb, SHEETS.viola).map(normalizeRowKeys)
  const viola = rawViola
    .map((r) => {
      const administrasi = Number(r.administrasi ?? 0)
      const permintaanInformasi = Number(r.permintaanInformasi ?? 0)
      const penangananPengaduan = Number(r.penangananPengaduan ?? 0)
      const jumlahPeserta = administrasi + permintaanInformasi + penangananPengaduan

      return {
        kabupaten: String(r.kabupaten ?? '').trim(),
        kecamatan: String(r.kecamatan ?? '').trim(),
        bulan: normalizeMonth(r.bulan),
        administrasi,
        permintaanInformasi,
        penangananPengaduan,
        jumlahPeserta,
      }
    })
    .filter((x) => x.bulan)

  // --- Sheet 3: Indeks Prima ---
  const rawPrima = getSheetRows(wb, SHEETS.prima).map(normalizeRowKeys)
  const indeksPrima = rawPrima
    .map((r) => {
      const tahun = Number(r.tahun ?? 0) || 0
      const bulan = Number(r.bulan ?? 0) || 0
      const wave1 = Number(r.wave1 ?? 0) || 0
      const wave2 = Number(r.wave2 ?? 0) || 0
      const wave3 = Number(r.wave3 ?? 0) || 0
      const wave4 = Number(r.wave4 ?? 0) || 0
      const nilai = wave1 + wave2 + wave3 + wave4
      return { tahun, bulan, wave1, wave2, wave3, wave4, nilai }
    })
    .filter((x) => x.tahun && x.bulan)

  // --- Sheet 4: Pengaduan (SLA) ---
  const rawPeng = getSheetRows(wb, SHEETS.pengaduan).map(normalizeRowKeys)
  const indeksPengaduan = rawPeng
    .map((r) => ({
      bulan: normalizeMonth(r.bulan),
      jumlah: Number(r.jumlah ?? 0),
      sla1: Number(r.sla1 ?? 0),
      sla2: Number(r.sla2 ?? 0),
      sla3: Number(r.sla3 ?? 0),
      slagt3: Number(r.slagt3 ?? 0),
    }))
    .filter((x) => x.bulan)

  return { kegiatanKeliling, viola, indeksPrima, indeksPengaduan }
}

module.exports = { parseExcel }
