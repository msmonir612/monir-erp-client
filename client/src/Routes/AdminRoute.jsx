import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const AdminRoute = ({ children }) => {

  const {
    isLoggedIn,
    role,
  } = useAuth();



  // Login Check
  if (!isLoggedIn) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }



  // Admin Check
  if (role !== "admin") {

    return (
      <Navigate
        to="/"
        replace
      />

    );

  }



  return children;

};


export default AdminRoute;