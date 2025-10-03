// frontend/src/components/ProtectedRoute.jsx
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requireRole = 'admin' }) {
  const { user } = useAuth()
  const loc = useLocation()

  if (!user) {
    // kirim state "from" supaya setelah login bisa balik
    return <Navigate to="/login" state={{ from: loc }} replace />
  }
  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />
  }
  return children
}
