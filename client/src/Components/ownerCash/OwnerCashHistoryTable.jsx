import {
  CalendarDays,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

const OwnerCashHistoryTable = ({
  entries = [],
  historyLoading,
  searchDate,
  isAdmin,
  formatMoney,
  formatDate,
  onSearchDateChange,
  onClearSearch,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-3 min-w-0 overflow-hidden">
      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            Daily Closing History
          </h2>

          <p className="text-[11px] text-slate-500 mt-0.5">
            Saved owner cash closing records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <CalendarDays
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="date"
              value={searchDate}
              onChange={onSearchDateChange}
              className="h-9 w-[155px] border border-slate-300 rounded-lg pl-9 pr-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {searchDate && (
            <button
              type="button"
              onClick={onClearSearch}
              title="Clear date filter"
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}

      <div className="w-full max-w-full overflow-x-auto">
        <table className="w-full min-w-[980px] table-fixed border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <TableHead className="w-10">
                #
              </TableHead>

              <TableHead className="w-[100px]">
                Date
              </TableHead>

              <TableHead className="w-[105px]">
                Opening
              </TableHead>

              <TableHead className="w-[105px]">
                Deposit
              </TableHead>

              <TableHead className="w-[100px]">
                Sales
              </TableHead>

              <TableHead className="w-[100px]">
                Purchase
              </TableHead>

              <TableHead className="w-[100px]">
                Expense
              </TableHead>

              <TableHead className="w-[105px]">
                Withdrawal
              </TableHead>

              <TableHead className="w-[110px]">
                Closing
              </TableHead>

              <TableHead className="w-[130px]">
                Created By
              </TableHead>

              <TableHead className="w-[140px]">
                Note
              </TableHead>

              {isAdmin && (
                <TableHead className="w-[90px]">
                  Action
                </TableHead>
              )}
            </tr>
          </thead>

          <tbody>
            {historyLoading ? (
              <tr>
                <td
                  colSpan={isAdmin ? 12 : 11}
                  className="border border-slate-200 p-7 text-center text-xs text-slate-500"
                >
                  Loading history...
                </td>
              </tr>
            ) : entries.length > 0 ? (
              entries.map((entry, index) => (
                <tr
                  key={entry._id}
                  className="hover:bg-slate-50"
                >
                  <TableCell>
                    {index + 1}
                  </TableCell>

                  <TableCell>
                    <span className="text-xs font-medium">
                      {formatDate(entry.date)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Amount>
                      {formatMoney(
                        entry.openingDeposit
                      )}
                    </Amount>
                  </TableCell>

                  <TableCell>
                    <Amount type="positive">
                      {formatMoney(
                        entry.ownerDeposit
                      )}
                    </Amount>
                  </TableCell>

                  <TableCell>
                    <Amount type="positive">
                      {formatMoney(
                        entry.cashSales
                      )}
                    </Amount>
                  </TableCell>

                  <TableCell>
                    <Amount type="negative">
                      {formatMoney(
                        entry.cashPurchase
                      )}
                    </Amount>
                  </TableCell>

                  <TableCell>
                    <Amount type="negative">
                      {formatMoney(
                        entry.cashExpense
                      )}
                    </Amount>
                  </TableCell>

                  <TableCell>
                    <Amount type="negative">
                      {formatMoney(
                        entry.ownerWithdrawal
                      )}
                    </Amount>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs font-bold text-green-700">
                      {formatMoney(
                        entry.closingCash
                      )}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {entry.createdBy?.name ||
                          "Unknown"}
                      </p>

                      <p className="text-[10px] uppercase text-slate-500 mt-0.5">
                        {entry.createdBy?.role ||
                          ""}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs text-slate-600 truncate">
                      {entry.note || "—"}
                    </p>
                  </TableCell>

                  {isAdmin && (
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <ActionButton
                          title="Edit"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                          onClick={() =>
                            onEdit(entry)
                          }
                        >
                          <Pencil size={15} />
                        </ActionButton>

                        <ActionButton
                          title="Delete"
                          className="bg-red-50 text-red-700 hover:bg-red-100"
                          onClick={() =>
                            onDelete(entry._id)
                          }
                        >
                          <Trash2 size={15} />
                        </ActionButton>
                      </div>
                    </TableCell>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={isAdmin ? 12 : 11}
                  className="border border-slate-200 p-7 text-center text-xs text-slate-500"
                >
                  No daily closing history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ======================================
// AMOUNT
// ======================================

const Amount = ({
  type,
  children,
}) => {
  const className =
    type === "positive"
      ? "text-green-700"
      : type === "negative"
      ? "text-red-700"
      : "text-slate-700";

  return (
    <span
      className={`text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
};

// ======================================
// ACTION BUTTON
// ======================================

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
      className={`h-7 w-7 shrink-0 rounded-md flex items-center justify-center transition ${className}`}
    >
      {children}
    </button>
  );
};

// ======================================
// TABLE HEAD
// ======================================

const TableHead = ({
  children,
  className = "",
}) => {
  return (
    <th
      className={`border border-slate-200 px-2 py-2 text-left text-[11px] font-semibold text-slate-700 whitespace-nowrap ${className}`}
    >
      {children}
    </th>
  );
};

// ======================================
// TABLE CELL
// ======================================

const TableCell = ({
  children,
}) => {
  return (
    <td className="border border-slate-200 px-2 py-2 align-middle overflow-hidden">
      {children}
    </td>
  );
};

export default OwnerCashHistoryTable;