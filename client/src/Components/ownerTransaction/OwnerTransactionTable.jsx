const OwnerTransactionTable = ({
  transactions,
  listLoading,
  isAdmin,
  formatMoney,
  formatDateTime,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">
          Transaction History
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Review all owner deposits and withdrawals.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <TableHead text="#" />
              <TableHead text="Date & Time" />
              <TableHead text="Type" />
              <TableHead text="Method" />
              <TableHead text="Amount" />
              <TableHead text="Account" />
              <TableHead text="Reference" />
              <TableHead text="Created By" />
              <TableHead text="Note" />

              {isAdmin && (
                <TableHead text="Action" />
              )}
            </tr>
          </thead>

          <tbody>
            {listLoading ? (
              <tr>
                <td
                  colSpan={isAdmin ? 10 : 9}
                  className="text-center p-8 text-gray-500"
                >
                  Loading transactions...
                </td>
              </tr>
            ) : transactions.length > 0 ? (
              transactions.map(
                (transaction, index) => (
                  <tr
                    key={transaction._id}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>
                      {index + 1}
                    </TableCell>

                    <TableCell>
                      {formatDateTime(
                        transaction.transactionDate
                      )}
                    </TableCell>

                    <TableCell>
                      <TransactionTypeBadge
                        type={
                          transaction.transactionType
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <PaymentMethodLabel
                        transaction={
                          transaction
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <span
                        className={`font-bold ${
                          transaction.transactionType ===
                          "deposit"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {formatMoney(
                          transaction.amount
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      {transaction.accountNumber ||
                        "—"}
                    </TableCell>

                    <TableCell>
                      {transaction.reference ||
                        "—"}
                    </TableCell>

                    <TableCell>
                      <CreatedByInfo
                        createdBy={
                          transaction.createdBy
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {transaction.note || "—"}
                    </TableCell>

                    {isAdmin && (
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onEdit(
                                transaction
                              )
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onDelete(
                                transaction._id
                              )
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    )}
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={isAdmin ? 10 : 9}
                  className="text-center p-8 text-gray-500"
                >
                  No Owner transactions found.
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
// TRANSACTION TYPE BADGE
// ======================================

const TransactionTypeBadge = ({ type }) => {
  const isDeposit = type === "deposit";

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
        isDeposit
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {isDeposit
        ? "Deposit"
        : "Withdrawal"}
    </span>
  );
};

// ======================================
// PAYMENT METHOD LABEL
// ======================================

const PaymentMethodLabel = ({
  transaction,
}) => {
  if (
    transaction.paymentMethod === "bank"
  ) {
    return (
      <div>
        <p className="font-medium">
          Bank
        </p>

        <p className="text-xs text-gray-500">
          {transaction.bankName ||
            "Unknown Bank"}
        </p>
      </div>
    );
  }

  if (
    transaction.paymentMethod ===
    "mobile_banking"
  ) {
    return (
      <div>
        <p className="font-medium">
          Mobile Banking
        </p>

        <p className="text-xs text-gray-500 capitalize">
          {transaction.mobileBankingName ||
            "Unknown"}
        </p>
      </div>
    );
  }

  return (
    <span className="font-medium">
      Cash
    </span>
  );
};

// ======================================
// CREATED BY INFO
// ======================================

const CreatedByInfo = ({ createdBy }) => {
  return (
    <div>
      <p className="font-medium">
        {createdBy?.name || "Unknown"}
      </p>

      <p className="text-xs text-gray-500 uppercase">
        {createdBy?.role || ""}
      </p>
    </div>
  );
};

// ======================================
// TABLE HELPERS
// ======================================

const TableHead = ({ text }) => {
  return (
    <th className="border p-3 text-left text-sm font-semibold text-slate-700 whitespace-nowrap">
      {text}
    </th>
  );
};

const TableCell = ({ children }) => {
  return (
    <td className="border p-3 text-sm text-slate-700 whitespace-nowrap align-top">
      {children}
    </td>
  );
};

export default OwnerTransactionTable;