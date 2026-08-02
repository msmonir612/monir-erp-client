const mongoose = require("mongoose");

const ownerTransactionSchema =
  new mongoose.Schema(
    {
      transactionDate: {
        type: Date,
        required: [true, "Transaction date is required"],
        default: Date.now,
        index: true,
      },

      transactionType: {
        type: String,
        required: [true, "Transaction type is required"],
        enum: {
          values: ["deposit", "withdrawal"],
          message:
            "Transaction type must be deposit or withdrawal",
        },
      },

      paymentMethod: {
        type: String,
        required: [true, "Payment method is required"],
        enum: {
          values: [
            "cash",
            "bank",
            "mobile_banking",
          ],
          message:
            "Payment method must be cash, bank or mobile banking",
        },
      },

      amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0.01, "Amount must be greater than zero"],
      },

      bankName: {
        type: String,
        trim: true,
        default: "",
      },

      mobileBankingName: {
        type: String,
        trim: true,
        enum: {
          values: [
            "",
            "bkash",
            "nagad",
            "rocket",
            "upay",
            "other",
          ],
          message:
            "Invalid mobile banking service",
        },
        default: "",
      },

      accountNumber: {
        type: String,
        trim: true,
        default: "",
      },

      reference: {
        type: String,
        trim: true,
        default: "",
      },

      note: {
        type: String,
        trim: true,
        maxlength: [
          500,
          "Note cannot exceed 500 characters",
        ],
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

// Faster daily transaction queries
ownerTransactionSchema.index({
  transactionDate: -1,
  paymentMethod: 1,
  transactionType: 1,
});

module.exports = mongoose.model(
  "OwnerTransaction",
  ownerTransactionSchema
);