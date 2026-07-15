const express = require("express");
const router = express.Router();

const {
  getAllStock,
  stockSummary,
  lowStockProducts,
  outOfStockProducts,
} = require("../Controller/stockController");

const {
  protect,
  managerOrAdmin,
} = require("../Middleware/authMiddleware");


// ===============================
// Stock Routes
// ===============================


// All Stock
router.get("/", protect, managerOrAdmin, getAllStock);


// Stock Summary
router.get("/summary", protect, managerOrAdmin, stockSummary);


// Low Stock Products
router.get("/low-stock", protect, managerOrAdmin, lowStockProducts);


// Out Of Stock Products
router.get("/out-stock", protect, managerOrAdmin, outOfStockProducts);


module.exports = router;