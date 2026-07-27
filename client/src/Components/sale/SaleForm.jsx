import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { createSale } from "../../services/saleService";
import { getCustomers } from "../../services/customerService";
import { getProducts } from "../../services/productService";
import { useNavigate } from "react-router-dom";

const SaleForm = ({ editingSale, onSuccess }) => {

  // ==========================
  // State
  // ==========================
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [items, setItems] = useState([]);

  const [selectedProduct, setSelectedProduct] =
    useState("");

  const [quantity, setQuantity] = useState("");

  const [salePrice, setSalePrice] = useState(0);
  const [currentStock,setCurrentStock]= useState(0)

  

  const [formData, setFormData] = useState({

    invoiceNo: "",

    customer: "",

    saleDate: new Date()
      .toISOString()
      .substring(0, 10),

    discount: "",

    vat: "",

    transportCost: "",

    paidAmount: "",

    paymentType: "Cash",

    note: "",

  });

  // ==========================
  // Load Data
  // ==========================

  useEffect(() => {

    loadCustomers();

    loadProducts();

    generateInvoice();

  }, []);

  // ==========================
  // Generate Invoice
  // ==========================

  const generateInvoice = () => {

    setFormData((prev) => ({
      ...prev,
      invoiceNo:
        "S-" +
        Date.now().toString().slice(-6),
    }));

  };

  // ==========================
  // Load Customers
  // ==========================

  const loadCustomers = async () => {

    try {

      const data = await getCustomers();

      if (Array.isArray(data)) {

        setCustomers(data);

      } else if (Array.isArray(data.data)) {

        setCustomers(data.data);

      } else {

        setCustomers([]);

      }

    } catch (error) {

      console.log(error);

      toast.error("Customer Load Failed");

    }

  };

  // ==========================
  // Load Products
  // ==========================

  const loadProducts = async () => {

    try {

      const data = await getProducts();
    

console.log(data);
setProducts(data);

      if (Array.isArray(data)) {

        setProducts(data);

      } else if (Array.isArray(data.data)) {

        setProducts(data.data);

      } else {

        setProducts([]);

      }

    } catch (error) {

      console.log(error);

      toast.error("Product Load Failed");

    }

  };

  // ==========================
  // Handle Input
  // ==========================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

    // ==========================
  // Product Change
  // ==========================

  const handleProductChange = (id) => {

    const product = products.find(
      (item) => item._id === id
    );

    setSelectedProduct(id);

    if (product) {
      setSalePrice(product.salePrice);
      setCurrentStock(product.currentStock)
    }


  };

  // ==========================
  // Add Product
  // ==========================

  const addItem = () => {

    if (!selectedProduct) {
      return toast.error("Select Product");
    }

    const product = products.find(
      (item) => item._id === selectedProduct
    );

    if (!product) {
      return toast.error("Product Not Found");
    }

    if (quantity <= 0) {
      return toast.error("Quantity must be greater than 0");
    }

    if (quantity > product.currentStock) {
      return toast.error(
        `Only ${product.currentStock} items available`
      );
    }

    const exists = items.find(
      (item) => item.product === selectedProduct
    );

    if (exists) {
      return toast.error("Product already added");
    }

    const total = quantity * salePrice;

    setItems([
      ...items,
      {
        product: product._id,
        productCode: product.productCode,
        productName: product.productName,
        currentStock: product.currentStock,
        quantity,
        salePrice,
        total,
      },
    ]);

    setSelectedProduct("");
    setQuantity(1);
    setSalePrice(0);

  };

  // ==========================
  // Remove Item
  // ==========================

  const removeItem = (id) => {

    setItems(
      items.filter(
        (item) => item.product !== id
      )
    );

  };

  // ==========================
  // Calculate Total
  // ==========================

  const subTotal = items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const grandTotal =
    subTotal -
    Number(formData.discount) +
    Number(formData.vat) +
    Number(formData.transportCost);

  const dueAmount =
    grandTotal -
    Number(formData.paidAmount);

      return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Create Sale
      </h2>

      {/* Customer Info */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <input
          type="text"
          value={formData.invoiceNo}
          readOnly
          className="border rounded-lg px-4 py-2 bg-gray-100"
        />

        <select
          name="customer"
          value={formData.customer}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">
            Select Customer
          </option>

          {customers.map((customer) => (

            <option
              key={customer._id}
              value={customer._id}
            >
              {customer.name}
            </option>

          ))}

        </select>

        <input
          type="date"
          name="saleDate"
          value={formData.saleDate}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        />

      </div>

      {/* Product Add */}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">

        <select
          value={selectedProduct}
          onChange={(e) =>
            handleProductChange(e.target.value)
          }
          className="border rounded-lg px-4 py-2"
        >
          <option value="">
            Select Product
          </option>

          {products.map((product) => (

            <option
              key={product._id}
              value={product._id}
            >
              {product.productName}
            </option>

          ))}

        </select>
<p className="mt-2 font-semibold text-green-600">
  Current Stock: {currentStock ?? 0}
</p>
        <input
          type="number"
          min="1"
          placeholder="product item"
          value={quantity}
          onChange={(e) =>
            setQuantity(Number(e.target.value))
          }
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="number"
          value={salePrice}
          onChange={(e) =>
            setSalePrice(Number(e.target.value))
          }
          className="border rounded-lg px-4 py-2"
        />
        {/* <input 
        type="number"
        value={}
        /> */}

        <button
          type="button"
          onClick={addItem}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Add Product
        </button>

      </div>

      {/* Product Table */}

      <div className="overflow-x-auto mb-6">

        <table className="min-w-full border">

          <thead className="bg-green-600 text-white">

            <tr>

              <th className="p-3">SL</th>

              <th>Product</th>

              <th>Stock</th>

              <th>Qty</th>

              <th>Sale Price</th>

              <th>Total</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {items.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center py-6"
                >
                  No Product Added
                </td>

              </tr>

            ) : (

              items.map((item, index) => (

                <tr
                  key={item.product}
                  className="border-b text-center"
                >

                  <td className="p-3">
                    {index + 1}
                  </td>

                  <td>
                    {item.productName}
                  </td>

                  <td>
                    {item.currentStock}
                  </td>

                  <td>
                    {item.quantity}
                  </td>

                  <td>
                    ৳ {item.salePrice}
                  </td>

                  <td>
                    ৳ {item.total}
                  </td>

                  <td>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.product)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Remove
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Summary */}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">

        <input
          type="number"
          name="discount"
          placeholder="Discount"
          value={formData.discount}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="number"
          name="vat"
          placeholder="VAT"
          value={formData.vat}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="number"
          name="transportCost"
          placeholder="Transport Cost"
          value={formData.transportCost}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="number"
          name="paidAmount"
          placeholder="Paid Amount"
          value={formData.paidAmount}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        />

        <select
          name="paymentType"
          value={formData.paymentType}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        >
          <option value="Cash">Cash</option>
          <option value="Due">Due</option>
        </select>

        <textarea
          name="note"
          placeholder="Note"
          value={formData.note}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        />

      </div>

      <div className="bg-slate-100 rounded-xl p-5">

        <p>
          <strong>Sub Total :</strong> ৳ {subTotal}
        </p>

        <p>
          <strong>Grand Total :</strong> ৳ {grandTotal}
        </p>

        <p className="text-red-600 font-bold">
          Due : ৳ {dueAmount}
        </p>

      </div>
          {/* Save Button */}

      <div className="mt-6 flex justify-end">

        <button
          type="button"
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
        >
          Save Sale
        </button>

      </div>

    </div>
  );

  // ==========================
  // Submit Sale
  // ==========================

  async function handleSubmit() {
    try {

      if (!formData.customer) {
        return toast.error("Select Customer");
      }

      if (items.length === 0) {
        return toast.error("Add at least one product");
      }

      const saleData = {
        // invoiceNo: formData.invoiceNo,
        customer: formData.customer,
        saleDate: formData.saleDate,

        items,

        subTotal,

        discount: Number(formData.discount),

        vat: Number(formData.vat),

        transportCost: Number(
          formData.transportCost
        ),

        grandTotal,

        paidAmount: Number(
          formData.paidAmount
        ),

        dueAmount,

        paymentType: formData.paymentType,

        note: formData.note,
      };

    const data = await createSale(saleData);

    toast.success(data.message);

      navigate(`/invoice/${data.sale._id}`);

      setSelectedProduct("");

      setQuantity(1);

      setSalePrice(0);

      generateInvoice();

      setFormData({
        invoiceNo: "",

        customer: "",

        saleDate: new Date()
          .toISOString()
          .substring(0, 10),

        discount: 0,

        vat: 0,

        transportCost: 0,

        paidAmount: 0,

        paymentType: "Cash",

        note: "",
      });

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Sale Failed"
      );

    }
  }
};

export default SaleForm;