import {
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
  Landmark,
  ReceiptText,
  ShoppingCart,
  Smartphone,
  WalletCards,
} from "lucide-react";

const OwnerCashSummaryCards = ({
  summary,
  formatMoney,
}) => {
  const cash = summary?.cash || {};
  const bank = summary?.bank || {};
  const mobile =
    summary?.mobileBanking || {};

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-2.5">
      <SummaryCard
        title="Owner Deposit"
        value={formatMoney(
          cash.ownerDeposit
        )}
        icon={<ArrowDownCircle size={17} />}
        iconClass="bg-green-100 text-green-700"
      />

      <SummaryCard
        title="Cash Sales"
        value={formatMoney(
          cash.cashSales
        )}
        icon={<Banknote size={17} />}
        iconClass="bg-blue-100 text-blue-700"
      />

      <SummaryCard
        title="Cash Purchase"
        value={formatMoney(
          cash.cashPurchase
        )}
        icon={<ShoppingCart size={17} />}
        iconClass="bg-orange-100 text-orange-700"
      />

      <SummaryCard
        title="Cash Expense"
        value={formatMoney(
          cash.cashExpense
        )}
        icon={<ReceiptText size={17} />}
        iconClass="bg-red-100 text-red-700"
      />

      <SummaryCard
        title="Owner Withdrawal"
        value={formatMoney(
          cash.ownerWithdrawal
        )}
        icon={<ArrowUpCircle size={17} />}
        iconClass="bg-rose-100 text-rose-700"
      />

      <SummaryCard
        title="Cash Net"
        value={formatMoney(
          cash.netMovement
        )}
        icon={<WalletCards size={17} />}
        iconClass={
          Number(cash.netMovement) >= 0
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700"
        }
      />

      <SummaryCard
        title="Bank Net"
        value={formatMoney(bank.net)}
        icon={<Landmark size={17} />}
        iconClass={
          Number(bank.net) >= 0
            ? "bg-violet-100 text-violet-700"
            : "bg-red-100 text-red-700"
        }
      />

      <SummaryCard
        title="Mobile Net"
        value={formatMoney(mobile.net)}
        icon={<Smartphone size={17} />}
        iconClass={
          Number(mobile.net) >= 0
            ? "bg-cyan-100 text-cyan-700"
            : "bg-red-100 text-red-700"
        }
      />
    </div>
  );
};

const SummaryCard = ({
  title,
  value,
  icon,
  iconClass,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm px-3 py-2.5 min-w-0">
      <div className="flex items-center gap-2.5">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${iconClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[11px] text-slate-500 truncate">
            {title}
          </p>

          <p className="text-sm md:text-base font-bold text-slate-900 truncate mt-0.5">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerCashSummaryCards;