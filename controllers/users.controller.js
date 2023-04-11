const User = require("../models/User.model")
const { StatusCodes } = require("http-status-codes")
const createError = require("http-errors")

// signup - creación de usuario en bbdd
module.exports.create = (req, res, next) => {
	const { email, password, username, img, about } = req.body
	User.create({ email, password, username, img, about })
		.then((userCreated) => {
			res.status(StatusCodes.CREATED).json(userCreated)
		})
		.catch(next)
}

// listado de usuarios
module.exports.list = (req, res, next) => {
	User.aggregate([
		{ $addFields: { numReviews: { $size: "$reviews" } } },
		{ $sort: { numReviews: 1 } },
	])
		.then((users) => res.json(users))
		.catch(next)
}

module.exports.getCurrentUserProfile = (req, res, next) => {
	User.findById(req.currentUserId)
		.then((user) => {
			res.json(user)
		})
		.catch(next)
}

module.exports.getUserById = (req, res, next) => {
	const { userId } = req.params
	User.findById(userId)
		.populate("reviews")
		.then((err, user) => {
			if (err) return next(err)
			if (!user) return createError(StatusCodes.NOT_FOUND, "User not found")
			return res.json(user)
		})
		.catch(next)
}

module.exports.updateLogedUser = (req, res, next) => {
	const { username, img, about } = req.body
	User.findByIdAndUpdate(req.currentUserId, {
		username,
		img,
		about,
		new: true,
		runValidators: true,
	})
		.then((updatedUser) => {
			return res.json(updatedUser)
		})
		.catch(next)
}

module.exports.updateUserRole = (req, res, next) => {
	const { id } = req.params
	const { type } = req.body
	User.findByIdAndUpdate(id, { type }, { new: true })
		.then((user) => {
			if (!user) {
				return createError(StatusCodes.NOT_FOUND, "User not found")
			}
			res.status(200).json(user)
		})
		.catch(next)
}

module.exports.followUser = (req, res, next) => {
	const { userId } = req.params
	User.findByIdAndUpdate(
		userId,
		{ $push: { followers: req.currentUserId } },
		{ new: true }
	)
		.then((user) => {
			if (!user) {
				return createError(StatusCodes.NOT_FOUND, "User not found")
			} else {
				User.findByIdAndUpdate(
					req.currentUserId,
					{ $push: { following: userId } },
					{ new: true }
				)
					.then((user) => {
						if (!user) {
							return createError(StatusCodes.NOT_FOUND, "User not found")
						} else {
							res.status(200).json(user)
						}
					})
					.catch(next)
			}
		})
		.catch(next)
}

module.exports.getFollowing = (req, res, next) => {
	const { userId } = req.params
	User.findById(userId)
		.populate("following", "username img ")
		.select("following")
		.then((user) => {
			if (!user) {
				return createError(StatusCodes.NOT_FOUND, "User not found")
			} else {
				res.json({
					following: user.following,
				})
			}
		})
		.catch(next)
}

module.exports.getFollowers = (req, res, next) => {
	const { userId } = req.params
	User.findById(userId)
		.populate("followers")
		.select("followers")
		.then((user) => {
			if (!user) {
				return createError(StatusCodes.NOT_FOUND, "User not found")
			} else {
				res.json({
					followers: user.followers,
				})
			}
		})
		.catch(next)
}

module.exports.changeUserRole = (req, res, next) => {
	const { userId } = req.params
	User.findByIdAndUpdate(userId, { type: "admin" }, { new: true })
		.then((user) => {
			if (!user) {
				return res.status(404).json({ message: "User not found" })
			}
			res.json(user)
		})
		.catch(next)
}
