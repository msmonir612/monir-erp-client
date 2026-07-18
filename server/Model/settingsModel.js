const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      default: "M.R.K TRADERS",
    },

    companyLogo: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    currency: {
      type: String,
      default: "BDT",
    },

    invoiceFooter: {
      type: String,
      default: "Thank you for your business.",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);