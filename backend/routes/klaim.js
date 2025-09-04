const express = require('express');
const { authRequired } = require('../middleware/auth');
const { listKlaim } = require('../controllers/klaimController');


const router = express.Router();
router.get('/', authRequired, listKlaim);
module.exports = router;