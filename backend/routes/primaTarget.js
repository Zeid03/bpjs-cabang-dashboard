// backend/routes/primaTarget.js
const router = require('express').Router();
const c = require('../controllers/primaTargetController');

// GET semua target per tahun
router.get('/', c.list);

// GET target spesifik tahun
router.get('/:tahun', c.getByYear);

// POST/PUT upsert target tahunan (keduanya boleh)
router.post('/', c.upsert);
router.put('/', c.upsert);

module.exports = router;
