import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  createProduct,
  updateProduct,
} from "../../services/productService";

const ProductForm = ({ product, onClose, refresh }) => {
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    category: "",
    brand: "",
    unit: "Pcs",
    salePrice: "",
    minimumStock: 5,
    description: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        productCode: product.productCode || "",
        productName: product.productName || "",
        category: product.category || "",
        brand: product.brand || "",
        unit: product.unit || "Pcs",
        salePrice: product.salePrice || "",
        minimumStock: product.minimumStock || 5,
        description: product.description || "",
        status: product.status || "Active",
      });
    }
  }, [product]);

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

      if (product) {
        await updateProduct(product._id, formData);
        toast.success("Product Updated Successfully");
      } else {
        await createProduct(formData);
        toast.success("Product Added Successfully");
      }

      refresh();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          {product ? "Update Product" : "Add Product"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-5"
        >
          <div>
            <label>Product Code</label>

            <input
              type="text"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label>Product Name</label>

            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label>Category</label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label>Brand</label>

            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label>Unit</label>

            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            >
              <option>Pcs</option>
              <option>Kg</option>
              <option>Liter</option>
              <option>Packet</option>
              <option>Box</option>
            </select>
          </div>

          <div>
            <label>Sale Price</label>

            <input
              type="number"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label>Minimum Stock</label>

            <input
              type="number"
              name="minimumStock"
              value={formData.minimumStock}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="col-span-2">
            <label>Description</label>

            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div className="col-span-2 flex justify-end gap-3 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading
                ? "Saving..."
                : product
                ? "Update Product"
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;