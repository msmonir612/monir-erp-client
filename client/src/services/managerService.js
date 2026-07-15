import api from "./api";

// ==========================
// Create Manager
// ==========================
export const createManager = async (managerData) => {
  const { data } = await api.post("/users/manager", managerData);
  return data;
};

// ==========================
// Get All Managers
// ==========================
export const getManagers = async () => {
  const { data } = await api.get("/users/managers");
  return data;
};

// ==========================
// Delete Manager
// ==========================
export const deleteManager = async (id) => {
  const { data } = await api.delete(`/users/managers/${id}`);
  return data;
};