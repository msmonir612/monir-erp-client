import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getPurchases,
  deletePurchase,
} from "../../services/purchaseService";

const PurchaseTable = ({ onEdit }) => {
  console.log("PurchaseTable Rendered");

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("useEffect Running");
    loadPurchases();
  }, []);


// Load Purchases
// ==========================
const loadPurchases = async () => {
  try {
    setLoading(true);

    const data = await getPurchases();

    console.log("========== Purchase API ==========");
    console.log(data);
    console.log("Is Array:", Array.isArray(data));
    console.log("==================================");

    if (Array.isArray(data)) {
      setPurchases(data);
    } else if (Array.isArray(data.purchases)) {
      setPurchases(data.purchases);
    } else if (Array.isArray(data.data)) {
      setPurchases(data.data);
    } else {
      console.log("Unexpected Response:", data);
      setPurchases([]);
    }
  } catch (error) {
    console.log("Purchase Load Error:", error);
    setPurchases([]);
  } finally {
    setLoading(false);
  }
};
  // ==========================
  // Delete Purchase
  // ==========================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Purchase?",
      text: "You won't be able to recover this purchase.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deletePurchase(id);

      Swal.fire({
        icon: "success",
        title: "Deleted Successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      loadPurchases();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
      });
    }
  };

  // ==========================
  // Search
  // ==========================
  const filteredPurchases = purchases.filter((purchase) => {
    const invoice = purchase.invoiceNo?.toLowerCase() || "";
    const supplier = purchase.supplier?.name?.toLowerCase() || "";

    return (
      invoice.includes(search.toLowerCase()) ||
      supplier.includes(search.toLowerCase())
    );
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">

        <h2 className="text-2xl font-bold">
          Purchase List
        </h2>

        <input
          type="text"
          placeholder="Search Invoice / Supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-72"
        />

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full border">

          <thead className="bg-blue-600 text-white">

            <tr>

              <th className="p-3">SL</th>

              <th>Invoice</th>

              <th>Date</th>

              <th>Supplier</th>

              <th>Items</th>

              <th>Grand Total</th>

              <th>Paid</th>

              <th>Due</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="9"
                  className="text-center py-10"
                >
                  Loading...
                </td>

              </tr>

            ) : filteredPurchases.length === 0 ? (

              <tr>

                <td
                  colSpan="9"
                  className="text-center py-10"
                >
                  No Purchase Found
                </td>

              </tr>

            ) : (

              filteredPurchases.map((purchase, index) => (

                <tr
                  key={purchase._id}
                  className="border-b hover:bg-slate-50 text-center"
                >

                  <td className="p-3">
                    {index + 1}
                  </td>

                  <td>
                    {purchase.invoiceNo}
                  </td>

                  <td>
                    {new Date(
                      purchase.purchaseDate
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    {purchase.supplier?.name}
                  </td>

                  <td>
                    {purchase.items?.length}
                  </td>

                  <td className="font-semibold">
                    ৳ {purchase.grandTotal}
                  </td>

                  <td className="text-green-600 font-semibold">
                    ৳ {purchase.paidAmount}
                  </td>

                  <td className="text-red-600 font-semibold">
                    ৳ {purchase.dueAmount}
                  </td>

                  <td className="space-x-2">

                    <button
                      onClick={() => onEdit(purchase)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(purchase._id)
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

export default PurchaseTable;