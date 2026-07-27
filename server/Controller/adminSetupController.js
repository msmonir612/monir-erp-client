const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../Model/userModel");
const PendingAdminSetup = require(
  "../Model/pendingAdminSetupModel"
);

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

const maskEmail = (email = "") => {
  const [name, domain] = email.split("@");

  if (!name || !domain) return email;

  const visiblePart =
    name.length <= 2
      ? name.charAt(0)
      : name.slice(0, 2);

  return `${visiblePart}${"*".repeat(
    Math.max(name.length - visiblePart.length, 3)
  )}@${domain}`;
};

// ======================================
// CHECK FIRST ADMIN SETUP STATUS
// ======================================

const getAdminSetupStatus = async (req, res) => {
  try {
    const adminExists = await User.exists({
      role: "admin",
    });

    return res.status(200).json({
      success: true,
      setupRequired: !adminExists,
    });
  } catch (error) {
    console.error(
      "ADMIN SETUP STATUS ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to check admin setup status",
    });
  }
};

// ======================================
// REQUEST FIRST ADMIN OTP
// ======================================

const requestAdminSetupOtp = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
    } = req.body;

    // ----------------------------------
    // Check if an Admin already exists
    // ----------------------------------

    const adminExists = await User.exists({
      role: "admin",
    });

    if (adminExists) {
      return res.status(403).json({
        success: false,
        message:
          "Admin account already exists. First Admin setup is disabled.",
      });
    }

    // ----------------------------------
    // Validation
    // ----------------------------------

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
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

    const normalizedPhone = phone.trim();

    // ----------------------------------
    // Check existing User email / phone
    // ----------------------------------

    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Email or phone number is already registered",
      });
    }

    // ----------------------------------
    // Resend Protection
    // ----------------------------------

    const existingPending =
      await PendingAdminSetup.findOne({
        $or: [
          { email: normalizedEmail },
          { phone: normalizedPhone },
        ],
      });

    if (
      existingPending &&
      existingPending.lastOtpSentAt
    ) {
      const secondsPassed =
        (Date.now() -
          new Date(
            existingPending.lastOtpSentAt
          ).getTime()) /
        1000;

      if (secondsPassed < 60) {
        return res.status(429).json({
          success: false,
          otpRequired: true,
          message: `OTP already sent. Please wait ${Math.ceil(
            60 - secondsPassed
          )} seconds.`,
          email: maskEmail(normalizedEmail),
        });
      }
    }

    // ----------------------------------
    // Generate OTP
    // ----------------------------------

    const otp = generateOtp();

    const otpHash = hashOtp(otp);

    const expiryMinutes =
      Number(process.env.OTP_EXPIRE_MINUTES) || 5;

    const otpExpires = new Date(
      Date.now() +
        expiryMinutes * 60 * 1000
    );

    // Hash Admin password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Remove previous pending setup
    await PendingAdminSetup.deleteMany({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
      ],
    });

    // Save temporary registration
    const pendingAdmin =
      await PendingAdminSetup.create({
        name: name.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        password: hashedPassword,
        otp: otpHash,
        otpExpires,
        otpAttempts: 0,
        lastOtpSentAt: new Date(),
      });

    // ----------------------------------
    // Send Email OTP
    // ----------------------------------

    try {
      await sendEmail({
        to: normalizedEmail,

        subject:
          "M.R.K TRADERS - Admin Account Verification",

        text: `Your M.R.K TRADERS Admin verification OTP is ${otp}. It will expire in ${expiryMinutes} minutes.`,

        html: `
          <div style="
            max-width:520px;
            margin:20px auto;
            font-family:Arial,Helvetica,sans-serif;
            border:1px solid #e5e7eb;
            border-radius:18px;
            overflow:hidden;
            background:#ffffff;
          ">

            <div style="
              background:#15803d;
              padding:26px;
              color:#ffffff;
              text-align:center;
            ">
              <h2 style="margin:0;">
                M.R.K TRADERS
              </h2>

              <p style="margin:8px 0 0;">
                Admin Account Verification
              </p>
            </div>

            <div style="
              padding:32px;
              text-align:center;
            ">

              <p style="
                font-size:16px;
                color:#374151;
              ">
                Hello <strong>${name.trim()}</strong>,
              </p>

              <p style="
                color:#4b5563;
                line-height:1.6;
              ">
                Use the verification code below
                to create your Admin account.
              </p>

              <div style="
                display:inline-block;
                margin:24px auto;
                padding:18px 26px;
                background:#f0fdf4;
                border:2px dashed #15803d;
                border-radius:14px;
                color:#15803d;
                font-size:36px;
                font-weight:bold;
                letter-spacing:8px;
              ">
                ${otp}
              </div>

              <p style="
                color:#6b7280;
                font-size:14px;
              ">
                This OTP expires in
                <strong>${expiryMinutes} minutes</strong>.
              </p>

              <p style="
                color:#9ca3af;
                font-size:12px;
                margin-top:25px;
              ">
                Never share this OTP with anyone.
              </p>

            </div>
          </div>
        `,
      });
    } catch (emailError) {
      // Remove pending record if email failed
      await PendingAdminSetup.findByIdAndDelete(
        pendingAdmin._id
      );

      console.error(
        "ADMIN SETUP EMAIL ERROR:",
        emailError.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to send verification email. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      otpRequired: true,

      message:
        "Verification OTP has been sent to your email.",

      email: maskEmail(normalizedEmail),

      otpExpiresIn:
        expiryMinutes * 60,
    });
  } catch (error) {
    console.error(
      "REQUEST ADMIN SETUP OTP ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to start Admin account setup",
    });
  }
};

// ======================================
// VERIFY FIRST ADMIN OTP
// CREATE REAL ADMIN ACCOUNT
// ======================================

const verifyAdminSetupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Another Admin must not already exist
    const adminExists = await User.exists({
      role: "admin",
    });

    if (adminExists) {
      return res.status(403).json({
        success: false,
        message:
          "Admin account already exists. Setup is disabled.",
      });
    }

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message:
          "Email and verification OTP are required",
      });
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const pendingAdmin =
      await PendingAdminSetup.findOne({
        email: normalizedEmail,
      });

    if (!pendingAdmin) {
      return res.status(400).json({
        success: false,
        message:
          "No pending Admin setup found. Please start again.",
      });
    }

    // ----------------------------------
    // OTP Expiry
    // ----------------------------------

    if (
      !pendingAdmin.otpExpires ||
      pendingAdmin.otpExpires.getTime() <
        Date.now()
    ) {
      await PendingAdminSetup.findByIdAndDelete(
        pendingAdmin._id
      );

      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please start Admin setup again.",
      });
    }

    // ----------------------------------
    // OTP Attempts
    // ----------------------------------

    if (
      (pendingAdmin.otpAttempts || 0) >= 5
    ) {
      await PendingAdminSetup.findByIdAndDelete(
        pendingAdmin._id
      );

      return res.status(429).json({
        success: false,
        message:
          "Too many incorrect OTP attempts. Please start again.",
      });
    }

    const submittedOtpHash = hashOtp(
      String(otp).trim()
    );

    if (
      submittedOtpHash !== pendingAdmin.otp
    ) {
      pendingAdmin.otpAttempts += 1;

      await pendingAdmin.save();

      const remainingAttempts =
        5 - pendingAdmin.otpAttempts;

      return res.status(400).json({
        success: false,

        message:
          remainingAttempts > 0
            ? `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`
            : "Invalid OTP. Please start again.",
      });
    }

    // ----------------------------------
    // Re-check email/phone before create
    // ----------------------------------

    const duplicateUser = await User.findOne({
      $or: [
        { email: pendingAdmin.email },
        { phone: pendingAdmin.phone },
      ],
    });

    if (duplicateUser) {
      return res.status(400).json({
        success: false,
        message:
          "Email or phone number is already registered",
      });
    }

    // ----------------------------------
    // CREATE REAL ADMIN
    // ----------------------------------

    const admin = await User.create({
      name: pendingAdmin.name,
      email: pendingAdmin.email,
      phone: pendingAdmin.phone,

      // Already hashed
      password: pendingAdmin.password,

      role: "admin",
      status: "active",
    });

    // Delete temporary setup
    await PendingAdminSetup.deleteMany({});

    return res.status(201).json({
      success: true,

      message:
        "Admin Account Created Successfully. Please login.",

      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(
      "VERIFY ADMIN SETUP OTP ERROR:",
      error.message
    );

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Email or phone number is already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to create Admin account",
    });
  }
};

module.exports = {
  getAdminSetupStatus,
  requestAdminSetupOtp,
  verifyAdminSetupOtp,
};