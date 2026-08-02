const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const stockRoutes = require("./Routes/stockRoutes.js");

const connectDB = require("./config/db");
const dashboardRoutes = require("./Routes/dashboardRoutes");
const userRoutes = require("./Routes/userRoutes");
const purchaseRoutes = require("./Routes/purchaseRoutes");
const productRoutes = require("./Routes/productRoutes");
const supplierRoutes = require("./Routes/supplierRoutes");
const customerRoutes = require("./Routes/customerRoutes");
const saleRoutes = require("./Routes/saleRoutes");
const expenseRoutes = require("./Routes/expenseRoutes.js"); 
const settingsRoutes = require("./Routes/settingsRoutes");
const ownerCashRoutes = require("./Routes/ownerCashRoutes");
const ownerTransactionRoutes = require("./Routes/ownerTransactionRoutes");
const investorRoutes = require("./Routes/investorRoutes");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Home Route
app.get("/", (req, res) => {
  res.send("Server Running");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/owner-cash", ownerCashRoutes);
app.use("/api/owner-transactions",ownerTransactionRoutes);
app.use("/api/investors",investorRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server Running On http://localhost:${PORT}`);
});