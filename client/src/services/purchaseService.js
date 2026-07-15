import api from "./api";

// ===========================
// Get All Purchases
// ===========================
export const getPurchases = async () => {
  const res = await api.get("/purchases");
  return res.data;
};

// ===========================
// Get Single Purchase
// ===========================
export const getPurchase = async (id) => {
  const res = await api.get(`/purchases/${id}`);
  return res.data;
};

// ===========================
// Create Purchase
// ===========================
export const createPurchase = async (data) => {
  const res = await api.post("/purchases", data);
  return res.data;
};

// ===========================
// Delete Purchase
// ===========================
export const deletePurchase = async (id) => {
  const res = await api.delete(`/purchases/${id}`);
  return res.data;
};