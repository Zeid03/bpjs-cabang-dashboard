import useSWR from 'swr';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import LineTrend from '../components/charts/LineTrend';
import PieJenis from '../components/charts/PieJenis';
import BarKlaimRS from '../components/charts/BarKlaimRS';
import DataTable from '../components/DataTable';
import { useState } from 'react';

const fetcher = (url) => api.get(url).then((r) => r.data);

export default function Dashboard() {
  const { data: stats } = useSWR('/peserta/stats', fetcher);

  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const { data: peserta } = useSWR(`/peserta?page=${page}&pageSize=20&q=${encodeURIComponent(q)}`, fetcher);

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <section className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow"><h2 className="font-semibold mb-2">Tren Peserta / Bulan</h2><LineTrend data={stats?.lineTrend || []} /></div>
          <div className="bg-white p-4 rounded-2xl shadow"><h2 className="font-semibold mb-2">Distribusi Jenis</h2><PieJenis data={stats?.pieJenis || []} /></div>
          <div className="bg-white p-4 rounded-2xl shadow md:col-span-1"><h2 className="font-semibold mb-2">Klaim per RS</h2><BarKlaimRS data={stats?.barKlaimRS || []} /></div>
        </section>

        <section className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Data Peserta</h2>
          <DataTable
            rows={peserta?.rows || []}
            columns={[
              { key: 'nik', header: 'NIK' },
              { key: 'nama', header: 'Nama' },
              { key: 'jenisKepesertaan', header: 'Jenis' },
              { key: 'faskes', header: 'Faskes' },
              { key: 'kabupaten', header: 'Kabupaten' },
              {
                key: 'tanggalDaftar',
                header: 'Tanggal Daftar',
                render: (v) => new Date(v).toLocaleDateString(),
              },
            ]}
            page={peserta?.page || 1}
            pageSize={peserta?.pageSize || 20}
            total={peserta?.total || 0}
            onPageChange={setPage}
            onSearch={(term) => { setQ(term); setPage(1); }}
          />
        </section>
      </main>
    </div>
  );
}
