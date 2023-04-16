const mongoose = require("mongoose")
const { REQUIRED_FIELD, } = require("../config/errorMessages")

const filmSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, REQUIRED_FIELD],
			unique: true,
		},
		plot: {
			type: String,
			required: [true, REQUIRED_FIELD],
		},
		year: {
			type: String,
			required: [true, REQUIRED_FIELD],
		},
		director: {
			type: String,
		},
		writer: {
			type: String,
		},
		actors: {
			type: String,
		},
		genre: {
			type: String,
		},
		runtime: {
			type: String,
		},
		country: {
			type: String,
		},
		poster: {
			type: String,
			required: [true, REQUIRED_FIELD],
		},
		imdbId: {
			type: String,
			unique: true,
		},
		rating: {
			type: Number
		}
	},
	{
		timestamps: true,
	}
)

const Film = mongoose.model("Film", filmSchema)

module.exports = Film
