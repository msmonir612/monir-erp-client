import { FaCheckCircle } from "react-icons/fa";
import dashboard from "../../assets/dashboard-preview.png"; // আপনার Screenshot এখানে রাখবেন

const DashboardPreview = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <span className="text-blue-600 font-semibold uppercase">
            Dashboard Preview
          </span>

          <h2 className="text-5xl font-bold mt-4 text-gray-800">
            Powerful Dashboard For Your Business
          </h2>

          <p className="text-gray-500 mt-4 max-w-3xl mx-auto">
            Monitor sales, purchase, stock, profit and business performance
            from one beautiful dashboard.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <img
              src={dashboard}
              alt="Dashboard Preview"
              className="rounded-3xl shadow-2xl border"
            />
          </div>

          {/* Right */}
          <div>

            <h3 className="text-3xl font-bold mb-8">
              Everything in One Dashboard
            </h3>

            <div className="space-y-5">

              <div className="flex gap-3">
                <FaCheckCircle className="text-green-600 mt-1" />
                <span>Real-time Sales Analytics</span>
              </div>

              <div className="flex gap-3">
                <FaCheckCircle className="text-green-600 mt-1" />
                <span>Purchase Monitoring</span>
              </div>

              <div className="flex gap-3">
                <FaCheckCircle className="text-green-600 mt-1" />
                <span>Inventory Management</span>
              </div>

              <div className="flex gap-3">
                <FaCheckCircle className="text-green-600 mt-1" />
                <span>Customer & Supplier Management</span>
              </div>

              <div className="flex gap-3">
                <FaCheckCircle className="text-green-600 mt-1" />
                <span>Expense & Profit Reports</span>
              </div>

              <div className="flex gap-3">
                <FaCheckCircle className="text-green-600 mt-1" />
                <span>Responsive & Easy to Use</span>
              </div>

            </div>

            <button className="mt-10 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition">
              Explore Dashboard
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

export default DashboardPreview;