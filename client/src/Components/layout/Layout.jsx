import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="mt-16 p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Layout;