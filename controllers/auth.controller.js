const User = require('../models/User.model');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res, next) => {
  const loginError = createError(StatusCodes.UNAUTHORIZED, 'Email or password incorrect');
  const { email, password } = req.body

  if (!email || !password) {
    return next(loginError);
  }

  // Check email
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return next(loginError)
      }

      // Check password
      return user.checkPassword(password)
        .then(match => {
          if (!match) {
            return next(loginError)
          }

          // Emitir y firmar un token jwt con la info del usuario
          const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'test',
            {
              expiresIn: '2h'
            }
          )

          res.json({ accessToken: token })
        })
    })
    .catch(next)
}