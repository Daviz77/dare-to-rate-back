const express = require("express")
const router = express.Router()

const healthController = require("../controllers/health.controller")
const usersController = require("../controllers/users.controller")
const authController = require("../controllers/auth.controller")
const reviewsController = require("../controllers/reviews.controller")
const commentsController = require("../controllers/comments.controller")
const reportsController = require("../controllers/reports.controller")
const authMiddleware = require("../middlewares/Auth.middlewares")
const upload = require("../config/storage.config")

// HEALTH CHECK

router.get("/health", healthController.health)

// AUTHENTICATION

router.post("/login", authController.login)
router.post("/signup", usersController.create)

// USER ROUTES

router.post("/users", usersController.create)

router.get(
	"/:username",
	usersController.getUserByUsername
) // obtener perfil de un usuario en concreto
router.get(
	"/:username/reviews",
	usersController.getUserReviewsByUsername
) // obtener las reseñas publicadas por un ususario concreto
// router.get("/users", usersController.list)
router.get(
	"/profile",
	authMiddleware.isAuthenticated,
	usersController.getCurrentUser
) 
router.patch(
	"/profile",
	authMiddleware.isAuthenticated,
	usersController.updateUser
) // ver y updatear el profile de mi usuario
router.patch(
	"/users/:id/role",
	authMiddleware.isAuthenticated,
	// middleware para revisar que el role es admin
	usersController.updateUserRole
)
router.post(
	"/users/:id/follow",
	authMiddleware.isAuthenticated,
	usersController.followUser
)
router.get(
	"/users/:id/following",
	usersController.getFollowing
)
/* router.get(
	"/users/:id/followed",
	usersController.getFolled
) */

// REVIEW ROUTES

router.post(
	"/reviews",
	authMiddleware.isAuthenticated,
	reviewsController.create
)
router.patch(
	"/reviews/:id",
	authMiddleware.isAuthenticated,
	reviewsController.updateReview
)
router.delete(
	"/reviews/:id",
	authMiddleware.isAuthenticated,
	reviewsController.deleteReview
)
router.get(
	"/reviews",
	reviewsController.getAllReviews
)

// REPORT ROUTES

router.get(
	"/reports",
	authMiddleware.isAuthenticated,
	// middleware revisando que el usuario logeado es admin
	reportsController.getAllReports
)
router.post(
	"/reviews/:id/report",
	authMiddleware.isAuthenticated,
	reportsController.createReviewReport
)

router.post(
	"/comments/:id/report",
	authMiddleware.isAuthenticated,
	reportsController.createCommentReport
)

// COMMENT ROUTES

router.post(
	"/reviews/:id/comments",
	authMiddleware.isAuthenticated,
	commentsController.create
)
router.delete(
	"/comments/:id",
	authMiddleware.isAuthenticated,
	commentsController.deleteComment
)
router.patch(
	"/comments/:id",
	authMiddleware.isAuthenticated,
	commentsController.updateComment
)
router.get(
	"/reviews/:id/comments",
	commentsController.getCommentsByReviewId
)

module.exports = router
