import {
  FaWallet,
  FaUniversity,
  FaArrowCircleDown,
  FaArrowCircleUp,
  FaChartLine,
  FaBoxOpen,
} from "react-icons/fa";

const data = [
  {
    title: "Cash in Hand",
    value: "৳ 1,25,000",
    icon: <FaWallet />,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    title: "Bank Balance",
    value: "৳ 8,50,000",
    icon: <FaUniversity />,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "Today's Collection",
    value: "৳ 75,000",
    icon: <FaArrowCircleDown />,
    bg: "bg-cyan-100",
    color: "text-cyan-600",
  },
  {
    title: "Today's Payment",
    value: "৳ 48,000",
    icon: <FaArrowCircleUp />,
    bg: "bg-red-100",
    color: "text-red-600",
  },
  {
    title: "Net Profit",
    value: "৳ 28,500",
    icon: <FaChartLine />,
    bg: "bg-emerald-100",
    color: "text-emerald-600",
  },
  {
    title: "Inventory Value",
    value: "৳ 12,50,000",
    icon: <FaBoxOpen />,
    bg: "bg-yellow-100",
    color: "text-yellow-600",
  },
];

const BusinessHealth = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Business Health
        </h2>

        <button className="text-blue-600 hover:underline">
          View Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {data.map((item, index) => (
          <div
            key={index}
            className="border rounded-xl p-5 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500 text-sm">
                  {item.title}
                </p>

                <h3 className="text-2xl font-bold mt-2">
                  {item.value}
                </h3>

              </div>

              <div
                className={`${item.bg} ${item.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl`}
              >
                {item.icon}
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default BusinessHealth;