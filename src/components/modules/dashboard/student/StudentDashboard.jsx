"use client";

import { Users, TrendingUp, Target, Clock, Award, Trophy, Star, Sparkles } from "lucide-react";
import StatusCard from "@/components/modules/dashboard/student/StatsCard";
import CourseTable from "@/components/modules/dashboard/student/CourseTable";
import { useAuth } from "@/hooks/useAuth";
import { useStudentDashboard, useMyPoints, useMyRank } from "@/hooks/useDashboard";
import { useMemo } from "react";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { data: dashboardData, loading: dashboardLoading } = useStudentDashboard();
  const { data: pointsData } = useMyPoints();
  const myRank = useMyRank();

  const stats = useMemo(() => {
    if (!dashboardData?.stats) return null;
    return {
      totalCourses: dashboardData.stats.totalCourses || 0,
      enrolledCourses: dashboardData.stats.enrolledCourses || 0,
      completionRate: dashboardData.stats.completionRate || 0,
      totalFeesPaid: dashboardData.stats.totalFeesPaid || 0,
      progress: dashboardData.quickStats?.progress || 0,
      activeCourses: dashboardData.quickStats?.activeCourses || 0,
      studyTime: dashboardData.quickStats?.studyTime || 0,
      totalPoints: pointsData?.wallet?.totalPoints || 0,
      rank: myRank || null,
    };
  }, [dashboardData, pointsData, myRank]);

  if (authLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-center">
          <div className="relative mx-auto mb-6 w-16 h-16">
            <div className="w-16 h-16 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[var(--color-primary)] animate-pulse" />
            </div>
          </div>
          <p className="text-[var(--color-text)]/60 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Header Band */}
      <div className="relative bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent-special)] overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-[-40px] left-[-40px] w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-60px] right-[-30px] w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        </div>

        <div className="relative px-6 sm:px-8 py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-1">Student Portal</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Welcome back, {user?.name?.split(" ")[0] || "Student"}! 👋
              </h1>
              <p className="text-white/80 mt-2 text-base">
                Track your learning journey and celebrate your progress.
              </p>
            </div>

            {/* Quick stat pills */}
            {stats && (
              <div className="flex flex-wrap gap-2">
                <QuickPill icon={<TrendingUp className="w-3.5 h-3.5" />} label={`${stats.progress}% progress`} />
                <QuickPill icon={<Target className="w-3.5 h-3.5" />} label={`${stats.activeCourses} active`} />
                <QuickPill icon={<Clock className="w-3.5 h-3.5" />} label={`${stats.studyTime}h this week`} />
                <QuickPill icon={<Award className="w-3.5 h-3.5" />} label={`${stats.totalPoints} pts`} />
                {stats.rank && (
                  <QuickPill icon={<Trophy className="w-3.5 h-3.5" />} label={`Rank #${stats.rank}`} highlight />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div>
          <SectionLabel>Overview</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
            <StatusCard
              icon={<Users className="w-5 h-5" />}
              value={stats?.enrolledCourses || 0}
              label="Enrolled"
              color="from-[var(--color-secondary)] to-[var(--color-primary)]"
              trend="Active now"
            />
            <StatusCard
              icon={<Award className="w-5 h-5" />}
              value={stats?.totalPoints || 0}
              label="Points Earned"
              color="from-[var(--color-primary)] to-[var(--color-accent)]"
              trend="Keep learning!"
            />
            <StatusCard
              icon={<Trophy className="w-5 h-5" />}
              value={stats?.rank ? `#${stats.rank}` : "N/A"}
              label="Leaderboard Rank"
              color={
                stats?.rank && stats.rank <= 3
                  ? "from-[var(--color-accent)] to-[var(--color-accent-special)]"
                  : "from-[var(--color-secondary)] to-[var(--color-primary)]"
              }
              trend={stats?.rank && stats.rank <= 3 ? "🏆 Top performer!" : "Global ranking"}
            />
          </div>
        </div>

        {/* Course Table */}
        <div>
          <SectionLabel>My Enrolled Courses</SectionLabel>
          <div className="mt-3">
            <CourseTable enrollments={dashboardData?.recentEnrollments || []} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ——— Sub-components ——— */

function QuickPill({ icon, label, highlight = false }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
        highlight
          ? "bg-[var(--color-accent)] text-white shadow-md"
          : "bg-white/15 text-white backdrop-blur-sm border border-white/20"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 w-1 rounded-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)]" />
      <h2 className="text-lg font-bold text-[var(--color-text)]">{children}</h2>
    </div>
  );
}