import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const DashboardChart = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-5">
        Monthly Sales & Purchase
      </h2>

      <ResponsiveContainer
        width="100%"
        height={400}
      >
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="sales"
            fill="#2563eb"
            radius={[5, 5, 0, 0]}
          />

          <Bar
            dataKey="purchase"
            fill="#16a34a"
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;