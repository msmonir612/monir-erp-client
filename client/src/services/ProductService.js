import api from "./api";

// ===========================
// Get All Products
// ===========================
export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

// ===========================
// Get Single Product
// ===========================
export const getProduct = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

// ===========================
// Create Product
// ===========================
export const createProduct = async (data) => {
  const res = await api.post("/products", data);
  return res.data;
};

// ===========================
// Update Product
// ===========================
export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

// ===========================
// Delete Product
// ===========================
export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};