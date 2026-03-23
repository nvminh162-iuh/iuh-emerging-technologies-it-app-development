const { Router } = require('express');
const { controller } = require('../controllers')

const router = Router();

router.get('/', controller.getAll)
router.get('/ticket/:id', controller.getById)
router.get('/upsert', controller.getUpsertForm)
router.get('/upsert/:id', controller.getUpsertForm)
router.post('/upsert', controller.upsert)
router.post('/upsert/:id', controller.upsert)

module.exports = router;