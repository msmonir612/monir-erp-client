const express = require("express");

const router = express.Router();

const {
  createInvestor,
  getInvestors,
  getInvestorById,
  updateInvestor,
  toggleInvestorStatus,
  deleteInvestor,
} = require(
  "../Controller/investorController"
);

const {
  protect,
  adminOnly,
} = require("../Middleware/authMiddleware");

// ======================================
// ALL INVESTOR ROUTES ARE ADMIN ONLY
// ======================================

// Create Investor
router.post(
  "/",
  protect,
  adminOnly,
  createInvestor
);

// Get All Investors
router.get(
  "/",
  protect,
  adminOnly,
  getInvestors
);

// Get Single Investor
router.get(
  "/:id",
  protect,
  adminOnly,
  getInvestorById
);

// Update Investor
router.put(
  "/:id",
  protect,
  adminOnly,
  updateInvestor
);

// Active / Inactive
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  toggleInvestorStatus
);

// Delete Investor
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteInvestor
);

module.exports = router;