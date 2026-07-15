const mongoose = require("mongoose");

// ======================================
// Sale Item Schema
// ======================================

const saleItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // Selling Price
    salePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // Average Purchase Price
    purchasePrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Quantity × Sale Price
    total: {
      type: Number,
      required: true,
      min: 0,
    },

    // Profit of this item
    profit: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

// ======================================
// Sale Schema
// ======================================

const saleSchema = new mongoose.Schema(
  {
    // Invoice
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Customer
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    // Sale Date
    saleDate: {
      type: Date,
      default: Date.now,
    },

    // Product List
    items: [saleItemSchema],

    // Totals
    subTotal: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    vat: {
      type: Number,
      default: 0,
    },

    transportCost: {
      type: Number,
      default: 0,
    },

    grandTotal: {
      type: Number,
      default: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    dueAmount: {
      type: Number,
      default: 0,
    },

    totalProfit: {
      type: Number,
      default: 0,
    },

    paymentType: {
      type: String,
      enum: ["Cash", "Due"],
      default: "Cash",
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Completed", "Cancelled"],
      default: "Completed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sale", saleSchema);