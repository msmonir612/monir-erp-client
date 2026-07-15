import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

import Navbar from "../Components/layout/Navbar";
import CustomerForm from "../Components/customer/CustomerForm";

import {
  getCustomers,
  deleteCustomer,
} from "../services/customerService";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [editingCustomer, setEditingCustomer] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  // ==========================
  // Load Customers
  // ==========================
  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const data = await getCustomers();

      setCustomers(data);
    } catch (error) {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ==========================
  // Search
  // ==========================
  const filteredCustomers =
    customers.filter((customer) => {
      return (
        customer.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        customer.phone
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        customer.customerCode
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });

  // ==========================
  // Delete
  // ==========================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Customer?",
      text: "You won't be able to recover this customer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCustomer(id);

      Swal.fire({
        icon: "success",
        title: "Deleted Successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchCustomers();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        {/* Header */}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

          <h1 className="text-3xl font-bold">
            Customer Management
          </h1>

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Search Customer..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="border rounded-lg px-4 py-2 w-72"
            />

            <button
              onClick={() => {
                setEditingCustomer(null);
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              + Add Customer
            </button>

          </div>

        </div>

        {/* Table */}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loading ? (
            <div className="p-10 text-center">
              Loading...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-10 text-center">
              No Customer Found
            </div>
          ) : (
            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="p-3">SL</th>

                  <th>Code</th>

                  <th>Name</th>

                  <th>Phone</th>

                  <th>Due</th>

                  <th>Status</th>

                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredCustomers.map(
                  (customer, index) => (
                    <tr
                      key={customer._id}
                      className="border-t text-center hover:bg-slate-50"
                    >
                      <td className="p-3">
                        {index + 1}
                      </td>

                      <td>
                        {customer.customerCode}
                      </td>

                      <td>{customer.name}</td>

                      <td>{customer.phone}</td>

                      <td>
                        ৳ {customer.currentDue}
                      </td>

                      <td>

                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            customer.status ===
                            "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {customer.status}
                        </span>

                      </td>

                      <td className="space-x-2">

                        <button
                          onClick={() => {
                            setEditingCustomer(
                              customer
                            );
                            setShowModal(true);
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              customer._id
                            )
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>
          )}

        </div>

        {/* Modal */}

        {showModal && (
          <CustomerForm
            customer={editingCustomer}
            onClose={() =>
              setShowModal(false)
            }
            refresh={fetchCustomers}
          />
        )}

      </div>
    </>
  );
};

export default Customer;