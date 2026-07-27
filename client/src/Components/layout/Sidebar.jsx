import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Truck,
  ShoppingCart,
  Users,
  ReceiptText,
} from "lucide-react";
import { IoMdSettings } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";


const Sidebar = () => {

  const {
    user,
    isAdmin,
    isManager,
  } = useAuth();



  const menus = [

    // =========================
    // Admin + Manager Dashboard
    // =========================

    ...(isAdmin 
      ? [
          {
            title: "Dashboard",
            path: "/dashboard",
            icon: <LayoutDashboard size={20} />,
          },
        ]
      : []
    ),



    // =========================
    // Admin Only
    // =========================

    ...(isAdmin
      ? [
          {
            title: "Managers",
            path: "/manager",
            icon: <Users size={20} />,
          },
        ]
      : []
    ),



    // =========================
    // Admin + Manager
    // =========================

    {
      title: "Stock",
      path: "/stock",
      icon: <ReceiptText size={20} />,
    },

    {
      title: "Products",
      path: "/product",
      icon: <Boxes size={20} />,
    },

    {
      title: "Suppliers",
      path: "/supplier",
      icon: <Truck size={20} />,
    },

    {
      title: "Purchases",
      path: "/purchase",
      icon: <ShoppingCart size={20} />,
    },

    {
      title: "Sales",
      path: "/sale",
      icon: <ReceiptText size={20} />,
    },

    {
      title: "Customers",
      path: "/customer",
      icon: <Users size={20} />,
    },

    {
      title: "Expenses",
      path: "/expense",
      icon: <ReceiptText size={20} />,
    },
   ...(isAdmin
  ? [
      {
        title: "Settings",
        path: "/settings",
        icon: <IoMdSettings size={20} />,
      },
    ]
  : []
),

  ];



  return (

    <div className="fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white shadow-lg">


      {/* Logo */}

      <div className="h-16 flex items-center justify-center border-b border-slate-700">

        <h1 className="text-xl font-bold">
          M.R.K TRADERS
        </h1>

      </div>



      {/* User Info */}

      <div className="px-6 py-3 border-b border-slate-700">

        <p className="text-sm">
          {user?.name}
        </p>

        <p className="text-xs text-gray-400 uppercase">
          {user?.role}
        </p>

      </div>



      {/* Menu */}

      <div className="py-4">

        {menus.map((menu) => (

          <NavLink

            key={menu.path}

            to={menu.path}

            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition-all ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`
            }

          >

            {menu.icon}

            <span>
              {menu.title}
            </span>

          </NavLink>

        ))}

      </div>


    </div>

  );
};


export default Sidebar;