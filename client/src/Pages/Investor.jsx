import {
  useEffect,
  useState,
} from "react";

import { toast } from "react-hot-toast";
import {
  Plus,
  RefreshCcw,
  X,
} from "lucide-react";

import InvestorHeader from "../Components/investor/InvestorHeader";
import InvestorSummaryCards from "../Components/investor/InvestorSummaryCards";
import InvestorForm from "../Components/investor/InvestorForm";
import InvestorFilter from "../Components/investor/InvestorFilter";
import InvestorTable from "../Components/investor/InvestorTable";
import InvestorViewModal from "../Components/investor/InvestorViewModal";

import {
  createInvestor,
  getInvestors,
  updateInvestor,
  toggleInvestorStatus,
  deleteInvestor,
} from "../services/investorService";

import { useAuth } from "../context/AuthContext";

// ======================================
// INITIAL FILTERS
// ======================================

const getInitialFilters = () => ({
  search: "",
  status: "",
  emailNotification: "",
  paymentMethod: "",
});

// ======================================
// PAGE
// ======================================

const Investor = () => {
  const {
    user,
    isAdmin,
  } = useAuth();

  const [
    investors,
    setInvestors,
  ] = useState([]);

  const [
    editingInvestor,
    setEditingInvestor,
  ] = useState(null);

  const [
    selectedInvestor,
    setSelectedInvestor,
  ] = useState(null);

  const [
    filters,
    setFilters,
  ] = useState(getInitialFilters);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    listLoading,
    setListLoading,
  ] = useState(true);

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  // ======================================
  // LOAD INVESTORS
  // ======================================

  const loadInvestors = async (
    selectedFilters = filters
  ) => {
    try {
      setListLoading(true);

      const data = await getInvestors(
        selectedFilters
      );

      setInvestors(
        data?.investors || []
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load investors"
      );
    } finally {
      setListLoading(false);
    }
  };

  // ======================================
  // INITIAL LOAD
  // ======================================

  useEffect(() => {
    if (!isAdmin) return;

    loadInvestors(
      getInitialFilters()
    );
  }, [isAdmin]);

  // ======================================
  // DRAWER CONTROL
  // ======================================

  const openCreateDrawer = () => {
    setEditingInvestor(null);
    setSelectedInvestor(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (
    investor
  ) => {
    setEditingInvestor(investor);
    setSelectedInvestor(null);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    if (loading) return;

    setDrawerOpen(false);
    setEditingInvestor(null);
  };

  // ======================================
  // CREATE / UPDATE INVESTOR
  // ======================================

  const handleSubmit = async (
    investorData
  ) => {
    try {
      setLoading(true);

      let data;

      if (editingInvestor?._id) {
        data = await updateInvestor(
          editingInvestor._id,
          investorData
        );
      } else {
        data = await createInvestor(
          investorData
        );
      }

      toast.success(
        data?.message ||
          (editingInvestor
            ? "Investor updated successfully"
            : "Investor created successfully")
      );

      setDrawerOpen(false);
      setEditingInvestor(null);
      setSelectedInvestor(null);

      await loadInvestors(filters);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save investor"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // VIEW INVESTOR
  // ======================================

  const handleView = (
    investor
  ) => {
    setSelectedInvestor(investor);
  };

  const handleCloseView = () => {
    setSelectedInvestor(null);
  };

  // ======================================
  // EDIT INVESTOR
  // ======================================

  const handleEdit = (
    investor
  ) => {
    openEditDrawer(investor);
  };

  // ======================================
  // TRANSACTIONS
  // TEMPORARY
  // ======================================

  const handleTransactions = (
    investor
  ) => {
    setSelectedInvestor(null);

    toast.success(
      `${investor.name}'s transaction module will be connected next.`
    );
  };

  // ======================================
  // STATEMENTS
  // TEMPORARY
  // ======================================

  const handleStatement = (
    investor
  ) => {
    setSelectedInvestor(null);

    toast.success(
      `${investor.name}'s PDF statement and monthly email module will be connected after the Profit Period module.`
    );
  };

  // ======================================
  // ACTIVE / INACTIVE
  // ======================================

  const handleToggleStatus =
    async (id) => {
      const investor =
        investors.find(
          (item) =>
            item._id === id
        );

      if (!investor) {
        toast.error(
          "Investor not found"
        );

        return;
      }

      const nextStatus =
        investor.status ===
        "active"
          ? "inactive"
          : "active";

      const confirmed =
        window.confirm(
          `Are you sure you want to make ${investor.name} ${nextStatus}?`
        );

      if (!confirmed) return;

      try {
        const data =
          await toggleInvestorStatus(
            id
          );

        toast.success(
          data?.message ||
            "Investor status updated"
        );

        if (
          editingInvestor?._id ===
          id
        ) {
          closeDrawer();
        }

        if (
          selectedInvestor?._id ===
          id
        ) {
          setSelectedInvestor(
            null
          );
        }

        await loadInvestors(
          filters
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Unable to change investor status"
        );
      }
    };

  // ======================================
  // DELETE INVESTOR
  // ======================================

  const handleDelete = async (
    id
  ) => {
    const investor =
      investors.find(
        (item) =>
          item._id === id
      );

    const confirmed =
      window.confirm(
        `Delete ${
          investor?.name ||
          "this investor"
        } permanently?`
      );

    if (!confirmed) return;

    try {
      const data =
        await deleteInvestor(id);

      toast.success(
        data?.message ||
          "Investor deleted successfully"
      );

      if (
        editingInvestor?._id ===
        id
      ) {
        closeDrawer();
      }

      if (
        selectedInvestor?._id ===
        id
      ) {
        setSelectedInvestor(null);
      }

      await loadInvestors(
        filters
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to delete investor"
      );
    }
  };

  // ======================================
  // FILTER CHANGE
  // ======================================

  const handleFilterChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================
  // APPLY FILTER
  // ======================================

  const handleApplyFilters =
    async () => {
      await loadInvestors(
        filters
      );
    };

  // ======================================
  // CLEAR FILTER
  // ======================================

  const handleClearFilters =
    async () => {
      const clearedFilters =
        getInitialFilters();

      setFilters(
        clearedFilters
      );

      await loadInvestors(
        clearedFilters
      );
    };

  // ======================================
  // REFRESH
  // ======================================

  const handleRefresh =
    async () => {
      await loadInvestors(
        filters
      );

      toast.success(
        "Investor list refreshed"
      );
    };

  // ======================================
  // ADMIN GUARD
  // ======================================

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white border rounded-2xl shadow-sm p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-700">
            Access Denied
          </h2>

          <p className="text-gray-500 mt-3">
            Investor Management is
            available to Admin only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-full min-w-0 space-y-5 overflow-hidden">
        {/* HEADER */}

        <InvestorHeader
          user={user}
        />

        {/* PAGE ACTIONS */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border rounded-2xl shadow-sm p-4">
          <div>
            <h2 className="font-bold text-slate-800">
              Investor Accounts
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Add, update and manage
              investor information.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={
                handleRefresh
              }
              disabled={listLoading}
              className="inline-flex items-center justify-center gap-2 border border-gray-300 rounded-xl px-4 py-2.5 font-semibold text-slate-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCcw
                size={18}
                className={
                  listLoading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={
                openCreateDrawer
              }
              className="inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white rounded-xl px-5 py-2.5 font-semibold"
            >
              <Plus size={19} />

              Add Investor
            </button>
          </div>
        </div>

        {/* SUMMARY */}

        <InvestorSummaryCards
          investors={investors}
        />

        {/* FILTER */}

        <InvestorFilter
          filters={filters}
          onChange={
            handleFilterChange
          }
          onApply={
            handleApplyFilters
          }
          onClear={
            handleClearFilters
          }
        />

        {/* TABLE */}

        <InvestorTable
          investors={investors}
          loading={listLoading}
          onView={handleView}
          onEdit={handleEdit}
          onTransactions={
            handleTransactions
          }
          onStatement={
            handleStatement
          }
          onToggleStatus={
            handleToggleStatus
          }
          onDelete={
            handleDelete
          }
        />
      </div>

      {/* ==================================
          ADD / EDIT DRAWER
      ================================== */}

      {drawerOpen && (
        <div className="fixed inset-0 z-[60]">
          {/* Overlay */}

          <button
            type="button"
            aria-label="Close investor drawer"
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/40"
          />

          {/* Drawer */}

          <aside className="absolute right-0 top-0 h-full w-full max-w-5xl bg-slate-100 shadow-2xl flex flex-col">
            {/* Drawer Header */}

            <div className="h-16 shrink-0 bg-white border-b px-5 md:px-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {editingInvestor
                    ? "Edit Investor"
                    : "Add New Investor"}
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  {editingInvestor
                    ? editingInvestor
                        .investorId
                    : "Create a new investor profile"}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeDrawer
                }
                disabled={loading}
                className="h-10 w-10 flex items-center justify-center rounded-full border hover:bg-gray-100 disabled:opacity-50"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}

            <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
              <InvestorForm
                onSubmit={
                  handleSubmit
                }
                editingInvestor={
                  editingInvestor
                }
                loading={loading}
                onCancelEdit={
                  closeDrawer
                }
              />
            </div>
          </aside>
        </div>
      )}

      {/* VIEW MODAL */}

      <InvestorViewModal
        investor={
          selectedInvestor
        }
        onClose={
          handleCloseView
        }
        onEdit={
          handleEdit
        }
        onTransactions={
          handleTransactions
        }
        onStatement={
          handleStatement
        }
      />
    </>
  );
};

export default Investor;