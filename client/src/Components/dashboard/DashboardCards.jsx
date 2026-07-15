import {
  Boxes,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  Truck,
} from "lucide-react";

const DashboardCards = ({ summary }) => {
  const cards = [
    {
      title: "Today's Purchases",
      value: `৳ ${summary?.todaysPurchases || 0}`,
      icon: <ShoppingCart size={20} />,
      bg: "bg-green-600",
    },
    {
      title:"Today's Sale",
      value:`৳ ${summary?.todaysSale || 0}`,
      icon: <Boxes size={30} /> ,
      bg: "bg-green-500"
    },
    {
      title:"Today's expense",
      value:`৳ ${summary?.todaysExpense}`,
      icon: <DollarSign />,
      bg: "bg-red-500"
    },
    {
      title: "Today's Profit",
      value: `৳ ${summary?.todaysProfit}`,
      icon: <Boxes />,
      bg: "bg-green-400"
    },
    {
      title:"Today's Net Profit",
      value: `৳ ${summary?.todaysNetProfit}`,
      icon: <Boxes /> ,
      bg: "bg-green-700"
    },
    {
      title: "Total Products",
      value: summary?.totalProducts || 0,
      icon: <Boxes size={30} />,
      bg: "bg-blue-600",
    },
    {
      title: "Total Customers",
      value: summary?.totalCustomers || 0,
      icon: <Users size={30} />,
      bg: "bg-green-600",
    },
    {
      title: "Total Suppliers",
      value: summary?.totalSuppliers || 0,
      icon: <Truck size={30} />,
      bg: "bg-orange-500",
    },
    {
      title: "Total Purchase",
      value: `৳ ${summary?.totalPurchase || 0}`,
      icon: <ShoppingCart size={30} />,
      bg: "bg-red-600",
    },
    {
      title: "Total Sales",
      value: `৳ ${summary?.totalSales || 0}`,
      icon: <DollarSign size={30} />,
      bg: "bg-red-600",
    },
    {
      title: "Total Profit",
      value: `৳ ${summary?.totalProfit || 0}`,
      icon: <TrendingUp size={30} />,
      bg: "bg-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bg} rounded-xl shadow-lg p-6 text-white flex justify-between items-center hover:scale-105 transition duration-300`}
        >
          <div>
            <h2 className="text-15 font-medium">{card.title}</h2>
            <h1 className="text-xl font-bold mt-2">{card.value}</h1>
          </div>

          <div className="bg-white/20 p-4 rounded-full">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;