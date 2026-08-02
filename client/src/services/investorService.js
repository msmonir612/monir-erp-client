import api from "./api";

// ======================================
// CREATE INVESTOR
// ADMIN ONLY
// ======================================

export const createInvestor = async (
  investorData
) => {
  const { data } = await api.post(
    "/investors",
    investorData
  );

  return data;
};

// ======================================
// GET ALL INVESTORS
// ADMIN ONLY
// ======================================

export const getInvestors = async (
  filters = {}
) => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.append(
      "search",
      filters.search
    );
  }

  if (filters.status) {
    params.append(
      "status",
      filters.status
    );
  }

  const queryString = params.toString();

  const url = queryString
    ? `/investors?${queryString}`
    : "/investors";

  const { data } = await api.get(url);

  return data;
};

// ======================================
// GET SINGLE INVESTOR
// ADMIN ONLY
// ======================================

export const getInvestorById = async (
  id
) => {
  const { data } = await api.get(
    `/investors/${id}`
  );

  return data;
};

// ======================================
// UPDATE INVESTOR
// ADMIN ONLY
// ======================================

export const updateInvestor = async (
  id,
  investorData
) => {
  const { data } = await api.put(
    `/investors/${id}`,
    investorData
  );

  return data;
};

// ======================================
// TOGGLE ACTIVE / INACTIVE
// ADMIN ONLY
// ======================================

export const toggleInvestorStatus =
  async (id) => {
    const { data } = await api.patch(
      `/investors/${id}/status`
    );

    return data;
  };

// ======================================
// DELETE INVESTOR
// ADMIN ONLY
// ======================================

export const deleteInvestor = async (
  id
) => {
  const { data } = await api.delete(
    `/investors/${id}`
  );

  return data;
};