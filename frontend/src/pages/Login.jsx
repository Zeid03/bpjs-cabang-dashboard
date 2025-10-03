import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import logo from '../../assets/bpjs-kesehatan-seeklogo.png'  // pastikan path benar

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login } = useAuth()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const onSubmit = async (values) => {
    try {
      setError(null)
      setLoading(true)
      // ✅ backend expects: { email, password }
      await login(values.email, values.password)
      const from = (history.state && history.state.usr && history.state.usr.from && history.state.usr.from.pathname) || '/'
      window.location.href = from
    } catch (e) {
      // tampilkan pesan error dari backend jika ada
      const msg = e?.response?.data?.message || 'Email atau password salah'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md">
        {/* Logo & Heading */}
        <div className="mb-6 text-center">
          <img src={logo} alt="BPJS Logo" className="mx-auto h-16" />
          <h1 className="mt-3 text-2xl font-bold text-slate-800">BPJS Cabang – Admin</h1>
          <p className="text-sm text-slate-500">Masuk untuk mengelola dashboard</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
        >
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                autoComplete="email"
                {...register('email', { required: 'Email wajib diisi' })}
                className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-[#0071BC] focus:ring focus:ring-[#0071BC]/30"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password', { required: 'Password wajib diisi' })}
                  className="block w-full rounded-xl border-slate-300 pr-12 shadow-sm focus:border-[#009B4C] focus:ring focus:ring-[#009B4C]/30"
                  
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 text-slate-500 hover:text-slate-700"
                  tabIndex={-1}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#009B4C] to-[#0071BC] py-2.5 font-medium text-white shadow hover:opacity-95 disabled:opacity-60"
            >
              {loading ? 'Memproses…' : 'Login'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <a href="/forgot" className="text-[#0071BC] hover:underline">Lupa password?</a>
          <span className="text-slate-500">Gunakan akun admin yang diberikan.</span>
        </div>
      </div>
    </div>
  )
}
