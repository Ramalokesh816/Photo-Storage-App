const express = require("express");
const router = express.Router();

const {
uploadPhoto,
getPhotos,
deletePhoto
} = require("../controllers/photoController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/upload", authMiddleware, uploadPhoto);

router.get("/photos", authMiddleware, getPhotos);

router.delete("/photos/:id", authMiddleware, deletePhoto);

module.exports = router;