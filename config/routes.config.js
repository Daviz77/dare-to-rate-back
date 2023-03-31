const router = require('express').Router()
const healthController = require('../controllers/health.controller')

router.get('/health', healthController.health)

module.exports = router