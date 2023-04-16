const { StatusCodes } = require('http-status-codes')
const createError = require('http-errors')
const Comment = require('../models/Comment.model')

module.exports.create = (req, res, next) => {
	const author = req.currentUserId
	const { content } = req.body
	const { reviewId } = req.params

	Comment.create({ content, author, review: reviewId })
		.then(() => res.status(StatusCodes.CREATED).send())
		.catch(next)
}

module.exports.deleteComment = (req, res, next) => {
	const { commentId } = req.params

	Comment.findById(commentId)
		.then(comment => {
			if (!comment) return next(createError(StatusCodes.BAD_REQUEST, 'Comment not found'))
			if (comment.author._id.toString() !== req.currentUserId)
				return next(createError(StatusCodes.UNAUTHORIZED, 'User is not the author of this comment'))

			comment.deleteOne()
			return res.status(StatusCodes.OK).send()
		})
		.catch(next)
}

module.exports.getCommentsByReviewId = (req, res, next) => {
	const { reviewId } = req.params

	Comment.find({ review: reviewId })
		.populate('author', 'username img')
		.then((comments) => res.json({ data: comments }))
		.catch(next)
}

module.exports.updateComment = (req, res, next) => {
	const { commentId } = req.params
	const { content } = req.body

	Comment.findById(commentId)
		.then((comment) => {
			if (comment.author._id.toString() === req.currentUserId) {
				return Comment.findByIdAndUpdate(
					commentId,
					{ content },
					{ new: true, runValidators: true }
				)
					.then(() => res.status(StatusCodes.NO_CONTENT).send())
					.catch(next)
			}

			return next(createError(StatusCodes.UNAUTHORIZED, 'User is not the author of this comment'))
		})
		.catch(next)
}
