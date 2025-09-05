const express = require('express')
const { authRequired } = require('../middleware/auth')
const { stats } = require('../controllers/dashboardController')

const router = express.Router()
router.get('/stats', authRequired, stats)
module.exports = router
