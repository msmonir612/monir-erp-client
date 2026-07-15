import { createContext, useContext, useEffect, useState } from "react";

import {
  getCurrentUser,
  isAuthenticated,
  logoutUser,
  isAdmin,
  isManager,
} from "../services/authService";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(
    getCurrentUser()
  );


  useEffect(() => {

    if (isAuthenticated()) {

      setUser(getCurrentUser());

    } else {

      setUser(null);

    }

  }, []);



  // =======================
  // LOGIN USER UPDATE
  // =======================

  const updateUser = (userData) => {

    setUser(userData);

  };



  // =======================
  // LOGOUT
  // =======================

  const logout = () => {

    logoutUser();

    setUser(null);

    window.location.href = "/login";

  };



  return (

    <AuthContext.Provider

      value={{

        // Current User
        user,

        setUser: updateUser,


        // Logout
        logout,


        // Login Status
        isLoggedIn: !!user,


        // Role Check
        isAdmin: isAdmin(),

        isManager: isManager(),


        // Direct Role
        role: user?.role || null,

      }}

    >

      {children}

    </AuthContext.Provider>

  );

};



// =======================
// Custom Hook
// =======================

export const useAuth = () => useContext(AuthContext);