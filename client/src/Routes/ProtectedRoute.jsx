import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const ProtectedRoute = ({
  children,
  roles = [],
}) => {


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



  // Role Check
  if (
    roles.length > 0 &&
    !roles.includes(role)
  ) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }



  return children;

};


export default ProtectedRoute;