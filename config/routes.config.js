const express = require("express")
const router = express.Router()

const healthController = require("../controllers/health.controller")
const usersController = require("../controllers/users.controller")
const authController = require("../controllers/auth.controller")
const reviewsController = require("../controllers/reviews.controller")
const commentsController = require("../controllers/comments.controller")
const reportsController = require("../controllers/reports.controller")
const authMiddleware = require("../middlewares/Auth.middleware")
const adminMiddleware = require("../middlewares/Admin.middleware")
const upload = require("../config/storage.config")

// HEALTH CHECK

router.get("/health", healthController.health)

// AUTHENTICATION

router.post("/login", authController.login)
router.post("/signup", usersController.create)

// USER ROUTES

router.post("/users", usersController.create)

router.get("/:username", usersController.getUserByUsername) // obtener perfil de un usuario en concreto
// obtener las reseñas publicadas por un ususario concreto
// router.get("/users", usersController.list)

router.get(
	"/profile",
	authMiddleware.isAuthenticated,
	usersController.getCurrentUser
)
router.patch(
	"/users",
	authMiddleware.isAuthenticated,
	usersController.updateLogedUser
) // ver y updatear el profile de mi usuario

router.patch(
	"/users/:userId/change-role",
	authMiddleware.isAuthenticated,
	adminMiddleware.isAdmin,
	usersController.changeUserRole
)
router.post(
	"/users/:userId/follow",
	authMiddleware.isAuthenticated,
	usersController.followUser
)
router.get("/users/:id/following", usersController.getFollowing)
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
router.get("/reviews/:userId", reviewsController.getUsersReviews)

router.get("/reviews", reviewsController.getAllReviews) // esto para que?

// REPORT ROUTES

router.get(
	"/reports",
	authMiddleware.isAuthenticated,
	adminMiddleware.isAdmin,
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
router.get("/reviews/:id/comments", commentsController.getCommentsByReviewId)

module.exports = router
