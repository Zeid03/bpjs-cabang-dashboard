import React from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import BarPengaduan from '../components/charts/BarPengaduan'
import { useAuth } from '../context/AuthContext'

const fetcher = (url) => api.get(url).then(r => r.data)

export default function DetailPengaduan() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const { data, mutate } = useSWR('/dashboard/stats', fetcher)
  const { data: rows, mutate: mutateRows } = useSWR('/pengaduan', fetcher)

  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({
    id: null, bulan: '', jumlah: '',
    sla1: '', sla2: '', sla3: '', slagt3: ''
  })

  if (!data) return <div className="p-6">Loading…</div>
  const aggr = data.pengaduanBar || []

  function openCreate() {
    if (!isAdmin) return
    setForm({ id: null, bulan: '', jumlah: '', sla1: '', sla2: '', sla3: '', slagt3: '' })
    setOpen(true)
  }
  function openEdit(row) {
    if (!isAdmin) return
    setForm({
      id: row.id,
      bulan: row.bulan,
      jumlah: row.jumlah,
      sla1: row.sla1 ?? 0,
      sla2: row.sla2 ?? 0,
      sla3: row.sla3 ?? 0,
      slagt3: row.slagt3 ?? 0,
    })
    setOpen(true)
  }
  async function onSubmit(e) {
    e.preventDefault()
    const payload = {
      bulan: form.bulan,
      jumlah: Number(form.jumlah),
      sla1: Number(form.sla1) || 0,
      sla2: Number(form.sla2) || 0,
      sla3: Number(form.sla3) || 0,
      slagt3: Number(form.slagt3) || 0,
    }
    if (form.id) await api.put(`/pengaduan/${form.id}`, payload)
    else await api.post('/pengaduan', payload)
    setOpen(false)
    await mutateRows()
    await mutate()
  }
  async function onDelete(id) {
    if (!isAdmin) return
    if (!confirm('Hapus data ini?')) return
    await api.delete(`/pengaduan/${id}`)
    await mutateRows(); await mutate()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">

        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <BarPengaduan data={aggr} big showTotal />
        </div>

        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <h2 className="mb-3 font-semibold">Rekap Bulanan</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-3 py-2 text-left align-bottom" rowSpan={2}>Bulan</th>
                  <th className="px-3 py-2 text-left align-bottom" rowSpan={2}>Jumlah Pengaduan</th>
                  <th className="px-3 py-2 text-center" colSpan={4}>SLA</th>
                </tr>
                <tr className="bg-slate-50">
                  <th className="px-3 py-2 text-left">1 hari</th>
                  <th className="px-3 py-2 text-left">2 hari</th>
                  <th className="px-3 py-2 text-left">3 hari</th>
                  <th className="px-3 py-2 text-left">&gt;3 hari</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {aggr.map((r) => (
                  <tr key={r.month} className="hover:bg-slate-50">
                    <td className="px-3 py-2">{r.month}</td>
                    <td className="px-3 py-2">{r.jumlah ?? 0}</td>
                    <td className="px-3 py-2">{r.sla1 ?? 0}</td>
                    <td className="px-3 py-2">{r.sla2 ?? 0}</td>
                    <td className="px-3 py-2">{r.sla3 ?? 0}</td>
                    <td className="px-3 py-2">{r.slagt3 ?? 0}</td>
                  </tr>
                ))}
                {aggr.length === 0 && (
                  <tr><td className="px-3 py-6 text-center text-slate-500" colSpan={6}>Belum ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Data Pengaduan</h2>
            {isAdmin && (
              <button
                onClick={openCreate}
                className="rounded-xl bg-gradient-to-r from-[#009B4C] to-[#0071BC] px-3 py-2 text-sm font-medium text-white"
              >
                + Input Data
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left">Bulan</th>
                  <th className="px-3 py-2 text-left">Jumlah</th>
                  <th className="px-3 py-2 text-left">SLA 1 hari</th>
                  <th className="px-3 py-2 text-left">SLA 2 hari</th>
                  <th className="px-3 py-2 text-left">SLA 3 hari</th>
                  <th className="px-3 py-2 text-left">SLA &gt;3 hari</th>
                  {isAdmin && <th className="px-3 py-2"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(rows || []).map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2">{r.bulan}</td>
                    <td className="px-3 py-2">{r.jumlah}</td>
                    <td className="px-3 py-2">{r.sla1 ?? 0}</td>
                    <td className="px-3 py-2">{r.sla2 ?? 0}</td>
                    <td className="px-3 py-2">{r.sla3 ?? 0}</td>
                    <td className="px-3 py-2">{r.slagt3 ?? 0}</td>
                    {isAdmin && (
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => openEdit(r)} className="mr-2 rounded-lg border px-2 py-1">Edit</button>
                        <button onClick={() => onDelete(r.id)} className="rounded-lg border px-2 py-1 text-red-600">Hapus</button>
                      </td>
                    )}
                  </tr>
                ))}
                {(!rows || rows.length === 0) &&
                  <tr><td className="px-3 py-6 text-center text-slate-500" colSpan={isAdmin ? 7 : 6}>Belum ada data</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <button onClick={() => navigate('/')} className="rounded-xl bg-slate-900 px-4 py-2 text-white">
          Kembali ke Dashboard
        </button>
      </main>

      <Modal open={open} title={form.id ? 'Edit Data Pengaduan' : 'Input Data Pengaduan'} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm">Bulan</label>
            <input type="month" value={form.bulan}
              onChange={e=>setForm(v=>({ ...v, bulan: e.target.value }))}
              className="w-full rounded-xl border-slate-300" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm">Jumlah Pengaduan</label>
              <input type="number" value={form.jumlah}
                onChange={e=>setForm(v=>({ ...v, jumlah: e.target.value }))}
                className="w-full rounded-xl border-slate-300" required />
            </div>
            <div>
              <label className="mb-1 block text-sm">SLA ≤1 hari</label>
              <input type="number" value={form.sla1}
                onChange={e=>setForm(v=>({ ...v, sla1: e.target.value }))}
                className="w-full rounded-xl border-slate-300" />
            </div>
            <div>
              <label className="mb-1 block text-sm">SLA 2 hari</label>
              <input type="number" value={form.sla2}
                onChange={e=>setForm(v=>({ ...v, sla2: e.target.value }))}
                className="w-full rounded-xl border-slate-300" />
            </div>
            <div>
              <label className="mb-1 block text-sm">SLA 3 hari</label>
              <input type="number" value={form.sla3}
                onChange={e=>setForm(v=>({ ...v, sla3: e.target.value }))}
                className="w-full rounded-xl border-slate-300" />
            </div>
            <div>
              <label className="mb-1 block text-sm">SLA &gt;3 hari</label>
              <input type="number" value={form.slagt3}
                onChange={e=>setForm(v=>({ ...v, slagt3: e.target.value }))}
                className="w-full rounded-xl border-slate-300" />
            </div>
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
