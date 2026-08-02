const OwnerTransactionFilter = ({
  filters,
  currentListTotals,
  formatMoney,
  onChange,
  onApply,
  onClear,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-5">
        Transaction Filters
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormField
          label="Date"
          type="date"
          name="date"
          value={filters.date}
          onChange={onChange}
        />

        <SelectField
          label="Transaction Type"
          name="transactionType"
          value={filters.transactionType}
          onChange={onChange}
          options={[
            {
              value: "",
              label: "All Types",
            },
            {
              value: "deposit",
              label: "Deposit",
            },
            {
              value: "withdrawal",
              label: "Withdrawal",
            },
          ]}
        />

        <SelectField
          label="Payment Method"
          name="paymentMethod"
          value={filters.paymentMethod}
          onChange={onChange}
          options={[
            {
              value: "",
              label: "All Methods",
            },
            {
              value: "cash",
              label: "Cash",
            },
            {
              value: "bank",
              label: "Bank",
            },
            {
              value: "mobile_banking",
              label: "Mobile Banking",
            },
          ]}
        />

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={onApply}
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white rounded-xl py-3 font-semibold"
          >
            Apply
          </button>

          <button
            type="button"
            onClick={onClear}
            className="border rounded-xl px-4 py-3 hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        <div className="bg-green-50 text-green-800 rounded-xl p-4">
          <p className="text-sm">
            Filtered Deposits
          </p>

          <p className="text-xl font-bold mt-1">
            {formatMoney(
              currentListTotals?.deposit
            )}
          </p>
        </div>

        <div className="bg-red-50 text-red-800 rounded-xl p-4">
          <p className="text-sm">
            Filtered Withdrawals
          </p>

          <p className="text-xl font-bold mt-1">
            {formatMoney(
              currentListTotals?.withdrawal
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const FormField = ({
  label,
  ...props
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <input
        {...props}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
      />
    </div>
  );
};

const SelectField = ({
  label,
  options,
  ...props
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <select
        {...props}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OwnerTransactionFilter;