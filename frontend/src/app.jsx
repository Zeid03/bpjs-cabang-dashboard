// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import DetailKeliling from './pages/DetailKeliling'
import DetailViola from './pages/DetailViola'
import DetailPrima from './pages/DetailPrima'
import DetailPengaduan from './pages/DetailPengaduan'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/detail/keliling" element={<DetailKeliling />} />
          <Route path="/detail/viola" element={<DetailViola />} />
          <Route path="/detail/prima" element={<DetailPrima />} />
          <Route path="/detail/pengaduan" element={<DetailPengaduan />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
