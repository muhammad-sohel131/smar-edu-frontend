"use client";
import { useState, useEffect, useMemo } from "react";
import {
  X,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Building,
  Smartphone,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CreditCard,
  History,
  User,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PAYMENT_METHODS = [
  {
    id: "bkash",
    name: "bKash",
    subtitle: "Personal / Agent",
    color: "#E2136E",
    bgColor: "bg-pink-50 hover:bg-pink-100/70 border-pink-200",
    activeBorder: "border-[#E2136E] ring-2 ring-[#E2136E]/20",
    badge: "Instant",
  },
  {
    id: "nagad",
    name: "Nagad",
    subtitle: "Personal / Agent",
    color: "#F7941D",
    bgColor: "bg-orange-50 hover:bg-orange-100/70 border-orange-200",
    activeBorder: "border-[#F7941D] ring-2 ring-[#F7941D]/20",
    badge: "Instant",
  },
  {
    id: "rocket",
    name: "Rocket",
    subtitle: "DBBL Mobile Banking",
    color: "#8C3494",
    bgColor: "bg-purple-50 hover:bg-purple-100/70 border-purple-200",
    activeBorder: "border-[#8C3494] ring-2 ring-[#8C3494]/20",
    badge: "Instant",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    subtitle: "Direct BEFTN / NPSB",
    color: "#2563EB",
    bgColor: "bg-blue-50 hover:bg-blue-100/70 border-blue-200",
    activeBorder: "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20",
    badge: "Secure",
  },
];

const POPULAR_BANKS = [
  "Islami Bank Bangladesh",
  "BRAC Bank Ltd",
  "Dutch-Bangla Bank",
  "City Bank Ltd",
  "Eastern Bank Ltd",
  "Sonali Bank PLC",
  "Mutual Trust Bank",
];

export default function WithdrawModal({
  isOpen,
  onClose,
  availableBalance = 0,
  onWithdrawSuccess,
  withdrawals = [],
  onResetSimulation,
  currentUser = null,
  initialTab = "withdraw",
  isInstructorView = false,
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // "withdraw" | "history"
  const [historyFilter, setHistoryFilter] = useState("all"); // "all" | "instructor" | "admin"
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bkash");
  const [accountType, setAccountType] = useState("Personal"); // "Personal" | "Agent"
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState(POPULAR_BANKS[0]);
  const [branchName, setBranchName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [note, setNote] = useState("");

  // Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(1);
  const [completedWithdrawal, setCompletedWithdrawal] = useState(null);
  const [copiedTrx, setCopiedTrx] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialTab) setActiveTab(initialTab);
      // Auto-prefill instructor name if bank selected
      if (currentUser?.name && !accountHolder) {
        setAccountHolder(currentUser.name);
      }
    }
  }, [isOpen, initialTab, currentUser]);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  const isBank = method === "bank";

  const handleQuickAmount = (val) => {
    if (val === "all") {
      setAmount(availableBalance.toString());
    } else {
      setAmount(val.toString());
    }
    setFormError("");
  };

  const handleCopyTrx = (trxId) => {
    navigator.clipboard.writeText(trxId);
    setCopiedTrx(true);
    setTimeout(() => setCopiedTrx(false), 2000);
  };

  const handleStartSimulation = (e) => {
    e.preventDefault();
    setFormError("");

    if (numAmount <= 0) {
      setFormError("Please enter a valid withdrawal amount.");
      return;
    }
    if (numAmount < 100) {
      setFormError("Minimum withdrawal amount is ৳100.");
      return;
    }
    if (numAmount > availableBalance) {
      setFormError(`Insufficient balance! Maximum available: ৳${availableBalance.toLocaleString()}`);
      return;
    }

    if (isBank) {
      if (!accountNumber.trim()) {
        setFormError("Please enter your bank account number.");
        return;
      }
      if (!accountHolder.trim()) {
        setFormError("Please enter the account holder name.");
        return;
      }
    } else {
      if (!accountNumber.trim() || accountNumber.trim().length < 11) {
        setFormError("Please enter a valid 11-digit mobile wallet number.");
        return;
      }
    }

    // Begin multi-step simulation
    setIsSimulating(true);
    setSimulationStep(1);

    setTimeout(() => {
      setSimulationStep(2);
    }, 800);

    setTimeout(() => {
      setSimulationStep(3);
    }, 1600);

    setTimeout(() => {
      // Completed payout callback
      const record = onWithdrawSuccess({
        amount: numAmount,
        method: isBank ? `Bank: ${bankName}` : method.toUpperCase(),
        methodType: method,
        accountNumber: accountNumber.trim(),
        accountType: isBank ? branchName || "Bank Branch" : accountType,
        accountHolder: isBank ? accountHolder.trim() : null,
        note: note.trim() || (isInstructorView ? "Instructor Course Earnings Payout" : "Admin Balance Payout"),
        user: {
          id: currentUser?._id || currentUser?.id || (isInstructorView ? "inst_kawsar" : "admin_super"),
          name: currentUser?.name || (isInstructorView ? "Engr. Kawsar Ahmed" : "Super Admin"),
          email: currentUser?.email || (isInstructorView ? "kawsar@gmail.com" : "admin@smartedu.com"),
          role: isInstructorView ? "INSTRUCTOR" : (currentUser?.role || "SUPER_ADMIN"),
        },
      });

      setCompletedWithdrawal(record);
      setIsSimulating(false);
    }, 2400);
  };

  const handleClose = () => {
    setIsSimulating(false);
    setCompletedWithdrawal(null);
    setAmount("");
    setAccountNumber("");
    setAccountHolder("");
    setBranchName("");
    setNote("");
    setFormError("");
    setActiveTab(initialTab || "withdraw");
    onClose();
  };

  // Filtered withdrawals & Stats calculation for Payout History
  const instructorWithdrawals = withdrawals.filter(w => w.user?.role === "INSTRUCTOR");
  const adminWithdrawals = withdrawals.filter(w => w.user?.role !== "INSTRUCTOR");

  const totalAllWithdrawn = withdrawals.reduce((sum, w) => sum + Number(w.amount || 0), 0);
  const totalInstructorWithdrawn = instructorWithdrawals.reduce((sum, w) => sum + Number(w.amount || 0), 0);
  const totalAdminWithdrawn = adminWithdrawals.reduce((sum, w) => sum + Number(w.amount || 0), 0);

  const displayedWithdrawals = withdrawals.filter(w => {
    if (historyFilter === "instructor") return w.user?.role === "INSTRUCTOR";
    if (historyFilter === "admin") return w.user?.role !== "INSTRUCTOR";
    return true;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 via-white to-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {isInstructorView ? "Withdraw Earnings" : "Withdraw Funds"}
                </h3>
                <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full ${
                  isInstructorView
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-blue-100 text-[var(--color-primary)] border border-blue-200"
                }`}>
                  {isInstructorView ? "Instructor Payout" : "Treasury Payout"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {isInstructorView
                  ? "Simulate instant payout of your course teaching earnings to mobile wallets or bank"
                  : "Simulate instant balance payouts to mobile wallets or bank"}
              </p>
            </div>
          </div>
          <button
            id="btn-close-modal"
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        {!completedWithdrawal && !isSimulating && (
          <div className="flex border-b border-gray-100 px-6 bg-white">
            <button
              onClick={() => setActiveTab("withdraw")}
              className={`py-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                activeTab === "withdraw"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Make Withdrawal
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                activeTab === "history"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <History className="w-4 h-4" />
              Payout History ({withdrawals.length})
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* SIMULATION IN PROGRESS */}
          {isSimulating && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-[var(--color-primary)] animate-spin flex items-center justify-center"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-[var(--color-primary)] animate-pulse" />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  {simulationStep === 1 && (isInstructorView ? "Verifying Instructor Credentials..." : "Verifying System Balance...")}
                  {simulationStep === 2 && `Connecting to ${method.toUpperCase()} Settlement API...`}
                  {simulationStep === 3 && "Dispatched! Finalizing Transfer Voucher..."}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Processing ৳{numAmount.toLocaleString()} to {method.toUpperCase()} ({accountNumber || "Account"})
                </p>
              </div>

              {/* Progress Steps Indicator */}
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span className={simulationStep >= 1 ? "text-[var(--color-primary)] font-semibold" : ""}>
                    Verification
                  </span>
                  <span className={simulationStep >= 2 ? "text-[var(--color-primary)] font-semibold" : ""}>
                    Gateway Auth
                  </span>
                  <span className={simulationStep >= 3 ? "text-emerald-600 font-semibold" : ""}>
                    Completed
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-emerald-500 transition-all duration-500"
                    style={{
                      width:
                        simulationStep === 1 ? "35%" : simulationStep === 2 ? "70%" : "100%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATION SUCCESS VIEW */}
          {!isSimulating && completedWithdrawal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 mb-2">
                  Simulation Success
                </span>
                <h4 className="text-2xl font-bold text-gray-900">Withdrawal Successful!</h4>
                <p className="text-sm text-gray-600 mt-1">
                  ৳{completedWithdrawal.amount.toLocaleString()} has been simulated and deducted from your available balance.
                </p>
              </div>

              {/* Digital Receipt Card */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/40 rounded-2xl p-5 border border-gray-200 text-left space-y-3.5 shadow-sm">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-xs text-gray-500">Transaction ID</span>
                  <button
                    onClick={() => handleCopyTrx(completedWithdrawal.trxId)}
                    className="flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--color-primary)] hover:underline"
                  >
                    {completedWithdrawal.trxId}
                    {copiedTrx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Recipient / Initiator */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Recipient / Initiator</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                    {completedWithdrawal.user?.name || currentUser?.name || (isInstructorView ? "Engr. Kawsar Ahmed" : "Super Admin")}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      (completedWithdrawal.user?.role || (isInstructorView ? "INSTRUCTOR" : currentUser?.role)) === "INSTRUCTOR"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {(completedWithdrawal.user?.role || (isInstructorView ? "INSTRUCTOR" : currentUser?.role)) === "INSTRUCTOR" ? "Instructor" : "Admin"}
                    </span>
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Withdrawn Amount</span>
                  <span className="font-bold text-gray-900 text-base">
                    ৳{completedWithdrawal.amount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Payout Method</span>
                  <span className="font-medium text-gray-900">
                    {completedWithdrawal.method}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Destination Account</span>
                  <span className="font-mono text-gray-800">
                    {completedWithdrawal.accountNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="text-xs text-gray-600">
                    {new Date(completedWithdrawal.date).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-xs font-semibold text-gray-500">Remaining Available Balance</span>
                  <span className="text-sm font-bold text-emerald-600">
                    ৳{availableBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCompletedWithdrawal(null);
                    setActiveTab("history");
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition text-sm flex items-center justify-center gap-2"
                >
                  <History className="w-4 h-4" />
                  View Payout History
                </button>
                <button
                  id="btn-done-withdrawal"
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-xl transition text-sm shadow-md shadow-blue-500/20"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 1: MAKE WITHDRAWAL FORM */}
          {!isSimulating && !completedWithdrawal && activeTab === "withdraw" && (
            <form onSubmit={handleStartSimulation} className="space-y-5">
              {/* Available Balance Box */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-md flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-100 font-medium">
                    {isInstructorView ? "Instructor Available Balance" : "Available for Withdrawal"}
                  </p>
                  <h4 className="text-2xl font-extrabold mt-0.5 tracking-tight">
                    ৳{availableBalance.toLocaleString()}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-sm text-white">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Instant Payout
                  </span>
                  <p className="text-[11px] text-blue-100 mt-1">Min: ৳100 • Fee: ৳0</p>
                </div>
              </div>

              {/* Error message */}
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Withdrawal Amount (৳) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">
                    ৳
                  </span>
                  <input
                    id="withdraw-amount-input"
                    type="number"
                    min="100"
                    max={availableBalance}
                    placeholder="Enter amount (min ৳100)"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setFormError("");
                    }}
                    className="w-full pl-10 pr-4 py-3 text-lg font-bold rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white text-gray-900"
                    required
                  />
                </div>

                {/* Quick Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[500, 1000, 2000, 5000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      disabled={val > availableBalance}
                      onClick={() => handleQuickAmount(val)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                        numAmount === val
                          ? "bg-blue-50 border-[var(--color-primary)] text-[var(--color-primary)]"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      }`}
                    >
                      ৳{val.toLocaleString()}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={availableBalance <= 0}
                    onClick={() => handleQuickAmount("all")}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-blue-200 bg-blue-50 text-[var(--color-primary)] hover:bg-blue-100 transition disabled:opacity-40"
                  >
                    Withdraw All (সবটুকু)
                  </button>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Select Payout Method *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PAYMENT_METHODS.map((m) => {
                    const isSelected = method === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethod(m.id)}
                        className={`p-3 rounded-xl border-2 text-left transition flex flex-col justify-between relative ${
                          isSelected ? m.activeBorder + " bg-white shadow-sm" : m.bgColor
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="font-bold text-sm"
                            style={{ color: isSelected ? m.color : "#1f2937" }}
                          >
                            {m.name}
                          </span>
                          {isSelected && (
                            <CheckCircle2
                              className="w-4 h-4 shrink-0"
                              style={{ color: m.color }}
                            />
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {m.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bank Details Form */}
              {isBank ? (
                <div className="space-y-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Bank Name *
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white font-medium"
                    >
                      {POPULAR_BANKS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Branch Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dhanmondi Branch"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Bank Account Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 20501234567890"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white font-mono"
                      required
                    />
                  </div>
                </div>
              ) : (
                /* Mobile Wallet Number Form */
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-700">
                      {method.toUpperCase()} Mobile Number *
                    </label>
                    <div className="flex items-center gap-3 text-xs">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="accType"
                          checked={accountType === "Personal"}
                          onChange={() => setAccountType("Personal")}
                          className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <span className="text-gray-700">Personal</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="accType"
                          checked={accountType === "Agent"}
                          onChange={() => setAccountType("Agent")}
                          className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <span className="text-gray-700">Agent</span>
                      </label>
                    </div>
                  </div>

                  <input
                    id="withdraw-account-input"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    maxLength={14}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white font-mono text-sm tracking-wide"
                    required
                  />
                </div>
              )}

              {/* Note / Reference */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Payout Reference / Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder={isInstructorView ? "e.g. Course Earnings Withdrawal" : "e.g. Monthly Profit Share, Operations"}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
                />
              </div>

              {/* Summary Table */}
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 text-xs space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>Gross Payout:</span>
                  <span className="font-semibold text-gray-800">৳{numAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Gateway Fee:</span>
                  <span className="text-emerald-600 font-semibold">৳0.00 (Free)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-1.5 border-t border-gray-200">
                  <span>Net Deducted:</span>
                  <span className="text-[var(--color-primary)]">৳{numAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-confirm-withdrawal"
                type="submit"
                disabled={availableBalance <= 0 || numAmount <= 0 || numAmount > availableBalance}
                className="w-full py-3.5 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ArrowUpRight className="w-5 h-5" />
                Confirm Withdrawal (উত্তোলন নিশ্চিত করুন)
              </button>
            </form>
          )}

          {/* TAB 2: PAYOUT HISTORY */}
          {!isSimulating && !completedWithdrawal && activeTab === "history" && (
            <div className="space-y-4">
              {/* Header and Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    {isInstructorView ? "Instructor Payout History" : "Platform Payout History"}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Showing {displayedWithdrawals.length} simulated payout records
                  </p>
                </div>

                {withdrawals.length > 0 && (
                  <button
                    onClick={onResetSimulation}
                    className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 hover:underline self-start sm:self-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Balance & History
                  </button>
                )}
              </div>

              {/* Admin Breakdown & Filter Pills (Shows 'K koto withdraw korce') */}
              {withdrawals.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-purple-50/30 p-3 rounded-xl border border-gray-200 space-y-2.5">
                  {/* Summary Metric Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-[10px] font-medium text-gray-500">Total Payouts</p>
                      <p className="font-bold text-gray-900 mt-0.5">৳{totalAllWithdrawn.toLocaleString()}</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-purple-100 shadow-sm">
                      <p className="text-[10px] font-medium text-purple-600">By Instructors</p>
                      <p className="font-bold text-purple-700 mt-0.5">৳{totalInstructorWithdrawn.toLocaleString()}</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-blue-100 shadow-sm">
                      <p className="text-[10px] font-medium text-blue-600">By Admin</p>
                      <p className="font-bold text-[var(--color-primary)] mt-0.5">৳{totalAdminWithdrawn.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                      <Filter className="w-3 h-3" /> Filter:
                    </span>
                    <button
                      type="button"
                      onClick={() => setHistoryFilter("all")}
                      className={`px-2.5 py-1 text-xs rounded-full font-semibold transition ${
                        historyFilter === "all"
                          ? "bg-gray-800 text-white"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      All ({withdrawals.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryFilter("instructor")}
                      className={`px-2.5 py-1 text-xs rounded-full font-semibold transition ${
                        historyFilter === "instructor"
                          ? "bg-purple-600 text-white"
                          : "bg-white text-purple-700 border border-purple-200 hover:bg-purple-50"
                      }`}
                    >
                      Instructors ({instructorWithdrawals.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryFilter("admin")}
                      className={`px-2.5 py-1 text-xs rounded-full font-semibold transition ${
                        historyFilter === "admin"
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
                      }`}
                    >
                      Admin ({adminWithdrawals.length})
                    </button>
                  </div>
                </div>
              )}

              {displayedWithdrawals.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                    <History className="w-6 h-6" />
                  </div>
                  <h5 className="font-semibold text-gray-800">No Payouts in This Category</h5>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    {historyFilter !== "all"
                      ? "No records found matching the selected filter."
                      : "You haven't performed any simulated withdrawals yet."}
                  </p>
                  <button
                    onClick={() => {
                      setHistoryFilter("all");
                      setActiveTab("withdraw");
                    }}
                    className="mt-2 px-4 py-2 text-xs font-semibold bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition"
                  >
                    Make a Withdrawal
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {displayedWithdrawals.map((w) => {
                    const isInstructorRecord = w.user?.role === "INSTRUCTOR";
                    const actorName = w.user?.name || (isInstructorRecord ? "Engr. Kawsar Ahmed" : "Super Admin");
                    const actorEmail = w.user?.email || (isInstructorRecord ? "kawsar@gmail.com" : "admin@smartedu.com");
                    const firstLetter = actorName.charAt(0).toUpperCase();

                    return (
                      <div
                        key={w.id || w.trxId}
                        className="p-3.5 bg-white hover:bg-gray-50/80 rounded-xl border border-gray-200 shadow-sm transition space-y-2.5"
                      >
                        {/* Top row: User Info & Role Badge */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              isInstructorRecord
                                ? "bg-purple-100 text-purple-700 border border-purple-200"
                                : "bg-blue-100 text-blue-700 border border-blue-200"
                            }`}>
                              {firstLetter}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-gray-900">{actorName}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                  isInstructorRecord
                                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                                    : "bg-blue-100 text-blue-700 border border-blue-200"
                                }`}>
                                  {isInstructorRecord ? "Instructor" : "Admin"}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-400 font-mono">{actorEmail}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-extrabold text-base text-gray-900">
                              ৳{Number(w.amount).toLocaleString()}
                            </span>
                            <div className="flex items-center gap-1 justify-end mt-0.5">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                {w.status || "Completed"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row: Account Details, Date & Trx ID */}
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-gray-700">{w.method}</span>
                            <span>•</span>
                            <span className="font-mono text-gray-600">{w.accountNumber}</span>
                            {w.accountType && (
                              <span className="text-[10px] text-gray-400">({w.accountType})</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">
                              {new Date(w.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <button
                              onClick={() => handleCopyTrx(w.trxId)}
                              title={`Copy Trx ID: ${w.trxId}`}
                              className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-[var(--color-primary)] hover:bg-blue-50 rounded transition"
                            >
                              <Copy className="w-3 h-3" />
                              {w.trxId}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
