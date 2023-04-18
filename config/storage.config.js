const multer = require('multer')
const cloudinary = require('cloudinary').v2
const CloudinaryStorage = require('multer-storage-cloudinary').CloudinaryStorage

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
})

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'ironhackP3',
		allowedFormats: ['jpg', 'png'],
	},
})

const uploadCloud = multer({ storage })

module.exports = uploadCloud
