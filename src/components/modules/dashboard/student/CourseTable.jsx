import React, { useState, useMemo } from "react";
import { Calendar, User, ArrowRight, Eye, Download, Clock, CheckCircle, PlayCircle, Search, Filter, BookOpen } from "lucide-react";
import Link from "next/link";

// Utility: slug from title
const generateSlug = (title) => {
  if (!title) return "";
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

const CourseTable = ({ enrollments = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const courses = useMemo(() => {
    return enrollments.map((enrollment) => {
      const course = enrollment.course || {};
      const instructor = course.instructor || {};
      return {
        id: enrollment._id,
        name: course.title || "Unknown Course",
        instructor: instructor.name || "Unknown Instructor",
        date: enrollment.createdAt
          ? new Date(enrollment.createdAt).toLocaleDateString("en-GB")
          : "N/A",
        status: enrollment.status === "completed" ? "Completed" : "Ongoing",
        progress: enrollment.progress || 0,
        duration: course.duration || "N/A",
        category: course.category || "General",
        nextLesson: enrollment.nextLesson || null,
        courseId: course._id,
        slug: course.slug || generateSlug(course.title) || course._id,
        enrollmentId: enrollment._id,
      };
    });
  }, [enrollments]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ||
        course.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [courses, searchTerm, statusFilter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Ongoing":
        return "bg-[var(--color-primary)]/8 text-[var(--color-primary)] border border-[var(--color-primary)]/20";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const getProgressColor = (status) =>
    status === "Completed"
      ? "from-emerald-400 to-emerald-500"
      : "from-[var(--color-primary)] to-[var(--color-secondary)]";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-[var(--color-primary)]/3 to-[var(--color-secondary)]/3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">My Enrolled Courses</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Track your learning progress across all enrolled courses
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all w-48 text-[var(--color-text)] placeholder-gray-400 bg-white"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all appearance-none text-[var(--color-text)] bg-white"
              >
                <option value="All">All Status</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">No courses found</h3>
          <p className="text-sm text-gray-500 max-w-xs">
            {searchTerm || statusFilter !== "All"
              ? "Try adjusting your search or filter."
              : "You haven't enrolled in any courses yet. Explore our course catalog to get started!"}
          </p>
        </div>
      )}

      {/* Table */}
      {filteredCourses.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-[var(--color-background)]">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Instructor
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Status
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCourses.map((course, idx) => (
                <tr
                  key={idx}
                  className="group hover:bg-gradient-to-r hover:from-[var(--color-primary)]/3 hover:to-transparent transition-colors duration-200"
                >
                  {/* Course Details */}
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/15 to-[var(--color-secondary)]/15 flex items-center justify-center flex-shrink-0 group-hover:from-[var(--color-primary)]/20 group-hover:to-[var(--color-secondary)]/20 transition-all">
                        <PlayCircle className="w-5 h-5 text-[var(--color-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--color-text)] text-sm leading-tight group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                          {course.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="text-xs px-2 py-0.5 bg-[var(--color-secondary)]/8 text-[var(--color-secondary)] rounded-full font-medium">
                            {course.category}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {course.date}
                          </div>
                          {course.duration !== "N/A" && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              {course.duration}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Instructor */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                      </div>
                      <span className="text-sm font-medium text-[var(--color-text)] line-clamp-1">
                        {course.instructor}
                      </span>
                    </div>
                  </td>

                  {/* Progress */}
                  <td className="px-5 py-4">
                    <div className="space-y-1.5 min-w-[120px]">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">
                          {course.status === "Completed" ? "Finished" : `${100 - course.progress}% left`}
                        </span>
                        <span className="font-semibold text-[var(--color-text)]">{course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(course.status)} transition-all duration-700`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                        course.status
                      )}`}
                    >
                      {course.status === "Completed" ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {course.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4">
                    <Link href={`/course/${course.slug}`}>
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white text-xs font-semibold rounded-xl hover:shadow-md hover:shadow-[var(--color-primary)]/25 hover:-translate-y-0.5 transition-all duration-200">
                        {course.status === "Completed" ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            Review
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3.5 h-3.5" />
                            Continue
                          </>
                        )}
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer row count */}
          <div className="px-5 py-3.5 border-t border-gray-100 bg-[var(--color-background)] flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing <span className="font-semibold text-[var(--color-text)]">{filteredCourses.length}</span> of{" "}
              <span className="font-semibold text-[var(--color-text)]">{courses.length}</span> courses
            </p>
            <div className="flex items-center gap-1 text-xs text-[var(--color-primary)] font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              {courses.filter((c) => c.status === "Completed").length} completed
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseTable;