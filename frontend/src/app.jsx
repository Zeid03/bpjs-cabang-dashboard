// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Upload from './pages/Upload'
import DetailKeliling from './pages/DetailKeliling'
import DetailViola from './pages/DetailViola'
import DetailPrima from './pages/DetailPrima'
import DetailPengaduan from './pages/DetailPengaduan'

// NEW pages
import Account from './pages/Account'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Publik */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/detail/keliling" element={<DetailKeliling />} />
          <Route path="/detail/viola" element={<DetailViola />} />
          <Route path="/detail/prima" element={<DetailPrima />} />
          <Route path="/detail/pengaduan" element={<DetailPengaduan />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />

          {/* Admin only */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute requireRole="admin">
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute requireRole="admin">
                <Account />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
