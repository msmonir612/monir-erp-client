const express = require("express");

const router = express.Router();

const {
  protect,
  managerOrAdmin,
} = require("../Middleware/authMiddleware");

const {
  getDashboardSummary,
  getMonthlyChart,
} = require("../Controller/dashboardController");

// Dashboard Summary
router.get(
  "/summary",
  protect,
  managerOrAdmin,
  getDashboardSummary
);

// Monthly Chart
router.get(
  "/chart",
  protect,
  managerOrAdmin,
  getMonthlyChart
);

module.exports = router;