// frontend/src/components/SearchableDropdown.jsx

import React, { useState, useEffect, useRef } from 'react';

export default function SearchableDropdown({ options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Efek untuk menutup dropdown jika pengguna mengklik di luar area komponen
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    // Tambahkan event listener saat komponen dimuat
    document.addEventListener("mousedown", handleClickOutside);
    // Hapus event listener saat komponen dibongkar
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // Filter opsi berdasarkan apa yang diketik pengguna
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fungsi untuk memilih salah satu opsi
  function selectOption(option) {
    onChange(option); // Kirim nilai yang dipilih ke komponen induk
    setSearchTerm(''); // Kosongkan kolom pencarian
    setIsOpen(false);  // Tutup dropdown
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        // Tampilkan nilai yang sudah dipilih jika dropdown tertutup,
        // atau tampilkan kata kunci pencarian jika dropdown terbuka
        value={isOpen ? searchTerm : value}
        onChange={e => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-xl border-slate-300"
        autoComplete="off" // Hindari autofill dari browser
      />

      {/* Tampilkan daftar pilihan hanya jika dropdown terbuka */}
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <div
                key={option}
                onClick={() => selectOption(option)}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-slate-100"
              >
                {option}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">Tidak ada hasil</div>
          )}
        </div>
      )}
    </div>
  );
}