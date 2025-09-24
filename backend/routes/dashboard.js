const express = require('express')
const { authRequired } = require('../middleware/auth')
const { getWilayah } = require('../controllers/dashboardController');
const { stats } = require('../controllers/dashboardController')
const router = express.Router()

router.get('/stats', authRequired, stats)
router.get('/Wilayah', authRequired, getWilayah)

module.exports = router
