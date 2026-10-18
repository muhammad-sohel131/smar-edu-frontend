"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/apiClient";
import {
  FaSearch,
  FaPhoneAlt,
  FaHandHoldingHeart,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCopy,
  FaCheck,
  FaGraduationCap,
  FaRocket,
  FaHandHoldingUsd,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaHistory,
  FaExternalLinkAlt,
  FaCoins,
  FaBalanceScale,
  FaReceipt
} from "react-icons/fa";
import { toast } from "react-toastify";

const fundIcons = {
  "educational-scholarships": FaGraduationCap,
  "institutional-development": FaRocket,
  "funding-programs": FaHandHoldingUsd,
};

const fundTitles = {
  "educational-scholarships": "Educational Scholarships",
  "institutional-development": "Institutional Development",
  "funding-programs": "Special Funding Programs",
};

const DonationTracker = ({ onDonateClick, initialPhone = "" }) => {
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [trackData, setTrackData] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [publicSummary, setPublicSummary] = useState(null);

  useEffect(() => {
    const fetchPublicSummary = async () => {
      try {
        const res = await api.get("/donation-spends/summary");
        if (res?.data?.data) {
          setPublicSummary(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching public transparency summary:", err);
      }
    };
    fetchPublicSummary();
  }, []);

  useEffect(() => {
    if (initialPhone && initialPhone.trim().length >= 8) {
      setPhone(initialPhone.trim());
      const cleanPhone = initialPhone.trim();
      const fetchInitial = async () => {
        try {
          setLoading(true);
          setHasSearched(true);
          const res = await api.get(`orders/donations/track?phone=${encodeURIComponent(cleanPhone)}`);
          setTrackData(res?.data?.data || null);
        } catch (error) {
          console.error("Error auto-tracking donations:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchInitial();
    }
  }, [initialPhone]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 8) {
      toast.error("Please enter a valid phone number to track donations");
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const res = await api.get(`orders/donations/track?phone=${encodeURIComponent(cleanPhone)}`);
      setTrackData(res?.data?.data || null);
    } catch (error) {
      console.error("Error tracking donations:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch donation records");
      setTrackData(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      toast.success("Order ID copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full">
      {/* Search Header Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10 mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-100/40 via-teal-100/20 to-blue-100/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 border border-emerald-200">
            <FaHistory className="w-3.5 h-3.5" />
            <span>Instant Donation Tracking</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Track Your Contributions by Phone
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-8">
            No registration or login needed. Enter the mobile number you provided during donation to view all your transactions, statuses, and impact breakdown.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number (e.g. 01712345678)"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 hover:bg-gray-100/60 focus:bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-base font-semibold transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <FaSearch className="w-4 h-4" />
                  <span>Track Donations</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Results View */}
      {loading && (
        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-xl text-center animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-80 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-28 bg-gray-100 rounded-2xl"></div>
            <div className="h-28 bg-gray-100 rounded-2xl"></div>
            <div className="h-28 bg-gray-100 rounded-2xl"></div>
          </div>
        </div>
      )}

      {!loading && hasSearched && trackData && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Donated */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-6 rounded-3xl shadow-xl flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FaHandHoldingHeart className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                  Total Impact Contributed
                </div>
                <div className="text-3xl font-extrabold tracking-tight mt-1">
                  ৳{trackData.totalDonated?.toLocaleString() || "0"}
                </div>
              </div>
            </div>

            {/* Total Records */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center space-x-4">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FaHistory className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total Donation Attempts
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mt-1">
                  {trackData.count || 0}
                </div>
              </div>
            </div>

            {/* Successfully Completed */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center space-x-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Verified Completed
                </div>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">
                  {trackData.paidCount || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Donation Records */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Donation History for <span className="text-emerald-600">{trackData.phone}</span>
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Showing all recorded donations linked with this phone number
                </p>
              </div>

              {onDonateClick && (
                <button
                  onClick={onDonateClick}
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5"
                >
                  <FaHandHoldingUsd className="w-4 h-4" />
                  <span>Make Another Donation</span>
                </button>
              )}
            </div>

            {trackData.donations && trackData.donations.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {trackData.donations.map((item) => {
                  const FundIcon = fundIcons[item.fund] || FaHandHoldingHeart;
                  const fundName = fundTitles[item.fund] || item.fund || "SMARTEDU Fund";
                  const isPaid = item.status === "paid";
                  const isPending = item.status === "pending";

                  return (
                    <div
                      key={item._id}
                      className="p-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Left info */}
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-700"
                              : isPending
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <FundIcon className="w-6 h-6" />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-gray-900 text-base">
                              {fundName}
                            </span>
                            {/* Status badge */}
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                                isPaid
                                  ? "bg-emerald-100 text-emerald-800"
                                  : isPending
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {isPaid ? (
                                <>
                                  <FaCheckCircle className="w-3 h-3 mr-1" />
                                  <span>Paid / Completed</span>
                                </>
                              ) : isPending ? (
                                <>
                                  <FaClock className="w-3 h-3 mr-1" />
                                  <span>Pending Payment</span>
                                </>
                              ) : (
                                <>
                                  <FaTimesCircle className="w-3 h-3 mr-1" />
                                  <span>Canceled</span>
                                </>
                              )}
                            </span>
                          </div>

                          {/* Donor name & phone & email */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                            {(item.donorName || item.billingInfo?.name) && (
                              <span className="flex items-center space-x-1">
                                <FaUser className="w-3 h-3 text-gray-400" />
                                <span>{item.donorName || item.billingInfo?.name}</span>
                              </span>
                            )}
                            {(item.donorEmail || item.billingInfo?.email) && (
                              <span className="flex items-center space-x-1">
                                <FaEnvelope className="w-3 h-3 text-gray-400" />
                                <span>{item.donorEmail || item.billingInfo?.email}</span>
                              </span>
                            )}
                            <span className="flex items-center space-x-1">
                              <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                              <span>{formatDate(item.createdAt)}</span>
                            </span>
                          </div>

                          {/* Order ID */}
                          <div className="mt-2 flex items-center space-x-2 text-xs text-gray-400">
                            <span>Ref ID:</span>
                            <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-600">
                              {item._id}
                            </code>
                            <button
                              onClick={() => copyToClipboard(item._id)}
                              className="text-gray-400 hover:text-emerald-600 transition"
                              title="Copy ID"
                            >
                              {copiedId === item._id ? (
                                <FaCheck className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <FaCopy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right info (Amount & Action) */}
                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0">
                        <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">
                          ৳{item.price?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 font-medium">
                          {item.provider?.toUpperCase() || "SSLCOMMERZ"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHistory className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  No Donations Found for This Phone Number
                </h4>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  We couldn't find any donation records matching "{trackData.phone}". Please make sure the phone number matches the one provided during checkout.
                </p>
                {onDonateClick && (
                  <button
                    onClick={onDonateClick}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition inline-flex items-center space-x-2 shadow-md"
                  >
                    <FaHandHoldingHeart className="w-4 h-4" />
                    <span>Make Your First Donation</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Helpful Info if not searched yet */}
      {!loading && !hasSearched && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 p-8 text-center">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaPhoneAlt className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Track Everything with Just Your Phone Number
          </h3>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            You don't need an account or password to verify your generosity. Simply input your phone number above to see total funds donated, receipts, and real-time transaction updates.
          </p>
        </div>
      )}

      {/* Live Fund Utilization & Financial Transparency Section */}
      {publicSummary && (
        <div className="mt-10 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl overflow-hidden relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3.5 py-1 rounded-full text-xs font-semibold mb-2 border border-emerald-200">
                <FaBalanceScale className="w-3.5 h-3.5" />
                <span>100% Financial Transparency</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Live Donation Fund Utilization
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Real-time accounting of every taka donated, spent on student causes, and currently held in reserve.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block mb-1">
                Total Funds Raised
              </span>
              <div className="text-2xl font-black text-emerald-900">
                ৳{publicSummary.totalRaised?.toLocaleString() || "0"}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">
                Across {publicSummary.totalDonationCount || 0} generous donations
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-red-50 border border-rose-100 rounded-2xl p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-800 block mb-1">
                Total Disbursed / Spent
              </span>
              <div className="text-2xl font-black text-rose-700">
                ৳{publicSummary.totalSpent?.toLocaleString() || "0"}
              </div>
              <div className="text-[11px] text-rose-600 mt-1">
                On scholarships, books, labs & equipment
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 block mb-1">
                Current Active Balance
              </span>
              <div className="text-2xl font-black text-blue-900">
                ৳{publicSummary.netBalance?.toLocaleString() || "0"}
              </div>
              <div className="text-[11px] text-blue-600 mt-1">
                Reserved for ongoing student welfare
              </div>
            </div>
          </div>

          {/* Recent Verified Expenses */}
          {publicSummary.recentSpends?.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaReceipt className="text-rose-500" />
                <span>Recent Verified Expenditures</span>
              </h4>
              <div className="space-y-2.5">
                {publicSummary.recentSpends.map((sp) => (
                  <div
                    key={sp._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100/70 rounded-xl border border-gray-100 transition text-xs gap-2"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{sp.title}</div>
                      {sp.recipient && (
                        <div className="text-gray-500 text-[11px] mt-0.5">
                          Beneficiary: <span className="text-emerald-700 font-medium">{sp.recipient}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                      <div className="font-bold text-rose-600 sm:text-right">
                        -৳{sp.amount?.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {new Date(sp.spentDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DonationTracker;
