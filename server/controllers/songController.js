const Song = require('../models/songModel');

exports.addSong = async (req, res) => {
    try {
        console.log(req.body);
        const { title, artist, genre, releaseYear, audioUrl, imageUrl } = req.body.data;

        // Create a new song entry
        const newSong = new Song({
            title,
            artist,
            genre,
            releaseYear,
            audioUrl,
            imageUrl,
        });

        await newSong.save();
        res.status(201).json({ message: 'Song uploaded successfully', song: newSong });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching songs' });
    }
};

exports.getSongById = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        res.json(song);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching song' });
    }
};

// Update current time of the song
exports.updateSongTime = async (req, res) => {
    const { id } = req.params;
    const { currentTime } = req.body;
  
    try {
      const song = await Song.findById(id);
      if (!song) {
        return res.status(404).json({ message: 'Song not found' });
      }
  
      song.currentTime = currentTime;
      await song.save();
  
      res.status(200).json({ message: 'Current time updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to update current time', error: err.message });
    }
  };
