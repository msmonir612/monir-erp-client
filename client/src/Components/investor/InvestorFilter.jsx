import {
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";

const InvestorFilter = ({
  filters,
  onChange,
  onApply,
  onClear,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 min-w-0">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-800">
          Investor Filters
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          Search and filter investor
          records.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <Field label="Search">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={onChange}
              placeholder="ID, name, email or phone"
              className="w-full min-w-0 h-10 border border-slate-300 rounded-lg pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </Field>

        <Field label="Status">
          <select
            name="status"
            value={filters.status}
            onChange={onChange}
            className="w-full min-w-0 h-10 border border-slate-300 rounded-lg px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </Field>

        <Field label="Email Notification">
          <select
            name="emailNotification"
            value={
              filters.emailNotification
            }
            onChange={onChange}
            className="w-full min-w-0 h-10 border border-slate-300 rounded-lg px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="">
              All Investors
            </option>

            <option value="enabled">
              Enabled
            </option>

            <option value="disabled">
              Disabled
            </option>
          </select>
        </Field>

        <Field label="Payment Method">
          <select
            name="paymentMethod"
            value={filters.paymentMethod}
            onChange={onChange}
            className="w-full min-w-0 h-10 border border-slate-300 rounded-lg px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="">
              All Methods
            </option>

            <option value="bank">
              Bank Transfer
            </option>

            <option value="mobile_banking">
              Mobile Banking
            </option>

            <option value="cash">
              Cash
            </option>
          </select>
        </Field>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 h-9 border border-slate-300 rounded-lg px-4 text-sm font-semibold hover:bg-slate-50"
        >
          <RotateCcw size={16} />
          Clear
        </button>

        <button
          type="button"
          onClick={onApply}
          className="inline-flex items-center gap-2 h-9 bg-green-700 hover:bg-green-800 text-white rounded-lg px-5 text-sm font-semibold"
        >
          <Filter size={16} />
          Apply
        </button>
      </div>
    </div>
  );
};

const Field = ({
  label,
  children,
}) => {
  return (
    <div className="min-w-0">
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label}
      </label>

      {children}
    </div>
  );
};

export default InvestorFilter;