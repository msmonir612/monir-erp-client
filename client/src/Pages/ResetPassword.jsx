import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  resetForgotPassword,
  getForgotPasswordEmail,
  getForgotPasswordRole,
  isForgotPasswordOtpVerified,
  clearForgotPasswordSession,
} from "../services/authService";

import loginBg from "../assets/login-bg.png";
import logo from "../assets/logo.png";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [email] = useState(() =>
    getForgotPasswordEmail()
  );

  const [role] = useState(() =>
    getForgotPasswordRole()
  );

  const [verified] = useState(() =>
    isForgotPasswordOtpVerified()
  );

  // ======================================
  // CHECK RESET SESSION
  // ======================================
  useEffect(() => {
    if (!email || !role || !verified) {
      toast.error(
        "Password reset session expired. Please start again."
      );

      navigate("/forgot-password", {
        replace: true,
      });
    }
  }, [email, role, verified, navigate]);

  // ======================================
  // HANDLE CHANGE
  // ======================================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ======================================
  // RESET PASSWORD
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      const data =
        await resetForgotPassword({
          newPassword:
            formData.newPassword,

          confirmPassword:
            formData.confirmPassword,
        });

      if (data.success) {
        toast.success(
          data.message ||
            "Password reset successfully"
        );

        navigate("/login", {
          replace: true,
        });
      }
    } catch (error) {
      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          "Unable to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // CANCEL
  // ======================================
  const handleCancel = () => {
    clearForgotPasswordSession();

    navigate("/login", {
      replace: true,
    });
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
          Create New Password
        </h1>

        <p className="text-center text-gray-500 text-sm mt-2">
          Reset password for your{" "}
          <span className="font-semibold capitalize">
            {role}
          </span>{" "}
          account
        </p>

        <p className="text-center text-sm text-slate-700 font-medium mt-1 break-all">
          {email}
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 mt-7"
        >

          {/* New Password */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
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
              Confirm New Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={
                formData.confirmPassword
              }
              onChange={handleChange}
              minLength={6}
              required
              autoComplete="new-password"
              className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Resetting Password..."
              : "Reset Password"}
          </button>

        </form>

        {/* Cancel */}
        <button
          type="button"
          onClick={handleCancel}
          className="w-full mt-4 text-sm text-gray-500 hover:text-green-700 font-medium"
        >
          Cancel and Back to Login
        </button>

      </div>
    </div>
  );
};

export default ResetPassword;