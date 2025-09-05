import React from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import BarPengaduan from '../components/charts/BarPengaduan'
import DataTable from '../components/DataTable'

const fetcher = (url) => api.get(url).then((r) => r.data)

export default function DetailPengaduan() {
  const navigate = useNavigate()
  const { data } = useSWR('/dashboard/stats', fetcher)

  if (!data) return <div>Loading...</div>

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <BarPengaduan data={data.pengaduanBar} big />
        <section className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Data Pengaduan Peserta</h2>
          <DataTable
            rows={data.pengaduanBar}
            columns={[
              { key: 'month', header: 'Bulan' },
              { key: 'jumlah', header: 'Jumlah Pengaduan' },
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
