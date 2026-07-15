import api from "./api";

// Get All Sales
export const getSales = async () => {
  const res = await api.get("/sales");
  return res.data;
};

// Get Single Sale
export const getSale = async (id) => {
  const res = await api.get(`/sales/${id}`);
  return res.data;
};

// Create Sale
export const createSale = async (data) => {
  const res = await api.post("/sales", data);
  return res.data;
};

// Delete Sale
export const deleteSale = async (id) => {
  const res = await api.delete(`/sales/${id}`);
  return res.data;
};