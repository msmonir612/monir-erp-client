const Product = require("../Model/productModel");
const Purchase = require("../Model/purchaseModel");
const Sale = require("../Model/saleModel");
const Customer = require("../Model/customerModel");
const Supplier = require("../Model/supplierModel");
const Expense = require("../Model/expenseModel");

// ==========================================
// Dashboard Summary
// ==========================================

const getDashboardSummary = async (req, res) => {
  try {
    // ==========================
    // Today Start & End
    // ==========================

    const today = new Date();

    const start = new Date(today);
    start.setHours(0, 0, 0, 0);

    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    // ==========================
    // Counts
    // ==========================

    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();

    // ==========================
    // Totals
    // ==========================

    const totalPurchase = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$grandTotal" },
        },
      },
    ]);

    const totalSales = await Sale.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$grandTotal" },
        },
      },
    ]);

    const totalProfit = await Sale.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalProfit" },
        },
      },
    ]);

    const totalExpense = await Expense.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const stockValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$stockValue" },
        },
      },
    ]);

    const lowStock = await Product.countDocuments({
      $expr: {
        $lte: ["$currentStock", "$minimumStock"],
      },
    });

    // ==========================
    // Today Sales
    // ==========================

    const todaySales = await Sale.aggregate([
      {
        $match: {
          saleDate: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$grandTotal",
          },
        },
      },
    ]);

    // ==========================
    // Today Purchase
    // ==========================

    const todayPurchase = await Purchase.aggregate([
      {
        $match: {
          purchaseDate: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$grandTotal",
          },
        },
      },
    ]);

    // ==========================
    // Today Expense
    // ==========================

    const todayExpense = await Expense.aggregate([
      {
        $match: {
          expenseDate: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    // ==========================
    // Today Profit
    // ==========================

    const todayProfit = await Sale.aggregate([
      {
        $match: {
          saleDate: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalProfit",
          },
        },
      },
    ]);

    // ==========================
    // Today Loss
    // ==========================

    const todayLoss = await Sale.aggregate([
      {
        $match: {
          saleDate: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalLoss",
          },
        },
      },
    ]);

    // ==========================
    // Net Profit
    // ==========================

    const todaysProfit = todayProfit[0]?.total || 0;
    const todaysExpense = todayExpense[0]?.total || 0;

    const todaysNetProfit = todaysProfit - todaysExpense;

    // ==========================
    // Response
    // ==========================

    res.status(200).json({
      success: true,

      totalProducts,
      totalCustomers,
      totalSuppliers,

      totalPurchase: totalPurchase[0]?.total || 0,
      totalSales: totalSales[0]?.total || 0,
      totalProfit: totalProfit[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,

      stockValue: stockValue[0]?.total || 0,
      lowStock,

      todaysPurchases: todayPurchase[0]?.total || 0,
      todaysSale: todaySales[0]?.total || 0,
      todaysExpense,
      todaysProfit,
      todaysLoss: todayLoss[0]?.total || 0,
      todaysNetProfit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Monthly Sales & Purchase Chart
// ==========================================

const getMonthlyChart = async (req, res) => {
  try {
    const sales = await Sale.aggregate([
      {
        $group: {
          _id: { $month: "$saleDate" },
          total: { $sum: "$grandTotal" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const purchases = await Purchase.aggregate([
      {
        $group: {
          _id: { $month: "$purchaseDate" },
          total: { $sum: "$grandTotal" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = months.map((month, index) => {
      const sale = sales.find((s) => s._id === index + 1);
      const purchase = purchases.find((p) => p._id === index + 1);

      return {
        month,
        sales: sale ? sale.total : 0,
        purchase: purchase ? purchase.total : 0,
      };
    });

    res.status(200).json(chartData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
  getMonthlyChart,
};