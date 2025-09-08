// import useSWR from 'swr';
// import api from '../api/axios';
// import Navbar from '../components/Navbar';
// import LineTrend from '../components/charts/LineTrend';
// import PieJenis from '../components/charts/PieJenis';
// import BarKlaimRS from '../components/charts/BarKlaimRS';
// import DataTable from '../components/DataTable';
// import { useState } from 'react';

// const fetcher = (url) => api.get(url).then((r) => r.data);

// export default function Dashboard() {
//   const { data: stats } = useSWR('/peserta/stats', fetcher);

//   const [page, setPage] = useState(1);
//   const [q, setQ] = useState('');
//   const { data: peserta } = useSWR(`/peserta?page=${page}&pageSize=20&q=${encodeURIComponent(q)}`, fetcher);

//   return (
//     <div>
//       <Navbar />
//       <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
//         <section className="grid md:grid-cols-3 gap-4">
//           <div className="bg-white p-4 rounded-2xl shadow"><h2 className="font-semibold mb-2">Tren Peserta / Bulan</h2><LineTrend data={stats?.lineTrend || []} /></div>
//           <div className="bg-white p-4 rounded-2xl shadow"><h2 className="font-semibold mb-2">Distribusi Jenis</h2><PieJenis data={stats?.pieJenis || []} /></div>
//           <div className="bg-white p-4 rounded-2xl shadow md:col-span-1"><h2 className="font-semibold mb-2">Klaim per RS</h2><BarKlaimRS data={stats?.barKlaimRS || []} /></div>
//         </section>

//         <section className="bg-white p-4 rounded-2xl shadow">
//           <h2 className="font-semibold mb-3">Data Peserta</h2>
//           <DataTable
//             rows={peserta?.rows || []}
//             columns={[
//               { key: 'nik', header: 'NIK' },
//               { key: 'nama', header: 'Nama' },
//               { key: 'jenisKepesertaan', header: 'Jenis' },
//               { key: 'faskes', header: 'Faskes' },
//               { key: 'kabupaten', header: 'Kabupaten' },
//               {
//                 key: 'tanggalDaftar',
//                 header: 'Tanggal Daftar',
//                 render: (v) => new Date(v).toLocaleDateString(),
//               },
//             ]}
//             page={peserta?.page || 1}
//             pageSize={peserta?.pageSize || 20}
//             total={peserta?.total || 0}
//             onPageChange={setPage}
//             onSearch={(term) => { setQ(term); setPage(1); }}
//           />
//         </section>
//       </main>
//     </div>
//   );
// }

//REFACTORE TAHAP 1

// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import useSWR from 'swr'
// import api from '../api/axios'
// import Navbar from '../components/Navbar'
// import LineTrend from '../components/charts/LineKeliling'
// import PieJenis from '../components/charts/LineViola'
// import BarKlaimRS from '../components/charts/BarPrima'
// import BarKabupaten from '../components/charts/BarPengaduan'

// const fetcher = (url) => api.get(url).then((r) => r.data)

// export default function Dashboard() {
//   const navigate = useNavigate()
//   const { data: stats } = useSWR('/peserta/stats', fetcher)

//   if (!stats) return <div>Loading...</div>

//   return (
//     <div>
//       <Navbar />
//       <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
//         <section className="grid md:grid-cols-2 gap-4">
//           {/* Tren Peserta */}
//           <div
//             onClick={() => navigate('/detail/tren')}
//             className="bg-white p-4 rounded-2xl shadow cursor-pointer hover:ring-2 hover:ring-slate-300 transition"
//           >
//             <h2 className="font-semibold mb-2">Tren Peserta / Bulan</h2>
//             <LineTrend data={stats.lineTrend || []} />
//           </div>

//           {/* Distribusi Jenis */}
//           <div
//             onClick={() => navigate('/detail/jenis')}
//             className="bg-white p-4 rounded-2xl shadow cursor-pointer hover:ring-2 hover:ring-slate-300 transition"
//           >
//             <h2 className="font-semibold mb-2">Distribusi Jenis</h2>
//             <PieJenis data={stats.pieJenis || []} />
//           </div>

//           {/* Klaim per RS */}
//           <div
//             onClick={() => navigate('/detail/klaim')}
//             className="bg-white p-4 rounded-2xl shadow cursor-pointer hover:ring-2 hover:ring-slate-300 transition"
//           >
//             <h2 className="font-semibold mb-2">Klaim per RS</h2>
//             <BarKlaimRS data={stats.barKlaimRS || []} />
//           </div>

//           {/* Peserta per Kabupaten */}
//           <div
//             onClick={() => navigate('/detail/kabupaten')}
//             className="bg-white p-4 rounded-2xl shadow cursor-pointer hover:ring-2 hover:ring-slate-300 transition"
//           >
//             <h2 className="font-semibold mb-2">Peserta per Kabupaten</h2>
//             <BarKabupaten data={stats.barKabupaten || []} />
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }

// REFACTORE TAHAP 2

// import React from 'react'
// import Navbar from '../components/Navbar'
// import useSWR from 'swr'
// import api from '../api/axios'
// import { useNavigate } from 'react-router-dom'
// import LineKeliling from '../components/charts/LineKeliling'
// import LineViola from '../components/charts/LineViola'
// import BarPrima from '../components/charts/BarPrima'
// import BarPengaduan from '../components/charts/BarPengaduan'

// const fetcher = (url) => api.get(url).then(r => r.data)

// export default function Dashboard() {
//   const navigate = useNavigate()
//   const { data: stats } = useSWR('/dashboard/stats', fetcher)

//   if (!stats) return <div>Loading...</div>

//   return (
//     <div>
//       <Navbar />
//       <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
//         <section className="grid md:grid-cols-2 gap-4">
//           <div onClick={() => navigate('/detail/keliling')} className="cursor-pointer hover:ring-2 hover:ring-slate-300 rounded-2xl">
//             <LineKeliling data={stats.kelilingTrend} />
//           </div>
//           <div onClick={() => navigate('/detail/viola')} className="cursor-pointer hover:ring-2 hover:ring-slate-300 rounded-2xl">
//             <LineViola data={stats.violaTrend} />
//           </div>
//           <div onClick={() => navigate('/detail/prima')} className="cursor-pointer hover:ring-2 hover:ring-slate-300 rounded-2xl">
//             <BarPrima data={stats.primaBar} />
//           </div>
//           <div onClick={() => navigate('/detail/pengaduan')} className="cursor-pointer hover:ring-2 hover:ring-slate-300 rounded-2xl">
//             <BarPengaduan data={stats.pengaduanBar} />
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }

// REFACTORE TAHAP 3

import React from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import LineKeliling from '../components/charts/LineKeliling'
import LineViola from '../components/charts/LineViola'
import BarPrima from '../components/charts/BarPrima'
import BarPengaduan from '../components/charts/BarPengaduan'

const fetcher = (url) => api.get(url).then(r => r.data)

export default function Dashboard() {
  const navigate = useNavigate()
  const { data, error } = useSWR('/dashboard/stats', fetcher)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Headline / CTA */}
        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <h1 className="text-xl font-semibold text-slate-800">Ringkasan Kinerja</h1>
          <p className="text-sm text-slate-500">
            Visualisasi data dari file Excel 4 sheet: Kegiatan Keliling, VIOLA, Indeks Prima, dan Pengaduan Peserta.
          </p>
        </div>

        {/* Error / Loading */}
        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            Gagal memuat data dashboard.
          </div>
        )}
        {!data && !error && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1,2,3,4].map(k => (
              <div key={k} className="h-64 animate-pulse rounded-2xl bg-white p-4 ring-1 ring-slate-200" />
            ))}
          </div>
        )}

        {data && (
          <section className="grid gap-4 md:grid-cols-2">
            <div
              onClick={() => navigate('/detail/keliling')}
              className="cursor-pointer rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:ring-2 hover:ring-[#009B4C]"
            >
              <h2 className="mb-2 font-semibold">Kegiatan Keliling (Total Peserta / Bulan)</h2>
              <LineKeliling data={data.kelilingTrend} />
            </div>

            <div
              onClick={() => navigate('/detail/viola')}
              className="cursor-pointer rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:ring-2 hover:ring-[#00AEEF]"
            >
              <h2 className="mb-2 font-semibold">VIOLA (Skor / Bulan)</h2>
              <LineViola data={data.violaTrend} />
            </div>

            <div
              onClick={() => navigate('/detail/prima')}
              className="cursor-pointer rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:ring-2 hover:ring-[#009B4C]"
            >
              <h2 className="mb-2 font-semibold">Indeks Pelayanan Prima</h2>
              <BarPrima data={data.primaBar} />
            </div>

            <div
              onClick={() => navigate('/detail/pengaduan')}
              className="cursor-pointer rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:ring-2 hover:ring-[#0071BC]"
            >
              <h2 className="mb-2 font-semibold">Pengaduan Peserta</h2>
              <BarPengaduan data={data.pengaduanBar} />
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
