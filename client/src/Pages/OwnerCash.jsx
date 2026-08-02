import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { toast } from "react-hot-toast";

import {
  Plus,
  RefreshCcw,
} from "lucide-react";

import OwnerCashHeader from "../Components/ownerCash/OwnerCashHeader";
import OwnerCashSummaryCards from "../Components/ownerCash/OwnerCashSummaryCards";
import OwnerCashMethodCards from "../Components/ownerCash/OwnerCashMethodCards";
import OwnerCashHistoryTable from "../Components/ownerCash/OwnerCashHistoryTable";

import {
  deleteOwnerCash,
  getOwnerCashAutoSummary,
  getOwnerCashEntries,
} from "../services/ownerCashService";

import {
  useAuth,
} from "../context/AuthContext";

// ======================================
// HELPERS
// ======================================

const getToday = () => {
  const now = new Date();

  const timezoneOffset =
    now.getTimezoneOffset() * 60000;

  return new Date(
    now.getTime() - timezoneOffset
  )
    .toISOString()
    .slice(0, 10);
};

const getInitialSummary = () => ({
  date: getToday(),

  cash: {
    ownerDeposit: 0,
    ownerWithdrawal: 0,
    cashSales: 0,
    cashPurchase: 0,
    cashExpense: 0,
    netMovement: 0,
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
});

// ======================================
// PAGE
// ======================================

const OwnerCash = () => {
  const navigate =
    useNavigate();

  const {
    isAdmin,
    user,
  } = useAuth();

  const [
    summary,
    setSummary,
  ] = useState(getInitialSummary);

  const [
    entries,
    setEntries,
  ] = useState([]);

  const [
    searchDate,
    setSearchDate,
  ] = useState("");

  const [
    summaryLoading,
    setSummaryLoading,
  ] = useState(false);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(true);

  // ======================================
  // FORMAT
  // ======================================

  const formatMoney = (
    amount
  ) => {
    return new Intl.NumberFormat(
      "en-BD",
      {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 2,
      }
    ).format(
      Number(amount) || 0
    );
  };

  const formatDate = (
    dateValue
  ) => {
    if (!dateValue) {
      return "—";
    }

    return new Date(
      dateValue
    ).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getLocalDateString = (
    dateValue
  ) => {
    const date =
      new Date(dateValue);

    const timezoneOffset =
      date.getTimezoneOffset() *
      60000;

    return new Date(
      date.getTime() -
        timezoneOffset
    )
      .toISOString()
      .slice(0, 10);
  };

  // ======================================
  // LOAD SUMMARY
  // ======================================

  const loadAutoSummary =
    async (selectedDate) => {
      try {
        setSummaryLoading(true);

        const data =
          await getOwnerCashAutoSummary(
            selectedDate
          );

        setSummary(
          data?.summary ||
            getInitialSummary()
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Unable to load summary"
        );
      } finally {
        setSummaryLoading(false);
      }
    };

  // ======================================
  // LOAD HISTORY
  // ======================================

  const loadEntries =
    async () => {
      try {
        setHistoryLoading(true);

        const data =
          await getOwnerCashEntries();

        setEntries(
          data?.entries || []
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Unable to load history"
        );
      } finally {
        setHistoryLoading(false);
      }
    };

  // ======================================
  // INITIAL LOAD
  // ======================================

  useEffect(() => {
    loadAutoSummary(
      getToday()
    );

    loadEntries();
  }, []);

  // ======================================
  // REFRESH
  // ======================================

  const handleRefresh =
    async () => {
      await Promise.all([
        loadAutoSummary(
          getToday()
        ),
        loadEntries(),
      ]);

      toast.success(
        "Owner Cash refreshed"
      );
    };

  // ======================================
  // NAVIGATION
  // ======================================

  const handleAdd = () => {
    navigate(
      "/owner-cash/new"
    );
  };

  const handleEdit = (
    entry
  ) => {
    if (!isAdmin) {
      toast.error(
        "Only Admin can edit entries"
      );

      return;
    }

    navigate(
      `/owner-cash/edit/${entry._id}`
    );
  };

  // ======================================
  // DELETE
  // ======================================

  const handleDelete =
    async (id) => {
      if (!isAdmin) {
        toast.error(
          "Only Admin can delete entries"
        );

        return;
      }

      const confirmed =
        window.confirm(
          "Delete this Daily Closing entry?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const data =
          await deleteOwnerCash(
            id
          );

        toast.success(
          data?.message ||
            "Entry deleted successfully"
        );

        await loadEntries();
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Unable to delete entry"
        );
      }
    };

  // ======================================
  // FILTER
  // ======================================

  const filteredEntries =
    useMemo(() => {
      if (!searchDate) {
        return entries;
      }

      return entries.filter(
        (entry) =>
          getLocalDateString(
            entry.date
          ) === searchDate
      );
    }, [
      entries,
      searchDate,
    ]);

  return (
    <div className="w-full min-w-0 space-y-4 overflow-hidden">
      <OwnerCashHeader
        user={user}
      />

      {/* PAGE ACTIONS */}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Daily Cash Closing
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Review daily summary and
              manage saved closing records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={
                handleRefresh
              }
              disabled={
                summaryLoading ||
                historyLoading
              }
              className="h-9 inline-flex items-center justify-center gap-2 border border-slate-300 rounded-lg px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCcw
                size={16}
                className={
                  summaryLoading ||
                  historyLoading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={
                handleAdd
              }
              className="h-9 inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white rounded-lg px-4 text-sm font-semibold"
            >
              <Plus size={17} />

              Add Closing
            </button>
          </div>
        </div>
      </div>

      <OwnerCashSummaryCards
        summary={summary}
        formatMoney={
          formatMoney
        }
      />

      <OwnerCashMethodCards
        summary={summary}
        formatMoney={
          formatMoney
        }
      />

      <OwnerCashHistoryTable
        entries={
          filteredEntries
        }
        historyLoading={
          historyLoading
        }
        searchDate={
          searchDate
        }
        isAdmin={isAdmin}
        formatMoney={
          formatMoney
        }
        formatDate={
          formatDate
        }
        onSearchDateChange={(
          e
        ) =>
          setSearchDate(
            e.target.value
          )
        }
        onClearSearch={() =>
          setSearchDate("")
        }
        onEdit={
          handleEdit
        }
        onDelete={
          handleDelete
        }
      />
    </div>
  );
};

export default OwnerCash;