// routes/songRoutes.js
const express = require('express');
const { addSong, getAllSongs, getSongById } = require('../controllers/songController');
const { updateSongTime } = require('../controllers/songController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer'); // Import the multer setup for Cloudinary
const router = express.Router();

// Route to add a song (Admin only), uses multer to upload file
router.post('/add', protect, adminOnly, addSong);
router.get('/', protect, getAllSongs);
router.get('/:id', protect, getSongById);

router.post('/songs/add', addSong);

router.patch('/:id/time', protect, updateSongTime);

module.exports = router;