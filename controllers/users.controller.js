const User = require("../models/User.model")
const { StatusCodes } = require("http-status-codes")
const createError = require("http-errors")


module.exports.create = (req, res, next) => {
	const { email, password, username, img, about } = req.body
	User.create({ email, password, username, img, about })
		.then((userCreated) => {
			res.status(StatusCodes.CREATED).json(userCreated)
		})
		.catch(next)
}

module.exports.list = (req, res, next) => {
	User.find()
		.then((users) => res.json(users))
		.catch(next)
}

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.currentUserId)
    .then(user => {
      if (!user) {
        next(createError(StatusCodes.NOT_FOUND, 'User not found'))
      } else {
        res.json(user);
      }
    })
    .catch(next)
  }

