import {
  FaBoxOpen,
  FaShoppingCart,
  FaCashRegister,
  FaUsers,
  FaTruck,
  FaChartBar,
  FaWarehouse,
  FaUserShield,
} from "react-icons/fa";

const services = [
  {
    title: "Product Management",
    description: "Manage all products, categories and stock efficiently.",
    icon: <FaBoxOpen />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Purchase Management",
    description: "Track supplier purchases and purchase history.",
    icon: <FaShoppingCart />,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Sales Management",
    description: "Create invoices and monitor daily sales.",
    icon: <FaCashRegister />,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Customer Management",
    description: "Store customer information and due history.",
    icon: <FaUsers />,
    color: "bg-pink-100 text-pink-600",
  },
  {
    title: "Supplier Management",
    description: "Manage suppliers and purchase records.",
    icon: <FaTruck />,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Reports & Analytics",
    description: "View sales, purchase and profit reports.",
    icon: <FaChartBar />,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    title: "Inventory Control",
    description: "Monitor stock levels and low stock alerts.",
    icon: <FaWarehouse />,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "Role Management",
    description: "Admin & Manager permission control system.",
    icon: <FaUserShield />,
    color: "bg-red-100 text-red-600",
  },
];

const Services = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <span className="text-blue-600 font-semibold uppercase">
            Our Services
          </span>

          <h2 className="text-5xl font-bold mt-4 text-gray-800">
            Everything Your Business Needs
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            MONIR GROUP ERP provides all essential tools to manage your
            business from one secure platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${service.color}`}
              >
                {service.icon}
              </div>

              <h3 className="text-xl font-bold mt-6 text-gray-800">
                {service.title}
              </h3>

              <p className="text-gray-500 mt-3 leading-7">
                {service.description}
              </p>

              <button className="mt-6 text-blue-600 font-semibold hover:text-blue-800">
                Learn More →
              </button>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Services;