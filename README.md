# BPJS Cabang Dashboard

Full‑stack dashboard untuk cabang BPJS: upload Excel → parsing → simpan MySQL via Prisma, autentikasi JWT, serta visualisasi data (Recharts) dan tabel dengan pencarian & paging.

> **Stack**: Node.js, Express, MySQL, Prisma, Multer, xlsx, JWT, bcrypt, React (Vite), Tailwind v3, Axios, SWR, React Router, Recharts, react-hook-form.

---

## 📁 Struktur Proyek

```
bpjs-cabang-dashboard/
├── backend/
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── index.js
│       ├── prisma.js
│       ├── middleware/auth.js
│       ├── routes/{auth,upload,peserta,klaim}.js
│       └── utils/excelParser.js
└── frontend/
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx, App.jsx, index.css
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx, ProtectedRoute.jsx, DataTable.jsx
        │   └── charts/{LineTrend,PieJenis,BarKlaimRS}.jsx
        └── pages/{Login,Dashboard,Upload}.jsx
```

---

## 🚀 Fitur

* **Auth Admin (JWT)**: login, proteksi route frontend.
* **Upload Excel**: Multer + xlsx → parsing → simpan ke MySQL via Prisma.
* **Dashboard**: Line (tren bulanan), Pie (jenis kepesertaan), Bar (klaim per RS), tabel dengan search & paging.
* **REST API**: `/auth/login`, `/upload/excel`, `/peserta`, `/peserta/stats`, `/klaim`.

---

## 🔐 Environment Variables

Buat file `.env` dari contoh berikut:

**backend/.env**

```
DATABASE_URL="mysql://bpjs_user:bpjs_pass123@localhost:3306/bpjs_cabang"
PORT=5678
JWT_SECRET="ganti_rahasia_ini"
CORS_ORIGIN="http://localhost:5173"
UPLOAD_DIR="uploads"
```

**frontend/.env**

```
VITE_API_URL=http://localhost:5678
```

---

## 🛠️ Setup Lokal (Step‑by‑Step)

### 1) Database MySQL

```sql
CREATE DATABASE bpjs_cabang;
CREATE USER 'bpjs_user'@'localhost' IDENTIFIED BY 'bpjs_pass123';
GRANT ALL PRIVILEGES ON bpjs_cabang.* TO 'bpjs_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2) Backend

```bash
cd backend
cp .env.example .env  # edit sesuai DB & JWT
npm i
npm run prisma:generate
npm run prisma:dev     # migrate schema
npm run seed           # buat admin default
npm run dev            # http://localhost:5678
```

> Login default: `admin@bpjs.go.id / admin123` (ubah setelah login!).

### 3) Frontend

```bash
cd ../frontend
npm i
# buat .env → VITE_API_URL=http://localhost:5678
npm run dev            # http://localhost:5173
```

---

## 📦 API Endpoints

### Auth

* `POST /auth/login`

  * **Body**: `{ email, password }`
  * **Response**: `{ token, user }`

### Upload

* `POST /upload/excel` *(JWT diperlukan)*

  * **Form-Data**: `file: peserta.xlsx`
  * **Response**: `{ message, imported: { peserta, klaim } }`

### Peserta

* `GET /peserta` *(JWT)* — query: `q`, `jenis`, `page`, `pageSize`
* `GET /peserta/stats` *(JWT)* — data untuk chart: `{ lineTrend, pieJenis, barKlaimRS }`

### Klaim

* `GET /klaim` *(JWT)* — query: `rs`, `page`, `pageSize`

---

## 📊 Format Excel

* **Sheet `Peserta`** (atau sheet pertama jika tidak ada `Peserta`):

  * Kolom: `NIK, Nama, Jenis, TanggalDaftar, Faskes, Kabupaten`
* **Sheet `Klaim`** *(opsional)*:

  * Kolom: `RumahSakit, Bulan (YYYY-MM), Jumlah`

> Parser mendukung tanggal Excel serial, `YYYY-MM-DD`, atau `DD/MM/YYYY`.

---

## 🧪 Uji Cepat (curl)

```bash
# Login
curl -X POST http://localhost:5678/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@bpjs.go.id","password":"admin123"}'

# Statistik
curl -H 'Authorization: Bearer <TOKEN>' http://localhost:5678/peserta/stats

# Upload Excel
curl -X POST http://localhost:5678/upload/excel \
  -H 'Authorization: Bearer <TOKEN>' \
  -F 'file=@/path/to/peserta.xlsx'
```

---

## 🧭 Git & GitHub

```bash
git init
git branch -M main
git remote add origin https://github.com/USERNAME/bpjs-cabang-dashboard.git

# .gitignore (disarankan)
# node_modules/, .env, backend/.env, frontend/.env, frontend/dist/, backend/uploads/

git add .
git commit -m "init: fullstack bpjs cabang"
git push -u origin main
```

---

## 🧰 Scripts

**Backend**

* `npm run dev` — start API dev (nodemon)
* `npm run prisma:dev` — migrate dev
* `npm run prisma:generate` — generate client
* `npm run seed` — buat admin default

**Frontend**

* `npm run dev` — start Vite dev server
* `npm run build` — build produksi
* `npm run preview` — preview build

---

## ❗ Troubleshooting

* **P1003: DB tidak ada** → jalankan `npm run prisma:dev`.
* **CORS error** → pastikan `CORS_ORIGIN` memuat URL frontend (mis. `http://localhost:5173`).
* **Token invalid/expired** → login ulang untuk dapat token baru.
* **Port bentrok** → ganti `PORT` di backend atau jalankan Vite pakai `--port`.

---

## 🧭 Roadmap (Opsional)

* Role-based access (admin/viewer)
* Import incremental & update by NIK
* Export CSV/XLSX dari tabel
* Filter global (rentang tanggal, kabupaten, faskes)
* Docker Compose (MySQL + API + UI)
* Audit log (login & upload)

---

## 📄 Lisensi

Tentukan lisensi (MIT/Apache-2.0/Proprietary) sesuai kebutuhan instansi.
