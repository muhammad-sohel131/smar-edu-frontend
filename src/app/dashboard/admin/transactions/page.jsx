"use client";
import { useState } from "react";
import { Search, ArrowUpRight, History } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import OrderStats from "./OrderStats";
import TransactionsTable from "./TransactionsTable";
import WithdrawModal from "./WithdrawModal";
import { useWithdrawalSimulation } from "./useWithdrawalSimulation";

export default function TransactionsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [modalTab, setModalTab] = useState("withdraw");

  const {
    withdrawals,
    availableBalance,
    addWithdrawal,
    resetSimulation,
  } = useWithdrawalSimulation({ user, isInstructor: false });

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleOpenWithdraw = (tab = "withdraw") => {
    setModalTab(tab);
    setIsWithdrawOpen(true);
  };

  return (
    <div className="p-6 space-y-6 text-[var(--color-text)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[--color-text]">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage all payment transactions, revenue & payouts
          </p>
        </div>

        {/* Withdraw Action Button in Header */}
        <div className="flex items-center gap-3">
          <button
            id="btn-withdraw-header"
            onClick={handleOpenWithdraw}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowUpRight className="w-4 h-4" />
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Order Stats with Available Balance & Withdraw Button */}
      <OrderStats
        onOpenWithdraw={() => handleOpenWithdraw("withdraw")}
        onOpenHistory={() => handleOpenWithdraw("history")}
      />

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by transaction ID, user name, or email..."
          value={search}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-3 rounded-[--radius-card] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
        />
      </div>

      {/* Transactions Table Component - Re-renders on search */}
      <TransactionsTable
        search={search}
        page={page}
        limit={limit}
        onPageChange={setPage}
      />

      {/* Fake Withdraw Simulation Modal */}
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={availableBalance}
        onWithdrawSuccess={addWithdrawal}
        withdrawals={withdrawals}
        onResetSimulation={resetSimulation}
        currentUser={user}
        initialTab={modalTab}
        isInstructorView={false}
      />
    </div>
  );
}