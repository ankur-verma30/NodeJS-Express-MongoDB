const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const app = require("./app"); // ✅ Ensure this correctly imports `app.js`

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connection established"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
