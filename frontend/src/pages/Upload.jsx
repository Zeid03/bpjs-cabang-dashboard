import Navbar from '../components/Navbar';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useState } from 'react';

export default function Upload() {
  const { register, handleSubmit, reset } = useForm();
  const [status, setStatus] = useState(null);

  const onSubmit = async (values) => {
    setStatus(null);
    const form = new FormData();
    form.append('file', values.file[0]);
    try {
      const { data } = await api.post('/upload/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStatus({ ok: true, msg: `Berhasil import: peserta=${data.imported.peserta}, klaim=${data.imported.klaim}` });
      reset();
    } catch (e) {
      setStatus({ ok: false, msg: e.response?.data?.message || 'Gagal upload' });
    }
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h1 className="text-xl font-semibold mb-4">Upload Data Excel</h1>
          <p className="text-sm text-slate-600 mb-4">Format sheet <b>Peserta</b>: NIK, Nama, Jenis, TanggalDaftar, Faskes, Kabupaten. (Opsional) sheet <b>Klaim</b>: RumahSakit, Bulan (YYYY-MM), Jumlah.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input type="file" accept=".xlsx,.xls" {...register('file', { required: true })} className="block w-full" />
            <button className="px-4 py-2 rounded-xl bg-slate-900 text-white">Upload</button>
          </form>
          {status && (
            <div className={`mt-4 rounded-xl px-3 py-2 ${status.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {status.msg}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
