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

module.exports.getAllReviews = (req, res, next) => {
	Review.find()
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

module.exports.reportReview = (req, res, next) => {
	const { id } = req.params
	const { userId } = req.body

	Review.findById(id)
		.then((review) => {
			if (review.reports.includes(userId)) {
				return res
					.status(StatusCodes.OK)
					.json({ message: "You already reported this review" })
			} else {
				review.reports.push(userId)
				review.save()
				return res.status(StatusCodes.OK).json({ message: "Review reported" })
			}
		})
		.catch(next)
}
