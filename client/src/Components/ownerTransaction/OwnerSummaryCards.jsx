const OwnerSummaryCards = ({
  summary,
  formatMoney,
}) => {
  return (
    <>
      {/* Main Summary */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Deposit"
          value={formatMoney(
            summary?.totalDeposit
          )}
          type="deposit"
        />

        <SummaryCard
          title="Total Withdrawal"
          value={formatMoney(
            summary?.totalWithdrawal
          )}
          type="withdrawal"
        />

        <SummaryCard
          title="Net Movement"
          value={formatMoney(
            summary?.netMovement
          )}
          type={
            Number(summary?.netMovement) >= 0
              ? "deposit"
              : "withdrawal"
          }
        />

        <SummaryCard
          title="Transactions"
          value={
            summary?.transactionCount || 0
          }
        />
      </div>

      {/* Payment Method Summary */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MethodSummaryCard
          title="Cash"
          data={summary?.cash}
          formatMoney={formatMoney}
        />

        <MethodSummaryCard
          title="Bank"
          data={summary?.bank}
          formatMoney={formatMoney}
        />

        <MethodSummaryCard
          title="Mobile Banking"
          data={summary?.mobileBanking}
          formatMoney={formatMoney}
        />
      </div>
    </>
  );
};

// ======================================
// SUMMARY CARD
// ======================================

const SummaryCard = ({
  title,
  value,
  type,
}) => {
  const className =
    type === "deposit"
      ? "bg-green-50 border-green-200 text-green-800"
      : type === "withdrawal"
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-white border-gray-200 text-slate-800";

  return (
    <div
      className={`rounded-2xl p-5 shadow-sm border ${className}`}
    >
      <p className="text-sm opacity-75">
        {title}
      </p>

      <p className="text-2xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
};

// ======================================
// METHOD SUMMARY CARD
// ======================================

const MethodSummaryCard = ({
  title,
  data,
  formatMoney,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5">
      <h3 className="font-bold text-slate-800">
        {title}
      </h3>

      <div className="space-y-3 mt-4">
        <SummaryRow
          label="Deposit"
          value={formatMoney(
            data?.deposit
          )}
          positive
        />

        <SummaryRow
          label="Withdrawal"
          value={formatMoney(
            data?.withdrawal
          )}
          negative
        />

        <SummaryRow
          label="Net"
          value={formatMoney(data?.net)}
          bold
        />
      </div>
    </div>
  );
};

// ======================================
// SUMMARY ROW
// ======================================

const SummaryRow = ({
  label,
  value,
  positive,
  negative,
  bold,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span
        className={`${
          bold
            ? "font-bold"
            : "font-semibold"
        } ${
          positive
            ? "text-green-700"
            : negative
            ? "text-red-700"
            : "text-slate-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

export default OwnerSummaryCards;