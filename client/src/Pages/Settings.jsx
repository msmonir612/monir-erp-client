import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  getSettings,
  updateSettings,
} from "../services/settingsService";

const Settings = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    currency: "BDT",
    invoiceFooter: "",
  });

  // ==========================
  // Load Settings
  // ==========================
  const loadSettings = async () => {
    try {
      const data = await getSettings();

      setFormData({
        companyName: data.settings.companyName || "",
        phone: data.settings.phone || "",
        email: data.settings.email || "",
        website: data.settings.website || "",
        address: data.settings.address || "",
        currency: data.settings.currency || "BDT",
        invoiceFooter: data.settings.invoiceFooter || "",
      });
    } catch (error) {
      toast.error("Failed to load settings");
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

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
  // Update Settings
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await updateSettings(formData);

      toast.success(data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      <div className="bg-white rounded-xl shadow-md p-8">

        <h2 className="text-3xl font-bold text-blue-600 mb-6">
          Company Settings
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            name="website"
            placeholder="Website"
            value={formData.website}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            name="currency"
            placeholder="Currency"
            value={formData.currency}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3 md:col-span-2"
            rows={3}
          />

          <textarea
            name="invoiceFooter"
            placeholder="Invoice Footer"
            value={formData.invoiceFooter}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3 md:col-span-2"
            rows={3}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg md:col-span-2"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Settings;