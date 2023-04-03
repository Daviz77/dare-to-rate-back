const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")

const EMAIL_PATTERN =
	/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

const SALT_ROUNDS = 10

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, "Username is required."],
			unique: true,
		},

		email: {
			type: String,
			required: [true, "Email is required."],
			unique: true,
			lowercase: true,
			match: [EMAIL_PATTERN, "Email is invalid."],
		},

		password: {
			type: String,
			required: [true, "Password is required."],
		},

		type: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
		},

		img: {
			type: String,
			default:
				"https://cronicavasca.elespanol.com/uploads/s1/16/11/39/51/visita-san-mames.jpeg",
		},

		about: {
			type: String,
		},

		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],

		active: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
)

userSchema.pre('save', function (next) {
  const rawPassword = this.password;
  if (this.isModified('password')) {   
    bcryptjs.hash(rawPassword, SALT_ROUNDS)
      .then(hash => {
        this.password = hash;
        next()
      })
      .catch(err => next(err))
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function (passwordToCheck) {
  return bcryptjs.compare(passwordToCheck, this.password)
}

const User = mongoose.model("User", userSchema)

module.exports = User
