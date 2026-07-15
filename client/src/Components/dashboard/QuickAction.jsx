import {
  FaShoppingCart,
  FaCashRegister,
  FaBoxOpen,
  FaTruck,
  FaUsers,
  FaMoneyBillWave,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const actions = [
  {
    title: "New Purchase",
    icon: <FaShoppingCart size={22} />,
    color: "bg-orange-500",
    path: "/purchase/add",
  },
  {
    title: "New Sale",
    icon: <FaCashRegister size={22} />,
    color: "bg-blue-500",
    path: "/sales/add",
  },
  {
    title: "Add Product",
    icon: <FaBoxOpen size={22} />,
    color: "bg-green-500",
    path: "/products/add",
  },
  {
    title: "Add Supplier",
    icon: <FaTruck size={22} />,
    color: "bg-purple-500",
    path: "/suppliers/add",
  },
  {
    title: "Add Customer",
    icon: <FaUsers size={22} />,
    color: "bg-pink-500",
    path: "/customers/add",
  },
  {
    title: "Expense",
    icon: <FaMoneyBillWave size={22} />,
    color: "bg-red-500",
    path: "/expenses/add",
  },
  {
    title: "Reports",
    icon: <FaChartBar size={22} />,
    color: "bg-cyan-500",
    path: "/reports",
  },
  {
    title: "Settings",
    icon: <FaCog size={22} />,
    color: "bg-slate-600",
    path: "/settings",
  },
];

const QuickAction = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-5">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((item) => (
          <Link
            key={item.title}
            to={item.path}
            className={`${item.color} text-white rounded-xl p-5 flex flex-col items-center justify-center gap-3 transition duration-300 hover:scale-105 hover:shadow-xl`}
          >
            {item.icon}

            <span className="text-sm font-semibold text-center">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickAction;