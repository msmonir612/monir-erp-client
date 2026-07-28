import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  createSupplier,
  updateSupplier,
} from "../../services/supplierService";

const SupplierForm = ({ supplier, onClose, refresh }) => {
  const [formData, setFormData] = useState({
    supplierCode: "",
    name: "",
    companyName: "",
    phone: "",
    email: "",
    address: "",
    previousDue: 0,
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supplier) {
      setFormData({
        supplierCode: supplier.supplierCode || "",
        name: supplier.name || "",
        companyName: supplier.companyName || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        address: supplier.address || "",
        previousDue: supplier.previousDue || 0,
        status: supplier.status || "Active",
      });
    }
  }, [supplier]);

  // ===========================
  // Input Change
  // ===========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===========================
  // Submit
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (supplier) {
        await updateSupplier(supplier._id, formData);
        toast.success("Supplier Updated Successfully");
      } else {
        await createSupplier(formData);
        toast.success("Supplier Added Successfully");
      }

      refresh();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Operation Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          {supplier ? "Edit Supplier" : "Add Supplier"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4"
        >
          <input
            name="supplierCode"
            placeholder="Supplier Code"
            value={formData.supplierCode}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg"
          />

          <input
            name="name"
            placeholder="Supplier Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg"
          />

          <input
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            type="number"
            name="previousDue"
            placeholder="Previous Due"
            value={formData.previousDue}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-3 rounded-lg col-span-2"
            rows="3"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading
                ? "Saving..."
                : supplier
                ? "Update Supplier"
                : "Save Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;