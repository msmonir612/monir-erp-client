import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import PurchaseForm from "../components/purchase/PurchaseForm";
import PurchaseTable from "../components/purchase/PurchaseTable";

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