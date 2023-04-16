const { StatusCodes } = require('http-status-codes')
const Review = require('../models/Review.model')
const Film = require('../models/Film.model')
const createError = require('http-errors')
const User = require('../models/User.model')

module.exports.create = (req, res, next) => {
	const author = req.currentUserId
	const { review, film } = req.body

	if (!film || !review) {
		return next(createError(StatusCodes.BAD_REQUEST, 'Body fileds `review` and `film` are required'))
	}

	if (!film._id) {
		return Film.findOne({ imdbId: film.imdbId }).then((filmRes) => {
			if (!filmRes) {
				return Film.create(film)
					.then((filmCreated) => createReview({ ...review, author, film: filmCreated._id }, res, next))
					.catch(next)
			}

			createReviewIfUserDoesNotYetHaveOne({ ...review, author, film: filmRes._id }, res, next)
		})
	}

	createReviewIfUserDoesNotYetHaveOne({ ...review, author, film: film._id }, res, next)
}

const createReviewIfUserDoesNotYetHaveOne = (review, res, next) =>
	Review.find({ author: review.author })
		.then((reviews) => {
			if (reviews.length > 0) return next(createError(StatusCodes.CONFLICT, 'User already has a review'))
			createReview(review, res, next)
		})
		.catch(next)

const createReview = (review, res, next) =>
	Review.create(review)
		.then((reviewCreated) => res.status(StatusCodes.CREATED).send())
		.catch(next)

module.exports.getAllReviews = (req, res, next) => {
	const reviewsLimit = 10

	if (req.currentUserId) {
		return User.findById(req.currentUserId)
			.then((user) => {
				if (!user) return next(createError(StatusCodes.NOT_FOUND, 'User not found'))
				if (!user.followings.length) {
					return Review.find()
						.limit(reviewsLimit)
						.sort({ createdAt: -1 })
						.populate('author', 'username img')
						.then((otherReviews) => res.json({ data: { followedReviews: [], otherReviews } }))
						.catch(next)
				}

				return Review.find({ author: { $in: user.followings } })
					.limit(reviewsLimit)
					.sort({ createdAt: -1 })
					.populate('author', 'username img')
					.then((followedReviews) =>
						Review.find({ author: { $ne: user.followings } })
							.limit(reviewsLimit)
							.sort({ createdAt: -1 })
							.populate('author', 'username img')
							.then((otherReviews) => res.json({ data: { followedReviews, otherReviews } }))
					)
					.catch(next)
			})
			.catch(next)
	}

	Review.find()
		.limit(reviewsLimit)
		.sort({ createdAt: -1 })
		.populate('author', 'username img')
		.then((reviews) => res.json({ data: { reviews } }))
		.catch(next)
}

module.exports.getReviewsByUserId = (req, res, next) => {
	const { userId } = req.params
	Review.find({ author: userId })
		.then((reviews) => res.json({ data: reviews }))
		.catch(next)
}

module.exports.updateReview = (req, res, next) => {
	const { reviewId } = req.params
	const { title, content } = req.body

	Review.findById(reviewId)
		.then((review) => {
			if (review.author._id.toString() === req.currentUserId) {
				return Review.findByIdAndUpdate(id, { title, content }, { new: true, runValidators: true })
					.then((review) => res.status(StatusCodes.OK).json({ data: review }))
					.catch(next)
			}

			return next(createError(StatusCodes.UNAUTHORIZED, 'User is not the author of this review'))
		})
		.catch(next)
}

module.exports.deleteReview = (req, res, next) => {
	const { reviewId } = req.params

	Review.findById(reviewId)
		.then((review) => {
			if (!review) return next(createError(StatusCodes.NOT_FOUND, 'Review not found'))
			if (review.author._id.toString() !== req.currentUserId)
				return next(createError(StatusCodes.UNAUTHORIZED, 'User are not the author of this review'))

			review.deleteOne()
			return res.status(StatusCodes.OK).send()
		})
		.catch(next)
}

module.exports.likeReview = (req, res, next) => {
	const { reviewId } = req.params

	Review.findById(reviewId)
		.then((review) => {
			if (!review) return next(createError(StatusCodes.NOT_FOUND, 'Review not found'))
			if (review.likes.includes(req.currentUserId)) {
				review.likes.pull(req.currentUserId)
			} else {
				review.likes.push(req.currentUserId)
			}

			review.save()
			return res.status(StatusCodes.OK).send()
		})
		.catch(next)
}