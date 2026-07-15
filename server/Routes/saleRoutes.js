const express = require("express");

const router = express.Router();

const {
  getSales,
  getSale,
  createSale,
  deleteSale,
} = require("../Controller/saleController");

const {
  protect,
  adminOnly,
  managerOrAdmin,
} = require("../Middleware/authMiddleware");

// ===============================
// Sale Routes
// ===============================

// Get All Sales
router.get("/", protect, managerOrAdmin, getSales);

// Get Single Sale
router.get("/:id", protect, managerOrAdmin, getSale);

// Create Sale
router.post("/", protect, managerOrAdmin, createSale);

// Delete Sale (Admin Only)
router.delete("/:id", protect, adminOnly, deleteSale);

module.exports = router;