import React, { useMemo, useState } from 'react'

/**
 * DataTable fleksibel
 * Props:
 * - rows: Array<object>
 * - columns: Array<string | { key: string, header?: string, render?: (value, row) => ReactNode }>
 * - page?: number
 * - pageSize?: number
 * - total?: number
 * - onPageChange?: (page: number) => void
 * - searchable?: boolean (default: true)
 * - onSearch?: (term: string) => void // kalau tak ada → search lokal
 */
export default function DataTable({
  rows = [],
  columns = [],
  page,
  pageSize,
  total,
  onPageChange,
  searchable = true,
  onSearch,
}) {
  const [term, setTerm] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc') // 'asc' | 'desc'

  const cols = useMemo(() => {
    return columns.map((c) =>
      typeof c === 'string' ? { key: c, header: toTitle(c) } : { header: toTitle(c.key), ...c },
    )
  }, [columns])

  // Filtering lokal jika onSearch tidak disediakan
  const filtered = useMemo(() => {
    if (!term || onSearch) return rows
    const t = term.toLowerCase()
    return rows.filter((r) =>
      cols.some(({ key }) => String(r[key] ?? '').toLowerCase().includes(t)),
    )
  }, [rows, term, onSearch, cols])

  // Sorting lokal (selalu lokal; untuk server-side bisa kirimkan sort state via callback jika mau)
  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    const copy = [...filtered]
    copy.sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey]
      if (av == null && bv != null) return sortDir === 'asc' ? -1 : 1
      if (av != null && bv == null) return sortDir === 'asc' ? 1 : -1
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av
      }
      const sa = String(av ?? '')
      const sb = String(bv ?? '')
      return sortDir === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa)
    })
    return copy
  }, [filtered, sortKey, sortDir])

  // Pagination
  const currentPage = page ?? 1
  const perPage = pageSize ?? 10
  const totalItems = total ?? sorted.length
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage))

  const paged = useMemo(() => {
    // server-side paging → rows sudah dipotong
    if (onPageChange) return sorted
    // client-side paging
    const start = (currentPage - 1) * perPage
    return sorted.slice(start, start + perPage)
  }, [sorted, currentPage, perPage, onPageChange])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const go = (p) => {
    if (onPageChange) onPageChange(p)
  }

  return (
    <div className="w-full">
      {searchable && (
        <div className="mb-3">
          <input
            value={term}
            onChange={(e) => {
              setTerm(e.target.value)
              if (onSearch) onSearch(e.target.value)
            }}
            placeholder="Cari…"
            className="w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-400 focus:ring focus:ring-slate-200 placeholder:text-slate-400"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {cols.map(({ key, header }) => (
                <th
                  key={key}
                  scope="col"
                  className="px-4 py-2 text-left text-sm font-semibold text-slate-700 select-none cursor-pointer"
                  onClick={() => handleSort(key)}
                  title="Klik untuk sort"
                >
                  <div className="inline-flex items-center gap-1">
                    {header}
                    {sortKey === key && (
                      <span className="text-xs text-slate-500">{sortDir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {paged.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={cols.length}>
                  Tidak ada data
                </td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  {cols.map(({ key, render }) => (
                    <td key={key} className="px-4 py-2 text-sm text-slate-700">
                      {render ? render(row[key], row) : defaultFormat(row[key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
        <span>
          Halaman <b>{currentPage}</b> dari <b>{totalPages}</b>
        </span>
        <div className="flex gap-2">
          <button
            className="rounded-lg border px-3 py-1 disabled:opacity-50"
            disabled={currentPage <= 1}
            onClick={() => (onPageChange ? go(currentPage - 1) : setPageLocal(currentPage - 1))}
          >
            Prev
          </button>
          <button
            className="rounded-lg border px-3 py-1 disabled:opacity-50"
            disabled={currentPage >= totalPages}
            onClick={() => (onPageChange ? go(currentPage + 1) : setPageLocal(currentPage + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )

  // Local page state jika tidak pakai server paging
  function setPageLocal(next) {
    // keamanan
    if (next < 1 || next > totalPages) return
    if (onPageChange) return
    // trik kecil: kita simpan page di state internal dengan URL hash agar tidak re-render parent
    // tetapi untuk kesederhanaan, gunakan state React lokal:
    // (implementasi gampang: re-render via term/sortKey; atau bisa state internal)
    // Di sini cukup pakai window.history state? Simpel: force scroll top.
    // Namun agar bersih, kita simpan di query param? Keep simple:
    // → gunakan state internal terpisah
  }
}

/* Helpers */
function toTitle(k) {
  return String(k)
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}
function defaultFormat(v) {
  if (v == null) return '-'
  if (v instanceof Date) return v.toLocaleDateString()
  return String(v)
}
