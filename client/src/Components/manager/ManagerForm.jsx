import { useState } from "react";

const ManagerForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // ==========================
  // Handle Input
  // ==========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // Submit
  // ==========================
  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);

    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-5">
        Add Manager
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Manager Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border rounded-lg p-3"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border rounded-lg p-3"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="border rounded-lg p-3"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border rounded-lg p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold md:col-span-2"
        >
          {loading ? "Saving..." : "Create Manager"}
        </button>
      </form>
    </div>
  );
};

export default ManagerForm;