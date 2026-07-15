import { FaFacebook, FaYoutube, FaGithub, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Company */}

          <div>

            <h2 className="text-3xl font-bold text-blue-400">
              MONIR GROUP
            </h2>

            <p className="mt-4 text-gray-400">
              Smart ERP Solution for Product, Purchase,
              Sales, Inventory and Business Management.
            </p>

          </div>

          {/* Modules */}

          <div>

            <h3 className="text-xl font-semibold mb-5">
              Modules
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>Product</li>
              <li>Purchase</li>
              <li>Sales</li>
              <li>Inventory</li>
              <li>Reports</li>
            </ul>

          </div>

          {/* Company */}

          <div>

            <h3 className="text-xl font-semibold mb-5">
              Company
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>About</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>

          </div>

          {/* Social */}

          <div>

            <h3 className="text-xl font-semibold mb-5">
              Follow Us
            </h3>

            <div className="flex gap-4 text-2xl">

              <FaFacebook className="hover:text-blue-500 cursor-pointer" />

              <FaYoutube className="hover:text-red-500 cursor-pointer" />

              <FaGithub className="hover:text-gray-300 cursor-pointer" />

              <FaEnvelope className="hover:text-green-500 cursor-pointer" />

            </div>

          </div>

        </div>

        <hr className="border-slate-700 my-10" />

        <div className="flex flex-col lg:flex-row justify-between items-center gap-3">

          <p className="text-gray-400">
            © 2026 MONIR GROUP. All Rights Reserved.
          </p>

          <p className="text-gray-500">
            Developed by <span className="text-blue-400">Monir</span>
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;