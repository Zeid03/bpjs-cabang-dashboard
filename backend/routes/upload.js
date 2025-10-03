// backend/routes/upload.js (HARDENED)
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { authRequired, requireAdmin } = require('../middleware/auth'); // ⬅️ tambah requireAdmin
const { uploadExcel } = require('../controllers/uploadController');

const router = express.Router();

// Pastikan folder upload ada
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Rate limit khusus upload
const uploadLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_UPLOAD_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_UPLOAD_MAX || 30),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak upload. Coba lagi nanti.' },
});

// Storage: nama file acak + ekstensi aman
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const allowed = ['.xlsx', '.xls'];
    const safeExt = allowed.includes(ext) ? ext : '.xlsx';
    const rand = crypto.randomBytes(16).toString('hex');
    cb(null, `${Date.now()}-${rand}${safeExt}`);
  },
});

// Filter: cek mime type & ekstensi
function safeFileFilter(req, file, cb) {
  const name = (file.originalname || '').toLowerCase();
  const okExt = name.endsWith('.xlsx') || name.endsWith('.xls');
  const mt = (file.mimetype || '').toLowerCase();
  const okMime =
    mt.includes('spreadsheetml') ||
    mt.includes('excel') ||
    mt.includes('officedocument');

  if (okExt && okMime) cb(null, true);
  else cb(new Error('Hanya file Excel (.xlsx/.xls) yang diperbolehkan'));
}

// LIMIT ukuran file
const upload = multer({
  storage,
  fileFilter: safeFileFilter,
  limits: {
    fileSize: Number(process.env.MAX_UPLOAD_SIZE_BYTES || 500 * 1024 * 1024),
    files: 1,
  },
});

// Endpoint upload → hanya admin
router.post(
  '/excel',
  authRequired,
  requireAdmin,      // ⬅️ hanya admin
  uploadLimiter,
  upload.single('file'),
  uploadExcel
);

module.exports = router;
