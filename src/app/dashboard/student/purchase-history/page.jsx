"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/apiClient";
import { ShoppingCart, CreditCard, Calendar, DollarSign, Receipt } from "lucide-react";

// Fetch orders hook
const useMyOrders = () => {
  return useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const res = await api.get('/orders/me');
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
};

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}

// Format price
function formatPrice(price, currency = 'BDT') {
  const symbols = {
    BDT: '৳',
    BDT: '$',
    GBP: '£',
    EUR: '€',
  };
  return `${symbols[currency] || currency} ${price.toFixed(2)}`;
}

// Get payment method display name
function getPaymentMethod(provider) {
  const methods = {
    sslcommerz: 'SSLCommerz',
    razorpay: 'Razorpay',
  };
  return methods[provider] || provider;
}

export default function PurchaseHistory() {
  const { data: ordersData, isLoading, error } = useMyOrders();

  const orders = ordersData?.data || [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Loading header banner */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-8">
          <div className="h-7 w-48 bg-white/20 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="p-6 md:p-10 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Error header banner */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-8">
          <h1 className="text-2xl font-bold text-white mb-1">Purchase History</h1>
          <p className="text-white/70 text-sm">Your course and bundle purchases</p>
        </div>
        <div className="p-6 md:p-10">
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            Error loading purchase history. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-[var(--color-text)]">
      {/* Page-level header banner */}
      <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl px-6 py-8 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Purchase History</h1>
          <p className="text-white/70 text-sm">Track all your course and bundle purchases</p>
        </div>
        <div className="flex items-center gap-2 bg-white/15 text-white text-sm px-4 py-2 rounded-full">
          <ShoppingCart className="h-4 w-4" />
          <span>{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</span>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="bg-[var(--color-primary)]/10 rounded-2xl p-6 mb-5">
              <Receipt className="h-12 w-12 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">No purchases yet</h3>
            <p className="text-gray-400 text-sm max-w-xs">
              When you purchase a course or bundle, your order details will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[var(--color-background)] text-left border-b border-gray-100">
                    <th className="p-4 text-[var(--color-text)]/60 uppercase tracking-wider text-xs font-semibold">Order ID</th>
                    <th className="p-4 text-[var(--color-text)]/60 uppercase tracking-wider text-xs font-semibold">Item Type</th>
                    <th className="p-4 text-[var(--color-text)]/60 uppercase tracking-wider text-xs font-semibold">Price</th>
                    <th className="p-4 text-[var(--color-text)]/60 uppercase tracking-wider text-xs font-semibold">Payment Status</th>
                    <th className="p-4 text-[var(--color-text)]/60 uppercase tracking-wider text-xs font-semibold">Payment Method</th>
                    <th className="p-4 text-[var(--color-text)]/60 uppercase tracking-wider text-xs font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-50 hover:bg-[var(--color-primary)]/[0.03] transition"
                    >
                      <td className="p-4 text-sm font-mono text-gray-500">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="p-4">
                        <span className="capitalize">{order.itemType}</span>
                      </td>
                      <td className="p-4 font-semibold text-[var(--color-primary)]">
                        {formatPrice(order.price, order.currency)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            order.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-sm">{getPaymentMethod(order.provider)}</td>
                      <td className="p-4 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 md:hidden p-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Order ID</p>
                      <p className="font-mono text-sm font-medium">#{order._id.slice(-8)}</p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        order.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium capitalize">{order.itemType}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Price:</span>
                      <span className="font-semibold text-[var(--color-primary)]">
                        {formatPrice(order.price, order.currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Method:</span>
                      <span>{getPaymentMethod(order.provider)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Date:</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}