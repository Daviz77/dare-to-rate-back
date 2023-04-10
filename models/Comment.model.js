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
			required: [true, REQUIRED_FIELD]
		},
		review: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Review',
			required: [true, REQUIRED_FIELD]
		},

		content: {
			type: String,
			minlength: [50, INVALID_LENGTH],
			maxlength: [300, INVALID_LENGTH],
			required: [true, REQUIRED_FIELD]

		},

		active: {
			type: Boolean,
			default: true,
		}
	},
	{
		timestamps: true,
	}
)

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment
