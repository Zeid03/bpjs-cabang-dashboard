// backend/src/index.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');

const prisma = require('./prisma');

const authRoutes = require('../routes/auth');
const dashboardRoutes = require('../routes/dashboard');
const kelilingRoutes = require('../routes/keliling');
const pengaduanRoutes = require('../routes/pengaduan');
const primaRoutes = require('../routes/prima');
const primaTargetRoutes = require('../routes/primaTarget');
const uploadRoutes = require('../routes/upload');
const violaRoutes = require('../routes/viola');

const app = express();

// --- Security middleware ---
app.disable('x-powered-by');
app.set('trust proxy', 1); // penting kalau nanti di belakang reverse proxy
app.use(helmet({ contentSecurityPolicy: false })); // bisa di-tune CSP saat domain fixed
app.use(hpp());
app.use(compression());

if (process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}


// Body parser
app.use(express.json({ limit: '1mb' }));

// --- CORS ketat (sesuaikan FRONTEND_URL) ---
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// --- Rate limiter (global untuk /api) ---
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 200, // 200 req/15m per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Terlalu banyak request. Coba lagi nanti.' },
  })
);

// --- Body parser dengan limit ---
app.use(express.json({ limit: '1mb' }));

// --- Routes ---
// gunakan prefix /api agar mudah di-deploy di hosting yang share domain
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/keliling', kelilingRoutes);
app.use('/api/pengaduan', pengaduanRoutes);
app.use('/api/prima', primaRoutes);
app.use('/api/prima/target', primaTargetRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/viola', violaRoutes);

// Healthcheck sederhana
app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api', (req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler (jangan bocorkan stack di production)
app.use((err, req, res, next) => {
  console.error(err);
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  res.status(500).json({ error: err.message, stack: err.stack });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
