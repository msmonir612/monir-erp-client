import { useEffect, useState } from "react";
import { CalendarDays, Clock3, RefreshCw } from "lucide-react";

const DashboardHeader = ({ onRefresh }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();

    if (hour < 12) return "🌞 Good Morning";
    if (hour < 17) return "☀️ Good Afternoon";
    if (hour < 20) return "🌇 Good Evening";

    return "🌙 Good Night";
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">

      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">

        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {getGreeting()}, Monir 👋
          </h1>

          <p className="text-slate-500 mt-2">
            Welcome to <span className="font-semibold">MONIR GROUP ERP</span>
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">

          <div className="flex items-center gap-2 text-slate-600">
            <CalendarDays size={20} />

            <span>
              {currentTime.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Clock3 size={20} />

            <span>
              {currentTime.toLocaleTimeString()}
            </span>
          </div>

          <button
            onClick={onRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw size={18} />

            Refresh
          </button>

        </div>

      </div>

    </div>
  );
};

export default DashboardHeader;