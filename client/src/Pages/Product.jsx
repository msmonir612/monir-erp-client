import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

import Navbar from "../Components/layout/Navbar";
import ProductForm from "../Components/product/ProductForm";

import {
  getProducts,
  deleteProduct,
} from "../services/productService";
import Sidebar from "../Components/layout/Sidebar";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [search, setSearch] = useState("");

  // ======================
  // Load Products
  // ======================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ======================
  // Delete
  // ======================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "You won't be able to recover it.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProduct(id);

      toast.success("Product Deleted");

      fetchProducts();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  // ======================
  // Search
  // ======================

  const filteredProducts = products.filter(
    (item) =>
      item.productName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.productCode
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.category
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <>
      <Sidebar />

      <div className="max-w-7xl mx-auto p-6">

        {/* Header */}

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            Product Management
          </h1>

          <button
            onClick={() => {
              setEditingProduct(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            + Add Product
          </button>

        </div>

        {/* Summary */}

        <div className="grid md:grid-cols-4 gap-5 mb-6">

          <div className="bg-blue-600 text-white p-5 rounded-xl">
            <h3>Total Products</h3>

            <p className="text-3xl font-bold">
              {products.length}
            </p>
          </div>

          <div className="bg-green-600 text-white p-5 rounded-xl">
            <h3>Active</h3>

            <p className="text-3xl font-bold">
              {
                products.filter(
                  (x) => x.status === "Active"
                ).length
              }
            </p>
          </div>

          <div className="bg-red-600 text-white p-5 rounded-xl">
            <h3>Inactive</h3>

            <p className="text-3xl font-bold">
              {
                products.filter(
                  (x) => x.status === "Inactive"
                ).length
              }
            </p>
          </div>

          <div className="bg-orange-500 text-white p-5 rounded-xl">
            <h3>Low Stock</h3>

            <p className="text-3xl font-bold">
              {
                products.filter(
                  (x) =>
                    x.currentStock <=
                    x.minimumStock
                ).length
              }
            </p>
          </div>

        </div>

        {/* Search */}

        <input
          type="text"
          placeholder="Search Product..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border rounded-lg px-4 py-2 mb-5 w-80"
        />

        {/* Table */}

        <div className="bg-white rounded-xl shadow overflow-x-auto">

          {loading ? (
            <div className="p-10 text-center">
              Loading...
            </div>
          ) : (
            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="p-3">SL</th>

                  <th>Code</th>

                  <th>Name</th>

                  <th>Category</th>

                  <th>Sale Price</th>

                  <th>Stock</th>

                  <th>Status</th>

                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredProducts.map(
                  (item, index) => (

                    <tr
                      key={item._id}
                      className="border-t text-center hover:bg-slate-50"
                    >

                      <td className="p-3">
                        {index + 1}
                      </td>

                      <td>{item.productCode}</td>

                      <td>{item.productName}</td>

                      <td>{item.category}</td>

                      <td>
                        ৳ {item.salePrice}
                      </td>

                      <td>
                        <span
                          className={`font-bold ${
                            item.currentStock <=
                            item.minimumStock
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {item.currentStock}
                        </span>
                      </td>

                      <td>

                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            item.status ===
                            "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>

                      </td>

                      <td className="space-x-2">

                        <button
                          onClick={() => {
                            setEditingProduct(
                              item
                            );
                            setShowModal(
                              true
                            );
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              item._id
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

        {showModal && (
          <ProductForm
            product={editingProduct}
            onClose={() =>
              setShowModal(false)
            }
            refresh={fetchProducts}
          />
        )}

      </div>
    </>
  );
};

export default Product;