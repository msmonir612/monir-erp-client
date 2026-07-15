const Product = require("../Model/productModel");

// ==========================
// Get All Stock
// ==========================
const getAllStock = async (req, res) => {
  try {
    const products = await Product.find().sort({ productName: 1 });

    res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Stock Summary
// ==========================
const stockSummary = async (req, res) => {
  try {
    const products = await Product.find();

    const totalProducts = products.length;

    const totalStock = products.reduce(
      (sum, item) => sum + item.currentStock,
      0
    );

    const totalStockValue = products.reduce(
      (sum, item) => sum + item.stockValue,
      0
    );

    const lowStock = products.filter(
      (item) =>
        item.currentStock > 0 &&
        item.currentStock <= item.minimumStock
    ).length;

    const outOfStock = products.filter(
      (item) => item.currentStock === 0
    ).length;

    res.status(200).json({
      success: true,
      summary: {
        totalProducts,
        totalStock,
        totalStockValue,
        lowStock,
        outOfStock,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Low Stock
// ==========================
const lowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: {
        $and: [
          { $gt: ["$currentStock", 0] },
          { $lte: ["$currentStock", "$minimumStock"] },
        ],
      },
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Out Of Stock
// ==========================
const outOfStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      currentStock: 0,
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllStock,
  stockSummary,
  lowStockProducts,
  outOfStockProducts,
};