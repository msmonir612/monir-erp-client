const express = require("express");

const router = express.Router();

const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../Controller/customerController");

const {
  protect,
  adminOnly,
  managerOrAdmin,
} = require("../Middleware/authMiddleware");

// =========================
// Customer Routes
// =========================

// Get All Customers
router.get("/", protect, managerOrAdmin, getCustomers);

// Get Single Customer
router.get("/:id", protect, managerOrAdmin, getCustomer);

// Create Customer
router.post("/", protect, managerOrAdmin, createCustomer);

// Update Customer
router.put("/:id", protect, managerOrAdmin, updateCustomer);

// Delete Customer (Admin Only)
router.delete("/:id", protect, adminOnly, deleteCustomer);

module.exports = router;