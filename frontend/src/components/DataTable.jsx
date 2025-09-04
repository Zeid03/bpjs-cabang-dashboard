import { useMemo, useState } from 'react';

export default function DataTable({ rows, columns, page, pageSize, total, onPageChange, onSearch }) {
  const [q, setQ] = useState('');

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleKey = (e) => {
    if (e.key === 'Enter') onSearch?.(q);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 mb-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Cari nama/NIK/faskes/kabupaten…"
          className="w-full md:w-80 px-3 py-2 border rounded-xl"
        />
        <button onClick={() => onSearch?.(q)} className="px-3 py-2 rounded-xl bg-slate-900 text-white">
          Search
        </button>
      </div>
      <div className="overflow-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="text-left px-3 py-2 whitespace-nowrap">{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="odd:bg-white even:bg-slate-50">
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-2 whitespace-nowrap">{c.render ? c.render(r[c.key], r) : r[c.key]}</td>
                ))}
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-4 text-center text-slate-500">Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3 text-sm">
        <div>{rows.length ? `${start}–${end} dari ${total}` : '0 data'}</div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 border rounded-lg disabled:opacity-50"
            onClick={() => onPageChange?.(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            className="px-2 py-1 border rounded-lg disabled:opacity-50"
            onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
