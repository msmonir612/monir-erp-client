import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/users",
});

// =======================
// LOGIN
// =======================
export const loginUser = async (userData) => {
  try {
    const { data } = await API.post("/login", userData);

    console.log("Login Response:", data);

    if (data.success && data.token) {

      // Clear old session
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Save Token
      sessionStorage.setItem(
        "token",
        data.token
      );

      // Save User with Role
      sessionStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    }

    return data;

  } catch (error) {

    throw error.response?.data || {
      message: "Login failed"
    };

  }
};


// =======================
// LOGOUT
// =======================
export const logoutUser = () => {

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");

};


// =======================
// GET CURRENT USER
// =======================
export const getCurrentUser = () => {

  const user = sessionStorage.getItem("user");

  return user
    ? JSON.parse(user)
    : null;

};


// =======================
// GET TOKEN
// =======================
export const getToken = () => {

  return sessionStorage.getItem("token");

};


// =======================
// CHECK AUTH
// =======================
export const isAuthenticated = () => {

  return Boolean(
    sessionStorage.getItem("token")
  );

};


// =======================
// CHECK ROLE
// =======================

export const isAdmin = () => {

  const user = getCurrentUser();

  return user?.role === "admin";

};


export const isManager = () => {

  const user = getCurrentUser();

  return user?.role === "manager";

};