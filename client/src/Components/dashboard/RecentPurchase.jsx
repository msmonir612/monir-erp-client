const purchases = [
  {
    id: "PUR-1001",
    supplier: "Akij Food Ltd.",
    amount: "৳ 52,000",
    paid: "৳ 40,000",
    due: "৳ 12,000",
    date: "02 Jul 2026",
    status: "Partial",
  },
  {
    id: "PUR-1002",
    supplier: "Square Consumer",
    amount: "৳ 18,500",
    paid: "৳ 18,500",
    due: "৳ 0",
    date: "02 Jul 2026",
    status: "Paid",
  },
  {
    id: "PUR-1003",
    supplier: "Fresh LPG",
    amount: "৳ 75,000",
    paid: "৳ 30,000",
    due: "৳ 45,000",
    date: "01 Jul 2026",
    status: "Due",
  },
];

const RecentPurchase = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold">Recent Purchases</h2>

        <button className="text-blue-600 hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Invoice</th>
              <th className="text-left p-3">Supplier</th>
              <th className="text-right p-3">Amount</th>
              <th className="text-right p-3">Paid</th>
              <th className="text-right p-3">Due</th>
              <th className="text-center p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {purchases.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-3 font-medium">{item.id}</td>

                <td className="p-3">{item.supplier}</td>

                <td className="text-right p-3">
                  {item.amount}
                </td>

                <td className="text-right p-3">
                  {item.paid}
                </td>

                <td className="text-right p-3 text-red-600">
                  {item.due}
                </td>

                <td className="text-center p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      item.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Partial"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPurchase;