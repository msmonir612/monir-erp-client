const express = require("express");

const router = express.Router();

const {
  login,
  createManager,
  getProfile,
  changePassword,
  getManagers,
  deleteManager,
} = require("../Controller/userController");


const {protect,adminOnly} = require("../Middleware/authMiddleware");

// ========================
// Public Route
// ========================

// Login
router.post("/login", login);

// ========================
// Protected Route
// ========================

// নিজের Profile
router.get("/profile", protect, getProfile);

// Password Change
router.put("/change-password", protect, changePassword);

// ========================
// Admin Only
// ========================

// Manager Create
router.post("/manager", protect, adminOnly, createManager);

// All Managers
router.get("/managers", protect, adminOnly, getManagers);

// Delete Manager
router.delete("/managers/:id", protect, adminOnly, deleteManager);

module.exports = router;