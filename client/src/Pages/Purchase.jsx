import { useState } from "react";
import Navbar from "../Components/layout/Navbar";
import PurchaseForm from "../Components/purchase/PurchaseForm";
import PurchaseTable from "../Components/purchase/PurchaseTable";

const Purchase = () => {

  const [editingPurchase, setEditingPurchase] =
    useState(null);

  return (
    
    <div className="space-y-6">
      <PurchaseForm
        editingPurchase={editingPurchase}
        onSuccess={() => setEditingPurchase(null)}
      />

      <PurchaseTable
        onEdit={setEditingPurchase}
      />

    </div>
  );
};

export default Purchase;