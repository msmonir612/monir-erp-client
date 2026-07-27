import { useState } from "react";

import SaleForm from "../Components/sale/SaleForm";
import SaleTable from "../Components/sale/SaleTable";
import Navbar from "../Components/layout/Navbar";

const Sale = () => {

  const [editingSale, setEditingSale] =
    useState(null);

  return (
    <div className="space-y-6">
      <Navbar />

      <SaleForm
        editingSale={editingSale}
        onSuccess={() =>
          setEditingSale(null)
        }
      />

      <SaleTable
        onEdit={setEditingSale}
      />

    </div>
  );
};

export default Sale;