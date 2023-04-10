const { StatusCodes } = require("http-status-codes")
const Review = require("../models/Review.model")
const User = require("../models/User.model")

module.exports.create = (req, res, next) => {
	const author = req.currentUserId
	const { content, like } = req.body
	Review.create({ content, like, author })
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
		.populate("user", "username")
		.then((reviews) => res.json(reviews))
		.catch(next)
}

module.exports.updateReview = (req, res, next) => {
	const { id } = req.params
	const { title, content, likes } = req.body
	Review.findByIdAndUpdate(id, { title, content, likes }, { new: true })
		.then((review) => res.status(StatusCodes.OK).json(review))
		.catch(next)
}

module.exports.deleteReview = (req, res, next) => {
	const { id } = req.params
	Review.findByIdAndDelete(id)
		.then(() => res.status(StatusCodes.OK))
		.catch(next)
}