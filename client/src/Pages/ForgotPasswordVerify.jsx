import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  verifyForgotPasswordOtp,
  getForgotPasswordEmail,
  getForgotPasswordMaskedEmail,
  getForgotPasswordOtpExpiresIn,
  clearForgotPasswordSession,
} from "../services/authService";

import loginBg from "../assets/login-bg.png";
import logo from "../assets/logo.png";

const ForgotPasswordVerify = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Session value একবার state-এ ধরে রাখছি
  const [email] = useState(() =>
    getForgotPasswordEmail()
  );

  const [maskedEmail] = useState(() =>
    getForgotPasswordMaskedEmail()
  );

  const [timeLeft, setTimeLeft] = useState(() =>
    getForgotPasswordOtpExpiresIn()
  );

  // ======================================
  // CHECK RESET SESSION
  // ======================================
  useEffect(() => {
    if (!email) {
      toast.error(
        "Password reset session expired. Please start again."
      );

      navigate("/forgot-password", {
        replace: true,
      });
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
        "OTP has expired. Please request a new OTP."
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
        await verifyForgotPasswordOtp(otp);

      if (
        data.success &&
        data.resetAllowed
      ) {
        toast.success(
          data.message ||
            "OTP verified successfully"
        );

        navigate("/reset-password", {
          replace: true,
        });
      }
    } catch (error) {
      toast.error(
        error?.message ||
          error?.response?.data?.message ||
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
    clearForgotPasswordSession();

    navigate("/forgot-password", {
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

        <h1 className="text-2xl font-extrabold text-center text-green-700">
          Verify Reset OTP
        </h1>

        <p className="text-center text-gray-600 mt-3">
          Enter the 6-digit OTP sent to
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

        {/* Form */}
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
              ? "Verifying..."
              : "Verify OTP"}
          </button>
        </form>

        {/* Start Again */}
        <button
          type="button"
          onClick={handleStartAgain}
          className="w-full mt-4 text-sm text-green-700 font-semibold hover:underline"
        >
          Request New OTP
        </button>

        {/* Back Login */}
        <button
          type="button"
          onClick={() =>
            navigate("/login")
          }
          className="w-full mt-3 text-sm text-gray-500 hover:text-green-700"
        >
          Back to Login
        </button>

      </div>
    </div>
  );
};

export default ForgotPasswordVerify;