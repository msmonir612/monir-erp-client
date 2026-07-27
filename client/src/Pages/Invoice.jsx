import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getInvoice } from "../services/invoiceService";

const Invoice = () => {
  const { id } = useParams();

  const [sale, setSale] = useState(null);

  useEffect(() => {
    loadInvoice();
  }, []);

  const loadInvoice = async () => {
    try {
      const data = await getInvoice(id);
      setSale(data);
    } catch (error) {
      toast.error("Failed to load invoice");
    }
  };

  if (!sale) {
    return (
      <div className="p-10 text-center">
        Loading Invoice...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 shadow rounded-lg">

      <h1 className="text-3xl font-bold text-center">
        SALES INVOICE
      </h1>

      <div className="mt-8 space-y-2">

        <p>
          <strong>Invoice :</strong> {sale.invoiceNo}
        </p>

        <p>
          <strong>Customer :</strong> {sale.customer?.name}
        </p>

        <p>
          <strong>Date :</strong>{" "}
          {new Date(sale.saleDate).toLocaleDateString()}
        </p>

      </div>

    </div>
  );
};

export default Invoice;