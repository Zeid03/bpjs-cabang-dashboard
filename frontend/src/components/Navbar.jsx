// import { useAuth } from '../context/AuthContext';
// import { Link, useLocation } from 'react-router-dom';

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const { pathname } = useLocation();

//   const NavLink = ({ to, label }) => (
//     <Link
//       to={to}
//       className={`px-3 py-2 rounded-xl hover:bg-slate-200/60 transition ${
//         pathname === to ? 'bg-slate-200' : ''
//       }`}
//     >
//       {label}
//     </Link>
//   );

//   return (
//     <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-slate-200">
//       <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
//         <div className="flex items-center gap-2 text-xl font-semibold">
//           <span>🩺</span>
//           <span>BPJS Cabang Dashboard</span>
//         </div>
//         <nav className="flex items-center gap-2">
//           <NavLink to="/" label="Dashboard" />
//           <NavLink to="/upload" label="Upload Data" />
//         </nav>
//         <div className="flex items-center gap-3">
//           <div className="text-sm text-slate-600">{user?.name}</div>
//           <button onClick={logout} className="px-3 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90">
//             Logout
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }


import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../../assets/bpjs horizontal.png' // ganti ke '/logo-bpjs.png' kalau di public/

const linkBase =
  'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition'
const idle =
  'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
const active =
  'text-white bg-gradient-to-r from-[#009B4C] to-[#0071BC] shadow'

export default function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="BPJS" className="h-8" />
          {/* <span className="text-lg font-semibold text-slate-800">
            BPJS Cabang Dashboard
          </span> */}
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
            end
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
          >
            Upload Data
          </NavLink>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-600 md:inline">Admin Cabang</span>
          <button
            onClick={onLogout}
            className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
