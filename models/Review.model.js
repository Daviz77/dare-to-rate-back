const mongoose = require("mongoose")


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
	},

	{
		timestamps: true,
	}
)

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review


