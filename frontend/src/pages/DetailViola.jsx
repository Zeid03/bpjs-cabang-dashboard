import React from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import LineViola from '../components/charts/LineViola'
import { useAuth } from '../context/AuthContext'

const fetcher = (url) => api.get(url).then(r => r.data)

export default function DetailViola() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const { data: rows, mutate: mutateRows } = useSWR('/viola', fetcher)
  const { data: stats, mutate } = useSWR('/dashboard/stats', fetcher)

  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({
    id: null,
    kabupaten: '', kecamatan: '',
    bulan: '',
    administrasi: '', permintaanInformasi: '', penangananPengaduan: '',
  })

  const toN = (v) => Math.max(0, Number(v) || 0)
  const calcJumlah = (f) => toN(f.administrasi) + toN(f.permintaanInformasi) + toN(f.penangananPengaduan)

  const vioAggrTotal = React.useMemo(() => {
    const map = new Map()
    for (const r of (rows || [])) {
      const month = String(r.bulan || '').trim()
      if (!month) continue
      const jp = Number(
        r.jumlahPeserta != null
          ? r.jumlahPeserta
          : toN(r.administrasi) + toN(r.permintaanInformasi) + toN(r.penangananPengaduan)
      ) || 0

      const prev = map.get(month) || { month, freq: 0, totalPeserta: 0 }
      prev.freq += 1
      prev.totalPeserta += jp
      map.set(month, prev)
    }
    return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month))
  }, [rows])

  const chartData = React.useMemo(() => {
    return vioAggrTotal.map(d => ({ month: d.month, jumlahPeserta: d.totalPeserta }))
  }, [vioAggrTotal])

  function openCreate() {
    if (!isAdmin) return
    setForm({
      id: null,
      kabupaten: '', kecamatan: '',
      bulan: '',
      administrasi: '', permintaanInformasi: '', penangananPengaduan: '',
    })
    setOpen(true)
  }
  function openEdit(row) {
    if (!isAdmin) return
    setForm({
      id: row.id,
      kabupaten: row.kabupaten ?? '',
      kecamatan: row.kecamatan ?? '',
      bulan: row.bulan ?? '',
      administrasi: row.administrasi ?? 0,
      permintaanInformasi: row.permintaanInformasi ?? 0,
      penangananPengaduan: row.penangananPengaduan ?? 0,
    })
    setOpen(true)
  }

  async function onSubmit(e) {
    e.preventDefault()
    const payload = {
      kabupaten: form.kabupaten,
      kecamatan: form.kecamatan,
      bulan: form.bulan,
      administrasi: toN(form.administrasi),
      permintaanInformasi: toN(form.permintaanInformasi),
      penangananPengaduan: toN(form.penangananPengaduan),
    }
    if (form.id) await api.put(`/viola/${form.id}`, payload)
    else await api.post('/viola', payload)
    setOpen(false)
    await mutateRows()
    await mutate()
  }

  async function onDelete(id) {
    if (!isAdmin) return
    if (!confirm('Hapus data ini?')) return
    await api.delete(`/viola/${id}`)
    await mutateRows()
    await mutate()
  }

  if (!rows) return <div className="p-6">Loading…</div>

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <LineViola data={chartData} big />
        </div>

        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <h2 className="mb-3 font-semibold">Rekap Bulanan</h2>
          <DataTable
            rows={vioAggrTotal}
            columns={[
              { key: 'month', header: 'Bulan' },
              { key: 'freq', header: 'Jumlah Frekuensi' },
              { key: 'totalPeserta', header: 'Jumlah Peserta (Total)' },
            ]}
            searchable={false}
          />
        </section>

        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Data VIOLA</h2>
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
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-3 py-2 text-left align-bottom" rowSpan={2}>Kabupaten</th>
                  <th className="px-3 py-2 text-left align-bottom" rowSpan={2}>Kecamatan</th>
                  <th className="px-3 py-2 text-left align-bottom" rowSpan={2}>Bulan</th>
                  <th className="px-3 py-2 text-center" colSpan={4}>Jenis Layanan</th>
                  {isAdmin && <th className="px-3 py-2 align-bottom" rowSpan={2}></th>}
                </tr>
                <tr className="bg-slate-50">
                  <th className="px-3 py-2 text-left">Administrasi</th>
                  <th className="px-3 py-2 text-left">Permintaan Informasi</th>
                  <th className="px-3 py-2 text-left">Penanganan Pengaduan</th>
                  <th className="px-3 py-2 text-left">Jumlah Peserta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(rows || []).map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2">{r.kabupaten || '-'}</td>
                    <td className="px-3 py-2">{r.kecamatan || '-'}</td>
                    <td className="px-3 py-2">{r.bulan}</td>
                    <td className="px-3 py-2">{r.administrasi ?? 0}</td>
                    <td className="px-3 py-2">{r.permintaanInformasi ?? 0}</td>
                    <td className="px-3 py-2">{r.penangananPengaduan ?? 0}</td>
                    <td className="px-3 py-2">{r.jumlahPeserta}</td>
                    {isAdmin && (
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(r)} className="rounded-lg border px-3 py-1.5 hover:bg-slate-50">Edit</button>
                          <button onClick={() => onDelete(r.id)} className="rounded-lg border px-3 py-1.5 text-red-600 hover:bg-red-50">Hapus</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {(!rows || rows.length === 0) &&
                  <tr><td className="px-3 py-6 text-center text-slate-500" colSpan={isAdmin ? 8 : 7}>Belum ada data</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <button onClick={() => navigate('/')} className="rounded-xl bg-slate-900 px-4 py-2 text-white">
          Kembali ke Dashboard
        </button>
      </main>

      <Modal
        open={open}
        title={form.id ? 'Edit Data VIOLA' : 'Input Data VIOLA'}
        onClose={() => setOpen(false)}
        size="2xl"
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm">Kabupaten</label>
              <input value={form.kabupaten} onChange={e=>setForm(v=>({ ...v, kabupaten: e.target.value }))} className="w-full rounded-xl border-slate-300" />
            </div>
            <div>
              <label className="mb-1 block text-sm">Kecamatan</label>
              <input value={form.kecamatan} onChange={e=>setForm(v=>({ ...v, kecamatan: e.target.value }))} className="w-full rounded-xl border-slate-300" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm">Bulan</label>
            <input type="month" value={form.bulan} onChange={e=>setForm(v=>({ ...v, bulan: e.target.value }))} className="w-full rounded-xl border-slate-300" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm">Administrasi</label>
              <input type="number" value={form.administrasi} onChange={e=>setForm(v=>({ ...v, administrasi: e.target.value }))} className="w-full rounded-xl border-slate-300" />
            </div>
            <div>
              <label className="mb-1 block text-sm">Permintaan Informasi</label>
              <input type="number" value={form.permintaanInformasi} onChange={e=>setForm(v=>({ ...v, permintaanInformasi: e.target.value }))} className="w-full rounded-xl border-slate-300" />
            </div>
            <div>
              <label className="mb-1 block text-sm">Penanganan Pengaduan</label>
              <input type="number" value={form.penangananPengaduan} onChange={e=>setForm(v=>({ ...v, penangananPengaduan: e.target.value }))} className="w-full rounded-xl border-slate-300" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm">Jumlah Peserta (otomatis)</label>
            <input
              value={calcJumlah(form)}
              readOnly
              className="w-full rounded-xl border-slate-300 bg-slate-50"
            />
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
