const mongoose = require("mongoose")
const {
	REQUIRED_FIELD,
	INVALID_EMAIL,
	INVALID_LENGTH,
} = require("../config/errorMessages")

const reviewSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, REQUIRED_FIELD],
			minlength: [6, INVALID_LENGTH],
		},

		content: {
			type: String,
			required: true,
			minlength: 50,
			maxlength: 500,
			required: [true, REQUIRED_FIELD]
		},

		likes:
			[{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}],

		active: {
			type: Boolean,
			default: true,
		},

		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, REQUIRED_FIELD],
		},
		
		reports: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		}
	},

	{
		timestamps: true,
	}
)

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review
