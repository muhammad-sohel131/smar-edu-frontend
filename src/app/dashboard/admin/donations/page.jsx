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
  RefreshCw,
  Percent,
  Sparkles,
  BookOpen,
  ArrowRight,
  Ticket,
  Copy,
  Check
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

  // Course Discount State
  const [discountConfig, setDiscountConfig] = useState({
    percentage: 0,
    isActive: false,
    title: "General Scholarship Subsidy",
    fundedBy: "educational-scholarships",
    scholarshipFundBalance: 0
  });
  const [discountInput, setDiscountInput] = useState(0);
  const [discountActiveInput, setDiscountActiveInput] = useState(false);
  const [savingDiscount, setSavingDiscount] = useState(false);

  // Subsidies History State
  const [subsidies, setSubsidies] = useState([]);
  const [subsidyStats, setSubsidyStats] = useState({
    totalSubsidized: 0,
    totalPaid: 0,
    totalOriginal: 0,
    count: 0
  });
  const [subsidySearch, setSubsidySearch] = useState("");

  // Scholarship Coupons State
  const [coupons, setCoupons] = useState([]);
  const [couponStats, setCouponStats] = useState({
    total: 0,
    active: 0,
    used: 0,
    disabled: 0,
    totalSubsidized: 0
  });
  const [couponSearch, setCouponSearch] = useState("");
  const [couponStatusFilter, setCouponStatusFilter] = useState("all");
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponFormData, setCouponFormData] = useState({
    code: "",
    discountPercentage: 50,
    title: "",
    expiryDate: ""
  });
  const [submittingCoupon, setSubmittingCoupon] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchSummary(), fetchSpends(), fetchDonations(), fetchDiscount(), fetchSubsidies(), fetchCoupons()]);
    } catch (error) {
      console.error("Error loading donation data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([fetchSummary(), fetchSpends(), fetchDonations(), fetchDiscount(), fetchSubsidies(), fetchCoupons()]);
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

  const fetchDiscount = async () => {
    try {
      const res = await api.get("/course-discount");
      if (res?.data?.data) {
        const d = res.data.data;
        setDiscountConfig(d);
        setDiscountInput(d.percentage || 0);
        setDiscountActiveInput(Boolean(d.isActive));
      }
    } catch (error) {
      console.error("Error fetching course discount:", error);
    }
  };

  const fetchSubsidies = async () => {
    try {
      const res = await api.get("/course-discount/subsidies", {
        params: { limit: 1000 }
      });
      if (res?.data?.data) {
        setSubsidies(res.data.data.records || []);
        if (res.data.data.stats) {
          setSubsidyStats(res.data.data.stats);
        }
      }
    } catch (error) {
      console.error("Error fetching subsidy history:", error);
    }
  };

  const handleUpdateDiscount = async (overrideActive = null) => {
    const numPct = Number(discountInput);
    if (isNaN(numPct) || numPct < 0 || numPct > 100) {
      toast.error("Discount percentage must be between 0% and 100%");
      return;
    }

    const nextActive = overrideActive !== null ? overrideActive : discountActiveInput;

    try {
      setSavingDiscount(true);
      const res = await api.patch("/course-discount", {
        percentage: numPct,
        isActive: nextActive
      });
      if (res?.data?.data) {
        setDiscountConfig((prev) => ({ ...prev, ...res.data.data }));
        setDiscountActiveInput(Boolean(res.data.data.isActive));
        setDiscountInput(res.data.data.percentage);
      }
      toast.success(
        nextActive
          ? `Scholarship discount set to ${numPct}% across all courses!`
          : "Course scholarship discount deactivated"
      );
      fetchSummary();
      fetchSubsidies();
    } catch (error) {
      console.error("Error updating discount:", error);
      toast.error(error?.response?.data?.message || "Failed to update discount");
    } finally {
      setSavingDiscount(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await api.get("/coupons", { params: { limit: 1000 } });
      if (res?.data?.data) {
        setCoupons(res.data.data.coupons || []);
        if (res.data.data.stats) {
          setCouponStats(res.data.data.stats);
        }
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    const pct = Number(couponFormData.discountPercentage);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      toast.error("Discount percentage must be between 0% and 100%");
      return;
    }

    try {
      setSubmittingCoupon(true);
      const res = await api.post("/coupons", {
        code: couponFormData.code ? couponFormData.code.trim().toUpperCase() : undefined,
        discountPercentage: pct,
        title: couponFormData.title?.trim() || undefined,
        expiryDate: couponFormData.expiryDate || undefined
      });
      toast.success(`Scholarship coupon "${res.data.data.code}" (${res.data.data.discountPercentage}%) created!`);
      setIsCouponModalOpen(false);
      setCouponFormData({ code: "", discountPercentage: 50, title: "", expiryDate: "" });
      fetchCoupons();
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error(error?.response?.data?.message || "Failed to create coupon");
    } finally {
      setSubmittingCoupon(false);
    }
  };

  const handleToggleCoupon = async (id, nextActive) => {
    try {
      await api.patch(`/coupons/${id}`, { isActive: nextActive });
      toast.success(`Coupon ${nextActive ? "enabled" : "disabled"}`);
      fetchCoupons();
    } catch (error) {
      console.error("Error toggling coupon:", error);
      toast.error(error?.response?.data?.message || "Failed to update coupon status");
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship coupon?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error(error?.response?.data?.message || "Failed to delete coupon");
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.info(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
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

  // Filtered Subsidies List
  const filteredSubsidies = subsidies.filter((item) => {
    if (!subsidySearch) return true;
    const q = subsidySearch.toLowerCase();
    const courseTitle = item.course?.title?.toLowerCase() || "";
    const studentName = item.student?.name?.toLowerCase() || "";
    const studentEmail = item.student?.email?.toLowerCase() || "";
    const studentPhone = item.student?.phone?.toLowerCase() || "";
    const couponCode = item.couponCode?.toLowerCase() || "";
    const txId = item.transactionId?.toLowerCase() || "";
    return (
      courseTitle.includes(q) ||
      studentName.includes(q) ||
      studentEmail.includes(q) ||
      studentPhone.includes(q) ||
      couponCode.includes(q) ||
      txId.includes(q)
    );
  });

  // Filtered Coupons List
  const filteredCoupons = coupons.filter((c) => {
    const q = couponSearch.toLowerCase();
    const matchesSearch =
      !couponSearch ||
      (c.code && c.code.toLowerCase().includes(q)) ||
      (c.title && c.title.toLowerCase().includes(q)) ||
      (c.usedBy?.name && c.usedBy.name.toLowerCase().includes(q)) ||
      (c.usedBy?.email && c.usedBy.email.toLowerCase().includes(q)) ||
      (c.usedCourse?.title && c.usedCourse.title.toLowerCase().includes(q));

    let matchesStatus = true;
    if (couponStatusFilter === "active") {
      matchesStatus = !c.isUsed && c.isActive;
    } else if (couponStatusFilter === "used") {
      matchesStatus = c.isUsed;
    } else if (couponStatusFilter === "disabled") {
      matchesStatus = !c.isUsed && !c.isActive;
    }

    return matchesSearch && matchesStatus;
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

      {/* Global Course Scholarship Discount Control Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-indigo-800/60 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header & Status Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-indigo-800/50">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Global Course Scholarship Discount (অটো স্কলারশিপ ফান্ড রিডাকশন)
                </h2>
              </div>
              <p className="text-xs text-indigo-200/80">
                Set a global discount % for all courses. When students enroll, the reduced portion will automatically be deducted from the Educational Scholarships fund.
              </p>
            </div>

            {/* Active Status Badge & Toggle Switch */}
            <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-indigo-700/50 self-start sm:self-auto">
              <span className="text-xs font-medium text-indigo-200">
                Discount Status:
              </span>
              <button
                type="button"
                onClick={() => {
                  const next = !discountActiveInput;
                  setDiscountActiveInput(next);
                  handleUpdateDiscount(next);
                }}
                disabled={savingDiscount}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  discountActiveInput ? "bg-emerald-500" : "bg-gray-600"
                }`}
                role="switch"
                aria-checked={discountActiveInput}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    discountActiveInput ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  discountActiveInput
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-gray-700 text-gray-300 border border-gray-600"
                }`}
              >
                {discountActiveInput ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
          </div>

          {/* Controls & Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Percentage Input & Quick Preset Buttons (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-2">
                  Discount Percentage (% অফ সকল কোর্সে)
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-950/80 border border-indigo-700/60 rounded-xl px-4 py-2.5 text-xl font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 font-bold text-lg">
                      %
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUpdateDiscount()}
                    disabled={savingDiscount}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-indigo-500/30 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingDiscount ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Apply Discount</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick presets */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-indigo-300 font-medium mr-1">Quick Select:</span>
                {[0, 10, 20, 25, 30, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscountInput(pct)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition border ${
                      Number(discountInput) === pct
                        ? "bg-indigo-500 text-white border-indigo-400 shadow-sm"
                        : "bg-slate-800/80 text-indigo-200 border-indigo-800 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {pct === 0 ? "0% (None)" : pct === 100 ? "100% (Full)" : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Funding Status & Live Simulation Preview (5 cols) */}
            <div className="lg:col-span-5 bg-slate-950/60 rounded-xl p-4 border border-indigo-800/40 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-indigo-900/60">
                <span className="text-indigo-300 flex items-center gap-1.5 font-medium">
                  <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                  Scholarship Fund Balance:
                </span>
                <span className="font-bold text-emerald-400 text-sm">
                  {(
                    summary.fundBreakdown?.find((f) => f.fund === "educational-scholarships")?.balance ??
                    discountConfig.scholarshipFundBalance ??
                    0
                  ).toLocaleString()}{" "}
                  BDT
                </span>
              </div>

              <div className="text-xs space-y-1.5 text-indigo-200">
                <div className="font-semibold text-white flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  Live Simulation (৳1,000 Course):
                </div>
                <div className="grid grid-cols-2 gap-2 bg-indigo-950/50 p-2.5 rounded-lg border border-indigo-900/40 text-[11px]">
                  <div>
                    <span className="text-indigo-400 block">Student Pays</span>
                    <span className="font-bold text-emerald-300 text-sm">
                      ৳{Math.max(0, 1000 - Math.round((1000 * (Number(discountInput) || 0)) / 100)).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-indigo-400 block">Deducted from Fund</span>
                    <span className="font-bold text-rose-300 text-sm">
                      -৳{Math.round((1000 * (Number(discountInput) || 0)) / 100).toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-indigo-300/70 leading-tight">
                  * Every course purchase automatically deducts the reduced amount from the Educational Scholarships fund and records it in history.
                </p>
              </div>
            </div>
          </div>
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

            <button
              onClick={() => setActiveTab("subsidies")}
              className={`pb-4 px-4 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
                activeTab === "subsidies"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <GraduationCap className="h-4 w-4 text-indigo-600" />
              <span>Course Subsidies & History</span>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                {subsidies.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("coupons")}
              className={`pb-4 px-4 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
                activeTab === "coupons"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Ticket className="h-4 w-4 text-purple-600" />
              <span>Scholarship Coupons</span>
              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                {coupons.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "spends" && (
              <button
                onClick={handleOpenCreateModal}
                className="mb-3 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border border-rose-200"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Expense</span>
              </button>
            )}

            {activeTab === "coupons" && (
              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="mb-3 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Scholarship Coupon</span>
              </button>
            )}
          </div>
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

        {/* TAB 3: COURSE SUBSIDIES & REDUCTIONS HISTORY */}
        {activeTab === "subsidies" && (
          <div>
            {/* Metric Highlights Banner */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-50/70 via-blue-50/50 to-white border-b border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Total Subsidized (Fund Deductions)
                  </span>
                  <div className="text-xl font-extrabold text-rose-600">
                    ৳{subsidyStats.totalSubsidized.toLocaleString()} BDT
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Subsidized from scholarship donations
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Subsidized Students / Purchases
                  </span>
                  <div className="text-xl font-extrabold text-indigo-600">
                    {subsidyStats.count} Enrollments
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Benefited through scholarship fund
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Paid by Students
                  </span>
                  <div className="text-xl font-extrabold text-emerald-600">
                    ৳{subsidyStats.totalPaid.toLocaleString()} BDT
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Net collected from students
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Total Course Value
                  </span>
                  <div className="text-xl font-extrabold text-gray-800">
                    ৳{subsidyStats.totalOriginal.toLocaleString()} BDT
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Original price value before reduction
                  </span>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/40">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by student name, email, phone, or course title..."
                  value={subsidySearch}
                  onChange={(e) => setSubsidySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Table Area */}
            {filteredSubsidies.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <GraduationCap className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="font-medium text-gray-700">No course subsidies match your query</p>
                <p className="text-xs text-gray-400 mt-1">
                  When students purchase courses with an active scholarship discount, each reduction will be tracked here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                      <th className="p-4">Course</th>
                      <th className="p-4">Student (Buyer)</th>
                      <th className="p-4 text-right">Original Price</th>
                      <th className="p-4 text-center">Discount</th>
                      <th className="p-4 text-right">Reduced / Fund Subsidized</th>
                      <th className="p-4 text-right">Student Paid</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Order ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSubsidies.map((item) => (
                      <tr key={item.orderId} className="hover:bg-gray-50/50 transition">
                        {/* Course */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {item.course?.thumbnail ? (
                              <img
                                src={item.course.thumbnail}
                                alt={item.course.title}
                                className="w-12 h-8 rounded-lg object-cover border border-gray-200 shrink-0 shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                                <BookOpen className="w-4 h-4" />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-gray-900 line-clamp-1 max-w-[200px]" title={item.course?.title}>
                                {item.course?.title || "Unknown Course"}
                              </div>
                              <div className="text-xs text-gray-400">
                                {item.course?.category || "General"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Student */}
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            {item.student?.picture ? (
                              <img
                                src={item.student.picture}
                                alt={item.student.name}
                                className="w-8 h-8 rounded-full object-cover border border-indigo-200 shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {(item.student?.name || "S").charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-gray-800 text-xs">
                                {item.student?.name || "Student"}
                              </div>
                              <div className="text-[11px] text-gray-500">
                                {item.student?.email || "N/A"}
                              </div>
                              {item.student?.phone && item.student?.phone !== "N/A" && (
                                <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                                  <Phone className="w-2.5 h-2.5 text-indigo-500" />
                                  <span>{item.student.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Original Price */}
                        <td className="p-4 text-right text-gray-500 font-medium whitespace-nowrap">
                          ৳{item.originalPrice?.toLocaleString()} BDT
                        </td>

                        {/* Discount */}
                        <td className="p-4 text-center whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {item.discountPercentage}% OFF
                          </span>
                        </td>

                        {/* Reduced / Fund Subsidized */}
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="font-bold text-rose-600">
                            -৳{item.reducedAmount?.toLocaleString()} BDT
                          </div>
                          <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200 font-medium inline-block mt-0.5">
                            Fund Deducted
                          </span>
                        </td>

                        {/* Student Paid */}
                        <td className="p-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                          ৳{item.paidAmount?.toLocaleString()} BDT
                        </td>

                        {/* Date */}
                        <td className="p-4 text-gray-500 whitespace-nowrap text-xs">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </td>

                        {/* Transaction / Order ID */}
                        <td className="p-4 text-xs font-mono text-gray-400 whitespace-nowrap">
                          {item.transactionId || item.orderId.slice(-8)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SCHOLARSHIP COUPONS */}
        {activeTab === "coupons" && (
          <div>
            {/* Metric Highlights Banner */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-white border-b border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Total Coupons Created
                  </span>
                  <div className="text-xl font-extrabold text-purple-700">
                    {couponStats.total} Coupons
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Single-use scholarship vouchers
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Active & Ready to Share
                  </span>
                  <div className="text-xl font-extrabold text-emerald-600">
                    {couponStats.active} Available
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Unused and ready for students
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Redeemed & Disabled
                  </span>
                  <div className="text-xl font-extrabold text-rose-600">
                    {couponStats.used} Redeemed
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Completed single-use enrollments
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Total Subsidized (Fund Deducted)
                  </span>
                  <div className="text-xl font-extrabold text-indigo-700">
                    ৳{couponStats.totalSubsidized.toLocaleString()} BDT
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Debited from scholarship fund
                  </span>
                </div>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/40">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by code, note, student name, email or course..."
                    value={couponSearch}
                    onChange={(e) => setCouponSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={couponStatusFilter}
                    onChange={(e) => setCouponStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-purple-400 outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active (Available)</option>
                    <option value="used">Used (Disabled)</option>
                    <option value="disabled">Disabled by Admin</option>
                  </select>

                  <button
                    onClick={() => setIsCouponModalOpen(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create Coupon</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Coupons Table */}
            {filteredCoupons.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Ticket className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="font-medium text-gray-700">No scholarship coupons found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Create a scholarship coupon to give specific students a single-use 0-100% discount.
                </p>
                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create First Coupon</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                      <th className="p-4">Coupon Code</th>
                      <th className="p-4 text-center">Discount</th>
                      <th className="p-4">Purpose / Note</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4">Redemption Details</th>
                      <th className="p-4 text-right">Fund Deducted</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCoupons.map((c) => {
                      const isUsed = c.isUsed;
                      const isActive = c.isActive;

                      return (
                        <tr key={c._id} className="hover:bg-gray-50/50 transition">
                          {/* Code */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                                {c.code}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyCode(c.code)}
                                title="Copy Code"
                                className="p-1 text-gray-400 hover:text-purple-600 rounded transition"
                              >
                                {copiedCode === c.code ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                            <span className="text-[10px] text-gray-400 block mt-1">
                              Created {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          </td>

                          {/* Discount % */}
                          <td className="p-4 text-center whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                              {c.discountPercentage}% OFF
                            </span>
                          </td>

                          {/* Title / Note */}
                          <td className="p-4">
                            <div className="text-gray-800 font-medium text-xs">
                              {c.title || "Scholarship Grant"}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              Funded by Educational Scholarships
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-4 text-center whitespace-nowrap">
                            {isUsed ? (
                              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                Redeemed & Disabled
                              </span>
                            ) : !isActive ? (
                              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                Disabled
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Active (Ready to share)
                              </span>
                            )}
                          </td>

                          {/* Redemption Details */}
                          <td className="p-4">
                            {isUsed ? (
                              <div className="space-y-0.5">
                                <div className="text-xs font-semibold text-gray-800">
                                  {c.usedBy?.name || "Student"} ({c.usedBy?.email || "N/A"})
                                </div>
                                <div className="text-[11px] text-gray-500 line-clamp-1">
                                  Course: {c.usedCourse?.title || "Course"}
                                </div>
                                <div className="text-[10px] text-gray-400">
                                  Redeemed on {new Date(c.usedAt || c.updatedAt).toLocaleDateString()}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic">
                                — Not used yet (Single-use) —
                              </span>
                            )}
                          </td>

                          {/* Fund Deducted */}
                          <td className="p-4 text-right whitespace-nowrap">
                            {isUsed ? (
                              <div>
                                <span className="font-bold text-rose-600">
                                  -৳{c.reducedAmount?.toLocaleString()} BDT
                                </span>
                                <span className="text-[10px] text-gray-400 block">
                                  (Paid: ৳{c.finalPaidPrice?.toLocaleString()})
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              {!isUsed && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleCoupon(c._id, !isActive)}
                                  className={`text-xs px-2 py-1 rounded font-medium border transition ${
                                    isActive
                                      ? "text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200"
                                      : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                                  }`}
                                >
                                  {isActive ? "Disable" : "Enable"}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteCoupon(c._id)}
                                className="p-1 text-gray-400 hover:text-rose-600 transition"
                                title="Delete Coupon"
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

      {/* CREATE SCHOLARSHIP COUPON MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-200">
                  <Ticket className="h-5 w-5" />
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  Create Single-Use Scholarship Coupon
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              {/* Coupon Code Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Coupon Code (কুপন কোড)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. SCHOLAR100 (leave blank to auto-generate)"
                    value={couponFormData.code}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        code: e.target.value.toUpperCase()
                      })
                    }
                    className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
                      setCouponFormData({
                        ...couponFormData,
                        code: `SCHOLAR${couponFormData.discountPercentage}-${rand}`
                      });
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
                  >
                    Auto Generate
                  </button>
                </div>
              </div>

              {/* Discount Percentage */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Discount Percentage (০ থেকে ১০০% স্কলারশিপ) *
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={couponFormData.discountPercentage}
                      onChange={(e) =>
                        setCouponFormData({
                          ...couponFormData,
                          discountPercentage: e.target.value
                        })
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                      %
                    </span>
                  </div>
                </div>

                {/* Preset Buttons */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[10, 25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() =>
                        setCouponFormData({
                          ...couponFormData,
                          discountPercentage: pct
                        })
                      }
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                        Number(couponFormData.discountPercentage) === pct
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {pct === 100 ? "100% (Full Scholarship)" : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title / Recipient Note */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Recipient Note / Purpose (কার জন্য বা কোন কারণে)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Merit scholarship for Tanvir, Need-based aid for Rahim"
                  value={couponFormData.title}
                  onChange={(e) =>
                    setCouponFormData({
                      ...couponFormData,
                      title: e.target.value
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={couponFormData.expiryDate}
                  onChange={(e) =>
                    setCouponFormData({
                      ...couponFormData,
                      expiryDate: e.target.value
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Info Note */}
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
                  <span>Single-Use Constraint:</span>
                </div>
                <p className="text-[11px] text-purple-800 leading-relaxed">
                  এই কুপনটি একজন স্টুডেন্ট মাত্র <strong>একবারই</strong> ব্যবহার করতে পারবে। পারচেজ সম্পন্ন হওয়ামাত্র কুপনটি স্বয়ংক্রিয়ভাবে ডিসেবল হয়ে যাবে এবং রিডিউস হওয়া অংশটুকু ডোনেশনের <strong>Educational Scholarships</strong> ফান্ড থেকে মাইনাস হবে।
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCoupon}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submittingCoupon ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <span>Create Coupon</span>
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
