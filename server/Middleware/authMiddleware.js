const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

// ======================================
// Protect Route (Login Required)
// ======================================
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No Token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find User
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

// ======================================
// Admin Only
// ======================================
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  next();
};

// ======================================
// Manager or Admin
// ======================================
const managerOrAdmin = (req, res, next) => {
  if (
    !req.user ||
    (req.user.role !== "admin" && req.user.role !== "manager")
  ) {
    return res.status(403).json({
      success: false,
      message: "Access denied.",
    });
  }

  next();
};

module.exports = {
  protect,
  adminOnly,
  managerOrAdmin,
};