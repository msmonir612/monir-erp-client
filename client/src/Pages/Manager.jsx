import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import ManagerForm from "../Components/manager/ManagerForm";
import ManagerTable from "../Components/manager/ManagerTable";

import {
  createManager,
  getManagers,
  deleteManager,
} from "../services/managerService";

const Manager = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================
  // Load Managers
  // ==========================
  const loadManagers = async () => {
    try {
      const data = await getManagers();
      setManagers(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load managers");
    }
  };

  useEffect(() => {
    loadManagers();
  }, []);

  // ==========================
  // Add Manager
  // ==========================
  const handleCreate = async (formData) => {
    try {
      setLoading(true);

      const data = await createManager(formData);

      toast.success(data.message);

      loadManagers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Delete Manager
  // ==========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this manager?")) return;

    try {
      const data = await deleteManager(id);

      toast.success(data.message);

      loadManagers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete Failed");
    }
  };

  return (
    <div className="space-y-6">

      <ManagerForm
        onSubmit={handleCreate}
        loading={loading}
      />

      <ManagerTable
        managers={managers}
        onDelete={handleDelete}
      />

    </div>
  );
};

export default Manager;