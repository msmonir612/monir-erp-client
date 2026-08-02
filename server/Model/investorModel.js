const mongoose = require("mongoose");

const investorSchema = new mongoose.Schema(
  {
    investorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Investor name is required"],
      trim: true,
      maxlength: [
        100,
        "Investor name cannot exceed 100 characters",
      ],
    },

    email: {
      type: String,
      required: [true, "Investor email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
      default: "",
      maxlength: [
        500,
        "Address cannot exceed 500 characters",
      ],
    },

    nidNumber: {
      type: String,
      trim: true,
      default: "",
    },

    // ======================================
    // INVESTOR PHOTO
    // Actual upload system will save URL/path
    // ======================================

    photoUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // ======================================
    // BANK INFORMATION
    // ======================================

    bankInfo: {
      bankName: {
        type: String,
        trim: true,
        default: "",
      },

      accountName: {
        type: String,
        trim: true,
        default: "",
      },

      accountNumber: {
        type: String,
        trim: true,
        default: "",
      },

      branchName: {
        type: String,
        trim: true,
        default: "",
      },

      routingNumber: {
        type: String,
        trim: true,
        default: "",
      },
    },

    // ======================================
    // MOBILE BANKING INFORMATION
    // ======================================

    mobileBanking: {
      provider: {
        type: String,
        enum: [
          "",
          "bkash",
          "nagad",
          "rocket",
          "upay",
          "other",
        ],
        default: "",
      },

      accountNumber: {
        type: String,
        trim: true,
        default: "",
      },

      accountType: {
        type: String,
        enum: [
          "",
          "personal",
          "merchant",
          "agent",
        ],
        default: "",
      },
    },

    // ======================================
    // PREFERRED PROFIT PAYMENT
    // ======================================

    preferredProfitPaymentMethod: {
      type: String,
      enum: [
        "cash",
        "bank",
        "mobile_banking",
      ],
      default: "bank",
    },

    // ======================================
    // AGREEMENT DOCUMENT
    // Actual upload system will save URL/path
    // ======================================

    agreementUrl: {
      type: String,
      trim: true,
      default: "",
    },

    agreementFileName: {
      type: String,
      trim: true,
      default: "",
    },

    agreementUploadedAt: {
      type: Date,
      default: null,
    },

    // ======================================
    // NOMINEE INFORMATION
    // ======================================

    nomineeName: {
      type: String,
      trim: true,
      default: "",
    },

    nomineePhone: {
      type: String,
      trim: true,
      default: "",
    },

    nomineeRelation: {
      type: String,
      trim: true,
      default: "",
    },

    // ======================================
    // NOTIFICATION AND STATUS
    // ======================================

    emailNotificationEnabled: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
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

// ======================================
// SEARCH INDEX
// ======================================

investorSchema.index({
  name: "text",
  email: "text",
  phone: "text",
  investorId: "text",
  nidNumber: "text",
});

// ======================================
// SAFE MODEL EXPORT
// ======================================

module.exports =
  mongoose.models.Investor ||
  mongoose.model(
    "Investor",
    investorSchema
  );