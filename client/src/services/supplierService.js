import api from "./api";

// =======================
// SUPPLIER API
// =======================

// GET ALL SUPPLIERS
export const getSuppliers = async () => {
  const res = await api.get("/suppliers");
  return res.data;
};


// GET SINGLE SUPPLIER
export const getSupplier = async (id) => {
  const res = await api.get(`/suppliers/${id}`);
  return res.data;
};


// CREATE SUPPLIER
export const createSupplier = async (supplierData) => {
  const res = await api.post("/suppliers", supplierData);
  return res.data;
};


// UPDATE SUPPLIER
export const updateSupplier = async (id, supplierData) => {
  const res = await api.put(`/suppliers/${id}`, supplierData);
  return res.data;
};


// DELETE SUPPLIER
export const deleteSupplier = async (id) => {
  const res = await api.delete(`/suppliers/${id}`);
  return res.data;
};