const express = require('express')
const { authRequired } = require('../middleware/auth')
const ctrl = require('../controllers/pengaduanController')
const router = express.Router()

router.get('/', authRequired, ctrl.list)
router.post('/', authRequired, ctrl.create)
router.put('/:id', authRequired, ctrl.update)
router.delete('/:id', authRequired, ctrl.remove)

module.exports = router
