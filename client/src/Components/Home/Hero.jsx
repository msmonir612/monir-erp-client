import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBoxOpen,
  FaShoppingCart,
  FaChartLine,
} from "react-icons/fa";

const Hero = () => {
  return (
    <section
      id="home"
      className="bg-gradient-to-r from-slate-900 via-green-900 to-slate-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left */}
          <div>
            <p className="text-green-300 font-semibold mb-4">
              Welcome to M.R.K TRADERS
            </p>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Reliable Business.
              <span className="block text-green-400">
                Smarter Management.
              </span>
            </h1>

            <p className="text-lg mt-6 text-gray-300 max-w-xl">
              Rice, feed, bran, gas, oil and general trading business
              managed through one modern business platform.
            </p>

            <div className="flex flex-wrap gap-4 mt-9">
              <Link
                to="/login?role=admin"
                className="bg-green-600 hover:bg-green-700 px-7 py-3.5 rounded-xl font-semibold transition flex items-center gap-2"
              >
                Admin Login
                <FaArrowRight />
              </Link>

              <Link
                to="/login?role=manager"
                className="border border-white/70 hover:bg-white hover:text-slate-900 px-7 py-3.5 rounded-xl font-semibold transition"
              >
                Manager Login
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-7">
              <FaBoxOpen className="text-4xl text-green-400 mb-4" />
              <h3 className="text-xl font-bold">Products</h3>
              <p className="text-gray-300 mt-2">
                Manage business products efficiently.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-7">
              <FaShoppingCart className="text-4xl text-green-400 mb-4" />
              <h3 className="text-xl font-bold">Trading</h3>
              <p className="text-gray-300 mt-2">
                Purchase and sales management.
              </p>
            </div>

            <div className="col-span-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-7">
              <FaChartLine className="text-4xl text-green-400 mb-4" />

              <h3 className="text-xl font-bold">
                M.R.K Business Management
              </h3>

              <p className="text-gray-300 mt-2">
                Supplier, customer, stock, purchase, sales and business
                performance in one organized system.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;