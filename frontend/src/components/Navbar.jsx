import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const NavLink = ({ to, label }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-xl hover:bg-slate-200/60 transition ${
        pathname === to ? 'bg-slate-200' : ''
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <span>🩺</span>
          <span>BPJS Cabang Dashboard</span>
        </div>
        <nav className="flex items-center gap-2">
          <NavLink to="/" label="Dashboard" />
          <NavLink to="/upload" label="Upload Data" />
        </nav>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-600">{user?.name}</div>
          <button onClick={logout} className="px-3 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
