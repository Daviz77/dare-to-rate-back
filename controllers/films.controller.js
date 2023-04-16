const axios = require('axios')
const { StatusCodes } = require('http-status-codes')
const createError = require('http-errors')
const Film = require('../models/Film.model')
const Review = require('../models/Review.model')

module.exports.getFilm = (req, res, next) => {
	const { title } = req.query

	if (title) {
		return axios.get(process.env.OMDB_API_HOST, { params: { apiKey: process.env.OMDB_API_KEY, plot: 'full', t: title  } })
			.then(imdbResponse =>
				Film.findOne({ imdbId: imdbResponse.data.imdbID })
					.lean()
					.then(film => {
						if (!film) return res.json({ data: createFilmResponseFromImdbApi(imdbResponse.data) })
						return calcRating(film, res, next)
					}))
					.catch(next)
	}

	next(createError(StatusCodes.BAD_REQUEST, 'Query param `title` is needed'))
}

module.exports.getFilmById = (req, res, next) => {
	const { filmId } = req.params

	Film.findById(filmId)
		.lean()
		.then(film => {
			if (!film) return createError(StatusCodes.NOT_FOUND, 'Film not found')
			return calcRating(film, res, next)
		})
		.catch(next)
}

const calcRating = (film, res, next)  =>
	Review.find({ film: film._id })
		.then(reviews => {
			let ratingSum = 0
			reviews.forEach(r => ratingSum += r.rating)

			return res.json({ data: { ...film, rating: ratingSum / reviews.length }})
		})
		.catch(next)

const createFilmResponseFromImdbApi = film => {
	return {
		title: film.Title,
		plot: film.Plot,
		year: film.Year,
		director: film.Director,
		writer: film.Writer,
		actors: film.Actors,
		genre: film.Genre,
		runtime: film.Runtime,
		country: film.Country,
		poster: film.Poster,
		imdbId: film.imdbID,
		rating: film.imdbRating
	}
}
