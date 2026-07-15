import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getSales, deleteSale } from "../../services/saleService";

const SaleTable = ({ onEdit }) => {
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ==========================
  // Load Sales
  // ==========================
  const loadSales = async () => {
    try {
      setLoading(true);

      const data = await getSales();

      if (Array.isArray(data)) {
        setSales(data);
      } else if (Array.isArray(data?.sales)) {
        setSales(data.sales);
      } else if (Array.isArray(data?.data)) {
        setSales(data.data);
      } else {
        setSales([]);
      }
    } catch (error) {
      console.error(error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  // ==========================
  // Delete Sale
  // ==========================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Sale?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSale(id);

      Swal.fire({
        icon: "success",
        title: "Deleted Successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      loadSales();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
      });
    }
  };

  // ==========================
  // Search
  // ==========================
  const filteredSales = sales.filter((sale) => {
    const invoice = sale.invoiceNo?.toLowerCase() || "";
    const customer = sale.customer?.name?.toLowerCase() || "";

    return (
      invoice.includes(search.toLowerCase()) ||
      customer.includes(search.toLowerCase())
    );
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Sales List</h2>

        <input
          type="text"
          placeholder="Search Invoice / Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-72"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3">SL</th>
              <th>Invoice</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Grand Total</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Profit</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : filteredSales.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-10">
                  No Sales Found
                </td>
              </tr>
            ) : (
              filteredSales.map((sale, index) => (
                <tr
                  key={sale._id}
                  className="border-b hover:bg-slate-50 text-center"
                >
                  <td className="p-3">{index + 1}</td>

                  <td>{sale.invoiceNo}</td>

                  <td>
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </td>

                  <td>{sale.customer?.name}</td>

                  <td>{sale.items?.length}</td>

                  <td className="font-semibold">
                    ৳ {sale.grandTotal}
                  </td>

                  <td className="text-green-600 font-semibold">
                    ৳ {sale.paidAmount}
                  </td>

                  <td className="text-red-600 font-semibold">
                    ৳ {sale.dueAmount}
                  </td>

                  <td className="text-blue-600 font-bold">
                    ৳ {sale.totalProfit}
                  </td>

                  <td className="space-x-2">
                    <button
                      onClick={() => navigate(`/sale/${sale._id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => onEdit(sale)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(sale._id)}
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

export default SaleTable;