const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.DB_TYPE === "atlas"
        ? process.env.MONGO_URI_ATLAS
        : process.env.MONGO_URI_LOCAL;

    await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected (${process.env.DB_TYPE})`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;