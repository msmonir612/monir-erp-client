import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  verifyLoginOtp,
  getMaskedOtpEmail,
  getOtpExpiresIn,
  getOtpEmail,
} from "../services/authService";

import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import loginBg from "../assets/login-bg.png";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Important:
  // OTP email একবারই state-এ ধরে রাখছি।
  // verifyLoginOtp() sessionStorage clear করলেও
  // এই value আর null হবে না।
  const [realEmail] = useState(() => getOtpEmail());
  const [maskedEmail] = useState(() => getMaskedOtpEmail());

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(() =>
    getOtpExpiresIn()
  );

  // ======================================
  // CHECK OTP SESSION
  // ======================================
  useEffect(() => {
    if (!realEmail) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [realEmail, navigate]);

  // ======================================
  // OTP TIMER
  // ======================================
  useEffect(() => {
    if (!realEmail || timeLeft <= 0) {
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
  }, [realEmail, timeLeft]);

  // ======================================
  // FORMAT TIME
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
  // VERIFY LOGIN OTP
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      toast.error(
        "OTP has expired. Please login again."
      );

      navigate("/login", {
        replace: true,
      });

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

      const data = await verifyLoginOtp(otp);

      if (
        data.success &&
        data.token &&
        data.user
      ) {
        // Update AuthContext
        setUser(data.user);

        toast.success(
          data.message || "Login Successful"
        );

        // Admin go Dashboard
                if (data.user.role === "admin") {
            navigate("/dashboard", {
                replace: true,
            });

            return;
            }

            if (data.user.role === "manager") {
            navigate("/stock", {
                replace: true,
            });

            return;
            }

            navigate("/", {
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
  // BACK TO LOGIN
  // ======================================
  const handleBackToLogin = () => {
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

      {/* OTP Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/40">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="M.R.K TRADERS Logo"
            className="w-24 h-24 object-contain drop-shadow-xl"
          />
        </div>

        <h1 className="text-2xl font-extrabold text-center text-green-700">
          Verify Your Login
        </h1>

        <p className="text-center text-gray-600 mt-2">
          Enter the 6-digit OTP sent to
        </p>

        <p className="text-center font-semibold text-slate-800 mt-1">
          {maskedEmail || realEmail}
        </p>

        {/* Timer */}
        <div className="mt-5 text-center">
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
              ? "Verifying..."
              : "Verify OTP"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleBackToLogin}
          className="w-full mt-4 text-sm text-green-700 font-semibold hover:underline"
        >
          Back to Login
        </button>

        <p className="text-xs text-gray-500 text-center mt-5">
          Never share your OTP with anyone.
        </p>

      </div>
    </div>
  );
};

export default VerifyOtp;