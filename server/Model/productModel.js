const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // =========================
    // Basic Information
    // =========================

    productCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "",
      trim: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    unit: {
      type: String,
      default: "Pcs",
    },

    description: {
      type: String,
      default: "",
    },

    // =========================
    // Price
    // =========================

    salePrice: {
      type: Number,
      default: 0,
    },

    latestPurchasePrice: {
      type: Number,
      default: 0,
    },

    averagePurchasePrice: {
      type: Number,
      default: 0,
    },

    // =========================
    // Stock
    // =========================

    currentStock: {
      type: Number,
      default: 0,
    },

    minimumStock: {
      type: Number,
      default: 5,
    },

    stockValue: {
      type: Number,
      default: 0,
    },

    // =========================
    // Purchase Statistics
    // =========================

    totalPurchaseQty: {
      type: Number,
      default: 0,
    },

    totalPurchaseValue: {
      type: Number,
      default: 0,
    },

    lastPurchaseDate: {
      type: Date,
      default: null,
    },

    // =========================
    // Sales Statistics
    // =========================

    totalSaleQty: {
      type: Number,
      default: 0,
    },

    totalSaleValue: {
      type: Number,
      default: 0,
    },

    totalProfit: {
      type: Number,
      default: 0,
    },

    lastSaleDate: {
      type: Date,
      default: null,
    },

    // =========================
    // Status
    // =========================

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);