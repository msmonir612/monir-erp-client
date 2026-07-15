import { Bell, Search } from "lucide-react";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow flex items-center justify-between px-6 z-50">

      {/* Left */}
      <h2 className="text-xl font-semibold">
        Dashboard
      </h2>

      {/* Center */}
      <div className="relative">

        <Search
          size={18}
          className="absolute left-3 top-3 text-gray-500"
        />

        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 border rounded-lg outline-none"
        />

      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        <Bell className="cursor-pointer" />

        <div className="flex items-center gap-3">

          <img
            src="https://i.pravatar.cc/40"
            alt="Admin"
            className="w-10 h-10 rounded-full"
          />

          <div>
            <p className="font-semibold uppercase">
              monir
            </p>

            <p className="text-sm text-gray-500">
              Administrator
            </p>
          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;