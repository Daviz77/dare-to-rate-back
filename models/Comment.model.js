const mongoose = require("mongoose")
const {
	REQUIRED_FIELD,
	INVALID_EMAIL,
	INVALID_LENGTH,
} = require("../config/errorMessages")

const commentSchema = new mongoose.Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		review: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Review',
			required: true,
		},

		content: {
			type: String,
			minlength: 50,
			maxlength: 300,
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

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment
