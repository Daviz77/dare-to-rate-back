const express = require('express');
const router = express.Router();

const healthController = require('../controllers/health.controller')
const usersController = require('../controllers/users.controller')

router.get('/health', healthController.health)

// USER ROUTES

router.post('/users', usersController.create);
router.get('/users', usersController.list);

// REVIEW ROUTES

// COMMENT ROUTES



module.exports = router