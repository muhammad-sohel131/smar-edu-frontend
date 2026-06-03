"use client";

import CourseCard from "@/components/modules/dashboard/student/CourseCard";
import { useAuth } from "@/hooks/useAuth";
import { useEnrollmentCourses } from "@/hooks/useCourse";
import { useMemo, useState } from "react";
import Link from "next/link";

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState("enrolled");

  const { user, loading: authLoading } = useAuth();
  const { data, loading: courseLoading } = useEnrollmentCourses(user?._id);

  // Calculate counts for each status using useMemo for performance
  const courseCounts = useMemo(() => {
    if (!data) return { enrolled: 0, completed: 0 };

    return data.reduce((acc, enrollment) => {
      const status = enrollment.status || 'enrolled';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, { enrolled: 0, completed: 0 });
  }, [data]);

  if (authLoading || courseLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  const filteredCourses = data?.filter((enrollment) => {
    const status = enrollment.status || 'enrolled';
    return status === activeTab;
  });

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-7 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full" />
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Enrolled Courses
          </h1>
        </div>
        <p className="text-gray-500 text-sm pl-4">
          Track your learning journey — manage your enrolled and completed courses.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-white rounded-xl border border-gray-100 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab("enrolled")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "enrolled"
              ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-sm"
              : "bg-white text-[var(--color-text)]/60 border border-gray-200 hover:border-[var(--color-primary)]/30"
          }`}
        >
          Enrolled ({courseCounts.enrolled})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "completed"
              ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-sm"
              : "bg-white text-[var(--color-text)]/60 border border-gray-200 hover:border-[var(--color-primary)]/30"
          }`}
        >
          Completed ({courseCounts.completed})
        </button>
      </div>

      {/* Courses */}
      {filteredCourses?.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No {activeTab} courses found</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            {activeTab === 'enrolled'
              ? "You haven't enrolled in any courses yet. Browse our course catalog to get started!"
              : "You haven't completed any courses yet. Keep learning to see your completed courses here!"
            }
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-md hover:shadow-[var(--color-primary)]/25 transition-all"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses?.map((enrollment) => (
            <CourseCard key={enrollment?._id} course={enrollment} />
          ))}
        </div>
      )}
    </div>
  );
}
