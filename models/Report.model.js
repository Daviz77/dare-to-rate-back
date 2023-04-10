const mongoose = require("mongoose")
const {
	REQUIRED_FIELD,
	INVALID_LENGTH,
} = require("../config/errorMessages")

const reportSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, REQUIRED_FIELD],
		},
		review: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Review'
		},
		comment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		},
		reason: {
			type: String,
			required: [true, REQUIRED_FIELD],
			minlength: [6, INVALID_LENGTH],
		},
		pending: {
			type: Boolean,
			default: true,			
		}
	},

	{
		timestamps: true,
	}
)

const Report = mongoose.model("Report", reportSchema)

module.exports = Report
