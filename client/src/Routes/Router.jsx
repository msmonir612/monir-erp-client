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
import Manager from "../Pages/Manager";


const router = createBrowserRouter([

  // =========================
  // Public Route
  // =========================

  {
    path: "/login",
    element: <Login />,
  },



  // =========================
  // Protected Routes
  // =========================

  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),

    children: [

      // Home
      {
        path: "/",
        element: <Home />,
      },



      // Dashboard
      // Admin + Manager
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute >
            <Dashboard />
          </ProtectedRoute>
        ),
      },



      // Manager Management
      // Admin Only
      {
        path: "/manager",
        element: (
          <AdminRoute>
            <Manager />
          </AdminRoute>
        ),
      },



      // Product
      // Admin + Manager
      {
        path: "/product",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Product />
          </ProtectedRoute>
        ),
      },



      // Stock
      {
        path: "/stock",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Stock />
          </ProtectedRoute>
        ),
      },



      // Supplier
      {
        path: "/supplier",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Supplier />
          </ProtectedRoute>
        ),
      },



      // Purchase
      {
        path: "/purchase",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Purchase />
          </ProtectedRoute>
        ),
      },



      // Sale
      {
        path: "/sale",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Sale />
          </ProtectedRoute>
        ),
      },



      // Customer
      {
        path: "/customer",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Customer />
          </ProtectedRoute>
        ),
      },



      // Expense
      {
        path: "/expense",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Expense />
          </ProtectedRoute>
        ),
      },



      // 404
      {
        path: "*",
        element: <div>404 Not Found</div>,
      },

    ],
  },

]);


export default router;