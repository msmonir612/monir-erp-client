const OwnerTransaction = require(
  "../Model/ownerTransactionModel"
);

// ======================================
// HELPERS
// ======================================

const getStartAndEndOfDay = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return {
    startOfDay,
    endOfDay,
  };
};

const normalizeTransactionData = (body) => {
  const {
    transactionDate,
    transactionType,
    paymentMethod,
    amount,
    bankName,
    mobileBankingName,
    accountNumber,
    reference,
    note,
  } = body;

  return {
    transactionDate: transactionDate
      ? new Date(transactionDate)
      : new Date(),

    transactionType:
      transactionType?.trim(),

    paymentMethod:
      paymentMethod?.trim(),

    amount: Number(amount),

    bankName:
      paymentMethod === "bank"
        ? bankName?.trim() || ""
        : "",

    mobileBankingName:
      paymentMethod ===
      "mobile_banking"
        ? mobileBankingName?.trim() || ""
        : "",

    accountNumber:
      paymentMethod === "cash"
        ? ""
        : accountNumber?.trim() || "",

    reference:
      reference?.trim() || "",

    note:
      note?.trim() || "",
  };
};

// ======================================
// CREATE OWNER TRANSACTION
// ADMIN + MANAGER
// ======================================

const createOwnerTransaction = async (
  req,
  res
) => {
  try {
    const transactionData =
      normalizeTransactionData(req.body);

    if (
      Number.isNaN(
        transactionData.transactionDate.getTime()
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid transaction date",
      });
    }

    if (
      !["deposit", "withdrawal"].includes(
        transactionData.transactionType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Transaction type must be deposit or withdrawal",
      });
    }

    if (
      ![
        "cash",
        "bank",
        "mobile_banking",
      ].includes(
        transactionData.paymentMethod
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment method",
      });
    }

    if (
      !Number.isFinite(
        transactionData.amount
      ) ||
      transactionData.amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Amount must be greater than zero",
      });
    }

    if (
      transactionData.paymentMethod ===
        "bank" &&
      !transactionData.bankName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Bank name is required",
      });
    }

    if (
      transactionData.paymentMethod ===
        "mobile_banking" &&
      !transactionData.mobileBankingName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Mobile banking service is required",
      });
    }

    const transaction =
      await OwnerTransaction.create({
        ...transactionData,
        createdBy: req.user._id,
      });

    const populatedTransaction =
      await OwnerTransaction.findById(
        transaction._id
      )
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
        "Owner transaction created successfully",
      transaction:
        populatedTransaction,
    });
  } catch (error) {
    console.error(
      "CREATE OWNER TRANSACTION ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create owner transaction",
    });
  }
};

// ======================================
// GET ALL OWNER TRANSACTIONS
// ADMIN + MANAGER
// ======================================

const getOwnerTransactions = async (
  req,
  res
) => {
  try {
    const {
      date,
      transactionType,
      paymentMethod,
    } = req.query;

    const filter = {};

    if (date) {
      const range =
        getStartAndEndOfDay(date);

      if (!range) {
        return res.status(400).json({
          success: false,
          message: "Invalid date filter",
        });
      }

      filter.transactionDate = {
        $gte: range.startOfDay,
        $lte: range.endOfDay,
      };
    }

    if (
      transactionType &&
      ["deposit", "withdrawal"].includes(
        transactionType
      )
    ) {
      filter.transactionType =
        transactionType;
    }

    if (
      paymentMethod &&
      [
        "cash",
        "bank",
        "mobile_banking",
      ].includes(paymentMethod)
    ) {
      filter.paymentMethod =
        paymentMethod;
    }

    const transactions =
      await OwnerTransaction.find(filter)
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "updatedBy",
          "name email role"
        )
        .sort({
          transactionDate: -1,
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error(
      "GET OWNER TRANSACTIONS ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load owner transactions",
    });
  }
};

// ======================================
// GET SINGLE OWNER TRANSACTION
// ADMIN + MANAGER
// ======================================

const getOwnerTransactionById =
  async (req, res) => {
    try {
      const transaction =
        await OwnerTransaction.findById(
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

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message:
            "Owner transaction not found",
        });
      }

      return res.status(200).json({
        success: true,
        transaction,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Unable to load owner transaction",
      });
    }
  };

// ======================================
// GET DAILY OWNER TRANSACTION SUMMARY
// ADMIN + MANAGER
// ======================================

const getDailyOwnerTransactionSummary =
  async (req, res) => {
    try {
      const selectedDate =
        req.query.date ||
        new Date()
          .toISOString()
          .split("T")[0];

      const range =
        getStartAndEndOfDay(
          selectedDate
        );

      if (!range) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid summary date",
        });
      }

      const results =
        await OwnerTransaction.aggregate([
          {
            $match: {
              transactionDate: {
                $gte: range.startOfDay,
                $lte: range.endOfDay,
              },
            },
          },
          {
            $group: {
              _id: {
                transactionType:
                  "$transactionType",
                paymentMethod:
                  "$paymentMethod",
              },
              totalAmount: {
                $sum: "$amount",
              },
              count: {
                $sum: 1,
              },
            },
          },
        ]);

      const summary = {
        date: selectedDate,

        cash: {
          deposit: 0,
          withdrawal: 0,
          net: 0,
        },

        bank: {
          deposit: 0,
          withdrawal: 0,
          net: 0,
        },

        mobileBanking: {
          deposit: 0,
          withdrawal: 0,
          net: 0,
        },

        totalDeposit: 0,
        totalWithdrawal: 0,
        netMovement: 0,
        transactionCount: 0,
      };

      results.forEach((item) => {
        const {
          transactionType,
          paymentMethod,
        } = item._id;

        const amount =
          Number(item.totalAmount) || 0;

        summary.transactionCount +=
          Number(item.count) || 0;

        if (
          transactionType ===
          "deposit"
        ) {
          summary.totalDeposit += amount;
        } else {
          summary.totalWithdrawal +=
            amount;
        }

        if (
          paymentMethod === "cash"
        ) {
          summary.cash[
            transactionType
          ] = amount;
        }

        if (
          paymentMethod === "bank"
        ) {
          summary.bank[
            transactionType
          ] = amount;
        }

        if (
          paymentMethod ===
          "mobile_banking"
        ) {
          summary.mobileBanking[
            transactionType
          ] = amount;
        }
      });

      summary.cash.net =
        summary.cash.deposit -
        summary.cash.withdrawal;

      summary.bank.net =
        summary.bank.deposit -
        summary.bank.withdrawal;

      summary.mobileBanking.net =
        summary.mobileBanking.deposit -
        summary.mobileBanking.withdrawal;

      summary.netMovement =
        summary.totalDeposit -
        summary.totalWithdrawal;

      return res.status(200).json({
        success: true,
        summary,
      });
    } catch (error) {
      console.error(
        "OWNER TRANSACTION SUMMARY ERROR:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to calculate transaction summary",
      });
    }
  };

// ======================================
// UPDATE OWNER TRANSACTION
// ADMIN ONLY
// ======================================

const updateOwnerTransaction = async (
  req,
  res
) => {
  try {
    const transaction =
      await OwnerTransaction.findById(
        req.params.id
      );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message:
          "Owner transaction not found",
      });
    }

    const transactionData =
      normalizeTransactionData(req.body);

    if (
      Number.isNaN(
        transactionData.transactionDate.getTime()
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid transaction date",
      });
    }

    if (
      !["deposit", "withdrawal"].includes(
        transactionData.transactionType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid transaction type",
      });
    }

    if (
      ![
        "cash",
        "bank",
        "mobile_banking",
      ].includes(
        transactionData.paymentMethod
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment method",
      });
    }

    if (
      !Number.isFinite(
        transactionData.amount
      ) ||
      transactionData.amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Amount must be greater than zero",
      });
    }

    if (
      transactionData.paymentMethod ===
        "bank" &&
      !transactionData.bankName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Bank name is required",
      });
    }

    if (
      transactionData.paymentMethod ===
        "mobile_banking" &&
      !transactionData.mobileBankingName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Mobile banking service is required",
      });
    }

    Object.assign(
      transaction,
      transactionData
    );

    transaction.updatedBy =
      req.user._id;

    await transaction.save();

    const updatedTransaction =
      await OwnerTransaction.findById(
        transaction._id
      )
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
        "Owner transaction updated successfully",
      transaction:
        updatedTransaction,
    });
  } catch (error) {
    console.error(
      "UPDATE OWNER TRANSACTION ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update owner transaction",
    });
  }
};

// ======================================
// DELETE OWNER TRANSACTION
// ADMIN ONLY
// ======================================

const deleteOwnerTransaction = async (
  req,
  res
) => {
  try {
    const transaction =
      await OwnerTransaction.findById(
        req.params.id
      );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message:
          "Owner transaction not found",
      });
    }

    await transaction.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Owner transaction deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE OWNER TRANSACTION ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete owner transaction",
    });
  }
};

module.exports = {
  createOwnerTransaction,
  getOwnerTransactions,
  getOwnerTransactionById,
  getDailyOwnerTransactionSummary,
  updateOwnerTransaction,
  deleteOwnerTransaction,
};