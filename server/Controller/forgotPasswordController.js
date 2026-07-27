const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../Model/userModel");
const sendEmail = require("../Utils/sendEmail");

// ======================================
// HELPERS
// ======================================

const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const hashOtp = (otp) => {
  return crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");
};

const maskEmail = (email) => {
  const [name, domain] = email.split("@");

  if (!name || !domain) {
    return email;
  }

  const visible =
    name.length <= 2
      ? name.charAt(0)
      : name.slice(0, 2);

  return `${visible}${"*".repeat(
    Math.max(name.length - visible.length, 3)
  )}@${domain}`;
};

const clearResetData = async (user) => {
  user.resetPasswordOtp = null;
  user.resetPasswordOtpExpires = null;
  user.resetPasswordOtpAttempts = 0;
  user.resetPasswordLastOtpSentAt = null;
  user.resetPasswordVerified = false;
  user.resetPasswordVerifiedExpires = null;

  await user.save();
};

// ======================================
// 1. REQUEST FORGOT PASSWORD OTP
// ======================================

const requestForgotPasswordOtp = async (
  req,
  res
) => {
  try {
    const { email, role } = req.body;

    // ----------------------------------
    // Validation
    // ----------------------------------

    if (!email || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Email and Login Type are required",
      });
    }

    if (
      !["admin", "manager"].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Login Type",
      });
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    // ----------------------------------
    // Find User
    // ----------------------------------

    const user = await User.findOne({
      email: normalizedEmail,
    }).select(
      "+resetPasswordOtp " +
        "+resetPasswordOtpExpires " +
        "+resetPasswordOtpAttempts " +
        "+resetPasswordLastOtpSentAt " +
        "+resetPasswordVerified " +
        "+resetPasswordVerifiedExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "No account found with this email",
      });
    }

    // ----------------------------------
    // Role Check
    // ----------------------------------

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message:
          role === "admin"
            ? "This email is not registered as an Admin"
            : "This email is not registered as a Manager",
      });
    }

    // ----------------------------------
    // Account Status
    // ----------------------------------

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message:
          "This account is inactive",
      });
    }

    // ----------------------------------
    // Cooldown
    // ----------------------------------

    const now = Date.now();

    if (
      user.resetPasswordLastOtpSentAt &&
      now -
        new Date(
          user.resetPasswordLastOtpSentAt
        ).getTime() <
        60 * 1000
    ) {
      const remainingSeconds = Math.ceil(
        (60 * 1000 -
          (now -
            new Date(
              user.resetPasswordLastOtpSentAt
            ).getTime())) /
          1000
      );

      return res.status(429).json({
        success: false,
        message: `Please wait ${remainingSeconds} seconds before requesting another OTP`,
      });
    }

    // ----------------------------------
    // Generate OTP
    // ----------------------------------

    const otp = generateOtp();

    const otpHash = hashOtp(otp);

    const expireMinutes = Number(
      process.env.OTP_EXPIRE_MINUTES || 5
    );

    user.resetPasswordOtp = otpHash;

    user.resetPasswordOtpExpires =
      new Date(
        Date.now() +
          expireMinutes * 60 * 1000
      );

    user.resetPasswordOtpAttempts = 0;

    user.resetPasswordLastOtpSentAt =
      new Date();

    user.resetPasswordVerified = false;

    user.resetPasswordVerifiedExpires =
      null;

    await user.save();

    // ----------------------------------
    // Send Email
    // ----------------------------------

    try {
      await sendEmail({
        to: user.email,
        subject:
          "M.R.K TRADERS - Password Reset OTP",

        text: `
Hello ${user.name},

We received a request to reset your M.R.K TRADERS ERP password.

Your verification code is:

${otp}

This code will expire in ${expireMinutes} minutes.

If you did not request a password reset, please ignore this email.

M.R.K TRADERS
        `,
      });
    } catch (emailError) {
      console.error(
        "RESET OTP EMAIL ERROR:",
        emailError.message
      );

      // Email fail হলে OTP invalidate
      user.resetPasswordOtp = null;
      user.resetPasswordOtpExpires = null;
      user.resetPasswordOtpAttempts = 0;
      user.resetPasswordLastOtpSentAt =
        null;

      await user.save();

      return res.status(500).json({
        success: false,
        message:
          "Unable to send password reset OTP. Please try again.",
      });
    }

    // ----------------------------------
    // Success
    // ----------------------------------

    return res.status(200).json({
      success: true,
      otpRequired: true,

      message:
        "Password reset OTP sent successfully",

      email: maskEmail(user.email),

      otpExpiresIn:
        expireMinutes * 60,
    });
  } catch (error) {
    console.error(
      "FORGOT PASSWORD OTP ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to process password reset request",
    });
  }
};

// ======================================
// 2. VERIFY FORGOT PASSWORD OTP
// ======================================

const verifyForgotPasswordOtp = async (
  req,
  res
) => {
  try {
    const { email, otp, role } = req.body;

    // ----------------------------------
    // Validation
    // ----------------------------------

    if (!email || !otp || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Email, OTP and Login Type are required",
      });
    }

    if (
      !["admin", "manager"].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Login Type",
      });
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    // ----------------------------------
    // Find User
    // ----------------------------------

    const user = await User.findOne({
      email: normalizedEmail,
    }).select(
      "+resetPasswordOtp " +
        "+resetPasswordOtpExpires " +
        "+resetPasswordOtpAttempts " +
        "+resetPasswordLastOtpSentAt " +
        "+resetPasswordVerified " +
        "+resetPasswordVerifiedExpires"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid password reset request",
      });
    }

    // ----------------------------------
    // Role Check
    // ----------------------------------

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message:
          "Account type does not match",
      });
    }

    // ----------------------------------
    // Status Check
    // ----------------------------------

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message:
          "This account is inactive",
      });
    }

    // ----------------------------------
    // Active OTP Check
    // ----------------------------------

    if (
      !user.resetPasswordOtp ||
      !user.resetPasswordOtpExpires
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No active password reset OTP found",
      });
    }

    // ----------------------------------
    // Expiry
    // ----------------------------------

    if (
      new Date(
        user.resetPasswordOtpExpires
      ).getTime() < Date.now()
    ) {
      await clearResetData(user);

      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    // ----------------------------------
    // Attempts Limit
    // ----------------------------------

    if (
      (user.resetPasswordOtpAttempts ||
        0) >= 5
    ) {
      await clearResetData(user);

      return res.status(429).json({
        success: false,
        message:
          "Too many incorrect OTP attempts. Please request a new OTP.",
      });
    }

    // ----------------------------------
    // Verify OTP
    // ----------------------------------

    const submittedOtpHash = hashOtp(
      String(otp).trim()
    );

    if (
      submittedOtpHash !==
      user.resetPasswordOtp
    ) {
      user.resetPasswordOtpAttempts =
        (user.resetPasswordOtpAttempts ||
          0) + 1;

      await user.save();

      const remainingAttempts =
        5 -
        user.resetPasswordOtpAttempts;

      return res.status(400).json({
        success: false,

        message:
          remainingAttempts > 0
            ? `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`
            : "Invalid OTP. Please request a new OTP.",
      });
    }

    // ----------------------------------
    // OTP Verified
    // ----------------------------------

    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;
    user.resetPasswordOtpAttempts = 0;
    user.resetPasswordLastOtpSentAt =
      null;

    user.resetPasswordVerified = true;

    // Reset password করার জন্য
    // 10 minutes permission
    user.resetPasswordVerifiedExpires =
      new Date(
        Date.now() + 10 * 60 * 1000
      );

    await user.save();

    return res.status(200).json({
      success: true,

      resetAllowed: true,

      message:
        "OTP verified successfully. You can now create a new password.",

      resetExpiresIn: 600,
    });
  } catch (error) {
    console.error(
      "VERIFY RESET OTP ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "OTP verification failed",
    });
  }
};

// ======================================
// 3. RESET PASSWORD
// ======================================

const resetPassword = async (req, res) => {
  try {
    const {
      email,
      role,
      newPassword,
      confirmPassword,
    } = req.body;

    // ----------------------------------
    // Validation
    // ----------------------------------

    if (
      !email ||
      !role ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required",
      });
    }

    if (
      !["admin", "manager"].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Login Type",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    if (
      newPassword !== confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    // ----------------------------------
    // Find User
    // ----------------------------------

    const user = await User.findOne({
      email: normalizedEmail,
    }).select(
      "+resetPasswordOtp " +
        "+resetPasswordOtpExpires " +
        "+resetPasswordOtpAttempts " +
        "+resetPasswordLastOtpSentAt " +
        "+resetPasswordVerified " +
        "+resetPasswordVerifiedExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // ----------------------------------
    // Role Check
    // ----------------------------------

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message:
          "Account type does not match",
      });
    }

    // ----------------------------------
    // Status
    // ----------------------------------

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message:
          "This account is inactive",
      });
    }

    // ----------------------------------
    // OTP Verification Permission Check
    // ----------------------------------

    if (
      !user.resetPasswordVerified ||
      !user.resetPasswordVerifiedExpires
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your OTP first",
      });
    }

    // ----------------------------------
    // Reset Permission Expired
    // ----------------------------------

    if (
      new Date(
        user.resetPasswordVerifiedExpires
      ).getTime() < Date.now()
    ) {
      await clearResetData(user);

      return res.status(403).json({
        success: false,
        message:
          "Password reset session expired. Please start again.",
      });
    }

    // ----------------------------------
    // Hash New Password
    // ----------------------------------

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password = hashedPassword;

    // ----------------------------------
    // Clear Reset Data
    // ----------------------------------

    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;
    user.resetPasswordOtpAttempts = 0;
    user.resetPasswordLastOtpSentAt =
      null;
    user.resetPasswordVerified = false;
    user.resetPasswordVerifiedExpires =
      null;

    // Login OTP-ও clear
    user.otp = null;
    user.otpExpires = null;
    user.otpAttempts = 0;
    user.lastOtpSentAt = null;

    await user.save();

    // ----------------------------------
    // Success
    // ----------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. Please login with your new password.",
    });
  } catch (error) {
    console.error(
      "RESET PASSWORD ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to reset password",
    });
  }
};

module.exports = {
  requestForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
};