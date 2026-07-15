import api from "./api";

// Dashboard Summary
export const getDashboardSummary = async () => {
  const { data } = await api.get("/dashboard/summary");
  return data;
};

// Dashboard Chart
export const getChartData = async () => {
  const { data } = await api.get("/dashboard/chart");
  return data;
};