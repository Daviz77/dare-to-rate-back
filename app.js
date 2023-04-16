require('dotenv').config()

const express = require('express')
const logger = require('morgan')
const createError = require('http-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes');

require('./config/db.config');

const frontPort = process.env.FRONT_PORT
const app = express();
app.use(cors({
  origin: `http://localhost:${frontPort}`,
}))

app.use(logger('dev'));
app.use(express.json());

const routes = require('./config/routes.config');
app.use(routes);

app.use((req, res, next) => {
  next(createError(StatusCodes.NOT_FOUND, 'Route not found'))
})

app.use((error, req, res, next) => {
  console.error(error);

  if (error instanceof mongoose.Error.ValidationError) {
    error = createError(StatusCodes.BAD_REQUEST, error)
  } else if (error instanceof mongoose.Error.CastError) {
    error = createError(StatusCodes.BAD_REQUEST, 'Resource not found')
  } else if (error.message && error.message.includes('E11000')) {
    error = createError(StatusCodes.BAD_REQUEST, 'Resource already exists')
  } else if (error instanceof jwt.JsonWebTokenError) {
    error = createError(StatusCodes.UNAUTHORIZED, error)
  } else if (!error.status) {
    error = createError(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const data = {};

  data.message = error.message;
  data.errors = error.errors
    ? Object.keys(error.errors).reduce(
      (errors, key) => {
        return {
          ...errors,
          [key]: error.errors[key].message || error.errors[key]
        }
      },
      {}
    ) : undefined

  res.status(error.status).json(data)
})

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`App initialized at port ${port}`)
})
