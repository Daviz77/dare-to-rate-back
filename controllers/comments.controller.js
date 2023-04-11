const { StatusCodes } = require("http-status-codes")
const Comment = require("../models/Comment.model")

module.exports.create = (req, res, next) => {
	const author = req.currentUserId
	const { title, like, content } = req.body
	const { reviewId } = req.params
	Comment.create({ content, like, author, title, review: reviewId })
		.then((commentCreated) => {
			res.status(StatusCodes.CREATED).json(commentCreated)
		})
		.catch(next)
}

module.exports.deleteComment = (req, res, next) => {
	const { commentId } = req.params
	Comment.findByIdAndDelete(commentId)
		.then(() => res.status(StatusCodes.OK).json())
		.catch(next)
}

module.exports.getCommentsByReviewId = (req, res, next) => {
	const { id } = req.params
	Comment.find({ review: id })
		.populate("user", "username")
		.populate("review")
		.then((comments) => res.json(comments))
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
					.then((review) => res.status(StatusCodes.OK).json(review))
					.catch(next)
			}
			throw createError(
				StatusCodes.UNAUTHORIZED,
				"You are not the author of this comment"
			)
		})
		.catch(next)
}

module.exports.reportComment = (req, res, next) => {
	const { id } = req.params
	const { userId } = req.body

	Comment.findById(id)
		.then((comment) => {
			if (comment.reports.includes(userId)) {
				return res
					.status(StatusCodes.OK)
					.json({ message: "You already reported this comment" })
			} else {
				comment.reports.push(userId)
				comment.save()
				return res.status(StatusCodes.OK).json({ message: "Comment reported" })
			}
		})
		.catch(next)
}
