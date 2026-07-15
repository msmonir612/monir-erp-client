const express = require("express");
const router = express.Router();

const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../Controller/supplierController");

const {
  protect,
  adminOnly,
  managerOrAdmin,
} = require("../Middleware/authMiddleware");

// ================================
// Supplier Routes
// ================================

// Get All Suppliers
router.get("/", protect, managerOrAdmin, getSuppliers);

// Get Single Supplier
router.get("/:id", protect, managerOrAdmin, getSupplier);

// Create Supplier
router.post("/", protect, managerOrAdmin, createSupplier);

// Update Supplier
router.put("/:id", protect, managerOrAdmin, updateSupplier);

// Delete Supplier (Admin Only)
router.delete("/:id", protect, adminOnly, deleteSupplier);

module.exports = router;