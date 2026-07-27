import { useState } from "react";

const ManagerForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // ==========================
  // Handle Input
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================
  // Submit
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      alert(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    // confirmPassword backend-এ পাঠাব না
    const managerData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
    };

    // Parent Manager.jsx OTP request করবে
    await onSubmit(managerData);

    // এখানে form clear করছি না।
    // OTP verification-এর পর Manager.jsx
    // form hide করবে।
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Create Manager Account
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Enter the Manager information. A verification
          OTP will be sent to the Manager&apos;s email.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >

        {/* Manager Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Manager Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter Manager Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter Real Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number
          </label>

          <input
            type="tel"
            name="phone"
            placeholder="Enter Mobile Number"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="tel"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Minimum 6 Characters"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            disabled={loading}
            autoComplete="new-password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100"
          />
        </div>

        {/* Confirm Password */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            disabled={loading}
            autoComplete="new-password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-green-700 hover:bg-green-800 text-white rounded-lg py-3 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Sending OTP..."
            : "Send Verification OTP"}
        </button>

      </form>

    </div>
  );
};

export default ManagerForm;