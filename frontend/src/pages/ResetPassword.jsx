import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function ResetPassword() {
  const [sp] = useSearchParams()
  const navigate = useNavigate()
  const token = sp.get('token') || ''
  const [newPassword, setNew] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    if (!token) setErr('Token reset tidak ditemukan. Buka link dari email.')
  }, [token])

  const submit = async (e) => {
    e.preventDefault()
    setMsg(null); setErr(null); setLoading(true)
    try {
      await api.post('/auth/reset', { token, newPassword })
      setMsg('Password berhasil direset. Silakan login.')
      setTimeout(() => navigate('/login'), 1200)
    } catch (e) {
      setErr(e?.response?.data?.message || 'Gagal mereset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <h1 className="mb-4 text-xl font-semibold text-slate-800">Reset Password</h1>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Password baru</label>
              <input type="password" className="w-full rounded-xl border-slate-300"
                     value={newPassword} onChange={(e)=>setNew(e.target.value)} required />
            </div>
            {msg && <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{msg}</div>}
            {err && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</div>}
            <button disabled={loading || !token} className="rounded-xl bg-slate-900 px-4 py-2 text-white">
              {loading ? 'Menyimpan…' : 'Simpan Password'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
