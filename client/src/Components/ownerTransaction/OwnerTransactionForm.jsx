const OwnerTransactionForm = ({
  formData,
  loading,
  editingId,
  onChange,
  onSubmit,
  onCancelEdit,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {editingId
              ? "Edit Owner Transaction"
              : "Add Owner Transaction"}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Record owner deposit or withdrawal.
          </p>
        </div>

        {editingId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <FormField
          label="Date and Time"
          type="datetime-local"
          name="transactionDate"
          value={formData.transactionDate}
          onChange={onChange}
          required
        />

        <SelectField
          label="Transaction Type"
          name="transactionType"
          value={formData.transactionType}
          onChange={onChange}
          options={[
            {
              value: "deposit",
              label: "Owner Deposit",
            },
            {
              value: "withdrawal",
              label: "Owner Withdrawal",
            },
          ]}
        />

        <SelectField
          label="Payment Method"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={onChange}
          options={[
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

        <FormField
          label="Amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={onChange}
          placeholder="Enter amount"
          min="0.01"
          step="0.01"
          required
        />

        {formData.paymentMethod === "bank" && (
          <FormField
            label="Bank Name"
            name="bankName"
            value={formData.bankName}
            onChange={onChange}
            placeholder="Enter bank name"
            required
          />
        )}

        {formData.paymentMethod ===
          "mobile_banking" && (
          <SelectField
            label="Mobile Banking"
            name="mobileBankingName"
            value={formData.mobileBankingName}
            onChange={onChange}
            options={[
              {
                value: "",
                label: "Select service",
              },
              {
                value: "bkash",
                label: "bKash",
              },
              {
                value: "nagad",
                label: "Nagad",
              },
              {
                value: "rocket",
                label: "Rocket",
              },
              {
                value: "upay",
                label: "Upay",
              },
              {
                value: "other",
                label: "Other",
              },
            ]}
          />
        )}

        {formData.paymentMethod !== "cash" && (
          <FormField
            label="Account / Mobile Number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={onChange}
            placeholder="Optional account number"
          />
        )}

        <FormField
          label="Reference"
          name="reference"
          value={formData.reference}
          onChange={onChange}
          placeholder="Transaction reference"
        />

        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>

          <textarea
            name="note"
            value={formData.note}
            onChange={onChange}
            rows={3}
            maxLength={500}
            placeholder="Optional note"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`md:col-span-2 lg:col-span-3 text-white rounded-xl py-3 font-semibold transition disabled:opacity-50 ${
            formData.transactionType === "deposit"
              ? "bg-green-700 hover:bg-green-800"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading
            ? "Saving..."
            : editingId
            ? "Update Transaction"
            : formData.transactionType === "deposit"
            ? "Save Owner Deposit"
            : "Save Owner Withdrawal"}
        </button>
      </form>
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

export default OwnerTransactionForm;