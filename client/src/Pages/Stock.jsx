import { useEffect, useState } from "react";
import {
  getAllStock,
  getStockSummary,
} from "../services/stockService";

const Stock = () => {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({});

  const loadStock = async () => {
    try {
      const stock = await getAllStock();
      const sum = await getStockSummary();

      setProducts(stock.data);
      setSummary(sum.summary);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  return (
    <div className="p-6">

      {/* Summary */}
      <div className="grid grid-cols-4 gap-5 mb-6">

        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-gray-500">Total Products</h3>
          <h1 className="text-3xl font-bold">
            {summary.totalProducts || 0}
          </h1>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-gray-500">Current Stock</h3>
          <h1 className="text-3xl font-bold">
            {summary.totalStock || 0}
          </h1>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-gray-500">Low Stock</h3>
          <h1 className="text-3xl font-bold text-yellow-500">
            {summary.lowStock || 0}
          </h1>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-gray-500">Out Of Stock</h3>
          <h1 className="text-3xl font-bold text-red-500">
            {summary.outOfStock || 0}
          </h1>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-3 text-left">Code</th>

              <th className="p-3 text-left">Product</th>

              <th className="p-3 text-left">Category</th>

              <th className="p-3 text-center">Stock</th>

              <th className="p-3 text-center">Value</th>

              <th className="p-3 text-center">Status</th>

            </tr>

          </thead>

          <tbody>

            {products.map((item) => (

              <tr
                key={item._id}
                className="border-b hover:bg-slate-50"
              >

                <td className="p-3">
                  {item.productCode}
                </td>

                <td className="p-3">
                  {item.productName}
                </td>

                <td className="p-3">
                  {item.category}
                </td>

                <td className="p-3 text-center">
                  {item.currentStock}
                </td>

                <td className="p-3 text-center">
                  ৳ {item.stockValue}
                </td>

                <td className="p-3 text-center">

                  {item.currentStock === 0 ? (
                    <span className="bg-red-500 text-white px-3 py-1 rounded">
                      Out
                    </span>
                  ) : item.currentStock <= item.minimumStock ? (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded">
                      Low
                    </span>
                  ) : (
                    <span className="bg-green-600 text-white px-3 py-1 rounded">
                      In Stock
                    </span>
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Stock;