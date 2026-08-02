import {
  ArrowLeftRight,
  Eye,
  FileText,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";

const InvestorTable = ({
  investors = [],
  loading,
  onView,
  onEdit,
  onTransactions,
  onStatement,
  onToggleStatus,
  onDelete,
}) => {
  const paymentLabel = (method) => {
    if (method === "bank") {
      return "Bank";
    }

    if (
      method === "mobile_banking"
    ) {
      return "Mobile";
    }

    return "Cash";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 min-w-0 overflow-hidden">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Investor List
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Manage investor profiles and
            account status.
          </p>
        </div>

        <p className="text-xs text-slate-500 whitespace-nowrap">
          Total:{" "}
          <span className="font-bold text-slate-800">
            {investors.length}
          </span>
        </p>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[920px] table-fixed border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <TableHead className="w-10">
                #
              </TableHead>

              <TableHead className="w-[190px]">
                Investor
              </TableHead>

              <TableHead className="w-[180px]">
                Contact
              </TableHead>

              <TableHead className="w-[110px]">
                NID
              </TableHead>

              <TableHead className="w-[110px]">
                Payment
              </TableHead>

              <TableHead className="w-[190px]">
                Bank / Mobile
              </TableHead>

              <TableHead className="w-[90px]">
                Status
              </TableHead>

              <TableHead className="w-[190px]">
                Actions
              </TableHead>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="border-b p-8 text-center text-sm text-slate-500"
                >
                  Loading investors...
                </td>
              </tr>
            ) : investors.length ? (
              investors.map(
                (investor, index) => (
                  <tr
                    key={investor._id}
                    className="hover:bg-slate-50"
                  >
                    <TableCell>
                      {index + 1}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-9 w-9 shrink-0 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                          {investor.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "I"}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {investor.name}
                          </p>

                          <p className="text-xs font-semibold text-blue-700">
                            {
                              investor.investorId
                            }
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm font-medium truncate">
                        {investor.phone}
                      </p>

                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {investor.email}
                      </p>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs">
                        {investor.nidNumber ||
                          "—"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-medium">
                        {paymentLabel(
                          investor.preferredProfitPaymentMethod
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      <PaymentDetails
                        investor={investor}
                      />
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        status={
                          investor.status
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <ActionButton
                          title="View"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                          onClick={() =>
                            onView(investor)
                          }
                        >
                          <Eye size={16} />
                        </ActionButton>

                        <ActionButton
                          title="Edit"
                          className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                          onClick={() =>
                            onEdit(investor)
                          }
                        >
                          <Pencil
                            size={16}
                          />
                        </ActionButton>

                        <ActionButton
                          title="Transactions"
                          className="bg-violet-50 text-violet-700 hover:bg-violet-100"
                          onClick={() =>
                            onTransactions(
                              investor
                            )
                          }
                        >
                          <ArrowLeftRight
                            size={16}
                          />
                        </ActionButton>

                        <ActionButton
                          title="Statement"
                          className="bg-amber-50 text-amber-700 hover:bg-amber-100"
                          onClick={() =>
                            onStatement(
                              investor
                            )
                          }
                        >
                          <FileText
                            size={16}
                          />
                        </ActionButton>

                        <ActionButton
                          title={
                            investor.status ===
                            "active"
                              ? "Inactive"
                              : "Activate"
                          }
                          className="bg-green-50 text-green-700 hover:bg-green-100"
                          onClick={() =>
                            onToggleStatus(
                              investor._id
                            )
                          }
                        >
                          <Power size={16} />
                        </ActionButton>

                        <ActionButton
                          title="Delete"
                          className="bg-red-50 text-red-700 hover:bg-red-100"
                          onClick={() =>
                            onDelete(
                              investor._id
                            )
                          }
                        >
                          <Trash2
                            size={16}
                          />
                        </ActionButton>
                      </div>
                    </TableCell>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="border-b p-8 text-center text-sm text-slate-500"
                >
                  No investors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PaymentDetails = ({
  investor,
}) => {
  const method =
    investor.preferredProfitPaymentMethod;

  if (method === "bank") {
    return (
      <div className="min-w-0">
        <p className="text-xs font-semibold truncate">
          {investor.bankInfo
            ?.bankName || "—"}
        </p>

        <p className="text-[11px] text-slate-500 truncate mt-0.5">
          A/C:{" "}
          {investor.bankInfo
            ?.accountNumber || "—"}
        </p>
      </div>
    );
  }

  if (
    method === "mobile_banking"
  ) {
    return (
      <div className="min-w-0">
        <p className="text-xs font-semibold capitalize truncate">
          {investor.mobileBanking
            ?.provider || "—"}
        </p>

        <p className="text-[11px] text-slate-500 truncate mt-0.5">
          {investor.mobileBanking
            ?.accountNumber || "—"}
        </p>
      </div>
    );
  }

  return (
    <span className="text-xs">
      Cash payment
    </span>
  );
};

const StatusBadge = ({
  status,
}) => {
  const active =
    status === "active";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        active
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {active
        ? "Active"
        : "Inactive"}
    </span>
  );
};

const ActionButton = ({
  title,
  className,
  onClick,
  children,
}) => {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center transition ${className}`}
    >
      {children}
    </button>
  );
};

const TableHead = ({
  children,
  className = "",
}) => {
  return (
    <th
      className={`border border-slate-200 p-2 text-left text-xs font-semibold text-slate-700 ${className}`}
    >
      {children}
    </th>
  );
};

const TableCell = ({
  children,
}) => {
  return (
    <td className="border border-slate-200 p-2 align-middle text-slate-700 overflow-hidden">
      {children}
    </td>
  );
};

export default InvestorTable;