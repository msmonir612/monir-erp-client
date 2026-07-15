const express = require("express");

const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} = require("../Controller/expenseController");

const {
  protect,
  adminOnly,
  managerOrAdmin,
} = require("../Middleware/authMiddleware");

const router = express.Router();

// ==========================
// Dashboard Summary
// ==========================

router.get("/summary/total", protect, managerOrAdmin, getExpenseSummary);

// ==========================
// Expense CRUD
// ==========================

// Get All Expenses
router.get("/", protect, managerOrAdmin, getExpenses);

// Get Single Expense
router.get("/:id", protect, managerOrAdmin, getExpense);

// Create Expense
router.post("/", protect, managerOrAdmin, createExpense);

// Update Expense
router.put("/:id", protect, managerOrAdmin, updateExpense);

// Delete Expense (Admin Only)
router.delete("/:id", protect, adminOnly, deleteExpense);

module.exports = router;