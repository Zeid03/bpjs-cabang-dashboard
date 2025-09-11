// frontend/src/components/Modal.jsx
import React from 'react'

const SIZE_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
}

export default function Modal({ open, title, children, onClose, size = 'md' }) {
  if (!open) return null
  const maxW = SIZE_MAP[size] || SIZE_MAP.md

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className={`w-full ${maxW} rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-200`}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
