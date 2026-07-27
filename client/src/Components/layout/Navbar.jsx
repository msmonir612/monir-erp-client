import {
  Bell,
  Search,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import monirImg from "../../assets/monir.png";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-6 z-50">

      {/* Left */}
      <h2 className="text-xl font-semibold text-slate-800">
        Dashboard
      </h2>

      {/* Center Search */}
      <div className="relative hidden md:block">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Notification */}
        <button
          type="button"
          className="relative p-2 hover:bg-gray-100 rounded-full"
        >
          <Bell
            size={21}
            className="text-gray-600"
          />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">

          {/* Profile Photo */}
          <img
            src={monirImg}
            alt={user?.name || "User"}
            className="w-10 h-10 rounded-full object-cover border-2 border-green-600"
          />

          {/* User Information */}
          <div className="hidden sm:block">
            <p className="font-semibold text-sm text-slate-800">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-gray-500 capitalize">
              {user?.role === "admin"
                ? "Administrator"
                : user?.role || ""}
            </p>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="ml-2 flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-2 rounded-lg transition"
          >
            <LogOut size={18} />

            <span className="hidden lg:inline text-sm font-medium">
              Logout
            </span>
          </button>

        </div>

      </div>

    </header>
  );
};

export default Navbar;