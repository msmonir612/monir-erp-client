import {
  ArrowLeft,
  Calculator,
  RefreshCcw,
  Save,
} from "lucide-react";

const OwnerCashClosingForm = ({
  formData,
  summary,
  calculatedClosingCash,
  loading,
  summaryLoading,
  editingId,
  formatMoney,
  onChange,
  onSubmit,
  onRefreshSummary,
  onCancelEdit,
}) => {
  const cash = summary?.cash || {};

  const closingAmount =
    Number(calculatedClosingCash) || 0;

  return (
    <div className="w-full min-w-0">
      <div className="w-full max-w-[1200px] mx-auto space-y-4">
        {/* =====================================
            PAGE HEADER
        ===================================== */}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-4 py-4 md:px-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              {onCancelEdit && (
                <button
                  type="button"
                  onClick={onCancelEdit}
                  disabled={loading}
                  className="h-9 w-9 shrink-0 rounded-lg border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  title="Back"
                >
                  <ArrowLeft size={17} />
                </button>
              )}

              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-800">
                  {editingId
                    ? "Edit Daily Cash Closing"
                    : "Daily Cash Closing"}
                </h1>

                <p className="text-xs md:text-sm text-slate-500 mt-1">
                  Enter the opening cash. Sales, purchases,
                  expenses and owner transactions are
                  calculated automatically.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onRefreshSummary}
              disabled={summaryLoading || loading}
              className="h-9 inline-flex items-center justify-center gap-2 border border-green-700 text-green-700 hover:bg-green-50 rounded-lg px-4 text-sm font-semibold disabled:opacity-50"
            >
              <RefreshCcw
                size={16}
                className={
                  summaryLoading
                    ? "animate-spin"
                    : ""
                }
              />

              {summaryLoading
                ? "Refreshing..."
                : "Refresh Summary"}
            </button>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4"
        >
          {/* =====================================
              ENTRY INFORMATION
          ===================================== */}

          <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-5">
            <div className="mb-4">
              <h2 className="text-sm md:text-base font-bold text-slate-800">
                Closing Information
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Select the closing date and enter the
                available opening cash.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Closing Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={onChange}
                required
              />

              <FormInput
                label="Opening Cash"
                type="number"
                name="openingDeposit"
                value={formData.openingDeposit}
                onChange={onChange}
                placeholder="Enter opening cash"
                min="0"
                step="0.01"
                required
              />

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Note
                </label>

                <textarea
                  name="note"
                  value={formData.note}
                  onChange={onChange}
                  rows={3}
                  maxLength={500}
                  placeholder="Write an optional closing note"
                  className="w-full min-w-0 border border-slate-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
                />

                <p className="text-[11px] text-slate-400 text-right mt-1">
                  {formData.note?.length || 0}/500
                </p>
              </div>
            </div>
          </section>

          {/* =====================================
              AUTOMATIC CALCULATION
          ===================================== */}

          <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 md:px-5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Calculator size={17} />
                </div>

                <div>
                  <h2 className="text-sm md:text-base font-bold text-slate-800">
                    Automatic Cash Calculation
                  </h2>

                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Values are loaded from the selected date.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <CalculationCard
                  label="Opening Cash"
                  value={formatMoney(
                    formData.openingDeposit
                  )}
                />

                <CalculationCard
                  label="Owner Deposit"
                  value={formatMoney(
                    cash.ownerDeposit
                  )}
                  type="positive"
                />

                <CalculationCard
                  label="Cash Sales"
                  value={formatMoney(
                    cash.cashSales
                  )}
                  type="positive"
                />

                <CalculationCard
                  label="Cash Purchase"
                  value={formatMoney(
                    cash.cashPurchase
                  )}
                  type="negative"
                />

                <CalculationCard
                  label="Cash Expense"
                  value={formatMoney(
                    cash.cashExpense
                  )}
                  type="negative"
                />

                <CalculationCard
                  label="Owner Withdrawal"
                  value={formatMoney(
                    cash.ownerWithdrawal
                  )}
                  type="negative"
                />
              </div>
            </div>
          </section>

          {/* =====================================
              CLOSING CASH RESULT
          ===================================== */}

          <section
            className={`rounded-xl border shadow-sm p-4 md:p-5 ${
              closingAmount >= 0
                ? "bg-emerald-50 border-emerald-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Expected Closing Cash
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  The amount that should remain in cash
                  after all daily movements.
                </p>
              </div>

              <p
                className={`text-2xl md:text-3xl font-bold break-all ${
                  closingAmount >= 0
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}
              >
                {formatMoney(closingAmount)}
              </p>
            </div>
          </section>

          {/* =====================================
              FORM ACTIONS
          ===================================== */}

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-4 py-3 md:px-5">
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
              {onCancelEdit && (
                <button
                  type="button"
                  onClick={onCancelEdit}
                  disabled={loading}
                  className="h-10 border border-slate-300 rounded-lg px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={
                  loading ||
                  summaryLoading
                }
                className="h-10 inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white rounded-lg px-6 text-sm font-semibold transition disabled:opacity-50"
              >
                <Save size={16} />

                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Daily Closing"
                  : "Save Daily Closing"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// ======================================
// FORM INPUT
// ======================================

const FormInput = ({
  label,
  ...props
}) => {
  return (
    <div className="min-w-0">
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label}
      </label>

      <input
        {...props}
        className="w-full min-w-0 h-10 border border-slate-300 rounded-lg px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
      />
    </div>
  );
};

// ======================================
// CALCULATION CARD
// ======================================

const CalculationCard = ({
  label,
  value,
  type = "default",
}) => {
  const valueClass =
    type === "positive"
      ? "text-green-700"
      : type === "negative"
      ? "text-red-700"
      : "text-slate-800";

  const symbol =
    type === "positive"
      ? "+"
      : type === "negative"
      ? "−"
      : "";

  return (
    <div className="min-w-0 border border-slate-200 rounded-lg bg-slate-50 px-3 py-3">
      <p className="text-[11px] text-slate-500 truncate">
        {label}
      </p>

      <p
        className={`text-sm md:text-base font-bold mt-1 truncate ${valueClass}`}
        title={`${symbol} ${value}`}
      >
        {symbol && (
          <span className="mr-1">
            {symbol}
          </span>
        )}

        {value}
      </p>
    </div>
  );
};

export default OwnerCashClosingForm;