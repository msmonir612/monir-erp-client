const express = require("express");

const router = express.Router();

const {
  createOwnerTransaction,
  getOwnerTransactions,
  getOwnerTransactionById,
  getDailyOwnerTransactionSummary,
  updateOwnerTransaction,
  deleteOwnerTransaction,
} = require(
  "../Controller/ownerTransactionController"
);

const {
  protect,
  adminOnly,
  managerOrAdmin,
} = require("../Middleware/authMiddleware");

// ======================================
// ADMIN + MANAGER
// ======================================

// Create Owner Transaction
router.post(
  "/",
  protect,
  managerOrAdmin,
  createOwnerTransaction
);

// Daily Summary
// এটি /:id-এর আগে থাকতে হবে
router.get(
  "/summary/daily",
  protect,
  managerOrAdmin,
  getDailyOwnerTransactionSummary
);

// Get All Transactions
router.get(
  "/",
  protect,
  managerOrAdmin,
  getOwnerTransactions
);

// Get Single Transaction
router.get(
  "/:id",
  protect,
  managerOrAdmin,
  getOwnerTransactionById
);

// ======================================
// ADMIN ONLY
// ======================================

// Update Transaction
router.put(
  "/:id",
  protect,
  adminOnly,
  updateOwnerTransaction
);

// Delete Transaction
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteOwnerTransaction
);

module.exports = router;