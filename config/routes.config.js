const express = require("express")
const router = express.Router()

const healthController = require("../controllers/health.controller")
const usersController = require("../controllers/users.controller")
const authController = require("../controllers/auth.controller")

router.get("/health", healthController.health)

// AUTHENTICATION

router.post("/login", authController.login)

// USER ROUTES

router.post("/users", usersController.create)
router.get("/users", usersController.list)

// REVIEW ROUTES

// COMMENT ROUTES

module.exports = router
