import api from "./api";

// ===============================
// Get All Expenses
// ===============================
export const getExpenses = async () => {
  const response = await api.get("/expenses");
  return response.data;
};

// ===============================
// Get Single Expense
// ===============================
export const getExpense = async (id) => {
  const response = await api.get(`/expenses/${id}`);
  return response.data;
};

// ===============================
// Create Expense
// ===============================
export const createExpense = async (expenseData) => {
  const response = await api.post("/expense", expenseData);
  return response.data;
};

// ===============================
// Update Expense
// ===============================
export const updateExpense = async (id, expenseData) => {
  const response = await api.put(`/expenses/${id}`, expenseData);
  return response.data;
};

// ===============================
// Delete Expense
// ===============================
export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

// ===============================
// Dashboard Summary
// ===============================
export const getExpenseSummary = async () => {
  const response = await api.get("/expenses/summary/total");
  return response.data;
};