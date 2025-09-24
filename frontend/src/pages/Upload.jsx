// Refactore tahap 1
import React, { useState } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return alert('Pilih file Excel terlebih dahulu')

    const fd = new FormData()
    fd.append('file', file)

    try {
      setLoading(true)
      setStatus(null)
      const res = await api.post('/upload/excel', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setStatus(res.data)
    } catch (err) {
      setStatus({ error: err.response?.data?.message || 'Gagal upload file' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <h1 className="text-xl font-semibold text-slate-800">Upload Data Excel</h1>
          <p className="text-sm text-slate-500">
            File harus berisi 4 sheet: <b>Kegiatan BPJS Kesehatan Keliling</b>, <b>VIOLA</b>, <b>Indeks Performa Pelayanan Prima</b>, dan <b>Indek Penanganan Pengaduan Peserta</b>.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-slate-700
                         file:mr-4 file:cursor-pointer file:rounded-xl file:border-0
                         file:bg-gradient-to-r file:from-[#009B4C] file:to-[#0071BC]
                         file:px-4 file:py-2 file:font-medium file:text-white
                         hover:file:opacity-90"
            />
            <button
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#009B4C] to-[#0071BC] py-2.5 font-medium text-white shadow hover:opacity-95 disabled:opacity-60"
            >
              {loading ? 'Mengunggah…' : 'Upload'}
            </button>
          </form>

          {status && (
            <div className="mt-4 text-sm">
              {status.error ? (
                <div className="rounded-xl bg-red-50 p-3 text-red-700">❌ {status.error}</div>
              ) : (
                <div className="space-y-2 rounded-2xl bg-green-50 p-3 text-green-800 ring-1 ring-green-200">
                  <p className="font-medium">✅ {status.message}</p>
                  <ul className="ml-5 list-disc">
                    <li>Kegiatan Keliling: {status.imported?.kegiatanKeliling ?? 0} baris</li>
                    <li>VIOLA: {status.imported?.viola ?? 0} baris</li>
                    <li>Indeks Prima: {status.imported?.indeksPrima ?? 0} baris</li>
                    <li>Pengaduan Peserta: {(status.imported?.indeksPengaduan ?? status.imported?.pengaduan) ?? 0} baris</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">📌 Format Header</h2>
          <ol className="ml-5 list-decimal space-y-1 text-sm text-slate-600">
            <li><b>Kegiatan BPJS KesehatanKeliling</b>: <code>Kabupaten</code> | <code>Kecamatan</code> | <code>Desa</code> | <code>Tanggal</code> | <code>Lokasi</code> | <code>Peserta</code></li>
            <li><b>VIOLA</b>: <code>Kabupaten</code> | <code>Kecamatan</code> | <code>Bulan</code> (YYYY-MM) | <code>Administrasi</code> | <code>Permintaan Informasi</code> | <code>Penanganan Pengaduan</code></li>
            <li><b>Indeks Performa Pelayanan Prima</b>: <code>Tahun</code> | <code>Bulan</code> (1..12) | <code>Wave1</code> | <code>Wave2</code> | <code>Wave3</code> | <code>Wave4</code></li>
            <li><b>Indeks Penanganan Pengaduan Peserta</b>: <code>Bulan</code> (YYYY-MM) | <code>Jumlah</code> | <code>1 hari</code> | <code>2 hari</code> | <code>3 hari</code> | <code>&gt;3 hari</code></li>
          </ol>
          <p className="mt-2 text-xs text-slate-500">
            Nama sheet harus persis: <code>Kegiatan BPJS KesehatanKeliling</code>, <code>VIOLA</code>,
            <code> Indeks Performa Pelayanan Prima</code>, <code>Indeks Penanganan Pengaduan Peserta</code>.
          </p>
        </div>
      </main>
    </div>
  )
}
