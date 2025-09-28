import React from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import BarPrima from '../components/charts/BarPrima'

const fetcher = (url) => api.get(url).then(r => r.data)
const pad2 = (n) => String(n).padStart(2, '0')

export default function DetailPrima() {
  const navigate = useNavigate()

  // Data mentah /prima (tanpa input target per bulan)
  const { data: rows, mutate: mutateRows } = useSWR('/prima?order=asc', fetcher)
  // Target tahunan
  const { data: targets, mutate: mutateTargets } = useSWR('/prima/target', fetcher)

  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({
    id: null, tahun: '', bulan: '', wave1: '', wave2: '', wave3: '', wave4: ''
  })

  // State untuk panel target tahunan
  const [yearSel, setYearSel] = React.useState('')
  const [yearTarget, setYearTarget] = React.useState('')

  React.useEffect(() => {
    if (rows && rows.length > 0 && !yearSel) {
      setYearSel(String(rows[0].tahun))
    }
  }, [rows, yearSel])

  React.useEffect(() => {
    if (!targets || !yearSel) return
    const found = (targets || []).find(t => String(t.tahun) === String(yearSel))
    setYearTarget(found ? String(found.target) : '')
  }, [targets, yearSel])

  if (!rows) return <div className="p-6">Loading…</div>

  // Buat map target per tahun (untuk chart & rekap)
  const targetMap = new Map((targets || []).map(t => [Number(t.tahun), Number(t.target || 0)]))

  // Data chart: wave1..4 + target per tahun
  const chartData = (rows || []).map(r => ({
    month: `${r.tahun}-${pad2(r.bulan)}`,
    wave1: Number(r.wave1 || 0),
    wave2: Number(r.wave2 || 0),
    wave3: Number(r.wave3 || 0),
    wave4: Number(r.wave4 || 0),
    target: targetMap.get(r.tahun) || 0,
  }))

  // Rekap bulanan: rata-rata + target (2 desimal)
  const rekap = (rows || []).map(r => {
    const avg = (Number(r.wave1||0)+Number(r.wave2||0)+Number(r.wave3||0)+Number(r.wave4||0))/4
    return {
      month: `${r.tahun}-${pad2(r.bulan)}`,
      nilai: avg.toFixed(2),
      target: Number(targetMap.get(r.tahun) || 0).toFixed(2)
    }
  })

  function openCreate() {
    setForm({ id: null, tahun: '', bulan: '', wave1: '', wave2: '', wave3: '', wave4: '' })
    setOpen(true)
  }
  function openEdit(row) {
    setForm({
      id: row.id,
      tahun: row.tahun,
      bulan: row.bulan,
      wave1: row.wave1 ?? 0,
      wave2: row.wave2 ?? 0,
      wave3: row.wave3 ?? 0,
      wave4: row.wave4 ?? 0,
    })
    setOpen(true)
  }
  async function onSubmit(e) {
    e.preventDefault()
    const payload = {
      tahun: Number(form.tahun),
      bulan: Number(form.bulan),
      wave1: parseFloat(form.wave1) || 0,
      wave2: parseFloat(form.wave2) || 0,
      wave3: parseFloat(form.wave3) || 0,
      wave4: parseFloat(form.wave4) || 0,
    }
    if (form.id) await api.put(`/prima/${form.id}`, payload)
    else await api.post('/prima', payload)
    setOpen(false)
    await mutateRows()
  }
  async function onDelete(id) {
    if (!confirm('Hapus data ini?')) return
    await api.delete(`/prima/${id}`)
    await mutateRows()
  }

  async function saveYearTarget(e) {
    e.preventDefault()
    const payload = { tahun: Number(yearSel), target: parseFloat(yearTarget) || 0 }
    await api.post('/prima/target', payload) // upsert
    await mutateTargets()
  }

  const yearOptions = Array.from(new Set((rows || []).map(r => r.tahun))).sort((a,b)=>a-b)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">

        {/* Panel Target Tahunan */}
        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <h2 className="mb-3 font-semibold">Target Tahunan Indeks Prima</h2>
          <form onSubmit={saveYearTarget} className="flex flex-col md:flex-row gap-3 items-start md:items-end">
            <div>
              <label className="text-sm">Tahun</label>
              <select
                value={yearSel}
                onChange={e=>setYearSel(e.target.value)}
                className="block w-40 rounded-xl border-slate-300"
              >
                <option value="" disabled>Pilih tahun</option>
                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm">Target Tahun</label>
              <input
                type="number" step="0.01"
                value={yearTarget}
                onChange={e=>setYearTarget(e.target.value)}
                className="block w-40 rounded-xl border-slate-300"
                placeholder="mis. 85"
              />
            </div>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-white">Simpan Target</button>
          </form>
        </section>

        {/* Chart */}
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <BarPrima data={chartData} big />
        </div>

        {/* Rekap Bulanan */}
        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <h2 className="mb-3 font-semibold">Rekap Bulanan</h2>
          <DataTable
            rows={rekap}
            columns={[
              { key: 'month', header: 'Periode' },
              { key: 'nilai', header: 'Nilai (Rata-rata)' },
              { key: 'target', header: 'Target' },
            ]}
            searchable={false}
          />
        </section>

        {/* Data mentah */}
        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Data Indeks Prima</h2>
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
                  <th className="px-3 py-2 text-left">Tahun</th>
                  <th className="px-3 py-2 text-left">Bulan</th>
                  <th className="px-3 py-2 text-left">Wave 1</th>
                  <th className="px-3 py-2 text-left">Wave 2</th>
                  <th className="px-3 py-2 text-left">Wave 3</th>
                  <th className="px-3 py-2 text-left">Wave 4</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(rows || []).map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2">{r.tahun}</td>
                    <td className="px-3 py-2">{r.bulan}</td>
                    <td className="px-3 py-2">{Number(r.wave1).toFixed(2)}</td>
                    <td className="px-3 py-2">{Number(r.wave2).toFixed(2)}</td>
                    <td className="px-3 py-2">{Number(r.wave3).toFixed(2)}</td>
                    <td className="px-3 py-2">{Number(r.wave4).toFixed(2)}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(r)} className="rounded-lg border px-3 py-1.5">Edit</button>
                        <button onClick={() => onDelete(r.id)} className="rounded-lg border px-3 py-1.5 text-red-600">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!rows || rows.length === 0) &&
                  <tr><td colSpan={7} className="text-center text-slate-500 py-6">Belum ada data</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <button onClick={() => navigate('/')} className="rounded-xl bg-slate-900 px-4 py-2 text-white">
          Kembali ke Dashboard
        </button>
      </main>

      <Modal open={open} title={form.id ? 'Edit Indeks Prima' : 'Input Indeks Prima'} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Tahun</label>
              <input
                type="number"
                value={form.tahun}
                onChange={e=>setForm(v=>({...v,tahun:e.target.value}))}
                className="w-full rounded-xl border-slate-300"
                required
              />
            </div>
            <div>
              <label className="text-sm">Bulan</label>
              <input
                type="number" min="1" max="12"
                value={form.bulan}
                onChange={e=>setForm(v=>({...v,bulan:e.target.value}))}
                className="w-full rounded-xl border-slate-300"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-sm">Wave 1</label>
              <input type="number" step="0.01" value={form.wave1} onChange={e=>setForm(v=>({...v,wave1:e.target.value}))} className="w-full rounded-xl border-slate-300"/>
            </div>
            <div>
              <label className="text-sm">Wave 2</label>
              <input type="number" step="0.01" value={form.wave2} onChange={e=>setForm(v=>({...v,wave2:e.target.value}))} className="w-full rounded-xl border-slate-300"/>
            </div>
            <div>
              <label className="text-sm">Wave 3</label>
              <input type="number" step="0.01" value={form.wave3} onChange={e=>setForm(v=>({...v,wave3:e.target.value}))} className="w-full rounded-xl border-slate-300"/>
            </div>
            <div>
              <label className="text-sm">Wave 4</label>
              <input type="number" step="0.01" value={form.wave4} onChange={e=>setForm(v=>({...v,wave4:e.target.value}))} className="w-full rounded-xl border-slate-300"/>
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
