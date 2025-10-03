import React, { useEffect, useState, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../../assets/bpjs horizontal.png";

const linkBase = "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition";
const idle = "text-slate-600 hover:text-slate-900 hover:bg-slate-100";
const active = "text-white bg-gradient-to-r from-[#009B4C] to-[#0071BC] shadow";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const onLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  // Tutup menu mobile saat route berubah
  useEffect(() => setOpen(false), [location.pathname]);

  // Tutup dengan tombol Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const NavItemsPublic = ({ onClick }) => (
    <>
      <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`} onClick={onClick}>
        Dashboard
      </NavLink>
      {/* Halaman detail publik */}
      <NavLink to="/detail/keliling" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`} onClick={onClick}>
        Keliling
      </NavLink>
      <NavLink to="/detail/viola" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`} onClick={onClick}>
        VIOLA
      </NavLink>
      <NavLink to="/detail/prima" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`} onClick={onClick}>
        Prima
      </NavLink>
      <NavLink to="/detail/pengaduan" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`} onClick={onClick}>
        Pengaduan
      </NavLink>
    </>
  );

  const NavItemsAdmin = ({ onClick }) => (
    <>
      <NavLink to="/upload" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`} onClick={onClick}>
        Upload
      </NavLink>
      <NavLink to="/account" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`} onClick={onClick}>
        Akun
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="BPJS" className="h-8 w-auto" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-2 md:flex">
          <NavItemsPublic />
          {user?.role === 'admin' && <NavItemsAdmin />}
        </nav>

        {/* Right (Desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <a
              href="/login"
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Login
            </a>
          ) : (
            <>
              <span className="text-sm text-slate-600">{user.name || 'Admin'}</span>
              <button
                onClick={onLogout}
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile: Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009B4C]"
          >
            <svg className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <button
          aria-hidden
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px] md:hidden"
        />
      )}

      {/* Mobile Menu Panel */}
      <div id="mobile-menu" className={`md:hidden ${open ? "block" : "hidden"}`}>
        <div className="absolute left-0 right-0 z-40 mt-0 origin-top rounded-b-2xl border-b bg-white px-4 pb-4 pt-2 shadow-lg">
          <nav className="flex flex-col gap-2">
            <NavItemsPublic onClick={() => setOpen(false)} />
            {user?.role === 'admin' && <NavItemsAdmin onClick={() => setOpen(false)} />}
          </nav>

          <div className="mt-3 flex items-center justify-between">
            {!user ? (
              <a
                href="/login"
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Login
              </a>
            ) : (
              <>
                <span className="text-sm text-slate-600">{user.name || 'Admin'}</span>
                <button
                  onClick={onLogout}
                  className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
