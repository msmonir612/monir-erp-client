import { Link } from "react-router-dom";
import QuickAction from "../Dashboard/QuickAction"
import {
  FaArrowRight,
  FaChartLine,
  FaBoxOpen,
  FaShoppingCart,
} from "react-icons/fa";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-gray-700 via-gray-700 to-purple-700 text-white">

      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}

          <div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mt-6">
              M.R.K enterprice
            </h1>

            <p className="text-xl mt-6 text-gray-200">
              Manage Product, Purchase, Sales, Stock, Customer,
              Supplier and Reports from one powerful dashboard.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                to="/login"
                className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
              >
                Login
              </Link>

              <Link
                to="/dashboard"
                className="border border-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-700 transition flex items-center gap-2"
              >
                Dashboard
                <FaArrowRight />
              </Link>

            </div>

          </div>

          {/* Right */}
          <div>
            <QuickAction />
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;