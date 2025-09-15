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
