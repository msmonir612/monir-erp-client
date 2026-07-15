const StatCard = ({ title, value, icon, color }) => {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-md
      p-5
      transition-all
      duration-300
      hover:-translate-y-2
      hover:shadow-xl
      cursor-pointer
    "
    >
      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-3">
            {value}
          </h2>

          <p className="text-green-500 text-sm mt-3">
            +12% from last period
          </p>

        </div>

        <div
          className={`${color} text-white text-3xl p-5 rounded-2xl shadow-lg`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
};

export default StatCard;