const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../Model/userModel");
const generateToken = require("../Utils/generateToken");
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
    .update(otp)
    .digest("hex");
};

const maskEmail = (email = "") => {
  const [name, domain] = email.split("@");

  if (!name || !domain) return email;

  const visible =
    name.length <= 2
      ? name[0]
      : `${name.slice(0, 2)}${"*".repeat(
          Math.max(name.length - 2, 3)
        )}`;

  return `${visible}@${domain}`;
};

// ======================================
// LOGIN
// STEP 1: EMAIL + PASSWORD → SEND OTP
// ======================================

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
      if (!email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: "Email, Password and Login Type are required",
        });
      }

      if (!["admin", "manager"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Login Type",
        });
      }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    // Need lastOtpSentAt because it is select:false
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+lastOtpSentAt");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // ======================================
// LOGIN ROLE CHECK
// ======================================

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message:
          role === "admin"
            ? "This account is not an Admin account"
            : "This account is not a Manager account",
      });
    }
    // Account Status
    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    // Password Check
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // ----------------------------------
    // Resend protection: 60 seconds
    // ----------------------------------

    if (user.lastOtpSentAt) {
      const secondsPassed =
        (Date.now() -
          new Date(user.lastOtpSentAt).getTime()) /
        1000;

      if (secondsPassed < 60) {
        return res.status(429).json({
          success: false,
          otpRequired: true,
          message: `OTP already sent. Please wait ${Math.ceil(
            60 - secondsPassed
          )} seconds.`,
          email: maskEmail(user.email),
        });
      }
    }

    // Generate OTP
    const otp = generateOtp();

    // Hash OTP before storing
    const otpHash = hashOtp(otp);

    const expiryMinutes =
      Number(process.env.OTP_EXPIRE_MINUTES) || 5;

    const otpExpires = new Date(
      Date.now() +
        expiryMinutes * 60 * 1000
    );

    // Save OTP information
    user.otp = otpHash;
    user.otpExpires = otpExpires;
    user.otpAttempts = 0;
    user.lastOtpSentAt = new Date();

    await user.save();

    // Send OTP Email
    await sendEmail({
      to: user.email,

      subject:
        "M.R.K TRADERS ERP - Login Verification Code",

      text: `Your M.R.K TRADERS ERP login OTP is ${otp}. It will expire in ${expiryMinutes} minutes.`,

      html: `
        <div style="
          max-width: 520px;
          margin: 20px auto;
          font-family: Arial, Helvetica, sans-serif;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          overflow: hidden;
          background: #ffffff;
        ">

          <div style="
            background: #15803d;
            color: #ffffff;
            padding: 25px;
            text-align: center;
          ">
            <h2 style="margin:0;">
              M.R.K TRADERS
            </h2>

            <p style="margin:8px 0 0;">
              ERP Security Verification
            </p>
          </div>

          <div style="
            padding: 32px;
            text-align:center;
          ">

            <p style="
              color:#374151;
              font-size:16px;
            ">
              Hello <strong>${user.name}</strong>,
            </p>

            <p style="
              color:#4b5563;
              line-height:1.6;
            ">
              Use the verification code below to complete
              your login.
            </p>

            <div style="
              margin:25px auto;
              display:inline-block;
              background:#f0fdf4;
              border:2px dashed #15803d;
              color:#15803d;
              font-size:36px;
              font-weight:bold;
              letter-spacing:8px;
              padding:18px 25px;
              border-radius:14px;
            ">
              ${otp}
            </div>

            <p style="
              color:#6b7280;
              font-size:14px;
            ">
              This OTP will expire in
              <strong>${expiryMinutes} minutes</strong>.
            </p>

            <p style="
              color:#9ca3af;
              font-size:12px;
              margin-top:25px;
            ">
              If you did not attempt to login,
              please do not share this OTP with anyone.
            </p>

          </div>

        </div>
      `,
    });

    return res.status(200).json({
      success: true,

      otpRequired: true,

      message:
        "Password verified. OTP has been sent to your email.",

      email: maskEmail(user.email),

      otpExpiresIn:
        expiryMinutes * 60,
    });
  } catch (error) {
    console.error(
      "LOGIN OTP ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to send login OTP. Please try again.",
    });
  }
};

// ======================================
// VERIFY LOGIN OTP
// STEP 2: OTP + ROLE → JWT TOKEN
// ======================================

const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp, role } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!email || !otp || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Email, OTP and Login Type are required",
      });
    }

    // Valid role check
    if (!["admin", "manager"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Login Type",
      });
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    // ======================================
    // FIND USER
    // OTP fields are select:false
    // ======================================

    const user = await User.findOne({
      email: normalizedEmail,
    }).select(
      "+otp +otpExpires +otpAttempts +lastOtpSentAt"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid verification request",
      });
    }

    // ======================================
    // ROLE CHECK
    // ======================================

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message:
          role === "admin"
            ? "This account is not an Admin account"
            : "This account is not a Manager account",
      });
    }

    // ======================================
    // ACCOUNT STATUS
    // ======================================

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    // ======================================
    // CHECK ACTIVE OTP
    // ======================================

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message:
          "No active OTP found. Please login again.",
      });
    }

    // ======================================
    // OTP EXPIRED
    // ======================================

    if (
      new Date(user.otpExpires).getTime() <
      Date.now()
    ) {
      user.otp = null;
      user.otpExpires = null;
      user.otpAttempts = 0;
      user.lastOtpSentAt = null;

      await user.save();

      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please login again.",
      });
    }

    // ======================================
    // ATTEMPTS LIMIT
    // ======================================

    if ((user.otpAttempts || 0) >= 5) {
      user.otp = null;
      user.otpExpires = null;
      user.otpAttempts = 0;
      user.lastOtpSentAt = null;

      await user.save();

      return res.status(429).json({
        success: false,
        message:
          "Too many incorrect OTP attempts. Please login again.",
      });
    }

    // ======================================
    // HASH SUBMITTED OTP
    // ======================================

    const submittedOtpHash = hashOtp(
      String(otp).trim()
    );

    // ======================================
    // INCORRECT OTP
    // ======================================

    if (submittedOtpHash !== user.otp) {
      user.otpAttempts =
        (user.otpAttempts || 0) + 1;

      await user.save();

      const remainingAttempts =
        5 - user.otpAttempts;

      return res.status(400).json({
        success: false,

        message:
          remainingAttempts > 0
            ? `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`
            : "Invalid OTP. Please login again.",
      });
    }

    // ======================================
    // OTP VERIFIED
    // ======================================

    user.otp = null;
    user.otpExpires = null;
    user.otpAttempts = 0;
    user.lastOtpSentAt = null;

    await user.save();

    // ======================================
    // GENERATE JWT
    // ======================================

    const token = generateToken(
      user._id,
      user.role
    );

    // ======================================
    // SUCCESS RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error(
      "VERIFY OTP ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "OTP verification failed. Please try again.",
    });
  }
};
// ======================================
// CREATE MANAGER
// ADMIN ONLY
// ======================================

const createManager = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const normalizedPhone =
      phone.trim();

    const exist = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
      ],
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message:
          "Email or Phone already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const manager = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      role: "manager",
      status: "active",
    });

    return res.status(201).json({
      success: true,
      message:
        "Manager Created Successfully",

      manager: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        phone: manager.phone,
        role: manager.role,
        status: manager.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET PROFILE
// ======================================

const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,

      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        status: req.user.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// CHANGE PASSWORD
// ======================================

const changePassword = async (
  req,
  res
) => {
  try {
    const {
      oldPassword,
      newPassword,
    } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Old password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Old Password is incorrect",
      });
    }

    const samePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from old password",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    // Invalidate any outstanding OTP
    user.otp = null;
    user.otpExpires = null;
    user.otpAttempts = 0;
    user.lastOtpSentAt = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password Changed Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET ALL MANAGERS
// ======================================

const getManagers = async (
  req,
  res
) => {
  try {
    const managers = await User.find({
      role: "manager",
    }).select(
      "-password -otp -otpExpires -otpAttempts -lastOtpSentAt"
    );

    return res.status(200).json(
      managers
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// DELETE MANAGER
// ======================================

const deleteManager = async (
  req,
  res
) => {
  try {
    const manager =
      await User.findOne({
        _id: req.params.id,
        role: "manager",
      });

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: "Manager not found",
      });
    }

    await manager.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Manager Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// EXPORTS
// ======================================

module.exports = {
  login,
  verifyLoginOtp,
  createManager,
  getProfile,
  changePassword,
  getManagers,
  deleteManager,
};