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

// AUTHENTICATION	V

router.post("/login", authController.login)
router.post("/signup", usersController.create)

// USER ROUTES V

router.get("/users/:userId", usersController.getUserById)

router.get(
	"/profile",
	authMiddleware.isAuthenticated,
	usersController.getCurrentUserProfile
)
router.patch(
	"/users",
	authMiddleware.isAuthenticated,
	usersController.updateLogedUser
)

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
router.get("/users/:userId/following", usersController.getFollowing)
router.get("/users/:userId/followers",	usersController.getFollowers)

// REVIEW ROUTES V

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

router.get("/reviews", authMiddleware.setCurrentUserIdIfExists, reviewsController.getAllReviews) // Para sacar las 10 últimas reviews de tus following en el feed

// REPORT ROUTES

router.get(
	"/reports",
	authMiddleware.isAuthenticated,
	adminMiddleware.isAdmin,
	reportsController.getAllReports
)
router.post(
	"/reviews/:reviewId/report",
	authMiddleware.isAuthenticated,
	reportsController.createReviewReport
)

router.post(
	"/comments/:commentId/report",
	authMiddleware.isAuthenticated,
	reportsController.createCommentReport
)

// COMMENT ROUTES V

router.post(
	"/reviews/:reviewId/comments",
	authMiddleware.isAuthenticated,
	commentsController.create
)
router.delete(
	"/comments/:commentId",
	authMiddleware.isAuthenticated,
	commentsController.deleteComment
)
router.patch(
	"/comments/:commentId/update",
	authMiddleware.isAuthenticated,
	commentsController.updateComment
)
router.get("/reviews/:id/comments", commentsController.getCommentsByReviewId)

module.exports = router
