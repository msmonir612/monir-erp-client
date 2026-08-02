import api from "./api";

// ======================================
// GET AUTOMATIC DAILY SUMMARY
// ======================================

export const getOwnerCashAutoSummary =
  async (date) => {
    const params = new URLSearchParams();

    if (date) {
      params.append("date", date);
    }

    const queryString = params.toString();

    const url = queryString
      ? `/owner-cash/summary/auto?${queryString}`
      : "/owner-cash/summary/auto";

    const { data } = await api.get(url);

    return data;
  };

// ======================================
// CREATE DAILY CLOSING
// ======================================

export const createOwnerCash = async (
  formData
) => {
  const { data } = await api.post(
    "/owner-cash",
    formData
  );

  return data;
};

// ======================================
// GET ALL DAILY CLOSING ENTRIES
// ======================================

export const getOwnerCashEntries =
  async () => {
    const { data } = await api.get(
      "/owner-cash"
    );

    return data;
  };

// ======================================
// GET SINGLE ENTRY
// ======================================

export const getOwnerCashById =
  async (id) => {
    const { data } = await api.get(
      `/owner-cash/${id}`
    );

    return data;
  };

// ======================================
// UPDATE DAILY CLOSING
// ADMIN ONLY
// ======================================

export const updateOwnerCash = async (
  id,
  formData
) => {
  const { data } = await api.put(
    `/owner-cash/${id}`,
    formData
  );

  return data;
};

// ======================================
// DELETE DAILY CLOSING
// ADMIN ONLY
// ======================================

export const deleteOwnerCash = async (
  id
) => {
  const { data } = await api.delete(
    `/owner-cash/${id}`
  );

  return data;
};