// backend/routes/primaTarget.js
const router = require('express').Router();
const { authRequired, requireAdmin } = require('../middleware/auth');
const c = require('../controllers/primaTargetController');

// Publik (GET)
router.get('/', c.list);
router.get('/:tahun', c.getByYear);

// Admin (upsert target tahunan)
router.post('/', authRequired, requireAdmin, c.upsert);
router.put('/',  authRequired, requireAdmin, c.upsert);

module.exports = router;
