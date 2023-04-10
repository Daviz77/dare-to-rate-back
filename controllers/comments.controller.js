const { StatusCodes } = require("http-status-codes")
const Comment = require("../models/Comment.model")

module.exports.create = (req, res, next) => {
	const { id } = req.params
	const { userId, content } = req.body
	Comment.create({ user: userId, review: id, content })
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
  const { id } = req.params;
  Comment.find({ review: id })
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

module.exports.reportComment = (req, res, next) => {

	const {id} = req.params
	const {userId} = req.body

	Comment.findById(id)
		.then((comment) => {
			if (comment.reports.includes(userId)) {
				return res.status(StatusCodes.OK).json({message: "You already reported this comment"})
			} else {
				comment.reports.push(userId)
				comment.save()
				return res.status(StatusCodes.OK).json({message: "Comment reported"})
			}
		})
		.catch(next)
}