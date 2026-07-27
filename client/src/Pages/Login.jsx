import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  loginUser,
  getAdminSetupStatus,
} from "../services/authService";

import loginBg from "../assets/login-bg.png";
import logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("admin");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [checkingAdmin, setCheckingAdmin] = useState(true);

  const [adminSetupRequired, setAdminSetupRequired] =
    useState(false);

  // ==========================================
  // CHECK WHETHER ADMIN EXISTS
  // ==========================================
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const data = await getAdminSetupStatus();

        setAdminSetupRequired(
          Boolean(data.setupRequired)
        );
      } catch (error) {
        console.error(
          "Admin status check failed:",
          error
        );

        // Safe default:
        // Don't show active Admin creation
        setAdminSetupRequired(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  // ==========================================
  // INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================================
  // LOGIN SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser({
        ...formData,
        role: selectedRole,
      });

      if (data.success && data.otpRequired) {
        sessionStorage.setItem(
          "loginSelectedRole",
          selectedRole
        );

        toast.success(
          data.message ||
            "OTP sent to your email"
        );

        navigate("/verify-otp");

        return;
      }

      toast.error(
        "Unable to continue login"
      );
    } catch (error) {
      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CREATE ADMIN
  // ==========================================
  const handleCreateAdmin = () => {
    if (checkingAdmin) {
      return;
    }

    if (adminSetupRequired) {
      navigate("/setup-admin");
      return;
    }

    toast(
      "Admin account already exists",
      {
        icon: "ℹ️",
      }
    );
  };

  // ==========================================
  // FORGOT PASSWORD
  // ==========================================
  const handleForgotPassword = () => {
    sessionStorage.setItem(
      "forgotPasswordRole",
      selectedRole
    );

    navigate("/forgot-password");
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Login Box */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/40">

        {/* Logo + Company */}
        <div className="flex items-center gap-5 mb-6">

          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="M.R.K TRADERS Logo"
              className="w-28 h-28 object-contain drop-shadow-xl"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-green-700 leading-tight">
              M.R.K TRADERS
            </h1>

            <p className="text-sm text-gray-500 mt-2 text-center">
              Login to your ERP Account
            </p>
          </div>

        </div>

        {/* ==================================
            ROLE SELECTOR
        ================================== */}

        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl mb-5">

          <button
            type="button"
            onClick={() =>
              setSelectedRole("admin")
            }
            className={`py-2.5 rounded-lg font-semibold transition ${
              selectedRole === "admin"
                ? "bg-green-700 text-white shadow"
                : "text-gray-600 hover:bg-white"
            }`}
          >
            Admin Login
          </button>

          <button
            type="button"
            onClick={() =>
              setSelectedRole("manager")
            }
            className={`py-2.5 rounded-lg font-semibold transition ${
              selectedRole === "manager"
                ? "bg-green-700 text-white shadow"
                : "text-gray-600 hover:bg-white"
            }`}
          >
            Manager Login
          </button>

        </div>

        {/* Selected Login Type */}
        <p className="text-center text-sm font-medium text-gray-600 mb-5">
          Signing in as{" "}
          <span className="text-green-700 capitalize font-bold">
            {selectedRole}
          </span>
        </p>

        {/* ==================================
            LOGIN FORM
        ================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder={`Enter ${selectedRole} email`}
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              className="w-full border border-gray-300 bg-white/90 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className="w-full border border-gray-300 bg-white/90 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end -mt-2">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-green-700 font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Sending OTP..."
              : `Login as ${
                  selectedRole === "admin"
                    ? "Admin"
                    : "Manager"
                }`}
          </button>

        </form>

        {/* ==================================
            ADMIN ACCOUNT CREATION
        ================================== */}

        {selectedRole === "admin" && (
          <div className="mt-6 pt-5 border-t border-gray-200">

            <p className="text-center text-xs text-gray-500 mb-2">
              {checkingAdmin
                ? "Checking Admin account..."
                : adminSetupRequired
                ? "No Admin account found"
                : "Admin account already created"}
            </p>

            <button
              type="button"
              onClick={handleCreateAdmin}
              disabled={checkingAdmin}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${
                adminSetupRequired
                  ? "border-2 border-green-700 text-green-700 hover:bg-green-50"
                  : "border border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed opacity-60"
              }`}
            >
              {adminSetupRequired
                ? "Create Admin Account"
                : "Create Admin Account"}
            </button>

          </div>
        )}

        <p className="text-center text-xs text-gray-500 mt-5">
          A verification code will be sent to your registered email.
        </p>

      </div>
    </div>
  );
};

export default Login;