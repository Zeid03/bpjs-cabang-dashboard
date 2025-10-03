const express = require('express')
const { authRequired, requireAdmin } = require('../middleware/auth')
const ctrl = require('../controllers/kelilingController')
const router = express.Router()

// Publik (read-only)
router.get('/', ctrl.list)

// Admin (tulis/ubah/hapus)
router.post('/', authRequired, requireAdmin, ctrl.create)
router.put('/:id', authRequired, requireAdmin, ctrl.update)
router.delete('/:id', authRequired, requireAdmin, ctrl.remove)

module.exports = router
