import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import Navbar from "../Components/layout/Navbar";
import SupplierForm from "../Components/supplier/SupplierForm";

import {
  getSuppliers,
  deleteSupplier,
} from "../services/supplierService";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [editingSupplier, setEditingSupplier] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ===========================
  // Load Suppliers
  // ===========================
  const fetchSuppliers = async () => {
    try {
      setLoading(true);

      const data = await getSuppliers();

      setSuppliers(data);
    } catch (error) {
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // ===========================
  // Search Filter
  // ===========================
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(search.toLowerCase()) ||
    supplier.phone.toLowerCase().includes(search.toLowerCase()) ||
    supplier.supplierCode.toLowerCase().includes(search.toLowerCase()) ||
    (supplier.companyName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ===========================
  // Delete Supplier
  // ===========================
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to recover this supplier!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#dc2626",
    confirmButtonText: "Yes, Delete",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteSupplier(id);

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Supplier deleted successfully.",
      timer: 1500,
      showConfirmButton: false,
    });

    fetchSuppliers();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Delete Failed",
      text: error.response?.data?.message || "Something went wrong",
    });
  }
};

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

          <h1 className="text-3xl font-bold">
            Supplier Management
          </h1>

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Search supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => {
                setEditingSupplier(null);
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              + Add Supplier
            </button>

          </div>

        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loading ? (
            <div className="p-10 text-center">
              Loading...
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="p-10 text-center">
              No Supplier Found
            </div>
          ) : (
            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>
                  <th className="p-3">Code</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredSuppliers.map((supplier) => (

                  <tr
                    key={supplier._id}
                    className="border-t text-center hover:bg-slate-50"
                  >

                    <td className="p-3">{supplier.supplierCode}</td>

                    <td>{supplier.name}</td>

                    <td>{supplier.phone}</td>

                    <td>{supplier.companyName || "-"}</td>

                    <td>৳ {supplier.currentDue}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          supplier.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {supplier.status}
                      </span>
                    </td>

                    <td className="space-x-2">

                      <button
                        onClick={() => {
                          setEditingSupplier(supplier);
                          setShowModal(true);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(supplier._id)
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <SupplierForm
            supplier={editingSupplier}
            onClose={() => setShowModal(false)}
            refresh={fetchSuppliers}
          />
        )}

      </div>
    </>
  );
};

export default Supplier;