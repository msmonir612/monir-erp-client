const express = require("express");

const router = express.Router();

const {
  getPurchases,
  getPurchase,
  createPurchase,
  deletePurchase,
} = require("../Controller/purchaseController");

const {
  protect,
  adminOnly,
  managerOrAdmin,
} = require("../Middleware/authMiddleware");

// ===============================
// Purchase Routes
// ===============================

// Get All Purchases
router.get("/", protect, managerOrAdmin, getPurchases);

// Get Single Purchase
router.get("/:id", protect, managerOrAdmin, getPurchase);

// Create Purchase
router.post("/", protect, managerOrAdmin, createPurchase);

// Delete Purchase (Admin Only)
router.delete("/:id", protect, adminOnly, deletePurchase);

module.exports = router;