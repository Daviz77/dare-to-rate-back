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
router.patch("/reviews/:id", authMiddleware.isAuthenticated, reviewsController.updateReview)
router.delete("/reviews/:id", authMiddleware.isAuthenticated, reviewsController.deleteReview)
router.get("/reviews", authMiddleware.isAuthenticated, reviewsController.getAllReviews)
router.post("/reviews", authMiddleware.isAuthenticated, reviewsController.reportReview)


// COMMENT ROUTES

router.post("/reviews/:reviewId/comments", authMiddleware.isAuthenticated, commentsController.create)
router.delete("/comments/:id", authMiddleware.isAuthenticated, commentsController.deleteComment)
router.patch("/comments/:id", authMiddleware.isAuthenticated, commentsController.updateComment)
router.get("/reviews/:reviewId/comments", authMiddleware.isAuthenticated, commentsController.getCommentsByReviewId)
router.post("/comments/:id/report", authMiddleware.isAuthenticated, commentsController.reportComment)





module.exports = router
