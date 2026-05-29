"use client";

import { useState, useEffect } from "react";
import api from "@/lib/apiClient";
import {
  Heart,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  Search,
  Filter,
  TrendingUp,
  Award,
  Users,
  Gift,
  ArrowUpDown
} from "lucide-react";
import { toast } from "react-toastify";

export default function DonationsTrackerPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFund, setSelectedFund] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // desc or asc by date

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      // Fetch paid orders of type Donation with a high limit to get all data
      const res = await api.get("/orders", {
        params: {
          itemType: "Donation",
          status: "paid",
          limit: 1000
        }
      });
      setDonations(res.data?.data?.orders || []);
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.error("Failed to load donations statistics");
    } finally {
      setLoading(false);
    }
  };

  // Group donations by fund to calculate totals
  const fundTotals = donations.reduce((acc, donation) => {
    const fundName = donation.fund || "General Fund";
    if (!acc[fundName]) {
      acc[fundName] = {
        amount: 0,
        count: 0
      };
    }
    acc[fundName].amount += donation.amount || 0;
    acc[fundName].count += 1;
    return acc;
  }, {});

  const totalDonatedAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  // Extract unique funds
  const uniqueFunds = Object.keys(fundTotals);

  // Filter and sort donations list
  const filteredDonations = donations
    .filter(d => {
      const matchesSearch = !search ||
        (d.userName && d.userName.toLowerCase().includes(search.toLowerCase())) ||
        (d.userEmail && d.userEmail.toLowerCase().includes(search.toLowerCase())) ||
        (d.transactionId && d.transactionId.toLowerCase().includes(search.toLowerCase()));

      const matchesFund = selectedFund === "all" || d.fund === selectedFund;

      return matchesSearch && matchesFund;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-[var(--color-background)]">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 h-32 border border-gray-100"></div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 h-96 border border-gray-100"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[var(--color-background)]">
      <div className="container mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
              Donation Tracker
            </h1>
            <p className="text-[var(--color-text)]/70 text-sm md:text-base mt-1">
              Monitor and track educational donations by fund and cause
            </p>
          </div>
          <button
            onClick={fetchDonations}
            className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm transition flex items-center gap-2 self-start md:self-auto"
          >
            Refresh Data
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Total Donated */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <DollarSign className="h-24 w-24 text-[var(--color-primary)]" />
            </div>
            <span className="text-sm font-medium text-gray-500 block mb-1">Total Funds Raised</span>
            <div className="text-3xl font-bold text-[var(--color-text)] tracking-tight">
              {totalDonatedAmount.toLocaleString()} BDT
            </div>
            <div className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              100% transparent tracking
            </div>
          </div>

          {/* Card 2: Total Contributors */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Users className="h-24 w-24 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-500 block mb-1">Total Donations Count</span>
            <div className="text-3xl font-bold text-[var(--color-text)] tracking-tight">
              {donations.length}
            </div>
            <div className="mt-2 text-xs text-blue-600 font-medium">
              From supportive students & sponsors
            </div>
          </div>

          {/* Card 3: Top Donated Fund */}
          {uniqueFunds.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Award className="h-24 w-24 text-amber-500" />
              </div>
              <span className="text-sm font-medium text-gray-500 block mb-1">Top Funded Cause</span>
              <div className="text-xl font-bold text-[var(--color-text)] tracking-tight truncate">
                {uniqueFunds.reduce((max, f) => (fundTotals[f].amount > fundTotals[max].amount ? f : max), uniqueFunds[0])}
              </div>
              <div className="mt-2 text-xs text-amber-600 font-medium">
                Highest allocation of support
              </div>
            </div>
          )}
        </div>

        {/* Fund Allocation / Tracking Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Fund Breakdown Progress Bars */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-red-500" />
              Fund Breakdown
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Track allocation percentage and distribution of total raised amount.
            </p>
            
            {uniqueFunds.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No funds tracked yet.</div>
            ) : (
              <div className="space-y-5">
                {uniqueFunds.map(fund => {
                  const data = fundTotals[fund];
                  const percentage = totalDonatedAmount > 0 ? (data.amount / totalDonatedAmount) * 100 : 0;
                  
                  return (
                    <div key={fund} className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-gray-700 truncate max-w-[200px]">{fund}</span>
                        <span className="text-[var(--color-text)] font-semibold">
                          {data.amount.toLocaleString()} BDT ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-red-400 to-pink-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {data.count} contribution{data.count !== 1 ? 's' : ''} received
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search, Filter, and Recent Donations Table */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">
                Donations History
              </h2>
              
              {/* Search & Filters Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by name, email, transaction..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                  />
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={selectedFund}
                    onChange={(e) => setSelectedFund(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent cursor-pointer"
                  >
                    <option value="all">All Funds</option>
                    {uniqueFunds.map(fund => (
                      <option key={fund} value={fund}>{fund}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition flex items-center justify-center"
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
                    {filteredDonations.map((donation) => (
                      <tr key={donation._id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4">
                          <div className="font-medium text-[var(--color-text)]">{donation.userName || "Anonymous"}</div>
                          <div className="text-xs text-gray-400 truncate max-w-[180px]">{donation.userEmail || "N/A"}</div>
                        </td>
                        <td className="p-4 font-medium text-gray-600">
                          {donation.fund || "General Fund"}
                        </td>
                        <td className="p-4 text-right font-bold text-[var(--color-primary)]">
                          {donation.amount.toLocaleString()} BDT
                        </td>
                        <td className="p-4 text-gray-500 whitespace-nowrap">
                          {donation.dateFormatted || new Date(donation.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-xs font-mono text-gray-400">
                          {donation.transactionId || donation._id.slice(-8)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
