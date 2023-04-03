const express = require("express")
const router = express.Router()

const healthController = require("../controllers/health.controller")
const usersController = require("../controllers/users.controller")
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")

router.get("/health", healthController.health)

// AUTHENTICATION

router.post("/login", authController.login)

// USER ROUTES

router.post("/users", usersController.create)
router.get("/users", usersController.list)
router.get("/users/me", authMiddleware.isAuthenticated, usersController.getCurrentUser)

// REVIEW ROUTES

// COMMENT ROUTES

module.exports = router
