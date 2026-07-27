import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:8080/api",
});

// ======================================
// FIRST ADMIN SETUP STATUS
// ======================================

export const getAdminSetupStatus = async () => {
  try {
    const { data } = await API.get(
      "/users/setup-admin/status"
    );

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        message:
          "Unable to check Admin setup status",
      }
    );
  }
};

// ======================================
// FIRST ADMIN SETUP
// STEP 1: DETAILS → SEND OTP
// ======================================

export const requestAdminSetupOtp = async (
  adminData
) => {
  try {
    const { data } = await API.post(
      "/users/setup-admin/request-otp",
      adminData
    );

    if (data.success && data.otpRequired) {
      sessionStorage.setItem(
        "adminSetupEmail",
        adminData.email
      );

      if (data.email) {
        sessionStorage.setItem(
          "adminSetupMaskedEmail",
          data.email
        );
      }

      if (data.otpExpiresIn) {
        sessionStorage.setItem(
          "adminSetupOtpExpiresIn",
          String(data.otpExpiresIn)
        );
      }
    }

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        message:
          "Unable to send Admin verification OTP",
      }
    );
  }
};

// ======================================
// FIRST ADMIN SETUP
// STEP 2: VERIFY OTP → CREATE ADMIN
// ======================================

export const verifyAdminSetupOtp = async (
  otp
) => {
  try {
    const email =
      sessionStorage.getItem(
        "adminSetupEmail"
      );

    if (!email) {
      throw {
        message:
          "Admin setup session expired. Please start again.",
      };
    }

    const { data } = await API.post(
      "/users/setup-admin/verify-otp",
      {
        email,
        otp,
      }
    );

    if (data.success) {
      clearAdminSetupSession();
    }

    return data;
  } catch (error) {
    throw (
      error.response?.data ||
      error || {
        message:
          "Admin OTP verification failed",
      }
    );
  }
};

// ======================================
// ADMIN SETUP SESSION HELPERS
// ======================================

export const getAdminSetupEmail = () => {
  return sessionStorage.getItem(
    "adminSetupEmail"
  );
};

export const getAdminSetupMaskedEmail = () => {
  return (
    sessionStorage.getItem(
      "adminSetupMaskedEmail"
    ) || ""
  );
};

export const getAdminSetupOtpExpiresIn = () => {
  const value =
    sessionStorage.getItem(
      "adminSetupOtpExpiresIn"
    );

  return value ? Number(value) : 300;
};

export const clearAdminSetupSession = () => {
  sessionStorage.removeItem(
    "adminSetupEmail"
  );

  sessionStorage.removeItem(
    "adminSetupMaskedEmail"
  );

  sessionStorage.removeItem(
    "adminSetupOtpExpiresIn"
  );
};

// ======================================
// LOGIN
// STEP 1: EMAIL + PASSWORD + ROLE
// ======================================

export const loginUser = async (userData) => {
  try {
    const { data } = await API.post(
      "/users/login",
      userData
    );

    console.log("Login Response:", data);

    if (data.success && data.otpRequired) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      sessionStorage.setItem(
        "otpEmail",
        userData.email
      );

      sessionStorage.setItem(
        "loginSelectedRole",
        userData.role
      );

      if (data.email) {
        sessionStorage.setItem(
          "maskedOtpEmail",
          data.email
        );
      }

      if (data.otpExpiresIn) {
        sessionStorage.setItem(
          "otpExpiresIn",
          String(data.otpExpiresIn)
        );
      }
    }

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Login failed",
      }
    );
  }
};

// ======================================
// VERIFY LOGIN OTP
// STEP 2: OTP + ROLE → JWT TOKEN
// ======================================

export const verifyLoginOtp = async (otp) => {
  try {
    const email =
      sessionStorage.getItem("otpEmail");

    const role =
      sessionStorage.getItem(
        "loginSelectedRole"
      );

    if (!email) {
      throw {
        message:
          "Login session expired. Please login again.",
      };
    }

    if (!role) {
      throw {
        message:
          "Login type not found. Please login again.",
      };
    }

    const { data } = await API.post(
      "/users/verify-login-otp",
      {
        email,
        otp,
        role,
      }
    );

    console.log(
      "OTP Verify Response:",
      data
    );

    if (
      data.success &&
      data.token &&
      data.user
    ) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      sessionStorage.setItem(
        "token",
        data.token
      );

      sessionStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      clearOtpSession();
    }

    return data;
  } catch (error) {
    throw (
      error.response?.data ||
      error || {
        message:
          "OTP verification failed",
      }
    );
  }
};

// ======================================
// LOGIN OTP SESSION HELPERS
// ======================================

export const getOtpEmail = () => {
  return sessionStorage.getItem(
    "otpEmail"
  );
};

export const getMaskedOtpEmail = () => {
  return (
    sessionStorage.getItem(
      "maskedOtpEmail"
    ) || ""
  );
};

export const getOtpExpiresIn = () => {
  const value =
    sessionStorage.getItem(
      "otpExpiresIn"
    );

  return value ? Number(value) : 300;
};

export const getLoginSelectedRole = () => {
  return sessionStorage.getItem(
    "loginSelectedRole"
  );
};

export const clearOtpSession = () => {
  sessionStorage.removeItem("otpEmail");
  sessionStorage.removeItem(
    "maskedOtpEmail"
  );
  sessionStorage.removeItem(
    "otpExpiresIn"
  );
  sessionStorage.removeItem(
    "loginSelectedRole"
  );
};

// ======================================
// FORGOT PASSWORD
// STEP 1: EMAIL + ROLE → SEND OTP
// ======================================

export const requestForgotPasswordOtp = async ({
  email,
  role,
}) => {
  try {
    const { data } = await API.post(
      "/users/forgot-password/request-otp",
      {
        email,
        role,
      }
    );

    if (data.success && data.otpRequired) {
      // Clear previous reset session
      clearForgotPasswordSession();

      // Save reset information
      sessionStorage.setItem(
        "forgotPasswordEmail",
        email
      );

      sessionStorage.setItem(
        "forgotPasswordRole",
        role
      );

      if (data.email) {
        sessionStorage.setItem(
          "forgotPasswordMaskedEmail",
          data.email
        );
      }

      if (data.otpExpiresIn) {
        sessionStorage.setItem(
          "forgotPasswordOtpExpiresIn",
          String(data.otpExpiresIn)
        );
      }
    }

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        message:
          "Unable to send password reset OTP",
      }
    );
  }
};

// ======================================
// FORGOT PASSWORD
// STEP 2: VERIFY OTP
// ======================================

export const verifyForgotPasswordOtp = async (
  otp
) => {
  try {
    const email =
      sessionStorage.getItem(
        "forgotPasswordEmail"
      );

    const role =
      sessionStorage.getItem(
        "forgotPasswordRole"
      );

    if (!email || !role) {
      throw {
        message:
          "Password reset session expired. Please start again.",
      };
    }

    const { data } = await API.post(
      "/users/forgot-password/verify-otp",
      {
        email,
        role,
        otp,
      }
    );

    if (
      data.success &&
      data.resetAllowed
    ) {
      sessionStorage.setItem(
        "forgotPasswordOtpVerified",
        "true"
      );

      if (data.resetExpiresIn) {
        sessionStorage.setItem(
          "forgotPasswordResetExpiresIn",
          String(data.resetExpiresIn)
        );
      }
    }

    return data;
  } catch (error) {
    throw (
      error.response?.data ||
      error || {
        message:
          "Password reset OTP verification failed",
      }
    );
  }
};

// ======================================
// FORGOT PASSWORD
// STEP 3: RESET PASSWORD
// ======================================

export const resetForgotPassword = async ({
  newPassword,
  confirmPassword,
}) => {
  try {
    const email =
      sessionStorage.getItem(
        "forgotPasswordEmail"
      );

    const role =
      sessionStorage.getItem(
        "forgotPasswordRole"
      );

    const verified =
      sessionStorage.getItem(
        "forgotPasswordOtpVerified"
      );

    if (!email || !role) {
      throw {
        message:
          "Password reset session expired. Please start again.",
      };
    }

    if (verified !== "true") {
      throw {
        message:
          "Please verify your OTP first.",
      };
    }

    const { data } = await API.post(
      "/users/forgot-password/reset",
      {
        email,
        role,
        newPassword,
        confirmPassword,
      }
    );

    if (data.success) {
      clearForgotPasswordSession();
    }

    return data;
  } catch (error) {
    throw (
      error.response?.data ||
      error || {
        message:
          "Unable to reset password",
      }
    );
  }
};

// ======================================
// FORGOT PASSWORD SESSION HELPERS
// ======================================

export const getForgotPasswordEmail = () => {
  return sessionStorage.getItem(
    "forgotPasswordEmail"
  );
};

export const getForgotPasswordRole = () => {
  return sessionStorage.getItem(
    "forgotPasswordRole"
  );
};

export const getForgotPasswordMaskedEmail =
  () => {
    return (
      sessionStorage.getItem(
        "forgotPasswordMaskedEmail"
      ) || ""
    );
  };

export const getForgotPasswordOtpExpiresIn =
  () => {
    const value =
      sessionStorage.getItem(
        "forgotPasswordOtpExpiresIn"
      );

    return value ? Number(value) : 300;
  };

export const isForgotPasswordOtpVerified =
  () => {
    return (
      sessionStorage.getItem(
        "forgotPasswordOtpVerified"
      ) === "true"
    );
  };

export const clearForgotPasswordSession =
  () => {
    sessionStorage.removeItem(
      "forgotPasswordEmail"
    );

    sessionStorage.removeItem(
      "forgotPasswordRole"
    );

    sessionStorage.removeItem(
      "forgotPasswordMaskedEmail"
    );

    sessionStorage.removeItem(
      "forgotPasswordOtpExpiresIn"
    );

    sessionStorage.removeItem(
      "forgotPasswordOtpVerified"
    );

    sessionStorage.removeItem(
      "forgotPasswordResetExpiresIn"
    );
  };

// ======================================
// LOGOUT
// ======================================

export const logoutUser = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");

  clearOtpSession();
  clearAdminSetupSession();
  clearForgotPasswordSession();
};

// ======================================
// GET CURRENT USER
// ======================================

export const getCurrentUser = () => {
  const user =
    sessionStorage.getItem("user");

  return user
    ? JSON.parse(user)
    : null;
};

// ======================================
// GET TOKEN
// ======================================

export const getToken = () => {
  return sessionStorage.getItem(
    "token"
  );
};

// ======================================
// CHECK AUTH
// ======================================

export const isAuthenticated = () => {
  return Boolean(
    sessionStorage.getItem("token")
  );
};

// ======================================
// CHECK ROLE
// ======================================

export const isAdmin = () => {
  const user = getCurrentUser();

  return user?.role === "admin";
};

export const isManager = () => {
  const user = getCurrentUser();

  return user?.role === "manager";
};