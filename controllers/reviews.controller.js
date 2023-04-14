const { StatusCodes } = require("http-status-codes")
const Review = require("../models/Review.model")
const createError = require("http-errors")
const User = require("../models/User.model")

module.exports.create = (req, res, next) => {
	const author = req.currentUserId
	const { content, like, title, reviewId } = req.body
	Review.create({ content, like, author, title, reviewId })
		.then((reviewCreated) => {
			res.status(StatusCodes.CREATED).json(reviewCreated)
		})
		.catch(next)
}

module.exports.getAllReviews = (req, res, next) => {
	const reviewsLimit = 10

	if (req.currentUserId) {
		return User.findById(req.currentUserId)
		.then((user) =>
			Review.find({ author: { $in: user.following } })
				.limit(reviewsLimit)
				.sort({ createdAt: -1 })
				.populate("author", "username")
				.then((reviews) => res.json(reviews))
				.catch(next))
	}

	Review.find()
		.limit(reviewsLimit)
		.sort({ createdAt: -1 })
		.populate("author", "username")
		.then((reviews) => res.json(reviews))
		.catch(next)
}

module.exports.getUsersReviews = (req, res, next) => {
	const { userId } = req.params
	Review.find({ author: userId })
		.then((reviews) => {
			return res.json(reviews)
		})
		.catch(next)
}

module.exports.updateReview = (req, res, next) => {
	const { id } = req.params
	const { title, content, likes } = req.body

	Review.findById(id)
		.then((review) => {
			if (review.author._id + "" === req.currentUserId) {
				return Review.findByIdAndUpdate(
					id,
					{ title, content, likes },
					{ new: true, runValidators: true }
				)
					.then((review) => res.status(StatusCodes.OK).json(review))
					.catch(next)
			}

			throw createError(
				StatusCodes.UNAUTHORIZED,
				"You are not the author of this review"
			)
		})
		.catch(next)
}

module.exports.deleteReview = (req, res, next) => {
	const { id } = req.params
	Review.findByIdAndDelete(id)
		.then(() => res.status(StatusCodes.OK))
		.catch(next)
}
