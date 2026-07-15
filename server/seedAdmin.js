const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const User = require("./Model/userModel");

dotenv.config();

connectDB();

const seedAdmin = async () => {
  try {
    // আগে থেকে Admin থাকলে আর তৈরি করবে না
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log("✅ Admin already exists.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      name: "Monir",
      email: "admin@gmail.com",
      phone: "01700000000",
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

    console.log("🎉 Admin Created Successfully!");
    console.log("================================");
    console.log("Email    : admin@gmail.com");
    console.log("Password : 123456");
    console.log("================================");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();