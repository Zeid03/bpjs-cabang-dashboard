import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function Account() {
  const [oldPassword, setOld] = useState('')
  const [newPassword, setNew] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setMsg(null); setErr(null); setLoading(true)
    try {
      await api.post('/auth/change-password', { oldPassword, newPassword })
      setMsg('Password berhasil diperbarui')
      setOld(''); setNew('')
    } catch (e) {
      setErr(e?.response?.data?.message || 'Gagal memperbarui password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <h1 className="mb-4 text-xl font-semibold text-slate-800">Ganti Password</h1>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Password lama</label>
              <input type="password" className="w-full rounded-xl border-slate-300"
                     value={oldPassword} onChange={(e)=>setOld(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Password baru</label>
              <input type="password" className="w-full rounded-xl border-slate-300"
                     value={newPassword} onChange={(e)=>setNew(e.target.value)} required />
            </div>
            {msg && <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{msg}</div>}
            {err && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</div>}
            <button disabled={loading} className="rounded-xl bg-slate-900 px-4 py-2 text-white">
              {loading ? 'Menyimpan…' : 'Simpan'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
