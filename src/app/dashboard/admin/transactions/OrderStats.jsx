"use client";
import { CreditCard, DollarSign, Wallet, ArrowUpRight, History } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/apiClient";
import { useState, useEffect } from "react";
import { useWithdrawalSimulation } from "./useWithdrawalSimulation";

// Custom hook for orders stats
const useOrderStats = () => {
  return useQuery({
    queryKey: ['order-stats'],
    queryFn: async () => {
      const res = await api.get('/orders', { params: { limit: 1000 } });
      return res.data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export default function OrderStats({ onOpenWithdraw, onOpenHistory }) {
  const {
    stats,
    isLoading,
    withdrawals,
    totalWithdrawn,
    effectiveRevenue,
    availableBalance,
  } = useWithdrawalSimulation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="p-6 bg-white rounded-[--radius-card] shadow-md animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. AVAILABLE BALANCE CARD (Highlighted with Withdraw Action) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[--radius-card] shadow-lg text-white border border-blue-500/20 flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-blue-100 text-xs font-semibold uppercase tracking-wider">
              <Wallet className="w-3.5 h-3.5" />
              Available Balance
            </div>
            <p className="text-2xl lg:text-3xl font-extrabold tracking-tight mt-1 text-white">
              ৳{availableBalance.toLocaleString()}
            </p>
          </div>

          <button
            id="btn-withdraw-card"
            onClick={onOpenWithdraw}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[var(--color-primary)] hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition hover:scale-105 active:scale-95"
            title="Withdraw Available Balance"
          >
            <ArrowUpRight className="w-4 h-4" />
            Withdraw
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-blue-400/30 flex items-center justify-between text-xs text-blue-100">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Ready for instant payout
          </span>
          <span className="font-semibold text-white/90">Fee: ৳0</span>
        </div>
      </motion.div>

      {/* 2. TOTAL REVENUE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-6 bg-white rounded-[--radius-card] shadow-md border border-gray-100 flex flex-col justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl">
            <DollarSign className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Revenue
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">
              ৳{effectiveRevenue.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>From {stats.paidOrders} successful orders</span>
          <span className="font-medium text-emerald-600">Active</span>
        </div>
      </motion.div>

      {/* 3. TOTAL WITHDRAWN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-white rounded-[--radius-card] shadow-md border border-gray-100 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl">
              <ArrowUpRight className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Withdrawn
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">
                ৳{totalWithdrawn.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>{withdrawals.length} completed payouts</span>
          {withdrawals.length > 0 && (
            <button
              id="btn-history-card"
              onClick={onOpenHistory}
              className="text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1"
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>
          )}
        </div>
      </motion.div>

      {/* 4. TOTAL ORDERS CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-6 bg-white rounded-[--radius-card] shadow-md border border-gray-100 flex flex-col justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Orders
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">
              {stats.totalOrders}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-emerald-600 font-medium">{stats.paidOrders} Paid</span>
          <span className="text-amber-600 font-medium">{stats.pendingOrders} Pending</span>
          <span className="text-red-600 font-medium">{stats.failedOrders} Failed</span>
        </div>
      </motion.div>
    </div>
  );
}