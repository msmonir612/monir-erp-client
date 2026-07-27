const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "manager"],
      default: "manager",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // ======================================
    // LOGIN OTP
    // ======================================

    otp: {
      type: String,
      default: null,
      select: false,
    },

    otpExpires: {
      type: Date,
      default: null,
      select: false,
    },

    otpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    lastOtpSentAt: {
      type: Date,
      default: null,
      select: false,
    },

    // ======================================
    // FORGOT PASSWORD OTP
    // ======================================

    resetPasswordOtp: {
      type: String,
      default: null,
      select: false,
    },

    resetPasswordOtpExpires: {
      type: Date,
      default: null,
      select: false,
    },

    resetPasswordOtpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    resetPasswordLastOtpSentAt: {
      type: Date,
      default: null,
      select: false,
    },

    // OTP verify হওয়ার পরে
    // অল্প সময়ের জন্য password reset করার অনুমতি
    resetPasswordVerified: {
      type: Boolean,
      default: false,
      select: false,
    },

    resetPasswordVerifiedExpires: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);