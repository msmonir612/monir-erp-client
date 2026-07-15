import axios from "axios";
import { getToken } from "./authService";

const API = "http://localhost:8080/api/suppliers";

// =======================
// AUTH HEADER
// =======================
const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// =======================
// GET ALL SUPPLIERS
// =======================
export const getSuppliers = async () => {
  const res = await axios.get(API, authConfig());
  return res.data;
};

// =======================
// GET SINGLE SUPPLIER
// =======================
export const getSupplier = async (id) => {
  const res = await axios.get(`${API}/${id}`, authConfig());
  return res.data;
};

// =======================
// CREATE SUPPLIER
// =======================
export const createSupplier = async (supplierData) => {
  const res = await axios.post(API, supplierData, authConfig());
  return res.data;
};

// =======================
// UPDATE SUPPLIER
// =======================
export const updateSupplier = async (id, supplierData) => {
  const res = await axios.put(`${API}/${id}`, supplierData, authConfig());
  return res.data;
};

// =======================
// DELETE SUPPLIER
// =======================
export const deleteSupplier = async (id) => {
  const res = await axios.delete(`${API}/${id}`, authConfig());
  return res.data;
};