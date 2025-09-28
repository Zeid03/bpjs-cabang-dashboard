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
const pad2 = (n) => String(n).padStart(2, '0')

export default function Dashboard() {
  const navigate = useNavigate()

  // Stats agregat untuk 3 kartu lain (keliling, viola, pengaduan)
  const { data: stats, error: statsErr } = useSWR('/dashboard/stats', fetcher)

  // Data Prima langsung dari backend (sudah termasuk target tahunan), urutan ASC via query
  const { data: primaRows, error: primaErr } = useSWR('/prima?order=asc', fetcher)

  const isLoading = (!stats && !statsErr) || (!primaRows && !primaErr)
  const isError = statsErr || primaErr

  // Siapkan data chart Prima: 4 bar per periode + garis target
  const primaChart = React.useMemo(() => {
    if (!primaRows) return []
    // Backend sudah ASC, tapi kita jaga-jaga sort lagi
    const asc = [...primaRows].sort((a, b) => (a.tahun - b.tahun) || (a.bulan - b.bulan))
    return asc.map(r => ({
      month: `${r.tahun}-${pad2(r.bulan)}`,
      wave1: Number(r.wave1 || 0),
      wave2: Number(r.wave2 || 0),
      wave3: Number(r.wave3 || 0),
      wave4: Number(r.wave4 || 0),
      target: Number(r.target || 0), // sudah disediakan backend (target tahunan)
    }))
  }, [primaRows])

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
        {isError && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            Gagal memuat data dashboard.
          </div>
        )}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1,2,3,4].map(k => (
              <div key={k} className="h-64 animate-pulse rounded-2xl bg-white p-4 ring-1 ring-slate-200" />
            ))}
          </div>
        )}

        {!isLoading && !isError && stats && primaRows && (
          <section className="grid gap-4 md:grid-cols-2">
            {/* Kegiatan Keliling */}
            <div
              onClick={() => navigate('/detail/keliling')}
              className="cursor-pointer rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:ring-2 hover:ring-[#009B4C]"
            >
              <h2 className="mb-2 font-semibold">Kegiatan Keliling (Total Peserta / Bulan)</h2>
              <LineKeliling data={stats.kelilingTrend || []} />
            </div>

            {/* VIOLA */}
            <div
              onClick={() => navigate('/detail/viola')}
              className="cursor-pointer rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:ring-2 hover:ring-[#00AEEF]"
            >
              <h2 className="mb-2 font-semibold">VIOLA (Jumlah Peserta / Bulan)</h2>
              <LineViola data={stats.violaTrend || []} />
            </div>

            {/* Indeks Pelayanan Prima — pakai data /prima?order=asc agar garis target muncul */}
            <div
              onClick={() => navigate('/detail/prima')}
              className="cursor-pointer rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:ring-2 hover:ring-[#009B4C]"
            >
              <h2 className="mb-2 font-semibold">Indeks Pelayanan Prima</h2>
              <BarPrima data={primaChart} />
            </div>

            {/* Pengaduan Peserta */}
            <div
              onClick={() => navigate('/detail/pengaduan')}
              className="cursor-pointer rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:ring-2 hover:ring-[#0071BC]"
            >
              <h2 className="mb-2 font-semibold">Pengaduan Peserta</h2>
              <BarPengaduan data={stats.pengaduanBar || []} />
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
