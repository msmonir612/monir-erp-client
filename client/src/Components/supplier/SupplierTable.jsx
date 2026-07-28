import { useEffect, useState } from "react";
import {
  getSuppliers,
  deleteSupplier,
} from "../../services/supplierService";

const SupplierTable = ({ onEdit }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);

      const res = await getSuppliers();

      setSuppliers(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmDelete) return;

    try {
      await deleteSupplier(id);
      loadSuppliers();
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  const filteredSuppliers = suppliers.filter((item) =>
    item.supplierName.toLowerCase().includes(search.toLowerCase()) ||
    item.phone.toLowerCase().includes(search.toLowerCase()) ||
    item.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

        <h2 className="text-2xl font-bold text-gray-700">
          Supplier List
        </h2>

        <input
          type="text"
          placeholder="Search Supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-72"
        />

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="min-w-full border border-gray-200">

          <thead className="bg-blue-600 text-white">

            <tr>
              <th className="p-3">SL</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Company</th>
              <th className="p-3">Phone</th>
              <th className="p-3">City</th>
              <th className="p-3">Current Due</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td colSpan="8" className="text-center py-10">
                  Loading...
                </td>
              </tr>

            ) : filteredSuppliers.length === 0 ? (

              <tr>
                <td colSpan="8" className="text-center py-10">
                  No Supplier Found
                </td>
              </tr>

            ) : (

              filteredSuppliers.map((item, index) => (

                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3 font-medium">
                    {item.supplierName}
                  </td>

                  <td className="p-3">
                    {item.companyName}
                  </td>

                  <td className="p-3">
                    {item.phone}
                  </td>

                  <td className="p-3">
                    {item.city}
                  </td>

                  <td className="p-3 font-semibold text-red-600">
                    ৳ {item.currentDue}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        item.status
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {item.status ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-3 flex gap-2">

                    <button
                      onClick={() => onEdit(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
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

export default SupplierTable;