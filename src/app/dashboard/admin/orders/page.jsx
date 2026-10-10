"use client";

import { useState, useEffect } from "react";
import api from "@/lib/apiClient";
import {
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  ShoppingBag,
  TrendingUp,
  FileText,
  CreditCard,
  Heart
} from "lucide-react";
import { toast } from "react-toastify";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    itemType: "all",
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders", {
        params: {
          status: filters.status !== "all" ? filters.status : undefined,
          itemType: filters.itemType !== "all" ? filters.itemType : undefined
        }
      });
      setOrders(res.data.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !search || 
      order.userName?.toLowerCase().includes(search.toLowerCase()) ||
      order.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      order.transactionId?.toLowerCase().includes(search.toLowerCase());

    const matchesType = filters.itemType === "all" || order.itemType === filters.itemType;
    const matchesStatus = filters.status === "all" || order.status === filters.status;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-[#05966915] text-[var(--color-primary)] border border-[#05966930]";
      case "pending": return "bg-[#FBBF2415] text-[var(--color-accent)] border border-[#FBBF2430]";
      case "failed": return "bg-red-100 text-red-700 border border-red-200";
      case "refunded": return "bg-blue-100 text-blue-700 border border-blue-200";
      case "canceled": return "bg-gray-100 text-gray-700 border border-gray-200";
      default: return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "failed": return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getItemTypeIcon = (itemType) => {
    switch (itemType) {
      case "course": return <FileText className="h-4 w-4" />;
      case "event": return <Calendar className="h-4 w-4" />;
      case "Donation": return <Heart className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-[var(--color-background)]">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl shadow p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
                Order Management
              </h1>
              <p className="text-[var(--color-text)]/70 text-sm md:text-base mt-1">
                Track and manage customer orders efficiently
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {filteredOrders.length} orders
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Total Orders</span>
                <div className="p-2 bg-[var(--color-secondary)]/10 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-[var(--color-secondary)]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[var(--color-text)]">
                {orders.length}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Revenue</span>
                <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-[var(--color-primary)]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[var(--color-text)]">
                ৳{orders.reduce((sum, o) => sum + (o.amount || 0), 0).toFixed(2)}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Courses</span>
                <div className="p-2 bg-[var(--color-accent)]/10 rounded-lg">
                  <FileText className="h-5 w-5 text-[var(--color-accent)]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[var(--color-text)]">
                {orders.filter(o => o.itemType === "course").length}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Events</span>
                <div className="p-2 bg-[var(--color-accent-special)]/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-[var(--color-accent-special)]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[var(--color-text)]">
                {orders.filter(o => o.itemType === "event").length}
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Search */}
              <div className="lg:col-span-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="lg:col-span-6 flex flex-wrap gap-3">
                <select
                  value={filters.itemType}
                  onChange={(e) => setFilters({...filters, itemType: e.target.value})}
                  className="flex-1 min-w-[150px] px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition appearance-none bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="course">Course</option>
                  <option value="event">Event</option>
                  <option value="Donation">Donation</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="flex-1 min-w-[150px] px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">
                {search || filters.status !== "all" ? "Try adjusting your filters" : "No orders have been placed yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-3">
                        {/* Order ID & Status */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[var(--color-text)]">
                              #{order._id.slice(-8)}
                            </h3>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                          
                          {/* Order Type Badge */}
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 flex items-center gap-1">
                            {getItemTypeIcon(order.itemType)}
                            {order.itemType}
                          </span>
                        </div>

                        {/* Customer Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{order.userName || "Customer"}</span>
                            <span className="text-gray-400">•</span>
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{order.userEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{order.dateFormatted}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Order Total */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-[var(--color-text)]">
                            {order.amountFormatted}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.provider ? `via ${order.provider}` : ""}
                          </div>
                        </div>

                        {/* Expand/Collapse Button */}
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                          className="p-2 hover:bg-gray-50 rounded-lg transition"
                        >
                          {expandedOrder === order._id ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrder === order._id && (
                    <div className="border-t px-5 py-4 bg-gray-50/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                          <h4 className="font-semibold text-gray-800 mb-2">Order Details</h4>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Order ID:</span>
                            <span className="font-mono text-gray-700">{order._id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Transaction ID:</span>
                            <span className="font-mono text-gray-700">{order.transactionId || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Type:</span>
                            <span className="font-medium text-gray-700 capitalize">{order.itemType}</span>
                          </div>
                          {order.event && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Event:</span>
                              <span className="font-medium text-gray-700">{order.event}</span>
                            </div>
                          )}
                          {order.fund && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Fund:</span>
                              <span className="font-medium text-gray-700">{order.fund}</span>
                            </div>
                          )}
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                          <h4 className="font-semibold text-gray-800 mb-2">Payment Summary</h4>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Payment Method:</span>
                            <span className="font-medium text-gray-700 uppercase">{order.provider || "SSLCommerz"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Status:</span>
                            <span className="font-medium capitalize text-gray-700">{order.status}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t font-semibold">
                            <span>Total Amount:</span>
                            <span className="text-[var(--color-primary)]">{order.amountFormatted}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}