const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    expenseName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Rent",
        "Salary",
        "Electricity",
        "Gas Bill",
        "Internet",
        "Transport",
        "Marketing",
        "Packaging",
        "Repair",
        "Office Expense",
        "Miscellaneous",
      ],
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank", "Mobile Banking", "Card"],
      default: "Cash",
    },

    referenceNo: {
      type: String,
      default: "",
      trim: true,
    },

    expenseDate: {
      type: Date,
      default: Date.now,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);