const { StatusCodes } = require("http-status-codes")
const Report = require("../models/Report.model")

module.exports.getAllReports = (req, res, next) => {
	Report.find()
		.populate("user", "username")
		.then((reports) => res.json(reports))
		.catch(next)
}


module.exports.createReviewReport = (req, res, next) => {
	const { id } = req.params
	const { reason } = req.body
	const user = req.currentUserId

	Report.create({ review: id, reason, user })
		.then((reportCreated) => {
			res.status(StatusCodes.CREATED).json(reportCreated)
		})
		.catch(next)	
}


module.exports.createCommentReport = (req, res, next) => {
	const { id } = req.params
	const { reason } = req.body
	const user = req.currentUserId

	Report.create({ comment: id, reason, user })
		.then((reportCreated) => {
			res.status(StatusCodes.CREATED).json(reportCreated)
		})
		.catch(next)	
}