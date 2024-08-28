const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  genre: { type: String },
  releaseYear: { type: String },
  audioUrl: { type: String, required: true },
  imageUrl: { type: String },
  currentTime: { type: Number, default: 0 },
});

module.exports = mongoose.model('Song', songSchema);
