const express = require("express")
const router = express.Router()

const healthController = require("../controllers/health.controller")
const usersController = require("../controllers/users.controller")
const authController = require("../controllers/auth.controller")
const reviewsController = require("../controllers/reviews.controller")
const commentsController = require("../controllers/comments.controller")
const authMiddleware = require("../middlewares/Auth.middlewares")
const upload = require('../config/storage.config');

// HEALTH CHECK

router.get("/health", healthController.health)

// AUTHENTICATION

router.post("/login", authController.login)

// USER ROUTES

router.post("/signup", usersController.create)
router.get('/:username', authMiddleware.isAuthenticated, usersController.getUserByUsername); // obtener perfil de un usuario en concreto
router.get('/:username/reviews', authMiddleware.isAuthenticated, usersController.getUserReviewsByUsername); // obtener las reseñas publicadas por un ususario concreto
// router.get("/users", usersController.list) 
router.patch("/profile", authMiddleware.isAuthenticated, usersController.getCurrentUser) // ver y updatear el profile de mi usuario

// REVIEW ROUTES

router.post("/reviews", authMiddleware.isAuthenticated, reviewsController.create)
router.post("/reviews/:id", authMiddleware.isAuthenticated, reviewsController.updateReview)
router.patch("/reviews/:id", authMiddleware.isAuthenticated, reviewsController.deleteReview)

// COMMENT ROUTES

router.post("/comments", authMiddleware.isAuthenticated, commentsController.create)
router.get("/comments", commentsController.list)


module.exports = router
