const OwnerCashHeader = ({ user }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Owner Daily Cash
        </h1>

        <p className="text-gray-500 mt-1">
          Automatic daily cash summary from Sales,
          Purchases, Expenses and Owner Transactions.
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
  );
};

export default OwnerCashHeader;