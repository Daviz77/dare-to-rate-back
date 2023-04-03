const mongoose = require("mongoose")
const {
	REQUIRED_FIELD,
	INVALID_EMAIL,
	INVALID_LENGTH,
} = require("../config/errorMessages")

const reviewSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
			minlength: 50,
			maxlength: 500,
		},

		likes: {
			type: Number,
			default: 0,
		},

		active: {
			type: Boolean,
			default: true,
		},

		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, REQUIRED_FIELD],
		},
	},

	{
		timestamps: true,
	}
)

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review
