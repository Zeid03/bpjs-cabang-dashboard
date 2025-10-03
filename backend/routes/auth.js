// backend/routes/auth.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  login,
  changePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// Rate limit login & forgot (opsional)
const loginLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_LOGIN_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_LOGIN_MAX || 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak percobaan login. Coba lagi nanti.' },
});

const forgotLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_FORGOT_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_FORGOT_MAX || 10),
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, login);
router.post('/change-password', authRequired, changePassword);
router.post('/forgot', forgotLimiter, forgotPassword);
router.post('/reset', resetPassword);

module.exports = router;
