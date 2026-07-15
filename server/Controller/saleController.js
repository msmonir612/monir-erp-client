const Sale = require("../Model/saleModel");
const Product = require("../Model/productModel");
const Customer = require("../Model/customerModel");

// ======================================
// Get All Sales
// ======================================

const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("customer", "name phone")
      .populate("items.product", "productName productCode")
      .sort({ createdAt: -1 });

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// Get Single Sale
// ======================================

const getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("customer")
      .populate("items.product");

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found",
      });
    }

    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// Create Sale
// ======================================

const createSale = async (req, res) => {
  try {
    const {
      invoiceNo,
      customer,
      saleDate,
      items,
      discount,
      vat,
      transportCost,
      paidAmount,
      paymentType,
      note,
    } = req.body;

    let subTotal = 0;
    let totalProfit = 0;

    const saleItems = [];


    // ======================================
    // Product Update
    // ======================================

    for (const item of items) {

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      // ==========================
      // Stock Check
      // ==========================

      if (product.currentStock < item.quantity) {
        return res.status(400).json({
          message: `${product.productName} stock is not available`,
        });
      }

      // ==========================
      // Calculation
      // ==========================

 const purchasePrice = Number(product.averagePurchasePrice) || 0;
const salePrice = Number(item.salePrice) || 0;
const quantity = Number(item.quantity) || 0;

const total = quantity * salePrice;

const profit = (salePrice - purchasePrice) * quantity;

      subTotal += total;

      totalProfit += profit;

      // ==========================
      // Save Item
      // ==========================

      saleItems.push({
        product: item.product,
        quantity: item.quantity,
        salePrice: item.salePrice,
        purchasePrice,
        total,
        profit,
      });

      // ==========================
      // Product Update
      // ==========================

      product.currentStock -= item.quantity;

      product.stockValue =
        Number(
          (
            product.currentStock *
            product.averagePurchasePrice
          ).toFixed(2)
        );

      product.totalSaleQty += item.quantity;

      product.totalSaleValue += total;

      product.totalProfit += profit;

      product.lastSaleDate = saleDate;

      await product.save();
    }

        // ======================================
    // Total Calculation
    // ======================================

    const grandTotal =
      subTotal -
      Number(discount || 0) +
      Number(vat || 0) +
      Number(transportCost || 0);

    const dueAmount =
      grandTotal - Number(paidAmount || 0);

    // ======================================
    // Customer Due Update
    // ======================================

    const customerData =
      await Customer.findById(customer);

    if (!customerData) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    customerData.currentDue += dueAmount;

    await customerData.save();

    // ======================================
    // Save Sale
    // ======================================

    const sale = await Sale.create({
      invoiceNo,
      customer,
      saleDate,
      items: saleItems,
      subTotal,
      discount,
      vat,
      transportCost,
      grandTotal,
      paidAmount,
      dueAmount,
      totalProfit,
      paymentType,
      note,
    });

    res.status(201).json({
      message: "Sale Created Successfully",
      sale,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// Delete Sale
// ======================================

const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found",
      });
    }

    // ======================================
    // Rollback Product Stock
    // ======================================

    for (const item of sale.items) {
      const product = await Product.findById(item.product);

      if (product) {
        // Stock ফেরত
        product.currentStock += item.quantity;

        // Sale Statistics Rollback
        product.totalSaleQty -= item.quantity;
        if (product.totalSaleQty < 0) {
          product.totalSaleQty = 0;
        }

        product.totalSaleValue -= item.total;
        if (product.totalSaleValue < 0) {
          product.totalSaleValue = 0;
        }

        product.totalProfit -= item.profit;
        if (product.totalProfit < 0) {
          product.totalProfit = 0;
        }

        // Stock Value Update
        product.stockValue = Number(
          (
            product.currentStock *
            product.averagePurchasePrice
          ).toFixed(2)
        );
product.status =
  product.currentStock <= 0
    ? "Inactive"
    : "Active";
        await product.save();
      }
    }

    // ======================================
    // Customer Due Rollback
    // ======================================

    const customer = await Customer.findById(sale.customer);

    if (customer) {
      customer.currentDue -= sale.dueAmount;

      if (customer.currentDue < 0) {
        customer.currentDue = 0;
      }

      await customer.save();
    }

    // ======================================
    // Delete Sale
    // ======================================

    await Sale.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Sale Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSales,
  getSale,
  createSale,
  deleteSale,
};