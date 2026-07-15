import { useEffect, useState } from "react";



import DashboardCards from "../Components/dashboard/DashboardCards";
import { getDashboardSummary,getChartData } from "../services/dashboardService";
import DashboardChart from "../Components/dashboard/DashboardChart";

const Dashboard = () => {
  const [summary, setSummary] = useState({});
const [chartData, setChartData] = useState([]);
sessionStorage.getItem("token")
  const loadDashboard = async () => {
    try {
      const data = await getDashboardSummary();
      const chart = await getChartData();

      setSummary(data);
      setChartData(chart);
    }catch (error) {
  console.log(error.response?.data);
  console.log(error.response?.status);
}
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <DashboardCards summary={summary} />
         <DashboardChart data={chartData} />
    </div>
  );
};

export default Dashboard;