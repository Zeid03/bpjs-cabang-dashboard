import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setMsg(null); setErr(null); setLoading(true)
    try {
      await api.post('/auth/forgot', { email })
      setMsg('Jika email terdaftar, tautan reset telah dikirim (cek email / minta ke admin).')
      setEmail('')
    } catch (e) {
      setErr(e?.response?.data?.message || 'Gagal memproses permintaan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <h1 className="mb-4 text-xl font-semibold text-slate-800">Lupa Password</h1>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input type="email" className="w-full rounded-xl border-slate-300"
                     value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
            {msg && <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{msg}</div>}
            {err && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</div>}
            <button disabled={loading} className="rounded-xl bg-slate-900 px-4 py-2 text-white">
              {loading ? 'Memproses…' : 'Kirim Tautan Reset'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
