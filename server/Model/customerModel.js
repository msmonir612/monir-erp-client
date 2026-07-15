const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    previousDue: {
      type: Number,
      default: 0,
    },

    currentDue: {
      type: Number,
      default: 0,
    },

    totalPurchaseAmount: {
      type: Number,
      default: 0,
    },

    totalPaidAmount: {
      type: Number,
      default: 0,
    },

    lastPurchaseDate: {
      type: Date,
      default: null,
    },

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

module.exports = mongoose.model("Customer", customerSchema);