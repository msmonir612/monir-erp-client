const Purchase = require("../Model/purchaseModel");
const Product = require("../Model/productModel");
const Supplier = require("../Model/supplierModel");

// ======================================
// Get All Purchases
// ======================================

const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplier", "name companyName")
      .populate("items.product", "productName productCode")
      .sort({ createdAt: -1 });

    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// Get Single Purchase
// ======================================

const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplier")
      .populate("items.product");

    if (!purchase) {
      return res.status(404).json({
        message: "Purchase not found",
      });
    }

    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// Create Purchase
// ======================================

const createPurchase = async (req, res) => {
  try {
    const {
      invoiceNo,
      supplier,
      purchaseDate,
      items,
      discount,
      transportCost,
      paidAmount,
      paymentType,
      note,
    } = req.body;

    let subTotal = 0;

    // ===============================
    // Product Update
    // ===============================

for (const item of items) {

  subTotal += item.total;

  const product = await Product.findById(item.product);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  // Previous Data
  const oldStock = product.currentStock;
  const oldAverage = product.averagePurchasePrice;

  // New Stock
  const newStock = oldStock + item.quantity;

  // Average Purchase Price
let newAverage;

if (oldStock === 0) {
  newAverage = item.purchasePrice;
} else {
  newAverage =
    (
      (oldStock * oldAverage) +
      (item.quantity * item.purchasePrice)
    ) / newStock;
}
  // ==========================
  // Product Update
  // ==========================

  product.currentStock = newStock;

  product.latestPurchasePrice = item.purchasePrice;

  product.averagePurchasePrice =
    Number(newAverage.toFixed(2));

  product.stockValue =
    Number(
      (newStock * newAverage).toFixed(2)
    );

  product.totalPurchaseQty += item.quantity;

  product.totalPurchaseValue += item.total;

  product.lastPurchaseDate = purchaseDate;

  await product.save();
}

    // ===============================
    // Total
    // ===============================

    const grandTotal =
      subTotal -
      Number(discount || 0) +
      Number(transportCost || 0);

    const dueAmount =
      grandTotal - Number(paidAmount || 0);

    // ===============================
    // Supplier Due Update
    // ===============================

    const supplierData =
      await Supplier.findById(supplier);

    if (supplierData) {
      supplierData.currentDue += dueAmount;

      await supplierData.save();
    }

    // ===============================
    // Save Purchase
    // ===============================

    const purchase =
      await Purchase.create({
        invoiceNo,
        supplier,
        purchaseDate,
        items,
        subTotal,
        discount,
        transportCost,
        grandTotal,
        paidAmount,
        dueAmount,
        paymentType,
        note,
      });

    res.status(201).json({
      message: "Purchase Created Successfully",
      purchase,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================
// Delete Purchase
// ======================================

const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        message: "Purchase not found",
      });
    }

    // ===============================
    // Rollback Product Stock
    // ===============================

    for (const item of purchase.items) {
      const product = await Product.findById(item.product);

      if (product) {
        // Stock কমানো
        product.currentStock -= item.quantity;

        if (product.currentStock < 0) {
          product.currentStock = 0;
        }

        // Purchase Statistics কমানো
        product.totalPurchaseQty -= item.quantity;
        if (product.totalPurchaseQty < 0) {
          product.totalPurchaseQty = 0;
        }

        product.totalPurchaseValue -= item.total;
        if (product.totalPurchaseValue < 0) {
          product.totalPurchaseValue = 0;
        }

        // Stock Value Update
        product.stockValue =
          Number(
            (
              product.currentStock *
              product.averagePurchasePrice
            ).toFixed(2)
          );

        await product.save();
      }
    }

    // ===============================
    // Supplier Due Rollback
    // ===============================

    const supplier = await Supplier.findById(
      purchase.supplier
    );

    if (supplier) {
      supplier.currentDue -= purchase.dueAmount;

      if (supplier.currentDue < 0) {
        supplier.currentDue = 0;
      }

      await supplier.save();
    }

    // ===============================
    // Delete Purchase
    // ===============================

    await Purchase.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Purchase Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getPurchases,
  getPurchase,
  createPurchase,
  deletePurchase,
};