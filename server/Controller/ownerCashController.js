const OwnerCash = require(
  "../Model/ownerCashModel"
);

const OwnerTransaction = require(
  "../Model/ownerTransactionModel"
);

const Sale = require(
  "../Model/saleModel"
);

const Purchase = require(
  "../Model/purchaseModel"
);

const Expense = require(
  "../Model/expenseModel"
);

// ======================================
// HELPERS
// ======================================

const getDateOnly = (dateValue) => {
  const rawDate =
    dateValue ||
    new Date().toISOString().split("T")[0];

  const dateString = String(rawDate).slice(
    0,
    10
  );

  const validPattern =
    /^\d{4}-\d{2}-\d{2}$/;

  if (!validPattern.test(dateString)) {
    return null;
  }

  return dateString;
};

// Bangladesh timezone UTC+6
const getDayRange = (dateValue) => {
  const dateString = getDateOnly(dateValue);

  if (!dateString) {
    return null;
  }

  const startOfDay = new Date(
    `${dateString}T00:00:00.000+06:00`
  );

  const endOfDay = new Date(
    `${dateString}T23:59:59.999+06:00`
  );

  if (
    Number.isNaN(startOfDay.getTime()) ||
    Number.isNaN(endOfDay.getTime())
  ) {
    return null;
  }

  return {
    dateString,
    startOfDay,
    endOfDay,
  };
};

const getAmount = (aggregationResult) => {
  return Number(
    aggregationResult?.[0]?.total || 0
  );
};

// ======================================
// BUILD AUTOMATIC DAILY SUMMARY
// ======================================

const calculateDailyOwnerCash = async (
  dateValue
) => {
  const range = getDayRange(dateValue);

  if (!range) {
    throw new Error("Invalid date");
  }

  const {
    dateString,
    startOfDay,
    endOfDay,
  } = range;

  const dateMatch = {
    $gte: startOfDay,
    $lte: endOfDay,
  };

  const [
    salesResult,
    purchaseResult,
    expenseResult,
    ownerDepositResult,
    ownerWithdrawalResult,
    bankDepositResult,
    bankWithdrawalResult,
    mobileDepositResult,
    mobileWithdrawalResult,
  ] = await Promise.all([
    // ==================================
    // CASH SALES
    // ==================================
    // paidAmount হলো বাস্তবে পাওয়া টাকা।
    // Due sale-এ partial paidAmount থাকলেও
    // সেটি cash received হিসেবে ধরা হবে।

    Sale.aggregate([
      {
        $match: {
          saleDate: dateMatch,
          status: "Completed",
          paidAmount: {
            $gt: 0,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$paidAmount",
          },
        },
      },
    ]),

    // ==================================
    // CASH PURCHASE
    // ==================================
    // Purchase model-এ আলাদা Bank/Mobile
    // method নেই, তাই paidAmount cash paid
    // হিসেবে গণনা করা হচ্ছে।

    Purchase.aggregate([
      {
        $match: {
          purchaseDate: dateMatch,
          paidAmount: {
            $gt: 0,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$paidAmount",
          },
        },
      },
    ]),

    // ==================================
    // CASH EXPENSE
    // ==================================

    Expense.aggregate([
      {
        $match: {
          expenseDate: dateMatch,
          paymentMethod: "Cash",
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
    ]),

    // ==================================
    // OWNER CASH DEPOSIT
    // ==================================

    OwnerTransaction.aggregate([
      {
        $match: {
          transactionDate: dateMatch,
          transactionType: "deposit",
          paymentMethod: "cash",
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
    ]),

    // ==================================
    // OWNER CASH WITHDRAWAL
    // ==================================

    OwnerTransaction.aggregate([
      {
        $match: {
          transactionDate: dateMatch,
          transactionType: "withdrawal",
          paymentMethod: "cash",
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
    ]),

    // ==================================
    // OWNER BANK DEPOSIT
    // ==================================

    OwnerTransaction.aggregate([
      {
        $match: {
          transactionDate: dateMatch,
          transactionType: "deposit",
          paymentMethod: "bank",
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
    ]),

    // ==================================
    // OWNER BANK WITHDRAWAL
    // ==================================

    OwnerTransaction.aggregate([
      {
        $match: {
          transactionDate: dateMatch,
          transactionType: "withdrawal",
          paymentMethod: "bank",
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
    ]),

    // ==================================
    // MOBILE BANKING DEPOSIT
    // ==================================

    OwnerTransaction.aggregate([
      {
        $match: {
          transactionDate: dateMatch,
          transactionType: "deposit",
          paymentMethod:
            "mobile_banking",
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
    ]),

    // ==================================
    // MOBILE BANKING WITHDRAWAL
    // ==================================

    OwnerTransaction.aggregate([
      {
        $match: {
          transactionDate: dateMatch,
          transactionType: "withdrawal",
          paymentMethod:
            "mobile_banking",
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
    ]),
  ]);

  const cashSales =
    getAmount(salesResult);

  const cashPurchase =
    getAmount(purchaseResult);

  const cashExpense =
    getAmount(expenseResult);

  const ownerDeposit =
    getAmount(ownerDepositResult);

  const ownerWithdrawal =
    getAmount(ownerWithdrawalResult);

  const bankDeposit =
    getAmount(bankDepositResult);

  const bankWithdrawal =
    getAmount(bankWithdrawalResult);

  const mobileDeposit =
    getAmount(mobileDepositResult);

  const mobileWithdrawal =
    getAmount(mobileWithdrawalResult);

  return {
    date: dateString,

    cash: {
      ownerDeposit,
      ownerWithdrawal,
      cashSales,
      cashPurchase,
      cashExpense,

      netMovement:
        ownerDeposit +
        cashSales -
        cashPurchase -
        cashExpense -
        ownerWithdrawal,
    },

    bank: {
      deposit: bankDeposit,
      withdrawal: bankWithdrawal,
      net:
        bankDeposit -
        bankWithdrawal,
    },

    mobileBanking: {
      deposit: mobileDeposit,
      withdrawal: mobileWithdrawal,
      net:
        mobileDeposit -
        mobileWithdrawal,
    },
  };
};

// ======================================
// GET AUTOMATIC DAILY SUMMARY
// ADMIN + MANAGER
// ======================================

const getOwnerCashAutoSummary = async (
  req,
  res
) => {
  try {
    const summary =
      await calculateDailyOwnerCash(
        req.query.date
      );

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error(
      "OWNER CASH AUTO SUMMARY ERROR:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Unable to calculate Owner Cash summary",
    });
  }
};

// ======================================
// CREATE DAILY OWNER CASH CLOSING
// ADMIN + MANAGER
// ======================================

const createOwnerCash = async (
  req,
  res
) => {
  try {
    const {
      date,
      openingDeposit,
      note,
    } = req.body;

    const range = getDayRange(date);

    if (!range) {
      return res.status(400).json({
        success: false,
        message: "Valid date is required",
      });
    }

    const openingCash =
      Number(openingDeposit);

    if (
      !Number.isFinite(openingCash) ||
      openingCash < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Opening Cash must be zero or greater",
      });
    }

    const existingEntry =
      await OwnerCash.findOne({
        date: {
          $gte: range.startOfDay,
          $lte: range.endOfDay,
        },
      });

    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message:
          "Daily closing entry already exists for this date",
      });
    }

    const automatic =
      await calculateDailyOwnerCash(
        range.dateString
      );

    const entry = await OwnerCash.create({
      date: range.startOfDay,

      openingDeposit: openingCash,

      ownerDeposit:
        automatic.cash.ownerDeposit,

      ownerWithdrawal:
        automatic.cash.ownerWithdrawal,

      cashSales:
        automatic.cash.cashSales,

      cashPurchase:
        automatic.cash.cashPurchase,

      cashExpense:
        automatic.cash.cashExpense,

      note: note?.trim() || "",

      createdBy: req.user._id,
    });

    const populatedEntry =
      await OwnerCash.findById(entry._id)
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "updatedBy",
          "name email role"
        );

    return res.status(201).json({
      success: true,
      message:
        "Daily Owner Cash closing saved successfully",
      entry: populatedEntry,
      automatic,
    });
  } catch (error) {
    console.error(
      "CREATE OWNER CASH ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.code === 11000
          ? "Daily closing entry already exists for this date"
          : error.message ||
            "Unable to save Owner Cash closing",
    });
  }
};

// ======================================
// GET ALL DAILY CLOSING ENTRIES
// ADMIN + MANAGER
// ======================================

const getOwnerCashEntries = async (
  req,
  res
) => {
  try {
    const entries = await OwnerCash.find()
      .populate(
        "createdBy",
        "name email role"
      )
      .populate(
        "updatedBy",
        "name email role"
      )
      .sort({
        date: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: entries.length,
      entries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Unable to load Owner Cash history",
    });
  }
};

// ======================================
// GET SINGLE CLOSING ENTRY
// ======================================

const getOwnerCashById = async (
  req,
  res
) => {
  try {
    const entry = await OwnerCash.findById(
      req.params.id
    )
      .populate(
        "createdBy",
        "name email role"
      )
      .populate(
        "updatedBy",
        "name email role"
      );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message:
          "Owner Cash entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      entry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Unable to load Owner Cash entry",
    });
  }
};

// ======================================
// UPDATE DAILY CLOSING
// ADMIN ONLY
// ======================================

const updateOwnerCash = async (
  req,
  res
) => {
  try {
    const entry = await OwnerCash.findById(
      req.params.id
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message:
          "Owner Cash entry not found",
      });
    }

    const dateValue =
      req.body.date ||
      entry.date;

    const range = getDayRange(dateValue);

    if (!range) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    const openingCash =
      req.body.openingDeposit !== undefined
        ? Number(
            req.body.openingDeposit
          )
        : Number(
            entry.openingDeposit
          );

    if (
      !Number.isFinite(openingCash) ||
      openingCash < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Opening Cash must be zero or greater",
      });
    }

    const duplicate =
      await OwnerCash.findOne({
        _id: {
          $ne: entry._id,
        },

        date: {
          $gte: range.startOfDay,
          $lte: range.endOfDay,
        },
      });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message:
          "Daily closing entry already exists for this date",
      });
    }

    // Update করার সময়ও সব automatic
    // amount পুনরায় calculation হবে।
    const automatic =
      await calculateDailyOwnerCash(
        range.dateString
      );

    entry.date = range.startOfDay;

    entry.openingDeposit =
      openingCash;

    entry.ownerDeposit =
      automatic.cash.ownerDeposit;

    entry.ownerWithdrawal =
      automatic.cash.ownerWithdrawal;

    entry.cashSales =
      automatic.cash.cashSales;

    entry.cashPurchase =
      automatic.cash.cashPurchase;

    entry.cashExpense =
      automatic.cash.cashExpense;

    if (req.body.note !== undefined) {
      entry.note =
        req.body.note?.trim() || "";
    }

    entry.updatedBy = req.user._id;

    await entry.save();

    const updatedEntry =
      await OwnerCash.findById(entry._id)
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "updatedBy",
          "name email role"
        );

    return res.status(200).json({
      success: true,
      message:
        "Daily Owner Cash closing updated successfully",
      entry: updatedEntry,
      automatic,
    });
  } catch (error) {
    console.error(
      "UPDATE OWNER CASH ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update Owner Cash entry",
    });
  }
};

// ======================================
// DELETE DAILY CLOSING
// ADMIN ONLY
// ======================================

const deleteOwnerCash = async (
  req,
  res
) => {
  try {
    const entry = await OwnerCash.findById(
      req.params.id
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message:
          "Owner Cash entry not found",
      });
    }

    await entry.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Owner Cash entry deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Unable to delete Owner Cash entry",
    });
  }
};

module.exports = {
  getOwnerCashAutoSummary,
  createOwnerCash,
  getOwnerCashEntries,
  getOwnerCashById,
  updateOwnerCash,
  deleteOwnerCash,
};