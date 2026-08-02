import {
  BellRing,
  CircleUserRound,
  Landmark,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";

const InvestorSummaryCards = ({
  investors = [],
}) => {
  const total = investors.length;

  const active = investors.filter(
    (item) => item.status === "active"
  ).length;

  const inactive = investors.filter(
    (item) => item.status === "inactive"
  ).length;

  const emailEnabled = investors.filter(
    (item) =>
      item.emailNotificationEnabled
  ).length;

  const bankPayment = investors.filter(
    (item) =>
      item.preferredProfitPaymentMethod ===
      "bank"
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <SummaryCard
        title="Total Investors"
        value={total}
        icon={
          <CircleUserRound size={20} />
        }
        iconClass="bg-blue-100 text-blue-700"
      />

      <SummaryCard
        title="Active Investors"
        value={active}
        icon={
          <UserRoundCheck size={20} />
        }
        iconClass="bg-green-100 text-green-700"
      />

      <SummaryCard
        title="Inactive Investors"
        value={inactive}
        icon={<UserRoundX size={20} />}
        iconClass="bg-red-100 text-red-700"
      />

      <SummaryCard
        title="Email Enabled"
        value={emailEnabled}
        icon={<BellRing size={20} />}
        iconClass="bg-orange-100 text-orange-700"
      />

      <SummaryCard
        title="Bank Payment"
        value={bankPayment}
        icon={<Landmark size={20} />}
        iconClass="bg-violet-100 text-violet-700"
        extraClass="col-span-2 lg:col-span-1"
      />
    </div>
  );
};

const SummaryCard = ({
  title,
  value,
  icon,
  iconClass,
  extraClass = "",
}) => {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl shadow-sm p-3 min-w-0 ${extraClass}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-500 truncate">
            {title}
          </p>

          <p className="text-xl font-bold text-slate-900 mt-0.5">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestorSummaryCards;