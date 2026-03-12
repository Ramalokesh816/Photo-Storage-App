const express = require("express");
const router = express.Router();

const {
  uploadPhoto,
  getPhotos,
  deletePhoto
} = require("../controllers/photoController");

router.post("/upload", uploadPhoto);

router.get("/photos", getPhotos);

router.delete("/photos/:id", deletePhoto);

module.exports = router;