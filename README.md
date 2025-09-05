# BPJS Cabang Dashboard

Dashboard interaktif untuk cabang BPJS:
Admin bisa **upload file Excel (4 sheet)** → data diparsing & disimpan ke MySQL via Prisma ORM → divisualisasikan dalam bentuk chart dan tabel detail.

---

## 🚀 Tech Stack

### Backend

* Node.js, Express
* MySQL + Prisma ORM
* Multer + xlsx (upload & parsing Excel)
* JWT + bcrypt (auth admin)
* Nodemon (dev), dotenv, cors

### Frontend

* React (Vite) + Tailwind CSS v3
* Axios + SWR (fetch API)
* React Router DOM (routing)
* Recharts (visualisasi data)
* react-hook-form (form login, validasi)

---

## 📊 Fitur Utama

1. **Login Admin**

   * Halaman login frontend.
   * Backend pakai JWT untuk autentikasi.

2. **Upload Excel (4 Sheet)**
   Format wajib:

   * **Sheet 1 – Kegiatan BPJS Kesehatan Keliling**
     Kolom: `Tanggal`, `Lokasi`, `Peserta`
   * **Sheet 2 – VIOLA**
     Kolom: `Bulan (YYYY-MM)`, `Skor`
   * **Sheet 3 – Indeks Performa Pelayanan Prima**
     Kolom: `Bulan (YYYY-MM)`, `Nilai`
   * **Sheet 4 – Indek Penanganan Pengaduan Peserta**
     Kolom: `Bulan (YYYY-MM)`, `Jumlah`

3. **Dashboard**

   * 4 chart utama:

     * **Line Chart** – Kegiatan Keliling (total peserta / bulan)
     * **Line Chart** – VIOLA (skor / bulan)
     * **Bar Chart** – Indeks Pelayanan Prima
     * **Bar Chart** – Pengaduan Peserta
   * Klik chart → buka halaman detail.

4. **Halaman Detail**

   * Chart besar (fullscreen).
   * Tabel data detail (pakai `DataTable.jsx` reusable).
   * Tombol kembali ke dashboard.

---

## 📁 Struktur Proyek

```
bpjs-cabang-dashboard/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # model: KegiatanKeliling, Viola, IndeksPrima, IndeksPengaduan
│   │   └── seed.js               # buat admin default
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── uploadController.js
│   │   └── dashboardController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   └── dashboard.js
│   ├── utils/excelParser.js
│   ├── middleware/auth.js
│   └── src/index.js
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── DataTable.jsx
    │   │   └── charts/
    │   │       ├── LineKeliling.jsx
    │   │       ├── LineViola.jsx
    │   │       ├── BarPrima.jsx
    │   │       └── BarPengaduan.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Upload.jsx
    │   │   ├── DetailKeliling.jsx
    │   │   ├── DetailViola.jsx
    │   │   ├── DetailPrima.jsx
    │   │   └── DetailPengaduan.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── index.html
```

---

## 🔐 Environment Variables

### Backend – `.env`

```env
DATABASE_URL="mysql://bpjs_user:bpjs_pass123@localhost:3306/bpjs_cabang"
PORT=5000
JWT_SECRET="ganti_rahasia_ini"
CORS_ORIGIN="http://localhost:5173"
UPLOAD_DIR="uploads"
```

### Frontend – `.env`

```env
VITE_API_URL=http://localhost:5000
```

---

## 🛠️ Setup & Jalankan

### Database MySQL

```sql
CREATE DATABASE bpjs_cabang;
CREATE USER 'bpjs_user'@'localhost' IDENTIFIED BY 'bpjs_pass123';
GRANT ALL PRIVILEGES ON bpjs_cabang.* TO 'bpjs_user'@'localhost';
FLUSH PRIVILEGES;
```

### Backend

```bash
cd backend
cp .env.example .env   # isi sesuai config DB
npm install
npm run prisma:generate
npm run prisma:dev     # migrate schema
npm run seed           # buat admin default
npm run dev            # API jalan di http://localhost:5000
```

Login default:
`admin@bpjs.go.id / admin123`

### Frontend

```bash
cd ../frontend
cp .env.example .env   # isi VITE_API_URL=http://localhost:5000
npm install
npm run dev            # UI jalan di http://localhost:5173
```

---

## 📦 API Endpoints

### Auth

* `POST /auth/login`

### Upload

* `POST /upload/excel` *(JWT required)*

### Dashboard

* `GET /dashboard/stats` *(JWT required)*
  Response:

  ```json
  {
    "kelilingTrend": [{ "month": "2025-01", "totalPeserta": 120 }],
    "violaTrend": [{ "month": "2025-01", "skor": 85.2 }],
    "primaBar": [{ "month": "2025-01", "nilai": 92.1 }],
    "pengaduanBar": [{ "month": "2025-01", "jumlah": 12 }]
  }
  ```

---

## 🧪 Uji Cepat (curl)

```bash
# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bpjs.go.id","password":"admin123"}'

# Upload Excel
curl -X POST http://localhost:5000/upload/excel \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@/path/to/data.xlsx"

# Ambil data dashboard
curl -H "Authorization: Bearer <TOKEN>" http://localhost:5000/dashboard/stats
```

---

## 🧭 Roadmap

* [ ] Export data ke CSV/Excel dari detail page
* [ ] Filter global per tanggal/kabupaten
* [ ] Role-based access (viewer/admin)
* [ ] Docker Compose (MySQL + API + UI)
* [ ] Audit log upload & login

---

## 📄 Lisensi

Sesuaikan kebutuhan instansi (MIT/Apache-2.0/Proprietary).


