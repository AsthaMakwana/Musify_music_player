const Playlist = require('../models/playlistModel');

// Create Playlist
exports.createPlaylist = async (req, res) => {
    const { name, songs } = req.body;
    try {
        const newPlaylist = new Playlist({
            user: req.user.id,
            name,
            songs
        });
        await newPlaylist.save();
        res.status(201).json({ message: 'Playlist created' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating playlist' });
    }
};

// Fetch all playlists for the logged-in user
exports.getPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ user: req.user.id }).populate('songs');
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching playlists' });
    }
};

// Add song to playlist
exports.addSongToPlaylist = async (req, res) => {
    const { playlistId, songId } = req.body;
    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

        if (playlist.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You do not have permission to modify this playlist' });
        }

        playlist.songs.push(songId);
        await playlist.save();
        res.json({ message: 'Song added to playlist' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding song to playlist' });
    }
};

// Remove song from playlist
exports.removeSongFromPlaylist = async (req, res) => {
    const { playlistId, songId } = req.body;
    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

        if (playlist.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You do not have permission to modify this playlist' });
        }

        playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
        await playlist.save();
        res.json({ message: 'Song removed from playlist' });
    } catch (error) {
        res.status(500).json({ error: 'Error removing song from playlist' });
    }
};

exports.getPlaylistById = async (req, res) => {
    const { playlistId } = req.params; // Extract playlistId from the request params
    try {
        // Find the playlist by ID and ensure it's owned by the logged-in user
        const playlist = await Playlist.findOne({ _id: playlistId, user: req.user.id }).populate('songs');

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found or you do not have access' });
        }

        res.json(playlist); // Send the playlist back in the response
    } catch (error) {
        res.status(500).json({ error: 'Error fetching playlist' });
    }
};

exports.removePlaylist = async (req, res) => {
    const { playlistId } = req.params;
    try {
        const playlist = await Playlist.findOne({ _id: playlistId, user: req.user.id });
        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

        if (playlist.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You do not have permission to delete this playlist' });
        }

        await playlist.remove();
        res.json({ message: 'Playlist removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error removing playlist' });
    }
};