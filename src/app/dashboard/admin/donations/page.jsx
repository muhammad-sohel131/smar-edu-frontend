"use client";

import { useState, useEffect } from "react";
import api from "@/lib/apiClient";
import {
  Heart,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
  Users,
  Search,
  ArrowUpDown,
  Phone,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Tag,
  FileText,
  AlertCircle,
  X,
  PieChart,
  Layers,
  GraduationCap,
  Receipt,
  CheckCircle2,
  Building,
  RefreshCw
} from "lucide-react";
import { toast } from "react-toastify";

const FUND_CONFIG = {
  "educational-scholarships": {
    name: "Educational Scholarships",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    barClass: "bg-gradient-to-r from-blue-500 to-indigo-600"
  },
  "institutional-development": {
    name: "Institutional Development",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    barClass: "bg-gradient-to-r from-purple-500 to-pink-600"
  },
  "funding-programs": {
    name: "Special Funding Programs",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    barClass: "bg-gradient-to-r from-amber-500 to-orange-600"
  }
};

const CATEGORIES = [
  "Scholarships & Stipends",
  "Books & Study Materials",
  "Lab & IT Equipment",
  "Food & Nutrition",
  "Medical Support",
  "Infrastructure & Maintenance",
  "Event & Workshop",
  "Operational & Logistics",
  "Other"
];

export default function DonationsManagementPage() {
  const [activeTab, setActiveTab] = useState("spends"); // "spends" | "donations"
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Financial summary data
  const [summary, setSummary] = useState({
    totalRaised: 0,
    totalSpent: 0,
    netBalance: 0,
    totalDonationCount: 0,
    totalSpendCount: 0,
    fundBreakdown: []
  });

  // Donations data
  const [donations, setDonations] = useState([]);
  const [donationSearch, setDonationSearch] = useState("");
  const [donationFundFilter, setDonationFundFilter] = useState("all");
  const [donationSortOrder, setDonationSortOrder] = useState("desc");

  // Spends data
  const [spends, setSpends] = useState([]);
  const [spendSearch, setSpendSearch] = useState("");
  const [spendFundFilter, setSpendFundFilter] = useState("all");
  const [spendCategoryFilter, setSpendCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialFormState = {
    title: "",
    fund: "educational-scholarships",
    category: "Scholarships & Stipends",
    amount: "",
    spentDate: new Date().toISOString().split("T")[0],
    recipient: "",
    description: "",
    handledBy: "Admin",
    receiptUrl: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchSummary(), fetchSpends(), fetchDonations()]);
    } catch (error) {
      console.error("Error loading donation data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([fetchSummary(), fetchSpends(), fetchDonations()]);
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error("Refresh failed:", error);
      toast.error("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await api.get("/donation-spends/summary");
      if (res?.data?.data) {
        setSummary(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching spend summary:", error);
    }
  };

  const fetchSpends = async () => {
    try {
      const res = await api.get("/donation-spends", {
        params: { limit: 1000, sortBy: "spentDate", sortOrder: "desc" }
      });
      setSpends(res?.data?.data?.spends || []);
    } catch (error) {
      console.error("Error fetching spends:", error);
    }
  };

  const fetchDonations = async () => {
    try {
      const res = await api.get("/orders", {
        params: { itemType: "Donation", status: "paid", limit: 1000 }
      });
      setDonations(res?.data?.data?.orders || []);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (spend) => {
    setModalMode("edit");
    setEditingId(spend._id);
    setFormData({
      title: spend.title || "",
      fund: spend.fund || "educational-scholarships",
      category: spend.category || "Scholarships & Stipends",
      amount: spend.amount || "",
      spentDate: spend.spentDate ? new Date(spend.spentDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      recipient: spend.recipient || "",
      description: spend.description || "",
      handledBy: spend.handledBy || "Admin",
      receiptUrl: spend.receiptUrl || ""
    });
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter expense purpose/title");
      return;
    }
    const numAmount = parseFloat(formData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid expense amount");
      return;
    }

    try {
      setSubmitting(true);
      if (modalMode === "create") {
        await api.post("/donation-spends", {
          ...formData,
          amount: numAmount
        });
        toast.success("Expense recorded successfully!");
      } else {
        await api.patch(`/donation-spends/${editingId}`, {
          ...formData,
          amount: numAmount
        });
        toast.success("Expense updated successfully!");
      }
      setIsModalOpen(false);
      // Refresh summaries and spends
      fetchSummary();
      fetchSpends();
    } catch (error) {
      console.error("Error saving spend:", error);
      toast.error(error?.response?.data?.message || "Failed to save expense record");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Spend
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/donation-spends/${deleteTarget._id}`);
      toast.success("Expense deleted successfully");
      setDeleteTarget(null);
      fetchSummary();
      fetchSpends();
    } catch (error) {
      console.error("Error deleting spend:", error);
      toast.error(error?.response?.data?.message || "Failed to delete expense");
    } finally {
      setDeleting(false);
    }
  };

  // Find fund balance helper for selected fund in modal
  const selectedFundInfo = summary.fundBreakdown?.find(f => f.fund === formData.fund);
  const selectedFundAvailable = selectedFundInfo ? selectedFundInfo.balance : 0;

  // Filtered Spends List
  const filteredSpends = spends.filter((s) => {
    const q = spendSearch.toLowerCase();
    const matchesSearch =
      !spendSearch ||
      (s.title && s.title.toLowerCase().includes(q)) ||
      (s.recipient && s.recipient.toLowerCase().includes(q)) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
      (s.category && s.category.toLowerCase().includes(q));

    const matchesFund = spendFundFilter === "all" || s.fund === spendFundFilter;
    const matchesCategory = spendCategoryFilter === "all" || s.category === spendCategoryFilter;

    return matchesSearch && matchesFund && matchesCategory;
  });

  // Filtered Donations List
  const filteredDonations = donations
    .filter((d) => {
      const q = donationSearch.toLowerCase();
      const matchesSearch =
        !donationSearch ||
        (d.donorName && d.donorName.toLowerCase().includes(q)) ||
        (d.userName && d.userName.toLowerCase().includes(q)) ||
        (d.donorEmail && d.donorEmail.toLowerCase().includes(q)) ||
        (d.userEmail && d.userEmail.toLowerCase().includes(q)) ||
        (d.donorPhone && d.donorPhone.toLowerCase().includes(q)) ||
        (d.phone && d.phone.toLowerCase().includes(q)) ||
        (d.transactionId && d.transactionId.toLowerCase().includes(q));

      const matchesFund = donationFundFilter === "all" || d.fund === donationFundFilter;

      return matchesSearch && matchesFund;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      return donationSortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  if (loading) {
    return (
      <div className="p-6 space-y-6 text-[var(--color-text)]">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 h-32 border border-gray-100"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 h-40 border border-gray-100"></div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 h-96 border border-gray-100"></div>
        </div>
      </div>
    );
  }

  const utilizationRate =
    summary.totalRaised > 0
      ? ((summary.totalSpent / summary.totalRaised) * 100).toFixed(1)
      : 0;

  return (
    <div className="p-6 space-y-6 text-[var(--color-text)]">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <Heart className="h-7 w-7 text-red-500 fill-red-500" />
            Donation & Fund Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time balance tracking, donation collections, and expenditure management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 shadow-sm transition flex items-center gap-2"
            title="Refresh All Data"
          >
            <RefreshCw className={`h-4 w-4 text-gray-500 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Financial Overview (Top 4 Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Raised */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute top-0 right-0 p-5 opacity-10">
            <DollarSign className="h-20 w-20 text-emerald-600" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-1">
            Total Funds Raised
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
            {summary.totalRaised.toLocaleString()} <span className="text-sm font-semibold text-gray-400">BDT</span>
          </div>
          <div className="mt-3 text-xs text-emerald-600 font-medium flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{summary.totalDonationCount || donations.length} verified donations</span>
          </div>
        </div>

        {/* Card 2: Total Spent */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute top-0 right-0 p-5 opacity-10">
            <TrendingDown className="h-20 w-20 text-rose-500" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-1">
            Total Funds Spent
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-rose-600 tracking-tight">
            {summary.totalSpent.toLocaleString()} <span className="text-sm font-semibold text-gray-400">BDT</span>
          </div>
          <div className="mt-3 text-xs text-rose-600 font-medium flex items-center gap-1.5">
            <Receipt className="h-3.5 w-3.5" />
            <span>{summary.totalSpendCount || spends.length} expenditure entries</span>
          </div>
        </div>

        {/* Card 3: Available Balance */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl p-6 shadow-md relative overflow-hidden group hover:shadow-lg transition">
          <div className="absolute top-0 right-0 p-5 opacity-15 text-white">
            <Wallet className="h-20 w-20" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100 block mb-1">
            Available Balance
          </span>
          <div className="text-2xl lg:text-3xl font-black tracking-tight text-white">
            {summary.netBalance.toLocaleString()} <span className="text-sm font-normal text-emerald-200">BDT</span>
          </div>
          <div className="mt-3 text-xs text-emerald-100 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-200" />
            <span>Active & ready for student aid</span>
          </div>
        </div>

        {/* Card 4: Fund Utilization Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute top-0 right-0 p-5 opacity-10">
            <PieChart className="h-20 w-20 text-blue-500" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-1">
            Fund Utilization
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-blue-600 tracking-tight">
            {utilizationRate}%
          </div>
          <div className="mt-2 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Number(utilizationRate))}%` }}
            ></div>
          </div>
          <div className="mt-2 text-[11px] text-gray-400">
            Calculated against all active funds
          </div>
        </div>
      </div>

      {/* Fund-by-Fund Balance Breakdown Cards */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
              <Layers className="h-5 w-5 text-[var(--color-primary)]" />
              Fund Balance Breakdown
            </h2>
            <p className="text-xs text-gray-500">
              Raised vs. Spent vs. Remaining Balance by specific educational cause
            </p>
          </div>
          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full self-start sm:self-auto">
            {summary.fundBreakdown?.length || 0} active causes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(summary.fundBreakdown || []).map((fundItem) => {
            const config = FUND_CONFIG[fundItem.fund] || {
              name: fundItem.fund,
              badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
              barClass: "bg-gradient-to-r from-blue-500 to-indigo-600"
            };

            const isLowBalance = fundItem.balance <= 0 && fundItem.raised > 0;

            return (
              <div
                key={fundItem.fund}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border truncate ${config.badgeClass}`}>
                    {config.name}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    isLowBalance ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
                  }`}>
                    Balance: {fundItem.balance.toLocaleString()} BDT
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 block">Raised</span>
                    <span className="font-semibold text-gray-800">
                      {fundItem.raised.toLocaleString()} BDT
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Spent</span>
                    <span className="font-semibold text-rose-600">
                      {fundItem.spent.toLocaleString()} BDT
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1">
                    <span>Utilization ({fundItem.percentageSpent}%)</span>
                    <span>{fundItem.spendCount} spend{fundItem.spendCount !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${config.barClass}`}
                      style={{ width: `${Math.min(100, fundItem.percentageSpent)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Tabbed Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tab Headers */}
        <div className="border-b border-gray-100 flex flex-wrap items-center justify-between px-6 pt-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("spends")}
              className={`pb-4 px-4 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
                activeTab === "spends"
                  ? "border-rose-500 text-rose-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <TrendingDown className="h-4 w-4" />
              <span>Fund Expenses & Spends</span>
              <span className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                {spends.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("donations")}
              className={`pb-4 px-4 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
                activeTab === "donations"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Heart className="h-4 w-4 text-red-500" />
              <span>Donations Received</span>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold">
                {donations.length}
              </span>
            </button>
          </div>

          {activeTab === "spends" && (
            <button
              onClick={handleOpenCreateModal}
              className="mb-3 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border border-rose-200"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Expense</span>
            </button>
          )}
        </div>

        {/* TAB 1: FUND SPENDS */}
        {activeTab === "spends" && (
          <div>
            {/* Search and Filters Bar */}
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/40">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by expense title, recipient, description..."
                    value={spendSearch}
                    onChange={(e) => setSpendSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={spendFundFilter}
                    onChange={(e) => setSpendFundFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-rose-400 focus:border-transparent cursor-pointer"
                  >
                    <option value="all">All Funds</option>
                    {Object.keys(FUND_CONFIG).map((f) => (
                      <option key={f} value={f}>
                        {FUND_CONFIG[f]?.name || f}
                      </option>
                    ))}
                  </select>

                  <select
                    value={spendCategoryFilter}
                    onChange={(e) => setSpendCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-rose-400 focus:border-transparent cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Spends Table Area */}
            {filteredSpends.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Receipt className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="font-semibold text-gray-700">No expense records found</p>
                <p className="text-xs text-gray-400 mt-1 mb-4">
                  {spendSearch || spendFundFilter !== "all" || spendCategoryFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Start recording where donation funds are spent"}
                </p>
                <button
                  onClick={handleOpenCreateModal}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold shadow transition inline-flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Record First Expense</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                      <th className="p-4">Expense Title & Recipient</th>
                      <th className="p-4">Fund Type</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Amount Spent</th>
                      <th className="p-4">Spent Date</th>
                      <th className="p-4">Handled By</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSpends.map((spend) => {
                      const fundObj = FUND_CONFIG[spend.fund] || {
                        name: spend.fund,
                        badgeClass: "bg-gray-100 text-gray-700 border-gray-200"
                      };

                      return (
                        <tr key={spend._id} className="hover:bg-gray-50/50 transition">
                          <td className="p-4">
                            <div className="font-semibold text-[var(--color-text)]">
                              {spend.title}
                            </div>
                            {spend.recipient && (
                              <div className="text-xs text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
                                <span>Beneficiary:</span>
                                <span>{spend.recipient}</span>
                              </div>
                            )}
                            {spend.description && (
                              <div className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-sm">
                                {spend.description}
                              </div>
                            )}
                          </td>

                          <td className="p-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium whitespace-nowrap ${fundObj.badgeClass}`}>
                              {fundObj.name}
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium whitespace-nowrap">
                              {spend.category || "General"}
                            </span>
                          </td>

                          <td className="p-4 text-right font-bold text-rose-600 whitespace-nowrap">
                            -{spend.amount.toLocaleString()} BDT
                          </td>

                          <td className="p-4 text-gray-500 whitespace-nowrap text-xs">
                            {new Date(spend.spentDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </td>

                          <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                            {spend.handledBy || "Admin"}
                          </td>

                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(spend)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit Expense"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(spend)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Delete Expense"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DONATIONS RECEIVED */}
        {activeTab === "donations" && (
          <div>
            {/* Search & Filters Row */}
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/40">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, transaction..."
                    value={donationSearch}
                    onChange={(e) => setDonationSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={donationFundFilter}
                    onChange={(e) => setDonationFundFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent cursor-pointer"
                  >
                    <option value="all">All Funds</option>
                    {Object.keys(FUND_CONFIG).map((fund) => (
                      <option key={fund} value={fund}>
                        {FUND_CONFIG[fund]?.name || fund}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() =>
                      setDonationSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                    }
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition flex items-center justify-center bg-white"
                    title="Sort by Date"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Table Area */}
            {filteredDonations.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Heart className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="font-medium text-gray-700">No donations match your query</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                      <th className="p-4">Donor</th>
                      <th className="p-4">Fund Type</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDonations.map((donation) => {
                      const fundObj = FUND_CONFIG[donation.fund] || {
                        name: donation.fund || "General Fund",
                        badgeClass: "bg-gray-100 text-gray-700 border-gray-200"
                      };

                      return (
                        <tr key={donation._id} className="hover:bg-gray-50/50 transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {donation.donorImage || donation.billingInfo?.image ? (
                                <img
                                  src={donation.donorImage || donation.billingInfo?.image}
                                  alt={donation.donorName || "Donor"}
                                  className="w-10 h-10 rounded-full object-cover border border-emerald-300 shadow-sm shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                                  {(donation.donorName || donation.userName || "D").charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-[var(--color-text)]">
                                  {donation.donorName || donation.userName || "Anonymous"}
                                </div>
                                <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                  {donation.donorEmail || donation.userEmail || "N/A"}
                                </div>
                                {(donation.donorPhone || donation.userPhone || donation.phone) && (
                                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1 font-mono">
                                    <Phone className="w-3 h-3 text-[var(--color-primary)] shrink-0" />
                                    <span>{donation.donorPhone || donation.userPhone || donation.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium whitespace-nowrap ${fundObj.badgeClass}`}>
                              {fundObj.name}
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                            +{donation.amount.toLocaleString()} BDT
                          </td>
                          <td className="p-4 text-gray-500 whitespace-nowrap text-xs">
                            {donation.dateFormatted || new Date(donation.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-xs font-mono text-gray-400">
                            {donation.transactionId || donation._id.slice(-8)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE / EDIT EXPENSE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-rose-500 to-red-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {modalMode === "create" ? "Record Expense" : "Edit Expense"}
                  </h3>
                  <p className="text-xs text-rose-100 mt-0.5">
                    {modalMode === "create"
                      ? "Log a new donation fund expenditure"
                      : "Modify the details of this expenditure"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Expense Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Expense Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student scholarship stipends, book purchases..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Fund Selector with Inline Available Balance */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Fund Type *
                  </label>
                  <span className={`text-xs font-semibold ${selectedFundAvailable > 0 ? "text-emerald-600" : "text-amber-600"}`}>
                    Available: {selectedFundAvailable.toLocaleString()} BDT
                  </span>
                </div>
                <select
                  value={formData.fund}
                  onChange={(e) => setFormData({ ...formData, fund: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none cursor-pointer transition"
                >
                  {Object.keys(FUND_CONFIG).map((f) => (
                    <option key={f} value={f}>
                      {FUND_CONFIG[f]?.name || f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Amount (BDT) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full pl-3.5 pr-14 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      BDT
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.spentDate}
                    onChange={(e) => setFormData({ ...formData, spentDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Category & Beneficiary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none cursor-pointer transition"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Beneficiary / Recipient
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Student name, school, vendor"
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Description / Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Notes / Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Optional details or items purchased..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition resize-none"
                ></textarea>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{modalMode === "create" ? "Save Expense" : "Update Expense"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Delete Expense Record?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete this expense record? The spent amount will be restored back to the available fund balance.
              </p>
              <div className="mt-3 p-3 bg-gray-50 rounded-xl text-left border border-gray-100 text-xs">
                <div className="font-semibold text-gray-800">{deleteTarget.title}</div>
                <div className="text-rose-600 font-bold mt-1">
                  Amount: {deleteTarget.amount?.toLocaleString()} BDT
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow transition disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Expense</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
