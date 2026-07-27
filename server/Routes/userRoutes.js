const express = require("express");

const router = express.Router();

const {
  login,
  verifyLoginOtp,
  createManager,
  getProfile,
  changePassword,
  getManagers,
  deleteManager,
} = require("../Controller/userController");

const {
  requestManagerOtp,
  verifyManagerOtp,
} = require("../Controller/managerSetupController");

const {
  getAdminSetupStatus,
  requestAdminSetupOtp,
  verifyAdminSetupOtp,
} = require("../Controller/adminSetupController");

const {
  requestForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
} = require("../Controller/forgotPasswordController");

const {
  protect,
  adminOnly,
} = require("../Middleware/authMiddleware");

// ======================================
// FIRST ADMIN SETUP - PUBLIC
// ======================================

// Check whether First Admin setup is allowed
router.get(
  "/setup-admin/status",
  getAdminSetupStatus
);

// Step 1:
// Admin information → Send Email OTP
router.post(
  "/setup-admin/request-otp",
  requestAdminSetupOtp
);

// Step 2:
// Verify OTP → Create Admin Account
router.post(
  "/setup-admin/verify-otp",
  verifyAdminSetupOtp
);

// ======================================
// LOGIN - PUBLIC
// ======================================

// Email + Password + Role → Login OTP
router.post(
  "/login",
  login
);

// Verify Login OTP + Role → JWT Token
router.post(
  "/verify-login-otp",
  verifyLoginOtp
);

// ======================================
// FORGOT PASSWORD - PUBLIC
// ======================================

// Step 1:
// Email + Role → Send Password Reset OTP
router.post(
  "/forgot-password/request-otp",
  requestForgotPasswordOtp
);

// Step 2:
// Verify Password Reset OTP
router.post(
  "/forgot-password/verify-otp",
  verifyForgotPasswordOtp
);

// Step 3:
// Set New Password
router.post(
  "/forgot-password/reset",
  resetPassword
);

// ======================================
// PROTECTED ROUTES
// ======================================

// Current Profile
router.get(
  "/profile",
  protect,
  getProfile
);

// Change Password
router.put(
  "/change-password",
  protect,
  changePassword
);

// ======================================
// ADMIN ONLY
// ======================================

// Manager creation OTP
router.post(
  "/manager/request-otp",
  protect,
  adminOnly,
  requestManagerOtp
);

// Verify Manager OTP
router.post(
  "/manager/verify-otp",
  protect,
  adminOnly,
  verifyManagerOtp
);

// All Managers
router.get(
  "/managers",
  protect,
  adminOnly,
  getManagers
);

// Delete Manager
router.delete(
  "/managers/:id",
  protect,
  adminOnly,
  deleteManager
);

module.exports = router;