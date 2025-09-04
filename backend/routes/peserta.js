const express = require('express');
const { authRequired } = require('../middleware/auth');
const { listPeserta, statsPeserta } = require('../controllers/pesertaController');


const router = express.Router();
router.get('/', authRequired, listPeserta);
router.get('/stats', authRequired, statsPeserta);
module.exports = router;