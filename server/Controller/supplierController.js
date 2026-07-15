const Supplier = require("../Model/supplierModel");

// ======================================
// GET ALL SUPPLIERS
// ======================================
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// GET SINGLE SUPPLIER
// ======================================
const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier || supplier.isDeleted) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// CREATE SUPPLIER
// ======================================
const createSupplier = async (req, res) => {
  try {
    const {
      supplierCode,
      name,
      companyName,
      phone,
      email,
      address,
      previousDue,
    } = req.body;

    // Required Check
    if (!supplierCode || !name || !phone) {
      return res.status(400).json({
        message: "Supplier Code, Name and Phone are required.",
      });
    }

    // Duplicate Code
    const codeExists = await Supplier.findOne({ supplierCode });

    if (codeExists) {
      return res.status(400).json({
        message: "Supplier Code already exists.",
      });
    }

    // Duplicate Phone
    const phoneExists = await Supplier.findOne({ phone });

    if (phoneExists) {
      return res.status(400).json({
        message: "Phone number already exists.",
      });
    }

    const supplier = await Supplier.create({
      supplierCode,
      name,
      companyName,
      phone,
      email,
      address,
      previousDue,
      currentDue: previousDue || 0,
    });

    res.status(201).json({
      message: "Supplier created successfully.",
      supplier,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// UPDATE SUPPLIER
// ======================================
const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found.",
      });
    }

    Object.assign(supplier, req.body);

    await supplier.save();

    res.status(200).json({
      message: "Supplier updated successfully.",
      supplier,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// DELETE SUPPLIER (SOFT DELETE)
// ======================================
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found.",
      });
    }

    supplier.isDeleted = true;

    await supplier.save();

    res.status(200).json({
      message: "Supplier deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};