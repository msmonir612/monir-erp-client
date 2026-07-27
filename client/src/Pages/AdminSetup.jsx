import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  getAdminSetupStatus,
  requestAdminSetupOtp,
} from "../services/authService";

import logo from "../assets/logo.png";
import loginBg from "../assets/login-bg.png";

const AdminSetup = () => {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // ======================================
  // CHECK WHETHER FIRST ADMIN SETUP IS OPEN
  // ======================================
  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const data = await getAdminSetupStatus();

        if (!data.setupRequired) {
          toast.error("Admin account already exists");

          navigate("/login", {
            replace: true,
          });

          return;
        }
      } catch (error) {
        toast.error(
          error?.message ||
            "Unable to check Admin setup status"
        );
      } finally {
        setChecking(false);
      }
    };

    checkSetupStatus();
  }, [navigate]);

  // ======================================
  // INPUT CHANGE
  // ======================================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ======================================
  // SUBMIT ADMIN INFORMATION
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const data =
        await requestAdminSetupOtp(formData);

      if (data.success && data.otpRequired) {
        toast.success(
          data.message ||
            "Verification OTP sent to your email"
        );

        navigate("/setup-admin/verify");
      }
    } catch (error) {
      toast.error(
        error?.message ||
          "Unable to start Admin account setup"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // LOADING SCREEN
  // ======================================
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-green-700 font-semibold">
          Checking Admin setup...
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-10"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Setup Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-8 md:p-10">

        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="M.R.K TRADERS"
            className="w-24 h-24 object-contain drop-shadow-xl"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-green-700 mt-3">
          M.R.K TRADERS
        </h1>

        <h2 className="text-xl font-bold text-center text-slate-800 mt-2">
          Create First Admin Account
        </h2>

        <p className="text-center text-gray-500 text-sm mt-2 mb-8">
          Enter your real information. A verification OTP will be sent to your email.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Full Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
              className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your real email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Mobile Number
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your mobile number"
              value={formData.phone}
              onChange={handleChange}
              required
              autoComplete="tel"
              className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
              autoComplete="new-password"
              className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength={6}
              required
              autoComplete="new-password"
              className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Sending Verification OTP..."
              : "Create Admin Account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-5 text-sm text-green-700 font-semibold hover:underline"
        >
          Already have an account? Login
        </button>

      </div>
    </div>
  );
};

export default AdminSetup;