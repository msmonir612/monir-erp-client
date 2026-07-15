const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../Controller/productController");

const {
  protect,
  adminOnly,
  managerOrAdmin,
} = require("../Middleware/authMiddleware");

// ======================================
// Product Routes
// ======================================

// Get All Products
router.get("/", protect, managerOrAdmin, getProducts);

// Get Single Product
router.get("/:id", protect, managerOrAdmin, getProduct);

// Create Product
router.post("/", protect, managerOrAdmin, createProduct);

// Update Product
router.put("/:id", protect, managerOrAdmin, updateProduct);

// Delete Product (Admin Only)
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;