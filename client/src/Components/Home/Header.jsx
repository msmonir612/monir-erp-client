import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live Date & Time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 min-h-20 flex items-center justify-between gap-5">

        {/* Logo + Company */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <img
            src={logo}
            alt="M.R.K TRADERS"
            className="w-14 h-14 object-contain"
          />

          <div>
            <h1 className="text-xl font-bold text-green-700">
              M.R.K TRADERS
            </h1>

            <p className="text-xs text-gray-500">
              Business Management
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-6 font-medium text-gray-700">
          <a href="#home" className="hover:text-green-700 transition">
            Home
          </a>

          <a href="#about" className="hover:text-green-700 transition">
            About
          </a>

          <a href="#services" className="hover:text-green-700 transition">
            Services
          </a>

          <a href="#contact" className="hover:text-green-700 transition">
            Contact
          </a>
        </nav>

        {/* Date & Time */}
        <div className="hidden xl:flex flex-col items-center justify-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl min-w-[165px]">

          <p className="text-xl text-gray-500 font-medium">
            {formattedDate}
          </p>

          <p className="text-sm font-bold text-green-700 mt-0.5">
            {formattedTime}
          </p>

        </div>

        {/* Login Buttons */}
        <div className="flex items-center gap-2">

          <Link
            to="/login"
            className="px-4 py-2 rounded-lg border border-green-700 text-green-700 text-sm font-semibold hover:bg-green-50 transition"
          >
             Login
          </Link>

    
        </div>

      </div>
    </header>
  );
};

export default Header;