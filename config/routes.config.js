const express = require('express')
const router = express.Router()

const healthController = require('../controllers/health.controller')
const usersController = require('../controllers/users.controller')
const authController = require('../controllers/auth.controller')
const reviewsController = require('../controllers/reviews.controller')
const commentsController = require('../controllers/comments.controller')
const reportsController = require('../controllers/reports.controller')
const filmsController = require('../controllers/films.controller')
const authMiddleware = require('../middlewares/Auth.middleware')
const adminMiddleware = require('../middlewares/Admin.middleware')
const upload = require('../config/storage.config')

// HEALTH
router.get('/health', healthController.health)

// AUTH
router.post('/login', authController.login)
router.post('/signup', usersController.create)

// PROFILE
router.get('/profile', authMiddleware.isAuthenticated, usersController.getCurrentUserProfile)

// USERS
router.get('/users/:userId', usersController.getUserById)

router.patch('/users', authMiddleware.isAuthenticated, usersController.updateLogedUser)

router.get('/users/:userId/reviews', reviewsController.getReviewsByUserId)

router.patch(
	'/users/:userId/change-role',
	authMiddleware.isAuthenticated,
	adminMiddleware.isAdmin,
	usersController.changeUserRole
)

router.post('/users/:userId/follow', authMiddleware.isAuthenticated, usersController.followUser)

router.get('/users/:userId/followings', usersController.getFollowings)

router.get('/users/:userId/followers', usersController.getFollowers)

// REVIEWS
router.get('/reviews', authMiddleware.setCurrentUserIdIfExists, reviewsController.getAllReviews)

router.post('/reviews', authMiddleware.isAuthenticated, reviewsController.create)

router.patch('/reviews/:reviewId', authMiddleware.isAuthenticated, reviewsController.updateReview)

router.delete('/reviews/:reviewId', authMiddleware.isAuthenticated, reviewsController.deleteReview)

router.get('/reviews/:reviewId/comments', commentsController.getCommentsByReviewId)

router.post('/reviews/:reviewId/report', authMiddleware.isAuthenticated, reportsController.createReviewReport)

router.post('/reviews/:reviewId/like', authMiddleware.isAuthenticated, reviewsController.likeReview)

// REPORTS
router.get('/reports', authMiddleware.isAuthenticated, adminMiddleware.isAdmin, reportsController.getAllReports)

// COMMENTS
router.post('/reviews/:reviewId/comments', authMiddleware.isAuthenticated, commentsController.create)

router.delete('/comments/:commentId', authMiddleware.isAuthenticated, commentsController.deleteComment)

router.patch('/comments/:commentId/update', authMiddleware.isAuthenticated, commentsController.updateComment)

router.post('/comments/:commentId/report', authMiddleware.isAuthenticated, reportsController.createCommentReport)

// FILMS
router.get('/films', filmsController.getFilm)

router.get('/films/:filmId', filmsController.getFilmById)

module.exports = router
