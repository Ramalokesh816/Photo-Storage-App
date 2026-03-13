const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const photoRoutes = require("./routes/photoRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// CORS Fix for frontend
app.use(cors({
  origin: "https://photo-storage-app-1.onrender.com",
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("MongoDB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", photoRoutes);
app.use("/api", profileRoutes);
app.use("/api", dashboardRoutes);

// Port fallback
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});