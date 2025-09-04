// middleware/auth.js
const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: token missing' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload: { sub, email, name, iat, exp }
    req.user = payload;
    next();
  } catch (err) {
    console.error('authRequired error:', err.message);
    return res.status(401).json({ message: 'Unauthorized: invalid token' });
  }
}

module.exports = { authRequired };
