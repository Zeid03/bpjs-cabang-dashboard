const xlsx = require('xlsx');

/**
 * Membaca file Excel dan mengembalikan object { peserta: [], klaim: [] }
 * - Sheet "Peserta" (atau sheet pertama) dengan kolom:
 *   NIK, Nama, Jenis, TanggalDaftar, Faskes, Kabupaten
 * - Sheet "Klaim" (opsional) dengan kolom:
 *   RumahSakit, Bulan (YYYY-MM), Jumlah
 */
function parseExcel(filePath) {
  const wb = xlsx.readFile(filePath);
  const sheets = wb.SheetNames;

  // Helper: parse sheet menjadi array of objects
  const sheetToJson = (name) => xlsx.utils.sheet_to_json(wb.Sheets[name], { defval: null });

  // Peserta
  let pesertaRows = [];
  const pesertaSheet = sheets.find((s) => s.toLowerCase() === 'peserta') || sheets[0];
  if (pesertaSheet) pesertaRows = sheetToJson(pesertaSheet);

  const peserta = pesertaRows
    .filter((r) => r.NIK && r.Nama && r.TanggalDaftar)
    .map((r) => ({
      nik: String(r.NIK).trim(),
      nama: String(r.Nama).trim(),
      jenisKepesertaan: r.Jenis ? String(r.Jenis).trim() : 'Tidak Diketahui',
      faskes: r.Faskes ? String(r.Faskes).trim() : null,
      kabupaten: r.Kabupaten ? String(r.Kabupaten).trim() : null,
      tanggalDaftar: parseExcelDate(r.TanggalDaftar),
    }));

  // Klaim (opsional)
  let klaim = [];
  const klaimSheet = sheets.find((s) => s.toLowerCase() === 'klaim');
  if (klaimSheet) {
    const rows = sheetToJson(klaimSheet);
    klaim = rows
      .filter((r) => r.RumahSakit && r.Bulan && r.Jumlah != null)
      .map((r) => ({
        rumahSakit: String(r.RumahSakit).trim(),
        bulan: parseYearMonth(r.Bulan),
        jumlah: Number(r.Jumlah) || 0,
      }));
  }

  return { peserta, klaim };
}

function parseExcelDate(val) {
  // dukung: serial excel, string tanggal, atau Date
  if (val instanceof Date) return val;
  if (typeof val === 'number') {
    // Excel serial date -> JS Date
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const d = new Date(epoch.getTime() + val * 24 * 60 * 60 * 1000);
    return d;
    }
  // coba parse string (YYYY-MM-DD atau DD/MM/YYYY)
  const s = String(val).trim();
  const iso = new Date(s);
  if (!isNaN(iso)) return iso;
  const [d, m, y] = s.split(/[\/-]/);
  if (y && m && d) return new Date(Number(y), Number(m) - 1, Number(d));
  return new Date();
}

function parseYearMonth(val) {
  if (val instanceof Date) return new Date(val.getFullYear(), val.getMonth(), 1);
  const s = String(val).trim();
  // formats: YYYY-MM or YYYY/MM or YYYY.MM
  const m = s.match(/(\d{4})[\/.\-](\d{1,2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, 1);
  const d = new Date(s);
  if (!isNaN(d)) return new Date(d.getFullYear(), d.getMonth(), 1);
  return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
}

module.exports = { parseExcel };
