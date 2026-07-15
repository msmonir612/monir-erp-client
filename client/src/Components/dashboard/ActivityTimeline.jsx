import {
  FaShoppingCart,
  FaCashRegister,
  FaMoneyBillWave,
  FaUserPlus,
  FaExclamationTriangle,
} from "react-icons/fa";

const activities = [
  {
    id: 1,
    title: "New Purchase Added",
    subtitle: "Supplier: Akij Food Ltd.",
    time: "10:30 AM",
    icon: <FaShoppingCart />,
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Sale Completed",
    subtitle: "Invoice #INV-1001",
    time: "11:15 AM",
    icon: <FaCashRegister />,
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Expense Added",
    subtitle: "Office Expense",
    time: "12:40 PM",
    icon: <FaMoneyBillWave />,
    color: "bg-red-500",
  },
  {
    id: 4,
    title: "New Customer Added",
    subtitle: "Rahim Traders",
    time: "02:00 PM",
    icon: <FaUserPlus />,
    color: "bg-purple-500",
  },
  {
    id: 5,
    title: "Low Stock Alert",
    subtitle: "Fresh Soybean Oil 5L",
    time: "03:45 PM",
    icon: <FaExclamationTriangle />,
    color: "bg-yellow-500",
  },
];

const ActivityTimeline = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-[500px]">
      <h2 className="text-xl font-bold mb-6">
        Recent Activities
      </h2>

      <div className="space-y-5 overflow-y-auto h-[420px] pr-2">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">

            <div
              className={`${activity.color} w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0`}
            >
              {activity.icon}
            </div>

            <div className="flex-1 border-b pb-4">
              <h3 className="font-semibold text-gray-800">
                {activity.title}
              </h3>

              <p className="text-sm text-gray-500">
                {activity.subtitle}
              </p>

              <span className="text-xs text-gray-400">
                {activity.time}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;