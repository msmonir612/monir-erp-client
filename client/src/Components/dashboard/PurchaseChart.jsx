import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", purchase: 90000 },
  { month: "Feb", purchase: 120000 },
  { month: "Mar", purchase: 100000 },
  { month: "Apr", purchase: 150000 },
  { month: "May", purchase: 180000 },
  { month: "Jun", purchase: 210000 },
];

const PurchaseChart = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-5">
        Purchase Overview
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Bar
            dataKey="purchase"
            fill="#F97316"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PurchaseChart;