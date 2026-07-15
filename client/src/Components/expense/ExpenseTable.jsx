import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  getExpenses,
  deleteExpense,
} from "../../services/expenseService";

const ExpenseTable = ({ onEdit }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ===============================
  // Load Expenses
  // ===============================
  const loadExpenses = async () => {
    try {
      setLoading(true);

      const data = await getExpenses();

      if (Array.isArray(data)) {
        setExpenses(data);
      } else if (Array.isArray(data.expenses)) {
        setExpenses(data.expenses);
      } else if (Array.isArray(data.data)) {
        setExpenses(data.data);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.log(error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // ===============================
  // Delete Expense
  // ===============================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Expense?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteExpense(id);

      Swal.fire({
        icon: "success",
        title: "Expense Deleted",
        timer: 1500,
        showConfirmButton: false,
      });

      loadExpenses();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
      });
    }
  };

  // ===============================
  // Search
  // ===============================
  const filteredExpenses = expenses.filter((expense) => {
    const category = expense.category?.toLowerCase() || "";
    const reference = expense.referenceNo?.toLowerCase() || "";

    return (
      category.includes(search.toLowerCase()) ||
      reference.includes(search.toLowerCase())
    );
  });

  // ===============================
  // Total Expense
  // ===============================
  const totalExpense = filteredExpenses.reduce(
    (total, item) => total + Number(item.amount),
    0
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Expense List</h2>

        <input
          type="text"
          placeholder="Search Category / Reference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-72"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-red-600">
          Total Expense : ৳ {totalExpense.toLocaleString()}
        </h3>
      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full border">

          <thead className="bg-red-600 text-white">

            <tr>
              <th className="p-3">SL</th>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Reference</th>
              <th>Description</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td colSpan="8" className="text-center py-10">
                  Loading...
                </td>
              </tr>

            ) : filteredExpenses.length === 0 ? (

              <tr>
                <td colSpan="8" className="text-center py-10">
                  No Expense Found
                </td>
              </tr>

            ) : (

              filteredExpenses.map((expense, index) => (

                <tr
                  key={expense._id}
                  className="border-b hover:bg-slate-50 text-center"
                >
                  <td className="p-3">{index + 1}</td>

                  <td>
                    {new Date(
                      expense.expenseDate
                    ).toLocaleDateString()}
                  </td>

                  <td>{expense.category}</td>

                  <td className="font-semibold text-red-600">
                    ৳ {expense.amount}
                  </td>

                  <td>{expense.paymentMethod}</td>

                  <td>{expense.referenceNo}</td>

                  <td>{expense.description}</td>

                  <td className="space-x-2">

                    <button
                      onClick={() => onEdit(expense)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(expense._id)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ExpenseTable;