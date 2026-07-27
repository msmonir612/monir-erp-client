const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../Model/userModel");
const PendingManager = require("../Model/pendingManagerModel");
const sendEmail = require("../Utils/sendEmail");

const generateOtp = () =>
  crypto.randomInt(100000, 1000000).toString();

const hashOtp = (otp) =>
  crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");

// ======================================
// REQUEST MANAGER OTP
// ADMIN ONLY
// ======================================
const requestManagerOtp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.trim();

    const exists = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
      ],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email or Phone already exists",
      });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    const expiryMinutes =
      Number(process.env.OTP_EXPIRE_MINUTES) || 5;

    const otpExpires = new Date(
      Date.now() + expiryMinutes * 60 * 1000
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    await PendingManager.deleteMany({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
      ],
    });

    await PendingManager.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      otp: otpHash,
      otpExpires,
      otpAttempts: 0,
    });

    await sendEmail({
      to: normalizedEmail,

      subject:
        "M.R.K TRADERS - Manager Account Verification",

      text: `Your Manager account verification OTP is ${otp}. It will expire in ${expiryMinutes} minutes.`,

      html: `
        <div style="max-width:520px;margin:auto;font-family:Arial;border:1px solid #ddd;border-radius:16px;overflow:hidden;">
          <div style="background:#15803d;color:white;padding:25px;text-align:center;">
            <h2>M.R.K TRADERS</h2>
            <p>Manager Account Verification</p>
          </div>

          <div style="padding:30px;text-align:center;">
            <p>Hello <strong>${name}</strong>,</p>

            <p>Your verification code is:</p>

            <div style="
              display:inline-block;
              margin:20px;
              padding:18px 25px;
              font-size:34px;
              font-weight:bold;
              letter-spacing:8px;
              color:#15803d;
              background:#f0fdf4;
              border:2px dashed #15803d;
              border-radius:12px;
            ">
              ${otp}
            </div>

            <p>
              OTP expires in
              <strong>${expiryMinutes} minutes</strong>.
            </p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      otpRequired: true,
      message: "OTP sent to Manager email",
      email: normalizedEmail,
      otpExpiresIn: expiryMinutes * 60,
    });
  } catch (error) {
    console.error("MANAGER OTP ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to send Manager OTP",
    });
  }
};

// ======================================
// VERIFY MANAGER OTP
// ======================================
const verifyManagerOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const pending = await PendingManager.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "No pending Manager verification found",
      });
    }

    if (pending.otpExpires.getTime() < Date.now()) {
      await pending.deleteOne();

      return res.status(400).json({
        success: false,
        message: "OTP expired. Please start again.",
      });
    }

    if (pending.otpAttempts >= 5) {
      await pending.deleteOne();

      return res.status(429).json({
        success: false,
        message: "Too many incorrect OTP attempts",
      });
    }

    const otpHash = hashOtp(otp);

    if (otpHash !== pending.otp) {
      pending.otpAttempts += 1;
      await pending.save();

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${
          5 - pending.otpAttempts
        } attempt(s) remaining.`,
      });
    }

    const manager = await User.create({
      name: pending.name,
      email: pending.email,
      phone: pending.phone,
      password: pending.password,
      role: "manager",
      status: "active",
    });

    await pending.deleteOne();

    return res.status(201).json({
      success: true,
      message: "Manager Account Created Successfully",

      manager: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        phone: manager.phone,
        role: manager.role,
      },
    });
  } catch (error) {
    console.error(
      "VERIFY MANAGER OTP ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Manager verification failed",
    });
  }
};

module.exports = {
  requestManagerOtp,
  verifyManagerOtp,
};