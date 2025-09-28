// // Refactore tahap 2

// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import useSWR from 'swr'
// import api from '../api/axios'
// import Navbar from '../components/Navbar'
// import DataTable from '../components/DataTable'
// import Modal from '../components/Modal'
// import LineKeliling from '../components/charts/LineKeliling'

// const fetcher = (url) => api.get(url).then(r => r.data)

// export default function DetailKeliling() {
//   const navigate = useNavigate()
//   const { data, mutate } = useSWR('/dashboard/stats', fetcher)
//   const { data: rowsKel, mutate: mutateKel } = useSWR('/keliling', fetcher)

//   const [open, setOpen] = React.useState(false)
//   // ⬇️ Tambah kabupaten & kecamatan di form state
//   const [form, setForm] = React.useState({
//     id: null, kabupaten: '', kecamatan: '', desa: '', tanggal: '', lokasi: '', peserta: ''
//   })

//   if (!data) return <div className="p-6">Loading…</div>

//   const kelAggr = data.kelilingTrend || []

//   function openCreate() {
//     setForm({ id: null, kabupaten: '', kecamatan: '', desa: '', tanggal: '', lokasi: '', peserta: '' })
//     setOpen(true)
//   }
//   function openEdit(row) {
//     setForm({
//       id: row.id,
//       kabupaten: row.kabupaten ?? '',
//       kecamatan: row.kecamatan ?? '',
//       desa: row.desa ?? '',
//       tanggal: row.tanggal?.slice(0,10) ?? '',
//       lokasi: row.lokasi ?? '',
//       peserta: row.peserta ?? '',
//     })
//     setOpen(true)
//   }
//   async function onSubmit(e) {
//     e.preventDefault()
//     // ⬇️ Sertakan kabupaten & kecamatan di payload
//     const payload = {
//       kabupaten: form.kabupaten,
//       kecamatan: form.kecamatan,
//       desa: form.desa,
//       tanggal: form.tanggal,
//       lokasi: form.lokasi,
//       peserta: Number(form.peserta)
//     }
//     if (form.id) await api.put(`/keliling/${form.id}`, payload)
//     else await api.post('/keliling', payload)
//     setOpen(false)
//     await mutateKel()
//     await mutate()
//   }
//   async function onDelete(id) {
//     if (!confirm('Hapus data ini?')) return
//     await api.delete(`/keliling/${id}`)
//     await mutateKel(); await mutate()
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Navbar />
//       <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
//         <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
//           <LineKeliling data={kelAggr} big />
//         </div>

//         {/* Tabel agregat – kolom FREKUENSI sebelum TOTAL PESERTA */}
//         <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
//           <h2 className="mb-3 font-semibold">Rekap Bulanan</h2>
//           <DataTable
//             rows={kelAggr}
//             columns={[
//               { key: 'month', header: 'Bulan' },
//               { key: 'freq', header: 'Jumlah Frekuensi' },
//               { key: 'totalPeserta', header: 'Total Peserta' },
//             ]}
//             searchable={false}
//           />
//         </section>

//         {/* Data mentah + CRUD */}
//         <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
//           <div className="mb-3 flex items-center justify-between">
//             <h2 className="font-semibold">Data Mentah Kegiatan Keliling</h2>
//             <button
//               onClick={openCreate}
//               className="rounded-xl bg-gradient-to-r from-[#009B4C] to-[#0071BC] px-3 py-2 text-sm font-medium text-white"
//             >
//               + Input Data
//             </button>
//           </div>

//           <div className="overflow-x-auto">
            // <table className="min-w-full divide-y divide-slate-200 text-sm">
            //   <thead className="bg-slate-50">
            //     <tr>
            //       {/* ⬇️ Tambah dua kolom di SEBELUM Tanggal */}
            //       <th className="px-3 py-2 text-left">Kabupaten</th>
            //       <th className="px-3 py-2 text-left">Kecamatan</th>
            //       <th className="px-3 py-2 text-left">Desa</th>
            //       <th className="px-3 py-2 text-left">Tanggal</th>
            //       <th className="px-3 py-2 text-left">Lokasi</th>
            //       <th className="px-3 py-2 text-left">Jumlah Peserta</th>
            //       <th className="px-3 py-2"></th>
            //     </tr>
            //   </thead>
            //   <tbody className="divide-y divide-slate-100">
            //     {(rowsKel || []).map(r => (
            //       <tr key={r.id} className="hover:bg-slate-50">
            //         <td className="px-3 py-2">{r.kabupaten || '-'}</td>
            //         <td className="px-3 py-2">{r.kecamatan || '-'}</td>
            //         <td className="px-3 py-2">{r.desa || '-'}</td>
            //         <td className="px-3 py-2">{new Date(r.tanggal).toLocaleDateString()}</td>
            //         <td className="px-3 py-2">{r.lokasi}</td>
            //         <td className="px-3 py-2">{r.peserta}</td>
            //         <td className="px-3 py-2 text-right">
            //           <button onClick={() => openEdit(r)} className="mr-2 rounded-lg border px-2 py-1">Edit</button>
            //           <button onClick={() => onDelete(r.id)} className="rounded-lg border px-2 py-1 text-red-600">Hapus</button>
            //         </td>
            //       </tr>
            //     ))}
            //     {(!rowsKel || rowsKel.length === 0) && (
            //       <tr><td className="px-3 py-6 text-center text-slate-500" colSpan={7}>Belum ada data</td></tr>
            //     )}
            //   </tbody>
            // </table>
//           </div>
//         </section>

//         <button onClick={() => navigate('/')} className="rounded-xl bg-slate-900 px-4 py-2 text-white">
//           Kembali ke Dashboard
//         </button>
//       </main>

//       <Modal open={open} title={form.id ? 'Edit Data Keliling' : 'Input Data Keliling'} onClose={() => setOpen(false)}>
//         <form onSubmit={onSubmit} className="space-y-3">
//           {/* ⬇️ Field kabupaten & kecamatan */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <div>
//               <label className="mb-1 block text-sm">Kabupaten</label>
//               <input
//                 value={form.kabupaten}
//                 onChange={e=>setForm(v=>({ ...v, kabupaten: e.target.value }))}
//                 className="w-full rounded-xl border-slate-300"
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-sm">Kecamatan</label>
//               <input
//                 value={form.kecamatan}
//                 onChange={e=>setForm(v=>({ ...v, kecamatan: e.target.value }))}
//                 className="w-full rounded-xl border-slate-300"
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-sm">Desa</label>
//               <input
//                 value={form.desa}
//                 onChange={e=>setForm(v=>({ ...v, desa: e.target.value }))}
//                 className="w-full rounded-xl border-slate-300"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="mb-1 block text-sm">Tanggal</label>
//             <input type="date" value={form.tanggal}
//               onChange={e=>setForm(v=>({ ...v, tanggal: e.target.value }))}
//               className="w-full rounded-xl border-slate-300" required />
//           </div>
//           <div>
//             <label className="mb-1 block text-sm">Lokasi</label>
//             <input value={form.lokasi}
//               onChange={e=>setForm(v=>({ ...v, lokasi: e.target.value }))}
//               className="w-full rounded-xl border-slate-300" required />
//           </div>
//           <div>
//             <label className="mb-1 block text-sm">Jumlah Peserta</label>
//             <input type="number" value={form.peserta}
//               onChange={e=>setForm(v=>({ ...v, peserta: e.target.value }))}
//               className="w-full rounded-xl border-slate-300" required />
//           </div>
//           <div className="flex justify-end gap-2 pt-2">
//             <button type="button" onClick={()=>setOpen(false)} className="rounded-xl border px-3 py-2">Batal</button>
//             <button className="rounded-xl bg-slate-900 px-3 py-2 text-white">{form.id ? 'Simpan' : 'Tambah'}</button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   )
// }

// frontend/src/pages/DetailKeliling.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import LineKeliling from '../components/charts/LineKeliling';
// ⬇️ 1. Impor komponen SearchableDropdown
import SearchableDropdown from '../components/SearchableDropdown';

const fetcher = (url) => api.get(url).then(r => r.data);

export default function DetailKeliling() {
  const navigate = useNavigate();
  const { data, mutate } = useSWR('/dashboard/stats', fetcher);
  const { data: rowsKel, mutate: mutateKel } = useSWR('/keliling', fetcher);
  // ⬇️ 2. Panggil API wilayah dari backend (perhatikan '/dashboard/Wilayah' dengan 'W' besar sesuai route Anda)
  const { data: wilayahData } = useSWR('/dashboard/Wilayah', fetcher);

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    id: null, kabupaten: '', kecamatan: '', desa: '', tanggal: '', lokasi: '', peserta: ''
  });

  // ⬇️ 3. State untuk menampung opsi-opsi dropdown
  const [kabupatenOptions, setKabupatenOptions] = React.useState([]);
  const [kecamatanOptions, setKecamatanOptions] = React.useState([]);
  const [desaOptions, setDesaOptions] = React.useState([]);

  // ⬇️ 4. useEffect untuk mengisi opsi kabupaten saat data dari API sudah siap
  React.useEffect(() => {
    if (wilayahData) {
      setKabupatenOptions(Object.keys(wilayahData));
    }
  }, [wilayahData]);

  // ⬇️ 5. useEffect untuk mengubah opsi kecamatan ketika kabupaten dipilih
  React.useEffect(() => {
    if (form.kabupaten && wilayahData) {
      setKecamatanOptions(Object.keys(wilayahData[form.kabupaten] || {}));
    } else {
      setKecamatanOptions([]);
    }
  }, [form.kabupaten, wilayahData]);

  // ⬇️ 6. useEffect untuk mengubah opsi desa ketika kecamatan dipilih
  React.useEffect(() => {
    if (form.kabupaten && form.kecamatan && wilayahData) {
      setDesaOptions(wilayahData[form.kabupaten]?.[form.kecamatan] || []);
    } else {
      setDesaOptions([]);
    }
  }, [form.kecamatan, wilayahData]);

  // ⬇️ 7. Pastikan data dashboard & wilayah sudah termuat sebelum render
  if (!data || !wilayahData) return <div className="p-6">Loading…</div>;

  const kelAggr = data.kelilingTrend || [];

  function openCreate() {
    setForm({ id: null, kabupaten: '', kecamatan: '', desa: '', tanggal: '', lokasi: '', peserta: '' });
    // Reset options
    setKecamatanOptions([]);
    setDesaOptions([]);
    setOpen(true);
  }

  function openEdit(row) {
    setForm({
      id: row.id,
      kabupaten: row.kabupaten ?? '',
      kecamatan: row.kecamatan ?? '',
      desa: row.desa ?? '',
      tanggal: row.tanggal?.slice(0, 10) ?? '',
      lokasi: row.lokasi ?? '',
      peserta: row.peserta ?? '',
    });
    setOpen(true);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const payload = {
      kabupaten: form.kabupaten,
      kecamatan: form.kecamatan,
      desa: form.desa,
      tanggal: form.tanggal,
      lokasi: form.lokasi,
      peserta: Number(form.peserta)
    };
    if (form.id) await api.put(`/keliling/${form.id}`, payload);
    else await api.post('/keliling', payload);
    setOpen(false);
    await mutateKel();
    await mutate();
  }

  async function onDelete(id) {
    if (!confirm('Hapus data ini?')) return;
    await api.delete(`/keliling/${id}`);
    await mutateKel();
    await mutate();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* ... (bagian JSX untuk Chart dan Tabel Rekap tidak berubah) ... */}
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <LineKeliling data={kelAggr} big />
        </div>
        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <h2 className="mb-3 font-semibold">Rekap Bulanan</h2>
            <DataTable
                rows={kelAggr}
                columns={[
                    { key: 'month', header: 'Bulan' },
                    { key: 'freq', header: 'Jumlah Frekuensi' },
                    { key: 'totalPeserta', header: 'Total Peserta' },
                ]}
                searchable={false}
            />
        </section>

        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Data Kegiatan Keliling</h2>
            <button
              onClick={openCreate}
              className="rounded-xl bg-gradient-to-r from-[#009B4C] to-[#0071BC] px-3 py-2 text-sm font-medium text-white"
            >
              + Input Data
            </button>
          </div>
          <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left">Kabupaten</th>
                  <th className="px-3 py-2 text-left">Kecamatan</th>
                  <th className="px-3 py-2 text-left">Desa</th>
                  <th className="px-3 py-2 text-left">Tanggal</th>
                  <th className="px-3 py-2 text-left">Lokasi</th>
                  <th className="px-3 py-2 text-left">Jumlah Peserta</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(rowsKel || []).map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2">{r.kabupaten || '-'}</td>
                    <td className="px-3 py-2">{r.kecamatan || '-'}</td>
                    <td className="px-3 py-2">{r.desa || '-'}</td>
                    <td className="px-3 py-2">{new Date(r.tanggal).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{r.lokasi}</td>
                    <td className="px-3 py-2">{r.peserta}</td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => openEdit(r)} className="mr-2 rounded-lg border px-2 py-1">Edit</button>
                      <button onClick={() => onDelete(r.id)} className="rounded-lg border px-2 py-1 text-red-600">Hapus</button>
                    </td>
                  </tr>
                ))}
                {(!rowsKel || rowsKel.length === 0) && (
                  <tr><td className="px-3 py-6 text-center text-slate-500" colSpan={7}>Belum ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        
        <button onClick={() => navigate('/')} className="rounded-xl bg-slate-900 px-4 py-2 text-white">
            Kembali ke Dashboard
        </button>
      </main>

      <Modal open={open} title={form.id ? 'Edit Data Keliling' : 'Input Data Keliling'} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-3">
          {/* ⬇️ 8. Ganti semua <input> dengan <SearchableDropdown> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm">Kabupaten</label>
              <SearchableDropdown
                options={kabupatenOptions}
                value={form.kabupaten}
                onChange={val => setForm(v => ({ ...v, kabupaten: val, kecamatan: '', desa: '' }))}
                placeholder="Cari Kabupaten..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Kecamatan</label>
              <SearchableDropdown
                options={kecamatanOptions}
                value={form.kecamatan}
                onChange={val => setForm(v => ({ ...v, kecamatan: val, desa: '' }))}
                placeholder="Pilih Kabupaten dulu"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Desa</label>
              <SearchableDropdown
                options={desaOptions}
                value={form.desa}
                onChange={val => setForm(v => ({ ...v, desa: val }))}
                placeholder="Pilih Kecamatan dulu"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm">Tanggal</label>
            <input type="date" value={form.tanggal}
              onChange={e=>setForm(v=>({ ...v, tanggal: e.target.value }))}
              className="w-full rounded-xl border-slate-300" required />
          </div>
          <div>
            <label className="mb-1 block text-sm">Lokasi</label>
            <input value={form.lokasi}
              onChange={e=>setForm(v=>({ ...v, lokasi: e.target.value }))}
              className="w-full rounded-xl border-slate-300" required />
          </div>
          <div>
            <label className="mb-1 block text-sm">Jumlah Peserta</label>
            <input type="number" value={form.peserta}
              onChange={e=>setForm(v=>({ ...v, peserta: e.target.value }))}
              className="w-full rounded-xl border-slate-300" required />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={()=>setOpen(false)} className="rounded-xl border px-3 py-2">Batal</button>
            <button className="rounded-xl bg-slate-900 px-3 py-2 text-white">{form.id ? 'Simpan' : 'Tambah'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}