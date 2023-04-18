const User = require('../models/User.model')
const Review = require('../models/Review.model')
const { StatusCodes } = require('http-status-codes')
const createError = require('http-errors')

module.exports.create = (req, res, next) => {
	const { email, password, username, img, about } = req.body
	User.create({ email, password, username, img, about })
		.then((userCreated) => res.status(StatusCodes.CREATED).json(userCreated))
		.catch(next)
}

module.exports.getCurrentUserProfile = (req, res, next) => {
	User.findById(req.currentUserId)
		.then((user) => {
			res.json({ data: user })
		})
		.catch(next)
}

module.exports.getUserById = (req, res, next) => {
	const { userId } = req.params
	User.findById(userId)
		.lean()
		.then((user) => {
			if (!user) return next(createError(StatusCodes.NOT_FOUND, 'User not found'))
			return Review.find({ author: user._id }).then((reviews) => res.json({ data: { ...user, reviews } }))
		})
		.catch(next)
}

module.exports.updateLogedUser = (req, res, next) => {
	if (req.file) {
		req.body.img = req.file.path
	}

	const { username, img, about } = req.body

	User.findByIdAndUpdate(req.currentUserId, { username, img, about }, { new: true, runValidators: true })
		.then(() => res.status(StatusCodes.NO_CONTENT).send())
		.catch(next)
}

module.exports.followUser = (req, res, next) => {
	const { userId } = req.params
	User.findByIdAndUpdate(req.currentUserId, { $push: { followings: userId } }, { new: true })
		.then((user) => {
			if (!user) {
				return next(createError(StatusCodes.NOT_FOUND, 'User not found'))
			} else {
				return res.status(StatusCodes.NO_CONTENT).send()
			}
		})
		.catch(next)
}

module.exports.getFollowings = (req, res, next) => {
	const { userId } = req.params
	User.findById(userId)
		.populate('followings')
		.select('followings')
		.then((user) => {
			if (!user) return next(createError(StatusCodes.BAD_REQUEST, 'User not found'))
			return res.json({ data: user.followings })
		})
		.catch(next)
}

module.exports.getFollowers = (req, res, next) => {
	const { userId } = req.params
	User.find({ followings: userId })
		.then((users) => res.json({ data: users }))
		.catch(next)
}

module.exports.changeUserRole = (req, res, next) => {
	const { userId } = req.params
	const { userRole } = req.body

	if (!userRole || (userRole !== 'ADMIN' && userRole !== 'USER')) {
		return next(createError(StatusCodes.BAD_REQUEST, 'Body field `userRole` is required and must be `ADMIN` or `USER`'))
	}

	User.findByIdAndUpdate(userId, { type: userRole }, { new: true })
		.then((user) => {
			if (!user) return next(createError(StatusCodes.NOT_FOUND, 'User not found'))

			return res.status(StatusCodes.CREATED).send()
		})
		.catch(next)
}
