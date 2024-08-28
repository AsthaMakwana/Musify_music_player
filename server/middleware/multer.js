// middleware/multer.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'music-player', // Folder in Cloudinary where files will be stored
        allowed_formats: ['jpeg', 'jpg', 'png', 'mp3'], // Specify allowed formats (can include more based on use)
    },
});

const upload = multer({ storage });

module.exports = upload;