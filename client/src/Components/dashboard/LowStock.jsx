const products = [
  {
    id: 1,
    name: "Fresh Soybean Oil 5L",
    stock: 8,
    alert: 15,
    status: "Low",
  },
  {
    id: 2,
    name: "Bashundhara Atta",
    stock: 2,
    alert: 10,
    status: "Critical",
  },
  {
    id: 3,
    name: "LPG Gas Cylinder",
    stock: 25,
    alert: 15,
    status: "Good",
  },
  {
    id: 4,
    name: "Miniket Rice",
    stock: 4,
    alert: 20,
    status: "Critical",
  },
  {
    id: 5,
    name: "ACI Salt",
    stock: 9,
    alert: 20,
    status: "Low",
  },
  {
    id: 6,
    name: "Fresh Sugar",
    stock: 30,
    alert: 20,
    status: "Good",
  },
];

const statusColor = {
  Good: "bg-green-100 text-green-700",
  Low: "bg-yellow-100 text-yellow-700",
  Critical: "bg-red-100 text-red-700",
};

const progressColor = {
  Good: "bg-green-500",
  Low: "bg-yellow-500",
  Critical: "bg-red-500",
};

const LowStock = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md lg:h-[520px] flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-5 border-b">
        <h2 className="text-xl font-bold">
          Low Stock Products
        </h2>

        <button className="text-blue-600 font-medium hover:underline">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-y-auto flex-1">

        <table className="w-full">

          <thead className="bg-slate-100 sticky top-0">

            <tr>
              <th className="text-left p-4">Product</th>
              <th className="text-center p-4">Stock</th>
              <th className="text-center p-4">Alert</th>
              <th className="text-center p-4">Status</th>
            </tr>

          </thead>

          <tbody>

            {products.map((item) => {

              const percent = Math.min(
                (item.stock / item.alert) * 100,
                100
              );

              return (
                <tr
                  key={item.id}
                  className="border-b hover:bg-slate-50 transition"
                >
                  <td className="p-4">

                    <h4 className="font-semibold">
                      {item.name}
                    </h4>

                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">

                      <div
                        className={`h-2 rounded-full ${progressColor[item.status]}`}
                        style={{ width: `${percent}%` }}
                      ></div>

                    </div>

                  </td>

                  <td className="text-center font-semibold">
                    {item.stock}
                  </td>

                  <td className="text-center">
                    {item.alert}
                  </td>

                  <td className="text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[item.status]}`}
                    >
                      {item.status}
                    </span>

                  </td>
                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default LowStock;