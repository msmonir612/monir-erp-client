const express = require("express");

const router = express.Router();

const {
  getOwnerCashAutoSummary,
  createOwnerCash,
  getOwnerCashEntries,
  getOwnerCashById,
  updateOwnerCash,
  deleteOwnerCash,
} = require(
  "../Controller/ownerCashController"
);

const {
  protect,
  adminOnly,
  managerOrAdmin,
} = require("../Middleware/authMiddleware");

// ======================================
// ADMIN + MANAGER
// ======================================

// Automatic Daily Summary
// অবশ্যই "/:id" route-এর আগে থাকবে
router.get(
  "/summary/auto",
  protect,
  managerOrAdmin,
  getOwnerCashAutoSummary
);

// Create Daily Closing
router.post(
  "/",
  protect,
  managerOrAdmin,
  createOwnerCash
);

// Get All Closing Entries
router.get(
  "/",
  protect,
  managerOrAdmin,
  getOwnerCashEntries
);

// Get Single Closing Entry
router.get(
  "/:id",
  protect,
  managerOrAdmin,
  getOwnerCashById
);

// ======================================
// ADMIN ONLY
// ======================================

// Update Daily Closing
router.put(
  "/:id",
  protect,
  adminOnly,
  updateOwnerCash
);

// Delete Daily Closing
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteOwnerCash
);

// খুব গুরুত্বপূর্ণ:
// object হিসেবে export করবেন না
module.exports = router;