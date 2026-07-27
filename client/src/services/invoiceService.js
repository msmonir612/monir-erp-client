import api from "./api";

// ===================================
// Get Single Invoice (Sale)
// ===================================
export const getInvoice = async (id) => {
  const response = await api.get(`/sales/${id}`);
  return response.data;
};