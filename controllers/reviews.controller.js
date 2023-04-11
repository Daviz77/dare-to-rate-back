const { StatusCodes } = require("http-status-codes")
const Review = require("../models/Review.model")
const createError = require("http-errors")


module.exports.create = (req, res, next) => {
	const author = req.currentUserId
	const { content, like, title } = req.body
	Review.create({ content, like, author, title })
		.then((reviewCreated) => {
			res.status(StatusCodes.CREATED).json(reviewCreated)
		})
		.catch(next)
}

module.exports.getAllReviews = (req, res, next) => {
	let filterReviews
	if (req.isAuthenticated()) {
		filterReviews = { user: { $in: req.user.following } }
	} else {
		filterReviews = {}
	}
	Review.find(filterReviews)
		.limit(10)
		.populate("user", "username")
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
			if (review.author._id + '' === req.currentUserId) {
				return Review.findByIdAndUpdate(id, { title, content, likes }, { new: true, runValidators: true })
					.then((review) => res.status(StatusCodes.OK).json(review))
					.catch(next)
			}

			throw createError(StatusCodes.UNAUTHORIZED, "You are not the author of this review")
		})
		.catch(next)
}

module.exports.deleteReview = (req, res, next) => {
	const { id } = req.params
	Review.findByIdAndDelete(id)
		.then(() => res.status(StatusCodes.OK))
		.catch(next)
}
