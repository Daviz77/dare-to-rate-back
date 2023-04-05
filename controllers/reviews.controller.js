const { StatusCodes } = require("http-status-codes")
const Review = require("../models/Review.model")

module.exports.create = (req, res, next) => {
	const owner = req.currentUserId
	const { content, like } = req.body
	Review.create({ content, like, owner })
		.then((reviewCreated) => {
			res.status(StatusCodes.CREATED).json(reviewCreated)
		})
		.catch(next)
}

module.exports.updateReview = (req, res, next) => {
	const { id } = req.params
	const { title, content, likes } = req.body
	Review.findByIdAndUpdate(id, { title, content, likes }, { new: true })
		.then((review) => res.status(StatusCodes.CREATED).json(review))
		.catch(next)
}

module.exports.deleteReview = (req, res, next) => {
	const { id } = req.params
	Review.findByIdAndDelete(id)
		.then(() => res.status(StatusCodes.OK))
		.catch(next)
}
