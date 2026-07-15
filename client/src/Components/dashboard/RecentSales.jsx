const sales = [
  {
    id: "INV-1001",
    customer: "Rahim Store",
    amount: "৳ 25,000",
    profit: "৳ 4,500",
    payment: "Paid",
    date: "03 Jul 2026",
  },
  {
    id: "INV-1002",
    customer: "Karim Enterprise",
    amount: "৳ 18,000",
    profit: "৳ 2,800",
    payment: "Due",
    date: "03 Jul 2026",
  },
  {
    id: "INV-1003",
    customer: "Sumi Traders",
    amount: "৳ 42,000",
    profit: "৳ 7,200",
    payment: "Paid",
    date: "02 Jul 2026",
  },
];

const RecentSales = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold">Recent Sales</h2>

        <button className="text-blue-600 hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Invoice</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-right">Profit</th>
              <th className="p-3 text-center">Payment</th>
              <th className="p-3 text-center">Date</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-3 font-semibold">
                  {item.id}
                </td>

                <td className="p-3">
                  {item.customer}
                </td>

                <td className="p-3 text-right">
                  {item.amount}
                </td>

                <td className="p-3 text-right text-green-600 font-semibold">
                  {item.profit}
                </td>

                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.payment === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.payment}
                  </span>
                </td>

                <td className="p-3 text-center">
                  {item.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentSales;