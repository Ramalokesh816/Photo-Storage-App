const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const photoRoutes = require("./routes/photoRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use(cors());

// increase request size for images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api", photoRoutes);
app.use("/api/auth",authRoutes);
app.use("/api",profileRoutes);

app.listen(process.env.PORT, () => {
console.log("Server running on port 5000");
});