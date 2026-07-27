import api from "./api";

// ======================================
// REQUEST MANAGER OTP
// ======================================
export const requestManagerOtp = async (
  managerData
) => {
  const { data } = await api.post(
    "/users/manager/request-otp",
    managerData
  );

  if (data.success && data.otpRequired) {
    sessionStorage.setItem(
      "pendingManagerEmail",
      managerData.email
    );

    sessionStorage.setItem(
      "managerOtpExpiresIn",
      String(data.otpExpiresIn || 300)
    );
  }

  return data;
};

// ======================================
// VERIFY MANAGER OTP
// ======================================
export const verifyManagerOtp = async (otp) => {
  const email = sessionStorage.getItem(
    "pendingManagerEmail"
  );

  if (!email) {
    throw new Error(
      "Manager verification session expired"
    );
  }

  const { data } = await api.post(
    "/users/manager/verify-otp",
    {
      email,
      otp,
    }
  );

  if (data.success) {
    clearManagerOtpSession();
  }

  return data;
};

// ======================================
// MANAGER OTP HELPERS
// ======================================
export const getPendingManagerEmail = () =>
  sessionStorage.getItem(
    "pendingManagerEmail"
  );

export const getManagerOtpExpiresIn = () => {
  const value = sessionStorage.getItem(
    "managerOtpExpiresIn"
  );

  return value ? Number(value) : 300;
};

export const clearManagerOtpSession = () => {
  sessionStorage.removeItem(
    "pendingManagerEmail"
  );

  sessionStorage.removeItem(
    "managerOtpExpiresIn"
  );
};

// ======================================
// GET ALL MANAGERS
// ======================================
export const getManagers = async () => {
  const { data } = await api.get(
    "/users/managers"
  );

  return data;
};

// ======================================
// DELETE MANAGER
// ======================================
export const deleteManager = async (id) => {
  const { data } = await api.delete(
    `/users/managers/${id}`
  );

  return data;
};