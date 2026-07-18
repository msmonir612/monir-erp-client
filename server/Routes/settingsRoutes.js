const express = require("express");
const router = express.Router();

const {
  getSettings,
  updateSettings,
} = require("../Controller/settingsController");

const { protect, adminOnly } = require("../Middleware/authMiddleware");

// Get Company Settings
router.get("/", protect, getSettings);

// Update Company Settings (Admin Only)
router.put("/", protect, adminOnly, updateSettings);

module.exports = router;