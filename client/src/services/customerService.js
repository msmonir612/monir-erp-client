import api from "./api";

// ==========================
// Get All Customers
// ==========================
export const getCustomers = async () => {
  const res = await api.get("/customers");
  return res.data;
};

// ==========================
// Get Single Customer
// ==========================
export const getCustomer = async (id) => {
  const res = await api.get(`/customers/${id}`);
  return res.data;
};

// ==========================
// Create Customer
// ==========================
export const createCustomer = async (data) => {
  const res = await api.post("/customers", data);
  return res.data;
};

// ==========================
// Update Customer
// ==========================
export const updateCustomer = async (id, data) => {
  const res = await api.put(`/customers/${id}`, data);
  return res.data;
};

// ==========================
// Delete Customer
// ==========================
export const deleteCustomer = async (id) => {
  const res = await api.delete(`/customers/${id}`);
  return res.data;
};