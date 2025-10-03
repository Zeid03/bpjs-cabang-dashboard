// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER || 'bpjs-api',
      audience: process.env.JWT_AUD || 'bpjs-dashboard',
      algorithms: ['HS256'],
      clockTolerance: 5,
    });

    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role || 'admin',
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
}

module.exports = { authRequired, requireAdmin };
