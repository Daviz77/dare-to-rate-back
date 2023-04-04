const express = require("express")
const router = express.Router()

const healthController = require("../controllers/health.controller")
const usersController = require("../controllers/users.controller")
const authController = require("../controllers/auth.controller")
const reviewsController = require("../controllers/reviews.controller")
const authMiddleware = require("../middlewares/Auth.middlewares")
const upload = require('../config/storage.config');

// HEALTH CHECK

router.get("/health", healthController.health)

// AUTHENTICATION

router.post("/login", authController.login)

// USER ROUTES

router.post("/users", usersController.create)
router.get("/users", usersController.list)
router.get("/users/me", authMiddleware.isAuthenticated, usersController.getCurrentUser)

// REVIEW ROUTES

router.post("/reviews", authMiddleware.isAuthenticated, reviewsController.create)
router.get("/reviews", reviewsController.list)

// COMMENT ROUTES

module.exports = router
