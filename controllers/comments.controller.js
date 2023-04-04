const { StatusCodes } = require('http-status-codes')
const Comment = require('../models/Comment.model')



module.exports.create = (req, res, next) => {
  const owner = req.currentUserId
  const {content} = req.body
	Comment.create({ content, owner })
		.then((commentCreated) => {
			res.status(StatusCodes.CREATED).json(commentCreated)
		})
		.catch(next)
}

module.exports.list = (req, res, next) => {
	Comment.find()
		.then((reviews) => res.json(reviews))
		.catch(next)
} 