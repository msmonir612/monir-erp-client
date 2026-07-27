import {
  FaBoxOpen,
  FaWarehouse,
  FaTruckLoading,
  FaUsers,
  FaChartLine,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaBoxOpen />,
      title: "Product Management",
      description:
        "Organized management of rice, feed, bran, oil, gas and other business products.",
    },
    {
      icon: <FaWarehouse />,
      title: "Stock Management",
      description:
        "Maintain accurate stock records and monitor product availability efficiently.",
    },
    {
      icon: <FaTruckLoading />,
      title: "Purchase Management",
      description:
        "Manage purchases, supplier transactions and product receiving in one organized system.",
    },
    {
      icon: <FaUsers />,
      title: "Supplier & Customer",
      description:
        "Maintain supplier and customer information with structured business records.",
    },
    {
      icon: <FaFileInvoiceDollar />,
      title: "Sales & Accounts",
      description:
        "Manage sales, invoices, payments and outstanding balances efficiently.",
    },
    {
      icon: <FaChartLine />,
      title: "Business Insights",
      description:
        "Track important business activities and make better decisions from accurate information.",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-green-700 font-semibold uppercase tracking-wider text-sm">
            Our Business System
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Smarter Management for
            <span className="text-green-700"> M.R.K TRADERS</span>
          </h2>

          <p className="text-gray-600 mt-4 leading-relaxed">
            An integrated management system designed to keep our products,
            purchases, sales, stock, suppliers and customers organized.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-2xl group-hover:bg-green-700 group-hover:text-white transition duration-300">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 mt-6">
                {feature.title}
              </h3>

              <p className="text-gray-600 mt-3 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;