const { StatusCodes } = require("http-status-codes")
const Comment = require("../models/Comment.model")

module.exports.create = (req, res, next) => {
	const { reviewId } = req.params
	const { userId, content } = req.body
	Comment.create({ user: userId, review: reviewId, content })
	Comment.save()
		.then((commentCreated) => {
			res.status(StatusCodes.CREATED).json(commentCreated)
		})
		.catch(next)
}

module.exports.deleteComment = (req, res, next) => {
	const { id } = req.params
	Comment.findByIdAndDelete(id)
		.then(() => res.status(StatusCodes.OK))
		.catch(next)
}

module.exports.getCommentsByReviewId = (req, res, next) => {
  const { reviewId } = req.params;
  Comment.find({ review: reviewId })
    .populate('user', 'username')
		.populate('review')
    .then((comments) => res.json(comments))
    .catch(next);
};

module.exports.updateComment = (req, res, next) => {
	const { id } = req.params
	const { content } = req.body
	Review.findByIdAndUpdate(id, { content }, { new: true })
		.then((review) => res.status(StatusCodes.OK).json(review))
		.catch(next)
}