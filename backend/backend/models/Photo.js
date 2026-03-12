const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  publicId: String,
  album: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Photo", PhotoSchema);