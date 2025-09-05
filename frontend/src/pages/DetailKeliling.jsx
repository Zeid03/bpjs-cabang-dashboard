import React from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import LineKeliling from '../components/charts/LineKeliling'
import DataTable from '../components/DataTable'

const fetcher = (url) => api.get(url).then((r) => r.data)

export default function DetailKeliling() {
  const navigate = useNavigate()
  const { data } = useSWR('/dashboard/stats', fetcher)

  if (!data) return <div>Loading...</div>

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <LineKeliling data={data.kelilingTrend} big />
        <section className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Data Kegiatan Keliling</h2>
          <DataTable
            rows={data.kelilingTrend}
            columns={[
              { key: 'month', header: 'Bulan' },
              { key: 'totalPeserta', header: 'Total Peserta' },
            ]}
          />
        </section>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl"
        >
          Kembali ke Dashboard
        </button>
      </main>
    </div>
  )
}
