import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  requestForgotPasswordOtp,
} from "../services/authService";

import loginBg from "../assets/login-bg.png";
import logo from "../assets/logo.png";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const savedRole =
    sessionStorage.getItem(
      "forgotPasswordRole"
    ) || "admin";

  const [role, setRole] = useState(savedRole);

  const [email, setEmail] = useState("");

  const [loading, setLoading] =
    useState(false);

  // ==============================
  // SUBMIT
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error(
        "Please enter your email"
      );
      return;
    }

    try {
      setLoading(true);

      const data =
        await requestForgotPasswordOtp({
          email: email.trim(),
          role,
        });

      if (
        data.success &&
        data.otpRequired
      ) {
        toast.success(
          data.message ||
            "Password reset OTP sent"
        );

        navigate(
          "/forgot-password/verify"
        );
      }
    } catch (error) {
      toast.error(
        error?.message ||
          error?.response?.data
            ?.message ||
          "Unable to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/40">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="M.R.K TRADERS"
            className="w-24 h-24 object-contain drop-shadow-xl"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold text-center text-green-700">
          Forgot Password
        </h1>

        <p className="text-center text-gray-500 text-sm mt-2 mb-6">
          Enter your registered email to
          receive a password reset OTP.
        </p>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl mb-6">

          <button
            type="button"
            onClick={() =>
              setRole("admin")
            }
            className={`py-2.5 rounded-lg font-semibold transition ${
              role === "admin"
                ? "bg-green-700 text-white shadow"
                : "text-gray-600 hover:bg-white"
            }`}
          >
            Admin
          </button>

          <button
            type="button"
            onClick={() =>
              setRole("manager")
            }
            className={`py-2.5 rounded-lg font-semibold transition ${
              role === "manager"
                ? "bg-green-700 text-white shadow"
                : "text-gray-600 hover:bg-white"
            }`}
          >
            Manager
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Registered Email
            </label>

            <input
              type="email"
              placeholder={`Enter ${role} email`}
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              autoComplete="email"
              className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Sending OTP..."
              : "Send Reset OTP"}
          </button>
        </form>

        {/* Back */}
        <button
          type="button"
          onClick={() =>
            navigate("/login")
          }
          className="w-full mt-5 text-sm text-green-700 font-semibold hover:underline"
        >
          Back to Login
        </button>

      </div>
    </div>
  );
};

export default ForgotPassword;