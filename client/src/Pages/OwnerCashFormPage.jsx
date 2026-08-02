import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { toast } from "react-hot-toast";

import OwnerCashClosingForm from "../Components/ownerCash/OwnerCashClosingForm";

import {
  createOwnerCash,
  getOwnerCashAutoSummary,
  getOwnerCashEntries,
  updateOwnerCash,
} from "../services/ownerCashService";

// ======================================
// DATE HELPERS
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

const getLocalDateString = (
  dateValue
) => {
  if (!dateValue) {
    return getToday();
  }

  const date = new Date(dateValue);

  const timezoneOffset =
    date.getTimezoneOffset() * 60000;

  return new Date(
    date.getTime() - timezoneOffset
  )
    .toISOString()
    .slice(0, 10);
};

const getInitialForm = () => ({
  date: getToday(),
  openingDeposit: "",
  note: "",
});

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

const OwnerCashFormPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEditing = Boolean(id);

  const [
    formData,
    setFormData,
  ] = useState(getInitialForm);

  const [
    summary,
    setSummary,
  ] = useState(getInitialSummary);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    pageLoading,
    setPageLoading,
  ] = useState(isEditing);

  const [
    summaryLoading,
    setSummaryLoading,
  ] = useState(false);

  // ======================================
  // HELPERS
  // ======================================

  const toNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  };

  const formatMoney = (amount) => {
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

  // ======================================
  // CALCULATED CLOSING CASH
  // ======================================

  const calculatedClosingCash =
    useMemo(() => {
      const cash =
        summary?.cash || {};

      return (
        toNumber(
          formData.openingDeposit
        ) +
        toNumber(
          cash.ownerDeposit
        ) +
        toNumber(
          cash.cashSales
        ) -
        toNumber(
          cash.cashPurchase
        ) -
        toNumber(
          cash.cashExpense
        ) -
        toNumber(
          cash.ownerWithdrawal
        )
      );
    }, [
      formData.openingDeposit,
      summary,
    ]);

  // ======================================
  // LOAD AUTO SUMMARY
  // ======================================

  const loadAutoSummary =
    async (selectedDate) => {
      if (!selectedDate) {
        return;
      }

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
            "Unable to load automatic summary"
        );

        setSummary(
          getInitialSummary()
        );
      } finally {
        setSummaryLoading(false);
      }
    };

  // ======================================
  // LOAD EDIT DATA
  // ======================================

  const loadEditData = async () => {
    try {
      setPageLoading(true);

      const data =
        await getOwnerCashEntries();

      const entries =
        data?.entries || [];

      const selectedEntry =
        entries.find(
          (entry) =>
            entry._id === id
        );

      if (!selectedEntry) {
        toast.error(
          "Daily closing record not found"
        );

        navigate(
          "/owner-cash",
          {
            replace: true,
          }
        );

        return;
      }

      const localDate =
        getLocalDateString(
          selectedEntry.date
        );

      setFormData({
        date: localDate,

        openingDeposit:
          selectedEntry
            .openingDeposit ?? "",

        note:
          selectedEntry.note || "",
      });

      await loadAutoSummary(
        localDate
      );
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          error?.message ||
          "Unable to load closing record"
      );

      navigate(
        "/owner-cash",
        {
          replace: true,
        }
      );
    } finally {
      setPageLoading(false);
    }
  };

  // ======================================
  // INITIAL LOAD
  // ======================================

  useEffect(() => {
    if (isEditing) {
      loadEditData();
    } else {
      const today = getToday();

      setFormData({
        ...getInitialForm(),
        date: today,
      });

      loadAutoSummary(today);
    }
  }, [id]);

  // ======================================
  // FORM CHANGE
  // ======================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (
      name === "date" &&
      value
    ) {
      loadAutoSummary(value);
    }
  };

  // ======================================
  // REFRESH SUMMARY
  // ======================================

  const handleRefreshSummary =
    async () => {
      if (!formData.date) {
        toast.error(
          "Please select a date"
        );

        return;
      }

      await loadAutoSummary(
        formData.date
      );

      toast.success(
        "Summary refreshed"
      );
    };

  // ======================================
  // SUBMIT
  // ======================================

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (!formData.date) {
        toast.error(
          "Date is required"
        );

        return;
      }

      const openingCash =
        Number(
          formData.openingDeposit
        );

      if (
        !Number.isFinite(
          openingCash
        ) ||
        openingCash < 0
      ) {
        toast.error(
          "Opening Cash must be zero or greater"
        );

        return;
      }

      if (
        calculatedClosingCash < 0
      ) {
        toast.error(
          "Closing Cash cannot be negative"
        );

        return;
      }

      const payload = {
        date: formData.date,

        openingDeposit:
          openingCash,

        note:
          formData.note.trim(),
      };

      try {
        setLoading(true);

        let data;

        if (isEditing) {
          data =
            await updateOwnerCash(
              id,
              payload
            );
        } else {
          data =
            await createOwnerCash(
              payload
            );
        }

        toast.success(
          data?.message ||
            (isEditing
              ? "Daily closing updated successfully"
              : "Daily closing saved successfully")
        );

        navigate(
          "/owner-cash",
          {
            replace: true,
          }
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Unable to save Daily Closing"
        );
      } finally {
        setLoading(false);
      }
    };

  // ======================================
  // BACK
  // ======================================

  const handleCancel = () => {
    if (loading) {
      return;
    }

    navigate("/owner-cash");
  };

  // ======================================
  // LOADING SCREEN
  // ======================================

  if (pageLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-8 py-6 text-center">
          <div className="h-8 w-8 border-4 border-slate-200 border-t-green-700 rounded-full animate-spin mx-auto" />

          <p className="text-sm text-slate-500 mt-4">
            Loading daily closing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <OwnerCashClosingForm
        formData={formData}
        summary={summary}
        calculatedClosingCash={
          calculatedClosingCash
        }
        loading={loading}
        summaryLoading={
          summaryLoading
        }
        editingId={
          isEditing ? id : null
        }
        formatMoney={
          formatMoney
        }
        onChange={
          handleChange
        }
        onSubmit={
          handleSubmit
        }
        onRefreshSummary={
          handleRefreshSummary
        }
        onCancelEdit={
          handleCancel
        }
      />
    </div>
  );
};

export default OwnerCashFormPage;