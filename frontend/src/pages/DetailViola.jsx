import React from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import LineViola from '../components/charts/LineViola'

const fetcher = (url) => api.get(url).then(r => r.data)

export default function DetailViola() {
  const navigate = useNavigate()
  const { data, mutate } = useSWR('/dashboard/stats', fetcher)
  const { data: rows, mutate: mutateRows } = useSWR('/viola', fetcher)

  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({ id: null, bulan: '', skor: '' })

  if (!data) return <div className="p-6">Loading…</div>

  const vioAggr = data.violaTrend || []

  function openCreate() {
    setForm({ id: null, bulan: '', skor: '' })
    setOpen(true)
  }
  function openEdit(row) {
    setForm({ id: row.id, bulan: row.bulan, skor: row.skor })
    setOpen(true)
  }
  async function onSubmit(e) {
    e.preventDefault()
    const payload = { bulan: form.bulan, skor: Number(form.skor) }
    if (form.id) await api.put(`/viola/${form.id}`, payload)
    else await api.post('/viola', payload)
    setOpen(false)
    await mutateRows()
    await mutate()
  }
  async function onDelete(id) {
    if (!confirm('Hapus data ini?')) return
    await api.delete(`/viola/${id}`)
    await mutateRows(); await mutate()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <LineViola data={vioAggr} big />
        </div>

        {/* Tabel agregat – kolom FREKUENSI sebelum SKOR */}
        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <h2 className="mb-3 font-semibold">Rekap Bulanan</h2>
          <DataTable
            rows={vioAggr}
            columns={[
              { key: 'month', header: 'Bulan' },
              { key: 'freq', header: 'Jumlah Frekuensi' },  // <-- sesuai permintaan
              { key: 'skor', header: 'Skor (Rata-rata)' },
            ]}
            searchable={false}
          />
        </section>

        {/* Data mentah + CRUD */}
        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Data Mentah VIOLA</h2>
            <button
              onClick={openCreate}
              className="rounded-xl bg-gradient-to-r from-[#009B4C] to-[#0071BC] px-3 py-2 text-sm font-medium text-white"
            >
              + Input Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left">Bulan</th>
                  <th className="px-3 py-2 text-left">Skor</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(rows || []).map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2">{r.bulan}</td>
                    <td className="px-3 py-2">{r.skor}</td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => openEdit(r)} className="mr-2 rounded-lg border px-2 py-1">Edit</button>
                      <button onClick={() => onDelete(r.id)} className="rounded-lg border px-2 py-1 text-red-600">Hapus</button>
                    </td>
                  </tr>
                ))}
                {(!rows || rows.length === 0) && (
                  <tr><td className="px-3 py-6 text-center text-slate-500" colSpan={3}>Belum ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <button onClick={() => navigate('/')} className="rounded-xl bg-slate-900 px-4 py-2 text-white">
          Kembali ke Dashboard
        </button>
      </main>

      <Modal open={open} title={form.id ? 'Edit Data VIOLA' : 'Input Data VIOLA'} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm">Bulan</label>
            <input type="month" value={form.bulan}
              onChange={e=>setForm(v=>({ ...v, bulan: e.target.value }))}
              className="w-full rounded-xl border-slate-300" required />
          </div>
          <div>
            <label className="mb-1 block text-sm">Skor</label>
            <input type="number" step="0.01" value={form.skor}
              onChange={e=>setForm(v=>({ ...v, skor: e.target.value }))}
              className="w-full rounded-xl border-slate-300" required />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={()=>setOpen(false)} className="rounded-xl border px-3 py-2">Batal</button>
            <button className="rounded-xl bg-slate-900 px-3 py-2 text-white">{form.id ? 'Simpan' : 'Tambah'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

