const createError = require("http-errors")
const { StatusCodes } = require("http-status-codes")
const User = require("../models/User.model")

module.exports.isAdmin = (req, res, next) => {
  User.findById(req.currentUserId)
    .then((user) => {
      if (user.type !== "admin") {
        return next(createError(StatusCodes.UNAUTHORIZED, "You are not an admin"))
      }
      next();
    })
    .catch(next)
}