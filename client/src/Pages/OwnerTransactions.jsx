import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import OwnerTransactionForm from "../Components/ownerTransaction/OwnerTransactionForm";
import OwnerTransactionTable from "../Components/ownerTransaction/OwnerTransactionTable";
import OwnerSummaryCards from "../Components/ownerTransaction/OwnerSummaryCards";
import OwnerTransactionFilter from "../Components/ownerTransaction/OwnerTransactionFilter";

import {
  createOwnerTransaction,
  getOwnerTransactions,
  getDailyOwnerTransactionSummary,
  updateOwnerTransaction,
  deleteOwnerTransaction,
} from "../services/ownerTransactionService";

import { useAuth } from "../context/AuthContext";

// ======================================
// DATE HELPERS
// ======================================

const getCurrentDateTime = () => {
  const now = new Date();

  const timezoneOffset =
    now.getTimezoneOffset() * 60000;

  return new Date(
    now.getTime() - timezoneOffset
  )
    .toISOString()
    .slice(0, 16);
};

const getToday = () => {
  return getCurrentDateTime().slice(0, 10);
};

// ======================================
// INITIAL VALUES
// ======================================

const getInitialForm = () => ({
  transactionDate: getCurrentDateTime(),
  transactionType: "deposit",
  paymentMethod: "cash",
  amount: "",
  bankName: "",
  mobileBankingName: "",
  accountNumber: "",
  reference: "",
  note: "",
});

const getInitialFilters = () => ({
  date: getToday(),
  transactionType: "",
  paymentMethod: "",
});

const initialSummary = {
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

// ======================================
// PAGE
// ======================================

const OwnerTransactions = () => {
  const { isAdmin, user } = useAuth();

  const [formData, setFormData] = useState(
    getInitialForm
  );

  const [transactions, setTransactions] =
    useState([]);

  const [summary, setSummary] =
    useState(initialSummary);

  const [filters, setFilters] = useState(
    getInitialFilters
  );

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [listLoading, setListLoading] =
    useState(true);

  // ======================================
  // FORMAT HELPERS
  // ======================================

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ======================================
  // LOAD TRANSACTIONS
  // ======================================

  const loadTransactions = async (
    selectedFilters = filters
  ) => {
    try {
      setListLoading(true);

      const data =
        await getOwnerTransactions(
          selectedFilters
        );

      setTransactions(
        data.transactions || []
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load Owner transactions"
      );
    } finally {
      setListLoading(false);
    }
  };

  // ======================================
  // LOAD DAILY SUMMARY
  // ======================================

  const loadSummary = async (
    selectedDate = filters.date
  ) => {
    try {
      const data =
        await getDailyOwnerTransactionSummary(
          selectedDate || getToday()
        );

      setSummary(
        data.summary || initialSummary
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load daily summary"
      );

      setSummary(initialSummary);
    }
  };

  // ======================================
  // INITIAL LOAD
  // ======================================

  useEffect(() => {
    const initialFilters =
      getInitialFilters();

    loadTransactions(initialFilters);
    loadSummary(initialFilters.date);
  }, []);

  // ======================================
  // FORM CHANGE
  // ======================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedForm = {
        ...prev,
        [name]: value,
      };

      if (name === "paymentMethod") {
        if (value === "cash") {
          updatedForm.bankName = "";
          updatedForm.mobileBankingName =
            "";
          updatedForm.accountNumber = "";
        }

        if (value === "bank") {
          updatedForm.mobileBankingName =
            "";
        }

        if (
          value === "mobile_banking"
        ) {
          updatedForm.bankName = "";
        }
      }

      return updatedForm;
    });
  };

  // ======================================
  // RESET FORM
  // ======================================

  const resetForm = () => {
    setFormData(getInitialForm());
    setEditingId(null);
  };

  // ======================================
  // CREATE / UPDATE
  // ======================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = Number(
      formData.amount
    );

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      toast.error(
        "Amount must be greater than zero"
      );
      return;
    }

    if (
      formData.paymentMethod === "bank" &&
      !formData.bankName.trim()
    ) {
      toast.error(
        "Please enter the bank name"
      );
      return;
    }

    if (
      formData.paymentMethod ===
        "mobile_banking" &&
      !formData.mobileBankingName
    ) {
      toast.error(
        "Please select a mobile banking service"
      );
      return;
    }

    const payload = {
      transactionDate:
        formData.transactionDate,

      transactionType:
        formData.transactionType,

      paymentMethod:
        formData.paymentMethod,

      amount,

      bankName:
        formData.bankName.trim(),

      mobileBankingName:
        formData.mobileBankingName,

      accountNumber:
        formData.accountNumber.trim(),

      reference:
        formData.reference.trim(),

      note:
        formData.note.trim(),
    };

    try {
      setLoading(true);

      let data;

      if (editingId) {
        data =
          await updateOwnerTransaction(
            editingId,
            payload
          );
      } else {
        data =
          await createOwnerTransaction(
            payload
          );
      }

      toast.success(
        data.message ||
          "Owner transaction saved successfully"
      );

      const selectedDate =
        payload.transactionDate.slice(
          0,
          10
        );

      const updatedFilters = {
        ...filters,
        date: selectedDate,
      };

      setFilters(updatedFilters);
      resetForm();

      await Promise.all([
        loadTransactions(
          updatedFilters
        ),
        loadSummary(selectedDate),
      ]);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // EDIT
  // ADMIN ONLY
  // ======================================

  const handleEdit = (transaction) => {
    if (!isAdmin) {
      toast.error(
        "Only Admin can edit transactions"
      );
      return;
    }

    const date = new Date(
      transaction.transactionDate
    );

    const timezoneOffset =
      date.getTimezoneOffset() * 60000;

    const localDate = new Date(
      date.getTime() - timezoneOffset
    )
      .toISOString()
      .slice(0, 16);

    setEditingId(transaction._id);

    setFormData({
      transactionDate: localDate,

      transactionType:
        transaction.transactionType,

      paymentMethod:
        transaction.paymentMethod,

      amount:
        transaction.amount ?? "",

      bankName:
        transaction.bankName || "",

      mobileBankingName:
        transaction.mobileBankingName ||
        "",

      accountNumber:
        transaction.accountNumber || "",

      reference:
        transaction.reference || "",

      note:
        transaction.note || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ======================================
  // DELETE
  // ADMIN ONLY
  // ======================================

  const handleDelete = async (id) => {
    if (!isAdmin) {
      toast.error(
        "Only Admin can delete transactions"
      );
      return;
    }

    const confirmed = window.confirm(
      "Delete this Owner transaction?"
    );

    if (!confirmed) return;

    try {
      const data =
        await deleteOwnerTransaction(id);

      toast.success(
        data.message ||
          "Transaction deleted successfully"
      );

      await Promise.all([
        loadTransactions(filters),
        loadSummary(
          filters.date || getToday()
        ),
      ]);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to delete transaction"
      );
    }
  };

  // ======================================
  // FILTER CHANGE
  // ======================================

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================
  // APPLY FILTER
  // ======================================

  const handleApplyFilters = async () => {
    await Promise.all([
      loadTransactions(filters),
      loadSummary(
        filters.date || getToday()
      ),
    ]);
  };

  // ======================================
  // CLEAR FILTER
  // ======================================

  const handleClearFilters = async () => {
    const clearedFilters =
      getInitialFilters();

    setFilters(clearedFilters);

    await Promise.all([
      loadTransactions(
        clearedFilters
      ),
      loadSummary(
        clearedFilters.date
      ),
    ]);
  };

  // ======================================
  // CURRENT FILTERED TOTALS
  // ======================================

  const currentListTotals =
    useMemo(() => {
      return transactions.reduce(
        (totals, transaction) => {
          const amount =
            Number(transaction.amount) ||
            0;

          if (
            transaction.transactionType ===
            "deposit"
          ) {
            totals.deposit += amount;
          }

          if (
            transaction.transactionType ===
            "withdrawal"
          ) {
            totals.withdrawal += amount;
          }

          return totals;
        },
        {
          deposit: 0,
          withdrawal: 0,
        }
      );
    }, [transactions]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Owner Transactions
          </h1>

          <p className="text-gray-500 mt-1">
            Record every amount deposited
            or withdrawn by the owner.
          </p>
        </div>

        <div className="bg-white border shadow-sm rounded-xl px-4 py-3">
          <p className="text-xs text-gray-500">
            Logged in as
          </p>

          <p className="font-semibold text-slate-800">
            {user?.name || "User"}
          </p>

          <p className="text-xs uppercase font-semibold text-green-700">
            {user?.role || ""}
          </p>
        </div>
      </div>

      {/* Summary */}
      <OwnerSummaryCards
        summary={summary}
        formatMoney={formatMoney}
      />

      {/* Form */}
      <OwnerTransactionForm
        formData={formData}
        loading={loading}
        editingId={editingId}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancelEdit={resetForm}
      />

      {/* Filter */}
      <OwnerTransactionFilter
        filters={filters}
        currentListTotals={
          currentListTotals
        }
        formatMoney={formatMoney}
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Table */}
      <OwnerTransactionTable
        transactions={transactions}
        listLoading={listLoading}
        isAdmin={isAdmin}
        formatMoney={formatMoney}
        formatDateTime={
          formatDateTime
        }
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

    </div>
  );
};

export default OwnerTransactions;