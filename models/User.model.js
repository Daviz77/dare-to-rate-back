const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")
const {
	REQUIRED_FIELD,
	INVALID_EMAIL,
	INVALID_LENGTH,
} = require("../config/errorMessages")

const EMAIL_PATTERN =
	/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

const SALT_ROUNDS = 10

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, REQUIRED_FIELD],
			unique: true,
		},
		email: {
			type: String,
			required: [true, REQUIRED_FIELD],
			unique: true,
			lowercase: true,
			match: [EMAIL_PATTERN, INVALID_EMAIL],
		},
		password: {
			type: String,
			required: [true, REQUIRED_FIELD],
			minlength: [4, INVALID_LENGTH],
		},
		type: {
			type: String,
			enum: ['ADMIN', 'USER'],
			default: 'USER',
		},
		img: {
			type: String,
			default: 'https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg',
		},
		about: {
			type: String
		},
		followings: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		active: {
			type: Boolean,
			default: true,
		}
	},
	{
		timestamps: true,
	}
)

userSchema.pre('save', function (next) {
	const rawPassword = this.password
	if (this.isModified('password')) {
		bcryptjs
			.hash(rawPassword, SALT_ROUNDS)
			.then((hash) => {
				this.password = hash
				next()
			})
			.catch((err) => next(err))
	} else {
		next()
	}
})

userSchema.methods.checkPassword = function (passwordToCheck) {
	return bcryptjs.compare(passwordToCheck, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User
