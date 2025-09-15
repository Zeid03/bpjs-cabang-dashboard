// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * Middleware untuk melindungi route dengan JWT Bearer.
 * - Wajib header: Authorization: Bearer <token>
 * - Verifikasi issuer, audience, algorithm, expiry.
 */
function authRequired(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : null;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER || 'bpjs-api',
      audience: process.env.JWT_AUD || 'bpjs-dashboard',
      algorithms: ['HS256'],
      clockTolerance: 5, // detik
    });

    // attach user ke request (hanya data minimal)
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      // exp, iat kalau butuh: payload.exp, payload.iat
    };

    return next();
  } catch (err) {
    // Jangan bocorkan detail verifikasi (expired, invalid signature, dll)
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = { authRequired };
