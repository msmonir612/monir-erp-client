import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", profit: 30000, expense: 12000 },
  { month: "Feb", profit: 45000, expense: 18000 },
  { month: "Mar", profit: 40000, expense: 15000 },
  { month: "Apr", profit: 55000, expense: 22000 },
  { month: "May", profit: 70000, expense: 25000 },
  { month: "Jun", profit: 65000, expense: 20000 },
];

const ProfitChart = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-5">
        Profit vs Expense
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="profit"
            stroke="#16A34A"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="expense"
            stroke="#DC2626"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitChart;