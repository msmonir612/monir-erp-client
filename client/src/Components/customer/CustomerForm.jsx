import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  createCustomer,
  updateCustomer,
} from "../../services/customerService";

const CustomerForm = ({
  customer,
  onClose,
  refresh,
}) => {
  const [formData, setFormData] = useState({
    customerCode: "",
    name: "",
    phone: "",
    address: "",
    previousDue: 0,
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        customerCode: customer.customerCode,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        previousDue: customer.previousDue,
        status: customer.status,
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (customer) {
        await updateCustomer(customer._id, formData);

        toast.success("Customer Updated");
      } else {
        await createCustomer(formData);

        toast.success("Customer Created");
      }

      refresh();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Operation Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-full max-w-xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          {customer
            ? "Update Customer"
            : "Add Customer"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4"
        >

          <input
            type="text"
            name="customerCode"
            placeholder="Customer Code"
            value={formData.customerCode}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="number"
            name="previousDue"
            placeholder="Previous Due"
            value={formData.previousDue}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border rounded-lg p-3 col-span-2"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <div className="col-span-2 flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded bg-blue-600 text-white"
            >
              {loading
                ? "Saving..."
                : customer
                ? "Update"
                : "Save"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CustomerForm;