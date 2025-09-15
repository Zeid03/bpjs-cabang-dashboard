// backend/routes/auth.js
const express = require('express');
const { login } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limit khusus login
const loginLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_LOGIN_WINDOW_MS || 15 * 60 * 1000), // 15 menit
  max: Number(process.env.RATE_LIMIT_LOGIN_MAX || 10), // 10 percobaan / window / IP
  standardHeaders: true, // RateLimit-* headers
  legacyHeaders: false,
  message: { message: 'Terlalu banyak percobaan login. Coba lagi nanti.' },
});

// POST /auth/login
router.post('/login', loginLimiter, login);

module.exports = router;
