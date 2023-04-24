const mongoose = require('mongoose')
const {
	REQUIRED_FIELD,
	INVALID_LENGTH,
} = require('../config/errorMessages')

const reviewSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, REQUIRED_FIELD],
			minlength: [4, INVALID_LENGTH],
		},
		content: {
			type: String,
			required: true,
			minlength: 50,
			required: [true, REQUIRED_FIELD]
		},
		rating: {
			type: Number,
			required: [true, REQUIRED_FIELD],
			min: 1,
			max: 10,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}
		],
		active: {
			type: Boolean,
			default: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, REQUIRED_FIELD],
		},
		film: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Film',
			required: [true, REQUIRED_FIELD],
		}
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		}
	}
)

reviewSchema.virtual('comments', {
	ref: 'Comment',
	localField: '_id',
	foreignField: 'review',
	justOne: false,
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
