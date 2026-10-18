"use client";
import { BookOpen, DollarSign, Users, UserCheck, HandHeart, TrendingUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAdminStats } from "@/hooks/useDashboard";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Custom Tooltip for Currency Charts
const CurrencyTooltip = ({ active, payload, label, title = "Amount", countLabel = "Count", accentColor = "#10B981" }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl shadow-xl text-xs space-y-1 border border-white/10">
        <p className="font-semibold text-slate-300">{data.fullMonth || label}</p>
        <p className="text-sm font-bold" style={{ color: accentColor }}>
          {title}: ৳{Number(payload[0].value || 0).toLocaleString()}
        </p>
        {data.count !== undefined && (
          <p className="text-slate-400">
            {countLabel}: <span className="font-semibold text-white">{data.count}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Courses Count Chart
const CourseTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl shadow-xl text-xs space-y-1 border border-white/10">
        <p className="font-semibold text-slate-300">{data.fullMonth || label}</p>
        <p className="text-sm font-bold text-blue-400">
          Published: <span className="text-white">{payload[0].value} Courses</span>
        </p>
      </div>
    );
  }
  return null;
};

const formatCurrencyYAxis = (val) => {
  if (val >= 1000000) return `৳${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `৳${(val / 1000).toFixed(0)}k`;
  return `৳${val}`;
};

export default function AdminDashboard() {
  const { data: statsData, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <section className="p-6 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="rounded-[--radius-card] shadow-sm bg-white p-5 animate-pulse border border-gray-100">
              <div className="h-10 w-10 bg-gray-200 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-white rounded-xl shadow-sm p-6 animate-pulse border border-gray-100"></div>
          <div className="h-80 bg-white rounded-xl shadow-sm p-6 animate-pulse border border-gray-100"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-6">
        <h1 className="text-2xl font-bold text-[--color-text]">Admin Dashboard Overview</h1>
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-[--radius-card]">
          Error loading dashboard data
        </div>
      </section>
    );
  }

  // 1. Published Courses Data
  const publishedCoursesData = statsData?.data?.publishedCoursesByMonth?.map((item) => ({
    month: `${monthNames[item._id.month - 1]} '${String(item._id.year).slice(2)}`,
    fullMonth: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    courses: item.count || 0,
  })) || [];

  // 2. Course Purchased Money Data
  const coursePurchaseData = statsData?.data?.coursePurchasedMoneyByMonth?.map((item) => ({
    month: `${monthNames[item._id.month - 1]} '${String(item._id.year).slice(2)}`,
    fullMonth: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    amount: item.amount || 0,
    count: item.count || 0,
  })) || [];

  // 3. Donation Data
  const donationData = statsData?.data?.donationByMonth?.map((item) => ({
    month: `${monthNames[item._id.month - 1]} '${String(item._id.year).slice(2)}`,
    fullMonth: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    amount: item.amount || 0,
    count: item.count || 0,
  })) || [];

  const totalCourseRevenue = statsData?.data?.totalRevenue || 0;
  const totalDonationAmount = statsData?.data?.totalDonations || 0;

  // Calculate year totals for chart badges
  const yearlyPublishedCourses = publishedCoursesData.reduce((acc, c) => acc + c.courses, 0);
  const yearlyCourseRevenue = coursePurchaseData.reduce((acc, c) => acc + c.amount, 0);
  const yearlyDonations = donationData.reduce((acc, c) => acc + c.amount, 0);

  const stats = [
    { title: "Total Students", value: statsData?.data?.totalStudents || "0", icon: Users, color: "bg-blue-50 text-blue-600 border border-blue-200/80" },
    { title: "Total Instructors", value: statsData?.data?.totalInstructors || "0", icon: UserCheck, color: "bg-indigo-50 text-indigo-600 border border-indigo-200/80" },
    { title: "Total Courses", value: statsData?.data?.totalCourses || "0", icon: BookOpen, color: "bg-amber-50 text-amber-600 border border-amber-200/80" },
    { title: "Course Purchased Revenue", value: `৳${Number(totalCourseRevenue).toLocaleString()}`, icon: DollarSign, color: "bg-orange-50 text-[var(--color-accent)] border border-orange-200/80" },
    { title: "Total Donations", value: `৳${Number(totalDonationAmount).toLocaleString()}`, icon: HandHeart, color: "bg-emerald-50 text-emerald-600 border border-emerald-200/80" },
  ];

  return (
    <section className="p-6 space-y-8 text-[var(--color-text)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[--color-text] tracking-tight">Admin Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time statistics, monthly analytics & financial insights</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200 w-fit">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Last 12 Months Analytics</span>
        </div>
      </div>

      {/* Top 5 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="rounded-[--radius-card] shadow-sm hover:shadow-md transition bg-white border border-gray-100 p-5">
              <div className="flex items-center gap-3.5">
                <div className={`p-3 rounded-xl shadow-xs ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 truncate">{stat.title}</p>
                  <h3 className="text-lg font-bold text-[--color-text] truncate mt-0.5">{stat.value}</h3>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 📊 3 Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRAPH 1: Published Courses by Month */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[--radius-card] shadow-sm hover:shadow-md transition bg-white p-6 border border-gray-100 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[--color-text]">Published Courses by Month</h2>
                <p className="text-xs text-gray-400">Monthly breakdown of published curriculum</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              12M Total: {yearlyPublishedCourses}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={publishedCoursesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip content={<CourseTooltip />} />
                <Bar dataKey="courses" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* GRAPH 2: Course Purchased Money by Month */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-[--radius-card] shadow-sm hover:shadow-md transition bg-white p-6 border border-gray-100 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-orange-50 text-[var(--color-accent)] rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[--color-text]">Course Purchased Money by Month</h2>
                <p className="text-xs text-gray-400">Monthly revenue from course enrollments</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-orange-50 text-[var(--color-accent)] rounded-full border border-orange-200">
              12M Total: ৳{yearlyCourseRevenue.toLocaleString()}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coursePurchaseData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickFormatter={formatCurrencyYAxis} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip content={<CurrencyTooltip title="Course Revenue" countLabel="Purchased Orders" accentColor="#F97316" />} />
                <Bar dataKey="amount" fill="#F97316" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* GRAPH 3: Donations by Month (Full Width) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-[--radius-card] shadow-sm hover:shadow-md transition bg-white p-6 border border-gray-100 flex flex-col justify-between lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <HandHeart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[--color-text]">Donation by Month</h2>
                <p className="text-xs text-gray-400">Monthly contributions and philanthropic funds received</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              12M Total Raised: ৳{yearlyDonations.toLocaleString()}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donationData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickFormatter={formatCurrencyYAxis} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip content={<CurrencyTooltip title="Donations Received" countLabel="Donation Orders" accentColor="#10B981" />} />
                <Bar dataKey="amount" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}