import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'

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
      await login(values.email, values.password)
      window.location.href = '/'
    } catch (e) {
      // setError('Email atau password salah')
      setError(e.response?.data?.message || e.message || 'Gagal login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white text-xl">🩺</div>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">BPJS Cabang – Admin</h1>
          <p className="text-sm text-slate-500">Masuk untuk mengelola dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl bg-white/90 backdrop-blur p-6 shadow-xl ring-1 ring-slate-200"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                autoComplete="email"
                {...register('email', { required: 'Email wajib diisi' })}
                className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-400 focus:ring focus:ring-slate-200 placeholder:text-slate-400"
                placeholder="Email"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password', { required: 'Password wajib diisi' })}
                  className="block w-full rounded-xl border-slate-300 pr-12 shadow-sm focus:border-slate-400 focus:ring focus:ring-slate-200 placeholder:text-slate-400"
                  placeholder="Password"
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

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-2.5 font-medium text-white shadow hover:opacity-95 disabled:opacity-60"
            >
              {loading ? 'Memproses…' : 'Login'}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Gunakan akun admin yang diberikan. Hubungi IT jika lupa password.
        </p>
      </div>
    </div>
  )
}
