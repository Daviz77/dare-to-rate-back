const { StatusCodes } = require('http-status-codes')
const createError = require('http-errors')
const Report = require('../models/Report.model')
const Review = require('../models/Review.model')
const Comment = require('../models/Comment.model')

module.exports.getAllReports = (req, res, next) => {
	Report.find()
		.populate('user review')
		.then((reports) => res.json({ data: reports }))
		.catch(next)
}


module.exports.createReviewReport = (req, res, next) => {
	const { reviewId } = req.params
	const { reason } = req.body
	const user = req.currentUserId

	Review.findById(reviewId)
		.then(review => {
			if (!review) return next(createError(StatusCodes.BAD_REQUEST, 'Review not found'))

			return Report.findOne({ user, review: reviewId })
				.then(report => {
					if (report) return next(createError(StatusCodes.CONFLICT, 'User has already reported the review'))
					return Report.create({ review: reviewId, reason, user })
						.then(() => res.status(StatusCodes.CREATED).send())
						.catch(next)	
				})
				.catch(next)
		})
		.catch(next)
}


module.exports.createCommentReport = (req, res, next) => {
	const { commentId } = req.params
	const { reason } = req.body
	const user = req.currentUserId

	Comment.findById(commentId)
		.then(comment => {
			if (!comment) return next(createError(StatusCodes.BAD_REQUEST, 'Comment not found'))

			return Report.findOne({ user, comment: commentId })
				.then(report => {
					if (report) return next(createError(StatusCodes.CONFLICT, 'User has already reported the comment'))
					return Report.create({ comment: commentId, reason, user })
						.then(() => res.status(StatusCodes.CREATED).send())
						.catch(next)	
				})
		})
		.catch(next)
}
