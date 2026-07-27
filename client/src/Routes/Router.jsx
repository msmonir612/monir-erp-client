import { createBrowserRouter } from "react-router-dom";

import Layout from "../Components/layout/Layout";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import Home from "../Pages/Home";
import Dashboard from "../Pages/Dashboard";
import Product from "../Pages/Product";
import Supplier from "../Pages/Supplier";
import Purchase from "../Pages/Purchase";
import Sale from "../Pages/Sale";
import Customer from "../Pages/Customer";
import Expense from "../Pages/Expense";
import Stock from "../Pages/Stock";

import Login from "../Pages/Login";
import VerifyOtp from "../Pages/VerifyOtp";

import AdminSetup from "../Pages/AdminSetup";
import AdminSetupVerify from "../Pages/AdminSetupVerify";

import ForgotPassword from "../Pages/ForgotPassword";
import ForgotPasswordVerify from "../Pages/ForgotPasswordVerify";
import ResetPassword from "../Pages/ResetPassword";

import Manager from "../Pages/Manager";
import Settings from "../Pages/Settings";
import Invoice from "../Pages/Invoice";

const router = createBrowserRouter([

  // ==========================================
  // PUBLIC WEBSITE
  // ==========================================

  {
    path: "/",
    element: <Home />,
  },

  // ==========================================
  // FIRST ADMIN SETUP
  // ==========================================

  {
    path: "/setup-admin",
    element: <AdminSetup />,
  },

  {
    path: "/setup-admin/verify",
    element: <AdminSetupVerify />,
  },

  // ==========================================
  // LOGIN
  // ==========================================

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/verify-otp",
    element: <VerifyOtp />,
  },

  // ==========================================
  // FORGOT PASSWORD
  // ==========================================

  // Step 1:
  // Email + Role
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  // Step 2:
  // Verify Reset OTP
  {
    path: "/forgot-password/verify",
    element: <ForgotPasswordVerify />,
  },

  // Step 3:
  // Create New Password
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },

  // ==========================================
  // PROTECTED ERP
  // ==========================================

  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),

    children: [

      // ======================================
      // ADMIN DASHBOARD
      // ======================================

      {
        path: "/dashboard",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      // ======================================
      // ADMIN ONLY
      // ======================================

      {
        path: "/manager",
        element: (
          <AdminRoute>
            <Manager />
          </AdminRoute>
        ),
      },

      // ======================================
      // ADMIN + MANAGER
      // ======================================

      {
        path: "/product",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Product />
          </ProtectedRoute>
        ),
      },

      {
        path: "/stock",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Stock />
          </ProtectedRoute>
        ),
      },

      {
        path: "/supplier",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Supplier />
          </ProtectedRoute>
        ),
      },

      {
        path: "/invoice/:id",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Invoice />
          </ProtectedRoute>
        ),
      },

      {
        path: "/purchase",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Purchase />
          </ProtectedRoute>
        ),
      },

      {
        path: "/sale",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Sale />
          </ProtectedRoute>
        ),
      },

      {
        path: "/customer",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Customer />
          </ProtectedRoute>
        ),
      },

      {
        path: "/expense",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Expense />
          </ProtectedRoute>
        ),
      },

      // ======================================
      // ADMIN SETTINGS
      // ======================================

      {
        path: "/settings",
        element: (
          <AdminRoute>
            <Settings />
          </AdminRoute>
        ),
      },

    ],
  },

  // ==========================================
  // 404
  // ==========================================

  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          404 - Page Not Found
        </h1>
      </div>
    ),
  },

]);

export default router;