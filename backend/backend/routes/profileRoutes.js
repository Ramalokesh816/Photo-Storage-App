const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, async (req, res) => {

  try {

    const user = await User.findById(req.user.id).select("-password");

    res.json(user);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

});


router.put("/profile", authMiddleware, async (req, res) => {

  try {

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updatedUser);

  } catch (error) {

    res.status(500).json({ message: "Update failed" });

  }

});

module.exports = router;