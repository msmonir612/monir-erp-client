import api from "./api";

// ======================================
// CREATE OWNER TRANSACTION
// ======================================

export const createOwnerTransaction = async (
  transactionData
) => {
  const { data } = await api.post(
    "/owner-transactions",
    transactionData
  );

  return data;
};

// ======================================
// GET ALL OWNER TRANSACTIONS
// ======================================

export const getOwnerTransactions = async (
  filters = {}
) => {
  const params = new URLSearchParams();

  if (filters.date) {
    params.append("date", filters.date);
  }

  if (filters.transactionType) {
    params.append(
      "transactionType",
      filters.transactionType
    );
  }

  if (filters.paymentMethod) {
    params.append(
      "paymentMethod",
      filters.paymentMethod
    );
  }

  const queryString = params.toString();

  const url = queryString
    ? `/owner-transactions?${queryString}`
    : "/owner-transactions";

  const { data } = await api.get(url);

  return data;
};

// ======================================
// GET SINGLE OWNER TRANSACTION
// ======================================

export const getOwnerTransactionById =
  async (id) => {
    const { data } = await api.get(
      `/owner-transactions/${id}`
    );

    return data;
  };

// ======================================
// GET DAILY SUMMARY
// ======================================

export const getDailyOwnerTransactionSummary =
  async (date) => {
    const params = new URLSearchParams();

    if (date) {
      params.append("date", date);
    }

    const queryString = params.toString();

    const url = queryString
      ? `/owner-transactions/summary/daily?${queryString}`
      : "/owner-transactions/summary/daily";

    const { data } = await api.get(url);

    return data;
  };

// ======================================
// UPDATE OWNER TRANSACTION
// ADMIN ONLY
// ======================================

export const updateOwnerTransaction = async (
  id,
  transactionData
) => {
  const { data } = await api.put(
    `/owner-transactions/${id}`,
    transactionData
  );

  return data;
};

// ======================================
// DELETE OWNER TRANSACTION
// ADMIN ONLY
// ======================================

export const deleteOwnerTransaction = async (
  id
) => {
  const { data } = await api.delete(
    `/owner-transactions/${id}`
  );

  return data;
};