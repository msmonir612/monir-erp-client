const mongoose = require("mongoose");

const ownerCashSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
      index: true,
    },

    openingDeposit: {
      type: Number,
      required: true,
      min: [0, "Opening Cash cannot be negative"],
      default: 0,
    },

    ownerDeposit: {
      type: Number,
      min: [0, "Owner Deposit cannot be negative"],
      default: 0,
    },

    ownerWithdrawal: {
      type: Number,
      min: [0, "Owner Withdrawal cannot be negative"],
      default: 0,
    },

    cashSales: {
      type: Number,
      min: [0, "Cash Sales cannot be negative"],
      default: 0,
    },

    cashPurchase: {
      type: Number,
      min: [0, "Cash Purchase cannot be negative"],
      default: 0,
    },

    cashExpense: {
      type: Number,
      min: [0, "Cash Expense cannot be negative"],
      default: 0,
    },

    closingCash: {
      type: Number,
      required: true,
      default: 0,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

ownerCashSchema.index(
  {
    date: 1,
  },
  {
    unique: true,
  }
);

ownerCashSchema.pre("validate", function () {
  const openingCash =
    Number(this.openingDeposit) || 0;

  const ownerDeposit =
    Number(this.ownerDeposit) || 0;

  const cashSales =
    Number(this.cashSales) || 0;

  const cashPurchase =
    Number(this.cashPurchase) || 0;

  const cashExpense =
    Number(this.cashExpense) || 0;

  const ownerWithdrawal =
    Number(this.ownerWithdrawal) || 0;

  this.closingCash =
    openingCash +
    ownerDeposit +
    cashSales -
    cashPurchase -
    cashExpense -
    ownerWithdrawal;
});

module.exports =
  mongoose.models.OwnerCash ||
  mongoose.model(
    "OwnerCash",
    ownerCashSchema
  );