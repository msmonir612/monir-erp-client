import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  verifyAdminSetupOtp,
  getAdminSetupEmail,
  getAdminSetupMaskedEmail,
  getAdminSetupOtpExpiresIn,
  clearAdminSetupSession,
} from "../services/authService";

import logo from "../assets/logo.png";
import loginBg from "../assets/login-bg.png";

const AdminSetupVerify = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(
    getAdminSetupOtpExpiresIn()
  );

  const email = getAdminSetupEmail();
  const maskedEmail = getAdminSetupMaskedEmail();

  // ======================================
  // CHECK ADMIN SETUP SESSION
  // ======================================
  useEffect(() => {
    if (!email) {
      toast.error(
        "Admin setup session expired. Please start again."
      );

      navigate("/setup-admin", {
        replace: true,
      });

      return;
    }
  }, [email, navigate]);

  // ======================================
  // OTP TIMER
  // ======================================
  useEffect(() => {
    if (!email || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, timeLeft]);

  // ======================================
  // FORMAT TIMER
  // ======================================
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  // ======================================
  // OTP INPUT
  // ======================================
  const handleOtpChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(value);
  };

  // ======================================
  // VERIFY OTP
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      toast.error(
        "OTP has expired. Please start Admin setup again."
      );
      return;
    }

    if (otp.length !== 6) {
      toast.error(
        "Please enter the 6-digit OTP"
      );
      return;
    }

    try {
      setLoading(true);

      const data =
        await verifyAdminSetupOtp(otp);

      if (data.success) {
        toast.success(
          data.message ||
            "Admin Account Created Successfully"
        );

        navigate("/login", {
          replace: true,
        });
      }
    } catch (error) {
      toast.error(
        error?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // START AGAIN
  // ======================================
  const handleStartAgain = () => {
    clearAdminSetupSession();

    navigate("/setup-admin", {
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
      <div className="absolute inset-0 bg-black/35" />

      {/* Verification Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-8">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="M.R.K TRADERS"
            className="w-24 h-24 object-contain drop-shadow-xl"
          />
        </div>

        <h1 className="text-2xl font-extrabold text-center text-green-700">
          Verify Admin Account
        </h1>

        <p className="text-center text-gray-600 mt-3">
          Enter the 6-digit verification code
          sent to
        </p>

        <p className="text-center font-semibold text-slate-800 mt-1 break-all">
          {maskedEmail || email}
        </p>

        {/* Timer */}
        <div className="text-center mt-6">
          {timeLeft > 0 ? (
            <>
              <p className="text-sm text-gray-500">
                OTP expires in
              </p>

              <p className="text-2xl font-bold text-green-700 mt-1">
                {formatTime(timeLeft)}
              </p>
            </>
          ) : (
            <p className="text-red-600 font-semibold">
              OTP Expired
            </p>
          )}
        </div>

        {/* OTP Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-7"
        >
          <label className="block text-center font-medium text-gray-700 mb-3">
            Verification Code
          </label>

          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={otp}
            onChange={handleOtpChange}
            placeholder="000000"
            maxLength={6}
            disabled={timeLeft <= 0}
            className="w-full text-center text-3xl tracking-[0.5em] font-bold border border-gray-300 rounded-xl px-4 py-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100"
          />

          <button
            type="submit"
            disabled={
              loading ||
              timeLeft <= 0 ||
              otp.length !== 6
            }
            className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Creating Admin Account..."
              : "Verify & Create Admin"}
          </button>
        </form>

        {/* Start Again */}
        <button
          type="button"
          onClick={handleStartAgain}
          className="w-full mt-4 text-sm text-green-700 font-semibold hover:underline"
        >
          Start Admin Setup Again
        </button>

        <p className="text-xs text-center text-gray-500 mt-5">
          Never share your verification code with anyone.
        </p>

      </div>
    </div>
  );
};

export default AdminSetupVerify;