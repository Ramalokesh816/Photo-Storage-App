const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
uploadPhoto,
getPhotos,
deletePhoto
} = require("../controllers/photoController");

const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", authMiddleware, upload.single("file"), uploadPhoto);

router.get("/photos", authMiddleware, getPhotos);

router.delete("/photos/:id", authMiddleware, deletePhoto);

module.exports = router;