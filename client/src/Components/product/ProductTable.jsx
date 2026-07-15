import { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
} from "../../services/productService";

const ProductTable = ({ onEdit }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await getProducts();

      setProducts(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);

      loadProducts();
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  const filteredProducts = products.filter((item) =>
    item.productName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">

        <h2 className="text-2xl font-bold text-gray-700">
          Product List
        </h2>

        <input
          type="text"
          placeholder="Search Product..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border rounded-lg px-4 py-2 w-72"
        />
      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full border border-gray-200">

          <thead className="bg-blue-600 text-white">

            <tr>

              <th className="p-3">SL</th>

              <th className="p-3">Product</th>

              <th className="p-3">Code</th>

              <th className="p-3">Category</th>

              <th className="p-3">Supplier</th>

              <th className="p-3">Stock</th>

              <th className="p-3">Purchase</th>

              <th className="p-3">Sale</th>

              <th className="p-3">Status</th>

              <th className="p-3">Action</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="10"
                  className="text-center py-10"
                >
                  Loading...
                </td>

              </tr>

            ) : filteredProducts.length === 0 ? (

              <tr>

                <td
                  colSpan="10"
                  className="text-center py-10"
                >
                  No Product Found
                </td>

              </tr>

            ) : (

              filteredProducts.map((item, index) => (

                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-3">
                    {index + 1}
                  </td>

                  <td className="p-3 font-medium">
                    {item.productName}
                  </td>

                  <td className="p-3">
                    {item.productCode}
                  </td>

                  <td className="p-3">
                    {item.category}
                  </td>

                  <td className="p-3">
                    {item.supplier?.supplierName}
                  </td>

                  <td className="p-3">
                    {item.stock}
                  </td>

                  <td className="p-3">
                    ৳ {item.purchasePrice}
                  </td>

                  <td className="p-3">
                    ৳ {item.salePrice}
                  </td>

                  <td className="p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-sm text-white ${
                        item.status
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {item.status
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>

                  <td className="p-3 flex gap-2">

                    <button
                      onClick={() =>
                        onEdit(item)
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item._id)
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

export default ProductTable;