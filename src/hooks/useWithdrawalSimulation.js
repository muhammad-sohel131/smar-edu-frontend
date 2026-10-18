"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/apiClient";

const STORAGE_KEY = "smartedu_admin_withdrawals";

// Shared hook for fetching real platform order stats
export const useOrderStats = () => {
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

export function useWithdrawalSimulation({
  user = null,
  isInstructor = false,
  instructorEarnings = 0,
} = {}) {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch real order statistics from backend for platform revenue
  const { data: ordersData, isLoading, error } = useOrderStats();
  const orders = ordersData?.data?.orders || [];

  const stats = useMemo(() => {
    if (orders.length > 0) {
      const paidOrders = orders.filter(order => order.status === 'paid');
      const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
      const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

      return {
        totalRevenue,
        totalOrders: orders.length,
        avgOrderValue,
        paidOrders: paidOrders.length,
        pendingOrders: orders.filter(order => order.status === 'pending').length,
        failedOrders: orders.filter(order => order.status === 'failed' || order.status === 'canceled').length
      };
    }

    // Default fallback if orders list is currently empty
    return {
      totalRevenue: 20342,
      totalOrders: 10,
      avgOrderValue: 2260.22,
      paidOrders: 9,
      pendingOrders: 1,
      failedOrders: 0,
    };
  }, [orders]);

  const loadWithdrawals = useCallback(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        // Normalize records so user info is always present
        const normalized = Array.isArray(parsed) ? parsed.map(w => {
          if (!w.user) {
            return {
              ...w,
              user: {
                id: "admin_super",
                name: "Super Admin",
                email: "admin@smartedu.com",
                role: "SUPER_ADMIN",
              }
            };
          }
          return w;
        }) : [];
        setWithdrawals(normalized);
      } else {
        setWithdrawals([]);
      }
    } catch (e) {
      console.error("Failed to load withdrawals from localStorage:", e);
      setWithdrawals([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadWithdrawals();

    const handleUpdate = () => loadWithdrawals();
    window.addEventListener("smartedu_withdrawals_updated", handleUpdate);
    return () => window.removeEventListener("smartedu_withdrawals_updated", handleUpdate);
  }, [loadWithdrawals]);

  // 1. Total withdrawn across the platform by ALL users (Admin payouts + Instructor payouts)
  const totalWithdrawnAll = useMemo(() => {
    return withdrawals.reduce((sum, w) => sum + Number(w.amount || 0), 0);
  }, [withdrawals]);

  // 2. Admin Available Balance (Platform Central Treasury)
  // When an instructor withdraws, it deducts from platform revenue too!
  const platformRevenue = stats.totalRevenue;
  const adminAvailableBalance = Math.max(0, platformRevenue - totalWithdrawnAll);

  // 3. Instructor Withdrawals (Filter by this instructor)
  const myWithdrawals = useMemo(() => {
    if (!isInstructor) return withdrawals;
    return withdrawals.filter(w => {
      // If user ID matches
      if (w.user?.id && user?._id && w.user.id === user._id) return true;
      // If user email matches
      if (w.user?.email && user?.email && w.user.email.toLowerCase() === user.email.toLowerCase()) return true;
      // If tagged as instructor
      if (w.user?.role === "INSTRUCTOR") return true;
      return false;
    });
  }, [withdrawals, isInstructor, user]);

  const instructorTotalWithdrawn = useMemo(() => {
    return myWithdrawals.reduce((sum, w) => sum + Number(w.amount || 0), 0);
  }, [myWithdrawals]);

  // Effective Instructor Earnings (default to ৳18,500 if zero or not set, so simulation works out of the box)
  const effectiveInstructorEarnings = useMemo(() => {
    const raw = Number(instructorEarnings);
    return !isNaN(raw) && raw > 0 ? raw : 18500;
  }, [instructorEarnings]);

  // Instructor Available Balance: Total Earnings - Instructor's Own Withdrawals
  const instructorAvailableBalance = Math.max(0, effectiveInstructorEarnings - instructorTotalWithdrawn);

  // Pick values based on whether caller is Instructor or Admin
  const availableBalance = isInstructor ? instructorAvailableBalance : adminAvailableBalance;
  const totalWithdrawn = isInstructor ? instructorTotalWithdrawn : totalWithdrawnAll;
  const effectiveRevenue = isInstructor ? effectiveInstructorEarnings : platformRevenue;

  const addWithdrawal = (withdrawalData) => {
    const actorRole = isInstructor ? "INSTRUCTOR" : (user?.role || "SUPER_ADMIN");
    const actorName = user?.name || (isInstructor ? "Engr. Kawsar Ahmed" : "Super Admin");
    const actorEmail = user?.email || (isInstructor ? "kawsar@gmail.com" : "admin@smartedu.com");
    const actorId = user?._id || user?.id || (isInstructor ? "inst_kawsar" : "admin_super");

    const newRecord = {
      id: Date.now().toString(),
      trxId: `WTH-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      status: "Completed",
      ...withdrawalData,
      user: {
        id: actorId,
        name: actorName,
        email: actorEmail,
        role: actorRole,
        ...(withdrawalData.user || {}),
      },
    };

    const updated = [newRecord, ...withdrawals];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save withdrawal:", e);
    }
    setWithdrawals(updated);
    window.dispatchEvent(new Event("smartedu_withdrawals_updated"));
    return newRecord;
  };

  const resetSimulation = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    setWithdrawals([]);
    window.dispatchEvent(new Event("smartedu_withdrawals_updated"));
  };

  return {
    stats,
    isLoading,
    error,
    withdrawals,
    myWithdrawals,
    totalWithdrawn,
    totalWithdrawnAll,
    adminAvailableBalance,
    instructorAvailableBalance,
    effectiveRevenue,
    effectiveEarnings: effectiveInstructorEarnings,
    availableBalance,
    addWithdrawal,
    resetSimulation,
    isLoaded,
  };
}
