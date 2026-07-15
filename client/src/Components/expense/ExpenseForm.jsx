import { useState } from "react";
import toast from "react-hot-toast";
import { createExpense } from "../../services/expenseService";

const ExpenseForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    expenseName: "",
    category: "",
    amount: "",
    paymentMethod: "Cash",
    referenceNo: "",
    expenseDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.expenseName) {
      return toast.error("Expense Name is required");
    }

    if (!formData.category) {
      return toast.error("Category is required");
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      return toast.error("Enter a valid amount");
    }

    try {
      setLoading(true);

      await createExpense({
        ...formData,
        amount: Number(formData.amount),
      });

      toast.success("Expense added successfully");

      setFormData({
        expenseName: "",
        category: "",
        amount: "",
        paymentMethod: "Cash",
        referenceNo: "",
        expenseDate: new Date().toISOString().split("T")[0],
        description: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add expense"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-5">
        Add Expense
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {/* Expense Name */}
        <div>
          <label className="block mb-2 font-medium">
            Expense Name
          </label>

          <input
            type="text"
            name="expenseName"
            value={formData.expenseName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Expense Name"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2 font-medium">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Category</option>

            <option>Rent</option>
            <option>Salary</option>
            <option>Electricity</option>
            <option>Gas Bill</option>
            <option>Internet</option>
            <option>Transport</option>
            <option>Marketing</option>
            <option>Packaging</option>
            <option>Repair</option>
            <option>Office Expense</option>
            <option>Miscellaneous</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block mb-2 font-medium">
            Amount
          </label>

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="0"
          />
        </div>

        {/* Payment */}
        <div>
          <label className="block mb-2 font-medium">
            Payment Method
          </label>

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option>Cash</option>
            <option>Bank</option>
            <option>Bkash</option>
            <option>Nagad</option>
            <option>Rocket</option>
          </select>
        </div>

        {/* Reference */}
        <div>
          <label className="block mb-2 font-medium">
            Reference No
          </label>

          <input
            type="text"
            name="referenceNo"
            value={formData.referenceNo}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Optional"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block mb-2 font-medium">
            Expense Date
          </label>

          <input
            type="date"
            name="expenseDate"
            value={formData.expenseDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">
            Description
          </label>

          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Description..."
          />
        </div>

        <div className="md:col-span-2">
          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            {loading ? "Saving..." : "Save Expense"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;