const { StatusCodes } = require('http-status-codes')
const Review = require('../models/Review.model')



module.exports.create = (req, res, next) => {
  const owner = req.currentUserId
  const {content, like } = req.body
	Review.create({ content, like, owner })
		.then((reviewCreated) => {
			res.status(StatusCodes.CREATED).json(reviewCreated)
		})
		.catch(next)
}

module.exports.list = (req, res, next) => {
	Review.find()
		.then((reviews) => res.json(reviews))
		.catch(next)
}