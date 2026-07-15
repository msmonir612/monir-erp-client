import {
  FaBoxOpen,
  FaShoppingCart,
  FaMoneyBillWave,
  FaUsers,
  FaTruck,
  FaChartLine,
} from "react-icons/fa";

const stats = [
  {
    title: "Products",
    value: "1,250+",
    icon: <FaBoxOpen />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Purchase",
    value: "৳10M",
    icon: <FaShoppingCart />,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Sales",
    value: "৳12.5M",
    icon: <FaMoneyBillWave />,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Customers",
    value: "2,500+",
    icon: <FaUsers />,
    color: "bg-pink-100 text-pink-600",
  },
  {
    title: "Suppliers",
    value: "120+",
    icon: <FaTruck />,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Profit",
    value: "৳2.3M",
    icon: <FaChartLine />,
    color: "bg-cyan-100 text-cyan-600",
  },
];

const Stats = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">
            Business Statistics
          </h2>

          <p className="text-gray-500 mt-3">
            Overview of your business performance.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">

          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 text-center"
            >
              <div
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl ${item.color}`}
              >
                {item.icon}
              </div>

              <h3 className="mt-5 text-3xl font-bold text-gray-800">
                {item.value}
              </h3>

              <p className="text-gray-500 mt-2">
                {item.title}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Stats;