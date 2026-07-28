import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import ManagerForm from "../Components/manager/ManagerForm";
import ManagerTable from "../Components/manager/ManagerTable";

import {
  requestManagerOtp,
  verifyManagerOtp,
  getManagers,
  updateManagerStatus,
  deleteManager,
  getPendingManagerEmail,
  getManagerOtpExpiresIn,
  clearManagerOtpSession,
} from "../services/managerService";

const Manager = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  const pendingEmail = getPendingManagerEmail();

  // ==========================
  // LOAD MANAGERS
  // ==========================
  const loadManagers = async () => {
    try {
      const data = await getManagers();
      setManagers(data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load managers"
      );
    }
  };

  useEffect(() => {
    loadManagers();
  }, []);

  // ==========================
  // RESTORE OTP STEP
  // ==========================
  useEffect(() => {
    if (pendingEmail) {
      setOtpStep(true);
      setTimeLeft(getManagerOtpExpiresIn());
    }
  }, [pendingEmail]);

  // ==========================
  // OTP TIMER
  // ==========================
  useEffect(() => {
    if (!otpStep || timeLeft <= 0) return;

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
  }, [otpStep, timeLeft]);

  // ==========================
  // SEND MANAGER OTP
  // ==========================
  const handleCreate = async (formData) => {
    try {
      setLoading(true);

      const data = await requestManagerOtp(formData);

      if (data.success && data.otpRequired) {
        toast.success(
          data.message || "OTP sent to Manager email"
        );

        setOtpStep(true);
        setOtp("");
        setTimeLeft(data.otpExpiresIn || 300);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // VERIFY MANAGER OTP
  // ==========================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    if (timeLeft <= 0) {
      toast.error("OTP has expired");
      return;
    }

    try {
      setLoading(true);

      const data = await verifyManagerOtp(otp);

      if (data.success) {
        toast.success(
          data.message ||
            "Manager Account Created Successfully"
        );

        setOtpStep(false);
        setOtp("");
        setTimeLeft(0);

        await loadManagers();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // CANCEL OTP
  // ==========================
  const handleCancelOtp = () => {
    clearManagerOtpSession();

    setOtpStep(false);
    setOtp("");
    setTimeLeft(0);
  };

  // ==========================
  // UPDATE MANAGER STATUS
  // ==========================
  const handleStatusChange = async (
    id,
    newStatus
  ) => {
    const action =
      newStatus === "inactive"
        ? "deactivate"
        : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this manager?`
    );

    if (!confirmed) return;

    try {
      const data = await updateManagerStatus(
        id,
        newStatus
      );

      toast.success(
        data.message ||
          `Manager ${
            newStatus === "active"
              ? "activated"
              : "deactivated"
          } successfully`
      );

      await loadManagers();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update manager status"
      );
    }
  };

  // ==========================
  // DELETE MANAGER
  // ==========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this manager?")) {
      return;
    }

    try {
      const data = await deleteManager(id);

      toast.success(data.message);

      await loadManagers();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Delete Failed"
      );
    }
  };

  // ==========================
  // FORMAT TIME
  // ==========================
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {!otpStep ? (
        <ManagerForm
          onSubmit={handleCreate}
          loading={loading}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 max-w-xl">
          <h2 className="text-xl font-bold mb-2">
            Verify Manager Email
          </h2>

          <p className="text-gray-600 mb-4">
            Enter the 6-digit OTP sent to:
          </p>

          <p className="font-semibold text-green-700 mb-4">
            {getPendingManagerEmail()}
          </p>

          <p className="text-sm text-gray-500 mb-4">
            OTP expires in:
            <span className="font-bold text-red-600 ml-2">
              {formatTime(timeLeft)}
            </span>
          </p>

          <form
            onSubmit={handleVerifyOtp}
            className="space-y-4"
          >
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              placeholder="Enter 6-digit OTP"
              className="w-full border rounded-lg p-3 text-center text-2xl tracking-widest"
            />

            <button
              type="submit"
              disabled={
                loading ||
                otp.length !== 6 ||
                timeLeft <= 0
              }
              className="w-full bg-green-700 hover:bg-green-800 text-white rounded-lg py-3 font-semibold disabled:opacity-50"
            >
              {loading
                ? "Verifying..."
                : "Verify & Create Manager"}
            </button>

            <button
              type="button"
              onClick={handleCancelOtp}
              className="w-full border border-gray-300 rounded-lg py-3 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <ManagerTable
        managers={managers}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default Manager;