"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Award,
  Trophy,
  CheckCircle2,
  ExternalLink,
  Receipt,
  Ticket,
  Search,
  LayoutGrid,
  List,
  AlertCircle,
  Share2,
  X,
  Printer,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { useMyRegisteredEvents } from "@/hooks/useEvent";
import { useAuth } from "@/hooks/useAuth";

const getTitle = (title) => {
  if (!title) return "Event";
  if (typeof title === "string") return title;
  return title.en || title.bn || Object.values(title)[0] || "Event";
};

const getDescription = (desc) => {
  if (!desc) return "";
  if (typeof desc === "string") return desc;
  return desc.en || desc.bn || Object.values(desc)[0] || "";
};

const formatEventDate = (dateVal) => {
  if (!dateVal) return "Date TBA";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "Date TBA";
    return format(d, "EEE, dd MMM yyyy • hh:mm a");
  } catch (e) {
    return "Date TBA";
  }
};

const formatPrice = (price, currency = "BDT") => {
  if (!price || Number(price) === 0) return "Free Entry";
  const symbols = { BDT: "৳", USD: "$", EUR: "€", GBP: "£" };
  return `${symbols[currency] || currency} ${Number(price).toLocaleString()}`;
};

export default function MyEventsHistory({ role = "student" }) {
  const { user } = useAuth();
  const { data: eventsData, isLoading, isError, error, refetch } = useMyRegisteredEvents();

  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'upcoming' | 'past'
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [selectedTicket, setSelectedTicket] = useState(null);

  const events = useMemo(() => {
    return Array.isArray(eventsData?.data) ? eventsData.data : [];
  }, [eventsData]);

  // Statistics calculation
  const stats = useMemo(() => {
    const now = new Date();
    let upcoming = 0;
    let completed = 0;
    let points = 0;

    events.forEach((ev) => {
      const evDate = new Date(ev.eventDate || ev.createdAt);
      if (evDate >= now) {
        upcoming += 1;
      } else {
        completed += 1;
      }
      points += Number(ev.pointsReward || 0);
    });

    return {
      total: events.length,
      upcoming,
      completed,
      pointsReward: points,
    };
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events.filter((ev) => {
      const title = getTitle(ev.title).toLowerCase();
      const location = (ev.location || "").toLowerCase();
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch = !query || title.includes(query) || location.includes(query);
      if (!matchesSearch) return false;

      const evDate = new Date(ev.eventDate || ev.createdAt);
      if (activeTab === "upcoming") {
        return evDate >= now;
      }
      if (activeTab === "past") {
        return evDate < now;
      }
      return true;
    });
  }, [events, activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 sm:px-6 md:px-8 py-8 space-y-8">
      {/* Hero Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent-special)] p-6 sm:p-8 md:p-10 text-white overflow-hidden shadow-lg shadow-[var(--color-primary)]/10">
        {/* Background ambient lighting */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-3 text-white/90">
              <Calendar className="w-3.5 h-3.5" />
              <span>{role === "instructor" ? "Teacher Event Portal" : "Student Event Portal"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              My Registered Events
            </h1>
            <p className="mt-2 text-white/80 text-sm sm:text-base leading-relaxed">
              Track your confirmed webinars, workshops, and masterclasses. View event passes, schedules, and rewarded points.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[var(--color-primary)] font-semibold text-sm hover:bg-white/90 hover:shadow-lg transition-all active:scale-95 shrink-0"
            >
              <span>Explore More Events</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Registered */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Registered
            </span>
            <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">{stats.total}</p>
          <p className="text-xs text-gray-400 mt-1">Confirmed passes</p>
        </motion.div>

        {/* Card 2: Upcoming */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Upcoming
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.upcoming}</p>
          <p className="text-xs text-gray-400 mt-1">Ready to attend</p>
        </motion.div>

        {/* Card 3: Past / Completed */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Completed
            </span>
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">{stats.completed}</p>
          <p className="text-xs text-gray-400 mt-1">Past sessions</p>
        </motion.div>

        {/* Card 4: Reward Points */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Reward Points
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-600">+{stats.pointsReward} XP</p>
          <p className="text-xs text-gray-400 mt-1">Earned via events</p>
        </motion.div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "all"
                ? "bg-white text-[var(--color-primary)] shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All Events ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "upcoming"
                ? "bg-white text-[var(--color-primary)] shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Upcoming ({stats.upcoming})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "past"
                ? "bg-white text-[var(--color-primary)] shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Completed ({stats.completed})
          </button>
        </div>

        {/* Search & View Mode */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-white text-[var(--color-primary)] shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-white text-[var(--color-primary)] shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse space-y-4">
              <div className="h-44 bg-gray-200 rounded-xl" />
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white rounded-2xl p-8 border border-red-100 text-center space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Failed to load registered events</h3>
          <p className="text-sm text-gray-500">{error?.message || "Something went wrong. Please try again."}</p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90"
          >
            Retry
          </button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
            {searchQuery
              ? "No matching events found"
              : activeTab === "upcoming"
              ? "No upcoming registered events"
              : activeTab === "past"
              ? "No past event history"
              : "You haven't registered for any events yet"}
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            {searchQuery
              ? "Try adjusting your search criteria or reset your filters."
              : "Discover masterclasses, coding bootcamps, and live workshops to upgrade your skills."}
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold text-sm hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition-all active:scale-95"
          >
            <span>Browse Available Events</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, idx) => {
            const isUpcoming = new Date(event.eventDate || event.createdAt) >= new Date();
            const title = getTitle(event.title);
            const desc = getDescription(event.description);
            const price = Number(event.price || 0);

            return (
              <motion.div
                key={event._id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
              >
                {/* Thumbnail / Header */}
                <div className="relative h-48 w-full bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                  {event.thumbnail ? (
                    <img
                      src={event.thumbnail}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/40 to-[var(--color-secondary)]/40 p-6 text-center">
                      <Calendar className="w-12 h-12 text-white/50" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
                        isUpcoming
                          ? "bg-emerald-500/90 text-white"
                          : "bg-black/60 text-white/80"
                      }`}
                    >
                      {isUpcoming ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          Upcoming
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Completed
                        </>
                      )}
                    </span>

                    {/* Ticket / Payment Badge */}
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-gray-800 backdrop-blur-md shadow-sm">
                      {price === 0 ? "Free Entry" : `Paid (${formatPrice(price, event.currency)})`}
                    </span>
                  </div>

                  {/* Points reward pill at bottom of image */}
                  {Number(event.pointsReward) > 0 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/90 text-white text-xs font-semibold backdrop-blur-md">
                        <Sparkles className="w-3 h-3" />
                        +{event.pointsReward} XP
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-[var(--color-text)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                      {title}
                    </h3>

                    {desc && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {desc}
                      </p>
                    )}
                  </div>

                  {/* Meta items */}
                  <div className="space-y-2 pt-2 border-t border-gray-50 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                      <span className="font-medium text-gray-800">
                        {formatEventDate(event.eventDate || event.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="truncate">{event.location || "Online Webinar"}</span>
                    </div>

                    {event.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{event.duration} Minutes Duration</span>
                      </div>
                    )}
                  </div>

                  {/* Order info snippet if paid */}
                  {event.order && (
                    <div className="p-2.5 bg-gray-50 rounded-xl text-[11px] text-gray-500 flex items-center justify-between">
                      <span className="font-mono">Order #{event.order._id?.slice(-8)}</span>
                      <span className="capitalize font-semibold text-emerald-600">
                        {event.order.provider || "SSLCommerz"} Paid
                      </span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href={`/events/${event._id}`}
                      className="flex-1 text-center py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>View Event</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                    </Link>

                    <button
                      onClick={() => setSelectedTicket(event)}
                      className="py-2.5 px-3 rounded-xl bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                      title="View Registration Pass"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Pass</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Event</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Ticket / Fee</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredEvents.map((event) => {
                  const isUpcoming = new Date(event.eventDate || event.createdAt) >= new Date();
                  const title = getTitle(event.title);
                  const price = Number(event.price || 0);

                  return (
                    <tr key={event._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                            {event.thumbnail ? (
                              <img src={event.thumbnail} alt={title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                <Calendar className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">{title}</p>
                            {event.pointsReward > 0 && (
                              <span className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-0.5">
                                <Sparkles className="w-3 h-3" /> +{event.pointsReward} XP
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap text-xs text-gray-700">
                        {formatEventDate(event.eventDate || event.createdAt)}
                      </td>

                      <td className="p-4 text-xs text-gray-600">
                        <span className="line-clamp-1">{event.location || "Online"}</span>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className="font-semibold text-xs text-[var(--color-primary)]">
                          {formatPrice(price, event.currency)}
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                            isUpcoming
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isUpcoming ? "Upcoming" : "Completed"}
                        </span>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedTicket(event)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                            title="View Pass"
                          >
                            <Ticket className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/events/${event._id}`}
                            className="p-2 rounded-lg bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-white transition"
                            title="View Event Details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ticket / Registration Pass Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
            >
              {/* Modal Top Band */}
              <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-6 text-white relative">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/80 font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Verified Registration Pass</span>
                </div>
                <h3 className="text-xl font-bold leading-snug">{getTitle(selectedTicket.title)}</h3>
              </div>

              {/* Ticket Details */}
              <div className="p-6 space-y-4 text-sm">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-500">Attendee</span>
                  <span className="font-semibold text-gray-900">{user?.name || "Attendee"}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-500">Attendee Email</span>
                  <span className="font-medium text-gray-700">{user?.email || "N/A"}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-500">Event Date & Time</span>
                  <span className="font-medium text-gray-900 text-right">
                    {formatEventDate(selectedTicket.eventDate || selectedTicket.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-500">Venue / Location</span>
                  <span className="font-medium text-gray-900 text-right">
                    {selectedTicket.location || "Online Webinar"}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-500">Ticket Type</span>
                  <span className="font-semibold text-emerald-600">
                    {Number(selectedTicket.price) === 0 ? "Free Entry" : `Paid (${formatPrice(selectedTicket.price, selectedTicket.currency)})`}
                  </span>
                </div>

                {selectedTicket.order && (
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 font-mono text-xs">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="text-gray-700">#{selectedTicket.order._id?.slice(-10)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-gray-500">Registration Status</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                    Confirmed & Valid
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-xs hover:bg-gray-100 transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Pass</span>
                </button>

                <button
                  onClick={() => setSelectedTicket(null)}
                  className="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-xs hover:opacity-90 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
