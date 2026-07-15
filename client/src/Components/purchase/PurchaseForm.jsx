import { useEffect, useState } from "react";
import { getSuppliers } from "../../services/supplierService";
import { getProducts } from "../../services/productService";
import { createPurchase } from "../../services/purchaseService";
import { toast } from "react-hot-toast";

const PurchaseForm = () => {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    invoiceNo: "",
    supplier: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    paymentType: "Cash",
    discount: 0,
    transportCost: 0,
    paidAmount: 0,
    note: "",
  });

  const [items, setItems] = useState([
    {
      product: "",
      quantity: 1,
      purchasePrice: 0,
      total: 0,
    },
  ]);

  // =====================================
  // Live Calculations (Component Level)
  // =====================================
  const subTotal = items.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const grandTotal =
    subTotal -
    Number(formData.discount || 0) +
    Number(formData.transportCost || 0);

  const dueAmount = grandTotal - Number(formData.paidAmount || 0);

  // Load Supplier & Product
  useEffect(() => {
    loadData();

    // Auto Invoice Number
    const invoice = "PUR-" + Date.now().toString().slice(-6);

    setFormData((prev) => ({
      ...prev,
      invoiceNo: invoice,
    }));
  }, []);

  const loadData = async () => {
    try {
      const supplierData = await getSuppliers();
      const productData = await getProducts();

      setSuppliers(supplierData);
      setProducts(productData);
    } catch (error) {
      console.log(error);
    }
  };

  // Invoice Input
  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================
  // Product Change
  // =====================================
  const handleProductChange = (index, value) => {
    const updatedItems = [...items];

    // Duplicate Product Check
    const exists = updatedItems.find(
      (item, i) => item.product === value && i !== index
    );

    if (exists) {
      toast.error("This product is already added.");
      return;
    }

    updatedItems[index].product = value;
    setItems(updatedItems);
  };

  // =====================================
  // Qty / Price Change
  // =====================================
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    updatedItems[index][field] = Number(value);

    updatedItems[index].total =
      updatedItems[index].quantity * updatedItems[index].purchasePrice;

    setItems(updatedItems);
  };

  // =====================================
  // Add New Row
  // =====================================
  const addRow = () => {
    setItems([
      ...items,
      {
        product: "",
        quantity: 1,
        purchasePrice: 0,
        total: 0,
      },
    ]);
  };

  const deleteRow = (index) => {
    if (items.length === 1) return;

    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // =====================================
  // Save Purchase
  // =====================================
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Form submit handle করার জন্য

    try {
      // Validation
      if (!formData.supplier) {
        return toast.error("Please select a supplier");
      }

      if (items.length === 0) {
        return toast.error("Please add at least one product");
      }

      for (const item of items) {
        if (!item.product) {
          return toast.error("Please select product");
        }

        if (item.quantity <= 0) {
          return toast.error("Quantity must be greater than zero");
        }

        if (item.purchasePrice <= 0) {
          return toast.error("Purchase price must be greater than zero");
        }
      }

      setLoading(true);

      const purchaseData = {
        invoiceNo: formData.invoiceNo,
        supplier: formData.supplier,
        purchaseDate: formData.purchaseDate,
        items,
        subTotal,
        discount: Number(formData.discount),
        transportCost: Number(formData.transportCost),
        grandTotal,
        paidAmount: Number(formData.paidAmount),
        dueAmount,
        paymentType: formData.paymentType,
        note: formData.note,
      };

      await createPurchase(purchaseData);
      toast.success("Purchase Saved Successfully");

      // Reset Form
      setFormData({
        invoiceNo: "PUR-" + Date.now().toString().slice(-6),
        supplier: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        paymentType: "Cash",
        discount: 0,
        transportCost: 0,
        paidAmount: 0,
        note: "",
      });

      setItems([
        {
          product: "",
          quantity: 1,
          purchasePrice: 0,
          total: 0,
        },
      ]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Purchase Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Purchase Invoice</h2>

      <form onSubmit={handleSubmit}>
        {/* Invoice Info */}
        <div className="grid md:grid-cols-4 gap-5">
          {/* Invoice */}
          <div>
            <label className="font-medium">Invoice No</label>
            <input
              type="text"
              name="invoiceNo"
              value={formData.invoiceNo}
              readOnly
              className="w-full border rounded-lg p-2 mt-1 bg-gray-100"
            />
          </div>

          {/* Supplier */}
          <div>
            <label className="font-medium">Supplier</label>
            <select
              name="supplier"
              value={formData.supplier}
              onChange={handleInput}
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="font-medium">Purchase Date</label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleInput}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* Payment */}
          <div>
            <label className="font-medium">Payment Type</label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleInput}
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="Cash">Cash</option>
              <option value="Due">Due</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border text-left border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 border text-center">SL</th>
                <th className="p-3 border">Product</th>
                <th className="p-3 border text-center">Qty</th>
                <th className="p-3 border text-center">Purchase Price</th>
                <th className="p-3 border text-center">Total</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border text-center">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border text-left">
                    <select
                      value={item.product}
                      onChange={(e) => handleProductChange(index, e.target.value)}
                      className="border rounded p-2 w-full"
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.productName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      className="border rounded p-2 w-20 text-center"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={item.purchasePrice}
                      min="0"
                      onChange={(e) => handleItemChange(index, "purchasePrice", e.target.value)}
                      className="border rounded p-2 w-28 text-center"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={item.total}
                      readOnly
                      className="border rounded p-2 w-28 bg-gray-100 text-center"
                    />
                  </td>
                  <td className="p-2 border">
                    <button
                      type="button"
                      onClick={() => deleteRow(index)}
                      disabled={items.length === 1}
                      className="bg-red-600 text-white px-3 py-1 rounded disabled:bg-gray-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={addRow}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            + Add Item
          </button>
        </div>

        {/* Calculation & Note Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Left: Note */}
          <div>
            <label className="font-medium">Note</label>
            <textarea
              rows="5"
              name="note"
              value={formData.note}
              onChange={handleInput}
              className="w-full border rounded-lg p-3 mt-2"
              placeholder="Write note..."
            />
          </div>

          {/* Right: Calculations */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-xl border">
            <div className="flex justify-between">
              <span>Sub Total</span>
              <strong>৳ {subTotal.toFixed(2)}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span>Discount</span>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                min="0"
                onChange={handleInput}
                className="border rounded-lg p-2 w-36 text-right"
              />
            </div>

            <div className="flex justify-between items-center">
              <span>Transport Cost</span>
              <input
                type="number"
                name="transportCost"
                value={formData.transportCost}
                min="0"
                onChange={handleInput}
                className="border rounded-lg p-2 w-36 text-right"
              />
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Grand Total</span>
              <span>৳ {grandTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Paid Amount</span>
              <input
                type="number"
                name="paidAmount"
                value={formData.paidAmount}
                min="0"
                onChange={handleInput}
                className="border rounded-lg p-2 w-36 text-right"
              />
            </div>

            <div className="flex justify-between font-bold text-red-600 text-lg border-t pt-2">
              <span>Due Amount</span>
              <span>৳ {dueAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow disabled:bg-gray-400 transition"
          >
            {loading ? "Saving..." : "Save Purchase"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseForm;