const InvestorViewModal = ({
  investor,
  onClose,
  onEdit,
  onTransactions,
  onStatement,
}) => {
  if (!investor) return null;

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    return new Date(dateValue).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getPaymentMethodLabel = (method) => {
    if (method === "bank") {
      return "Bank Transfer";
    }

    if (method === "mobile_banking") {
      return "Mobile Banking";
    }

    return "Cash";
  };

  const calculateProfileCompletion = () => {
    const checks = [
      investor.name,
      investor.email,
      investor.phone,
      investor.address,
      investor.nidNumber,
      investor.photoUrl,
      investor.nomineeName,
      investor.nomineePhone,
      investor.agreementUrl,
      investor.preferredProfitPaymentMethod,
    ];

    if (
      investor.preferredProfitPaymentMethod ===
      "bank"
    ) {
      checks.push(
        investor.bankInfo?.bankName,
        investor.bankInfo?.accountName,
        investor.bankInfo?.accountNumber
      );
    }

    if (
      investor.preferredProfitPaymentMethod ===
      "mobile_banking"
    ) {
      checks.push(
        investor.mobileBanking?.provider,
        investor.mobileBanking?.accountNumber
      );
    }

    const completed = checks.filter(
      (value) =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    ).length;

    return Math.round(
      (completed / checks.length) * 100
    );
  };

  const profileCompletion =
    calculateProfileCompletion();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 md:p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden">
        {/* Header */}

        <div className="flex items-start justify-between gap-4 border-b px-5 py-4 md:px-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-16 w-16 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {investor.photoUrl ? (
                <img
                  src={investor.photoUrl}
                  alt={investor.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-slate-600">
                  {investor.name
                    ?.charAt(0)
                    ?.toUpperCase() || "I"}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-blue-700">
                {investor.investorId}
              </p>

              <h2 className="text-2xl font-bold text-slate-800 truncate">
                {investor.name}
              </h2>

              <StatusBadge
                status={investor.status}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-full border text-xl hover:bg-gray-100 shrink-0"
            aria-label="Close investor profile"
          >
            ×
          </button>
        </div>

        {/* Content */}

        <div className="overflow-y-auto max-h-[calc(92vh-150px)] p-5 md:p-6 space-y-6">
          {/* Profile Completion */}

          <section className="border rounded-2xl p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800">
                  Profile Completion
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Complete investor information before
                  generating official statements.
                </p>
              </div>

              <span className="text-2xl font-bold text-blue-700">
                {profileCompletion}%
              </span>
            </div>

            <div className="h-3 bg-slate-200 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{
                  width: `${profileCompletion}%`,
                }}
              />
            </div>
          </section>

          {/* Basic Information */}

          <Section
            title="Basic Information"
            columns={2}
          >
            <InfoRow
              label="Investor ID"
              value={investor.investorId}
            />

            <InfoRow
              label="Name"
              value={investor.name}
            />

            <InfoRow
              label="Email"
              value={investor.email}
            />

            <InfoRow
              label="Phone"
              value={investor.phone}
            />

            <InfoRow
              label="NID Number"
              value={investor.nidNumber}
            />

            <InfoRow
              label="Address"
              value={investor.address}
            />

            <InfoRow
              label="Email Statement"
              value={
                investor.emailNotificationEnabled
                  ? "Monthly email enabled"
                  : "Email disabled"
              }
            />

            <InfoRow
              label="Preferred Profit Payment"
              value={getPaymentMethodLabel(
                investor.preferredProfitPaymentMethod
              )}
            />
          </Section>

          {/* Financial Summary */}

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Financial Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <FinancialCard
                title="Current Capital"
                value="Not available yet"
              />

              <FinancialCard
                title="Total Investment"
                value="Not available yet"
              />

              <FinancialCard
                title="Capital Returned"
                value="Not available yet"
              />

              <FinancialCard
                title="Profit / Loss"
                value="Not available yet"
              />

              <FinancialCard
                title="Profit Withdrawn"
                value="Not available yet"
              />

              <FinancialCard
                title="Available Profit"
                value="Not available yet"
              />
            </div>
          </section>

          {/* Bank Information */}

          <Section
            title="Bank Information"
            columns={2}
          >
            <InfoRow
              label="Bank Name"
              value={
                investor.bankInfo?.bankName
              }
            />

            <InfoRow
              label="Account Name"
              value={
                investor.bankInfo?.accountName
              }
            />

            <InfoRow
              label="Account Number"
              value={
                investor.bankInfo?.accountNumber
              }
            />

            <InfoRow
              label="Branch"
              value={
                investor.bankInfo?.branchName
              }
            />

            <InfoRow
              label="Routing Number"
              value={
                investor.bankInfo?.routingNumber
              }
            />
          </Section>

          {/* Mobile Banking */}

          <Section
            title="Mobile Banking"
            columns={2}
          >
            <InfoRow
              label="Provider"
              value={
                investor.mobileBanking?.provider
              }
              capitalize
            />

            <InfoRow
              label="Account Number"
              value={
                investor.mobileBanking
                  ?.accountNumber
              }
            />

            <InfoRow
              label="Account Type"
              value={
                investor.mobileBanking?.accountType
              }
              capitalize
            />
          </Section>

          {/* Nominee */}

          <Section
            title="Nominee Information"
            columns={3}
          >
            <InfoRow
              label="Nominee Name"
              value={investor.nomineeName}
            />

            <InfoRow
              label="Phone"
              value={investor.nomineePhone}
            />

            <InfoRow
              label="Relationship"
              value={investor.nomineeRelation}
            />
          </Section>

          {/* Agreement */}

          <Section
            title="Agreement Information"
            columns={2}
          >
            <InfoRow
              label="File Name"
              value={investor.agreementFileName}
            />

            <InfoRow
              label="Uploaded Date"
              value={formatDate(
                investor.agreementUploadedAt
              )}
            />

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Agreement
              </p>

              {investor.agreementUrl ? (
                <a
                  href={investor.agreementUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-1 text-blue-700 font-semibold hover:underline"
                >
                  View Agreement
                </a>
              ) : (
                <p className="mt-1 font-medium text-gray-400">
                  Not uploaded
                </p>
              )}
            </div>
          </Section>

          {/* Audit Information */}

          <Section
            title="Audit Information"
            columns={2}
          >
            <InfoRow
              label="Created By"
              value={
                investor.createdBy?.name
              }
            />

            <InfoRow
              label="Created Date"
              value={formatDate(
                investor.createdAt
              )}
            />

            <InfoRow
              label="Last Updated By"
              value={
                investor.updatedBy?.name
              }
            />

            <InfoRow
              label="Last Updated Date"
              value={formatDate(
                investor.updatedAt
              )}
            />

            <InfoRow
              label="Note"
              value={investor.note}
            />
          </Section>
        </div>

        {/* Actions */}

        <div className="border-t px-5 py-4 md:px-6 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => onEdit(investor)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 font-semibold"
            >
              Edit Investor
            </button>

            <button
              type="button"
              onClick={() =>
                onTransactions(investor)
              }
              className="bg-green-700 hover:bg-green-800 text-white rounded-xl py-2.5 font-semibold"
            >
              Transactions
            </button>

            <button
              type="button"
              onClick={() =>
                onStatement(investor)
              }
              className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl py-2.5 font-semibold"
            >
              Statements
            </button>

            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 hover:bg-gray-50 rounded-xl py-2.5 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================================
// SECTION
// ======================================

const Section = ({
  title,
  columns = 2,
  children,
}) => {
  const gridClass =
    columns === 3
      ? "md:grid-cols-3"
      : "md:grid-cols-2";

  return (
    <section className="border rounded-2xl p-5">
      <h3 className="text-lg font-bold text-slate-800">
        {title}
      </h3>

      <div
        className={`grid grid-cols-1 ${gridClass} gap-5 mt-4`}
      >
        {children}
      </div>
    </section>
  );
};

// ======================================
// INFO ROW
// ======================================

const InfoRow = ({
  label,
  value,
  capitalize = false,
}) => {
  const displayValue =
    value !== undefined &&
    value !== null &&
    String(value).trim() !== ""
      ? value
      : "—";

  return (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p
        className={`font-medium text-slate-800 mt-1 break-words ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {displayValue}
      </p>
    </div>
  );
};

// ======================================
// FINANCIAL CARD
// ======================================

const FinancialCard = ({
  title,
  value,
}) => {
  return (
    <div className="border rounded-xl p-4 bg-slate-50 min-w-0">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="font-bold text-slate-800 mt-2 break-words">
        {value}
      </p>
    </div>
  );
};

// ======================================
// STATUS BADGE
// ======================================

const StatusBadge = ({ status }) => {
  const active =
    status === "active";

  return (
    <span
      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
        active
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {active
        ? "Active Investor"
        : "Inactive Investor"}
    </span>
  );
};

export default InvestorViewModal;