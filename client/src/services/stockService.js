import api from "./api";

// সব Stock
export const getAllStock = async () => {
  const { data } = await api.get("/stock");
  return data;
};

// Summary
export const getStockSummary = async () => {
  const { data } = await api.get("/stock/summary");
  return data;
};

// Low Stock
export const getLowStock = async () => {
  const { data } = await api.get("/stock/low-stock");
  return data;
};

// Out Of Stock
export const getOutOfStock = async () => {
  const { data } = await api.get("/stock/out-stock");
  return data;
};