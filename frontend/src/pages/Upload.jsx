// import React, { useState } from 'react'
// import api from '../api/axios'
// import Navbar from '../components/Navbar'

// export default function Upload() {
//   const [file, setFile] = useState(null)
//   const [status, setStatus] = useState(null)
//   const [loading, setLoading] = useState(false)

//   const handleUpload = async (e) => {
//     e.preventDefault()
//     if (!file) return alert('Pilih file Excel terlebih dahulu')

//     const formData = new FormData()
//     formData.append('file', file)

//     try {
//       setLoading(true)
//       setStatus(null)
//       const res = await api.post('/upload/excel', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       })
//       setStatus(res.data)
//     } catch (err) {
//       console.error(err)
//       setStatus({ error: err.response?.data?.message || 'Gagal upload file' })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div>
//       <Navbar />
//       <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
//         <h1 className="text-2xl font-semibold">Upload Data Excel</h1>

//         <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
//           <form onSubmit={handleUpload} className="space-y-4">
//             <input
//               type="file"
//               accept=".xlsx,.xls"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="block w-full text-sm text-slate-600
//                          file:mr-4 file:py-2 file:px-4
//                          file:rounded-xl file:border-0
//                          file:text-sm file:font-semibold
//                          file:bg-slate-900 file:text-white
//                          hover:file:opacity-90"
//             />

//             <button
//               disabled={loading}
//               className="w-full rounded-xl bg-slate-900 py-2.5 font-medium text-white shadow hover:opacity-90 disabled:opacity-50"
//             >
//               {loading ? 'Mengunggah…' : 'Upload'}
//             </button>
//           </form>

//           {/* Status */}
//           {status && (
//             <div className="mt-4 text-sm">
//               {status.error ? (
//                 <div className="rounded-xl bg-red-50 text-red-700 p-3">
//                   ❌ {status.error}
//                 </div>
//               ) : (
//                 <div className="rounded-xl bg-green-50 text-green-700 p-3 space-y-1">
//                   <p>✅ {status.message}</p>
//                   <ul className="list-disc ml-5">
//                     <li>Kegiatan Keliling: {status.imported?.kegiatanKeliling ?? 0} baris</li>
//                     <li>VIOLA: {status.imported?.viola ?? 0} baris</li>
//                     <li>Indeks Prima: {status.imported?.indeksPrima ?? 0} baris</li>
//                     <li>Pengaduan Peserta: {status.imported?.indeksPengaduan ?? 0} baris</li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <section className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600">
//           <h2 className="font-semibold mb-2">📌 Format Excel Wajib</h2>
//           <p className="mb-1">File Excel harus punya 4 sheet dengan header:</p>
//           <ol className="list-decimal ml-5 space-y-1">
//             <li><b>Kegiatan BPJS Kesehatan Keliling</b>: Tanggal | Lokasi | Peserta</li>
//             <li><b>VIOLA</b>: Bulan (YYYY-MM) | Skor</li>
//             <li><b>Indeks Performa Pelayanan Prima</b>: Bulan (YYYY-MM) | Nilai</li>
//             <li><b>Indek Penanganan Pengaduan Peserta</b>: Bulan (YYYY-MM) | Jumlah</li>
//           </ol>
//         </section>
//       </main>
//     </div>
//   )
// }

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
                    <li>Pengaduan Peserta: {status.imported?.indeksPengaduan ?? 0} baris</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">📌 Format Header</h2>
          <ol className="ml-5 list-decimal space-y-1 text-sm text-slate-600">
            <li><b>Kegiatan BPJS Kesehatan Keliling</b>: <code>Tanggal</code> | <code>Lokasi</code> | <code>Peserta</code></li>
            <li><b>VIOLA</b>: <code>Bulan</code> (YYYY-MM) | <code>Skor</code></li>
            <li><b>Indeks Performa Pelayanan Prima</b>: <code>Bulan</code> (YYYY-MM) | <code>Nilai</code></li>
            <li><b>Indek Penanganan Pengaduan Peserta</b>: <code>Bulan</code> (YYYY-MM) | <code>Jumlah</code></li>
          </ol>
        </div>
      </main>
    </div>
  )
}
