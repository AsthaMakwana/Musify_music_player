const express = require('express');
const { createPlaylist, getPlaylists, addSongToPlaylist, removeSongFromPlaylist, getPlaylistById, removePlaylist } = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', protect, createPlaylist);
router.get('/', protect, getPlaylists);
router.post('/add-song', protect, addSongToPlaylist);
router.get('/:playlistId', protect, getPlaylistById);
router.post('/remove-song', protect, removeSongFromPlaylist);
router.delete('/:playlistId/remove', protect, removePlaylist);

module.exports = router;
