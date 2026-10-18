"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import EarningsChart from "./EarningsChart";
import {
  Sparkles,
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  Award,
  AlertCircle,
  ChevronRight,
  Calendar,
  Wallet,
  ArrowUpRight,
  History,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useInstructorDashboard } from "@/hooks/useInstructor";
import { useMyRegisteredEvents } from "@/hooks/useEvent";
import { useWithdrawalSimulation } from "@/hooks/useWithdrawalSimulation";
import WithdrawModal from "@/app/dashboard/admin/transactions/WithdrawModal";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading, isError, error } = useInstructorDashboard();
  const { data: eventsData } = useMyRegisteredEvents();

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [modalTab, setModalTab] = useState("withdraw");

  const { stats, topCourses, unevaluatedTasks } = dashboardData || {};

  const {
    withdrawals,
    myWithdrawals,
    totalWithdrawn: instructorTotalWithdrawn,
    availableBalance: instructorAvailableBalance,
    effectiveEarnings: instructorTotalEarnings,
    addWithdrawal,
    resetSimulation,
  } = useWithdrawalSimulation({
    user,
    isInstructor: true,
    instructorEarnings: stats?.totalEarnings,
  });

  const handleOpenWithdraw = (tab = "withdraw") => {
    setModalTab(tab);
    setIsWithdrawOpen(true);
  };

  // Loading State
  if (isLoading) {
    return (
      <section className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-primary)] mx-auto"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <p className="mt-6 text-lg font-medium text-[var(--color-text)]">
              Loading your dashboard...
            </p>
            <p className="text-sm text-[var(--color-text)]/70 mt-2">
              Preparing your insights and statistics
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (isError) {
    return (
      <section className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-[var(--color-text)]">
              Failed to load dashboard
            </p>
            <p className="text-sm text-[var(--color-text)]/70 mt-2">
              {error?.message || "Please try again later"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (user?.instructorRequest?.status === "pending") {
    return (
      <section className=" flex min-h-[80vh] items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="text-center">
          <div className="p-4 bg-yellow-100 rounded-full inline-block mb-4">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Instructor Request Pending</h2>
          <p className="text-gray-600 mb-6">
            Your instructor request is currently under review. Please check back later.
          </p>

          <p className="text-sm text-gray-500 mt-4 text-center">
            For more information, please contact <br />
            <a
              href="mailto:support@gmail.com"
              className="text-indigo-600 font-medium hover:underline"
            >
              support@gmail.com
            </a>.
          </p>


        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-special)] rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-[var(--color-secondary)]">
                  Welcome back, {user?.name || "Instructor"}
                </h2>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
                  Instructor Dashboard
                </h1>
              </div>
            </div>
            <p className="text-[var(--color-text)]/70 max-w-2xl">
              Track your performance, manage earnings, courses, and student engagement
            </p>
          </div>

          {/* Action Header Button */}
          <div className="flex items-center gap-3">
            <button
              id="btn-instructor-withdraw-header"
              onClick={() => handleOpenWithdraw("withdraw")}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowUpRight className="w-4 h-4" />
              Withdraw Earnings
            </button>

            <span className="hidden md:inline-flex px-4 py-2 bg-blue-50 text-[var(--color-primary)] rounded-full font-medium text-sm border border-blue-100">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Financial & Activity Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 1. AVAILABLE BALANCE CARD (Gradient Hero Card with Withdraw Button) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="relative overflow-hidden p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-lg text-white border border-blue-500/20 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1.5 text-blue-100 text-xs font-semibold uppercase tracking-wider">
                    <Wallet className="w-4 h-4" />
                    Available Balance
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/40 text-blue-100 font-semibold border border-blue-300/30">
                    Ready to Payout
                  </span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white mb-1">
                  ৳{instructorAvailableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <p className="text-blue-200 text-xs">Simulate instant withdrawal to wallet/bank</p>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-400/30 flex items-center justify-between">
                <button
                  id="btn-instructor-withdraw-card"
                  onClick={() => handleOpenWithdraw("withdraw")}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-[var(--color-primary)] hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition hover:scale-105 active:scale-95"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Withdraw
                </button>
                <button
                  id="btn-instructor-history-link"
                  onClick={() => handleOpenWithdraw("history")}
                  className="text-xs text-blue-100 hover:text-white font-medium flex items-center gap-1 underline underline-offset-2"
                >
                  <History className="w-3.5 h-3.5" />
                  History ({myWithdrawals.length})
                </button>
              </div>
            </div>
          </motion.div>

          {/* 2. TOTAL EARNINGS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-6 hover:shadow-xl transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white shadow-md shadow-amber-500/20">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Lifetime
                  </span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  ৳{instructorTotalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <p className="text-gray-500 text-sm">Total Earnings</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                Revenue from course enrollments
              </div>
            </div>
          </motion.div>

          {/* 3. TOTAL WITHDRAWN CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-6 hover:shadow-xl transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white shadow-md shadow-purple-500/20">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    {myWithdrawals.length} Payouts
                  </span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  ৳{instructorTotalWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <p className="text-gray-500 text-sm">Total Withdrawn</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400">Paid out to wallets</span>
                {myWithdrawals.length > 0 && (
                  <button
                    onClick={() => handleOpenWithdraw("history")}
                    className="text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1"
                  >
                    <History className="w-3.5 h-3.5" />
                    View History
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* 4. LIVE COURSES CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-6 hover:shadow-xl transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {stats?.liveCourses || 0}
                </h3>
                <p className="text-gray-500 text-sm">Live Courses</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                Published & available online
              </div>
            </div>
          </motion.div>

          {/* 5. ACTIVE STUDENTS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-6 hover:shadow-xl transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white shadow-md shadow-emerald-500/20">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {stats?.totalStudents || 0}
                </h3>
                <p className="text-gray-500 text-sm">Active Students</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                Enrolled learners
              </div>
            </div>
          </motion.div>

          {/* 6. REGISTERED EVENTS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/dashboard/instructor/events">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-md shadow-indigo-500/20">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                    {eventsData?.data?.length || 0}
                  </h3>
                  <p className="text-gray-600 text-sm group-hover:text-[var(--color-primary)] transition-colors">
                    Registered Events
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 group-hover:text-[var(--color-primary)] transition-colors">
                  View upcoming sessions →
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section - 2/3 width */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top Courses */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Top Performing Courses
                    </h2>
                    <p className="text-sm text-gray-600">
                      Most successful courses by enrollment
                    </p>
                  </div>
                </div>
                <Link
                  href="/instructor/courses"
                  className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="divide-y divide-emerald-50">
              {topCourses && topCourses.length > 0 ? (
                topCourses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-emerald-50/30 transition-colors"
                  >
                    <Link href={`/instructor/courses/${course.slug || course._id}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center overflow-hidden">
                            {course.thumbnail ? (
                              <Image
                                src={course.thumbnail}
                                alt={course.title}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            ) : (
                              <BookOpen className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {course.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-600 flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {course.subscriberCount || 0} students
                              </span>
                              <span className="text-sm text-gray-600 flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                ৳{course.price?.toFixed(2) || "0.00"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            ৳{course.totalRevenue?.toFixed(2) || "0.00"}
                          </div>
                          <div className="text-xs text-gray-500">Total Revenue</div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="inline-block p-4 bg-emerald-50 rounded-full mb-4">
                    <BookOpen className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-gray-600 mb-6">
                    No courses found. Create your first course!
                  </p>
                  <Link
                    href="/dashboard/instructor/courses/add"
                    className="inline-block px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                  >
                    Create Course
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Earnings Chart */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-emerald-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Revenue Analytics
                  </h2>
                  <p className="text-sm text-gray-600">Monthly earnings overview</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <EarningsChart data={dashboardData?.monthlyEarnings || []} />
            </div>
          </div>
        </div>

        {/* Right Section - 1/3 width */}
        <div className="space-y-8">
          {/* Unevaluated Tasks */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Pending Evaluation
                    </h2>
                    <p className="text-sm text-gray-600">
                      Tasks requiring your attention
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {unevaluatedTasks && unevaluatedTasks.length > 0 ? (
                  unevaluatedTasks.map((task, index) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`dashboard/instructor/assignments`}>
                        <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-50/50 rounded-xl border border-amber-200 hover:border-amber-300 transition-colors cursor-pointer group">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">
                                {task.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {task.pendingCount || 0} submissions pending review
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                                {task.pendingCount || 0}
                              </span>
                              <ChevronRight className="w-4 h-4 text-amber-400 group-hover:text-amber-600 transition-colors" />
                            </div>
                          </div>
                          <div className="mt-3 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((task.pendingCount || 0) / 10) * 100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="inline-block p-3 bg-amber-50 rounded-full mb-3">
                      <AlertCircle className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-gray-600">No unevaluated tasks</p>
                    <p className="text-sm text-gray-500 mt-1">
                      You're all caught up!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructor Withdraw Simulation Modal */}
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={instructorAvailableBalance}
        onWithdrawSuccess={addWithdrawal}
        withdrawals={withdrawals}
        onResetSimulation={resetSimulation}
        currentUser={user}
        initialTab={modalTab}
        isInstructorView={true}
      />
    </section>
  );
}