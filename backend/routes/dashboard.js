const express = require('express')
const { getWilayah, stats } = require('../controllers/dashboardController')
const router = express.Router()

// Publik (tanpa login)
router.get('/stats', stats)
// NOTE: pertahankan casing path sesuai versi lama agar tidak memutus frontend
router.get('/Wilayah', getWilayah)

module.exports = router
