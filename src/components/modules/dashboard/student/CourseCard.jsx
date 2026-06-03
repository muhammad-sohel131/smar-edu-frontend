"use client";

import { PlayCircle, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function CourseCard({ course }) {
  const isCompleted = course?.status === "completed";
  const isEnrolled = course?.status === "enrolled";
  const progress = course?.progress || 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10">
        {course?.course?.thumbnail ? (
          <img
            src={course.course.thumbnail}
            alt={course?.course?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-[var(--color-primary)]/40" />
          </div>
        )}
        {/* Status overlay badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
              isCompleted
                ? "bg-emerald-500 text-white"
                : isEnrolled
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white/90 text-gray-700"
            }`}
          >
            {isCompleted ? (
              <><CheckCircle className="w-3 h-3" /> Completed</>
            ) : isEnrolled ? (
              <><Clock className="w-3 h-3" /> In Progress</>
            ) : (
              course?.course?.category
            )}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[var(--color-text)] text-sm leading-snug line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
          {course?.course?.title}
        </h3>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-1.5">
            <span>Progress</span>
            <span className="font-semibold text-[var(--color-text)]">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted
                  ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                  : "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-bold text-[var(--color-primary)]">
            {course?.course?.price ? `৳${course.course.price}` : "Free"}
          </span>
          <Link href={`/course/${course?.course?.slug}`}>
            <button
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                  : "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white hover:shadow-md hover:shadow-[var(--color-primary)]/25"
              }`}
            >
              {isCompleted ? (
                <><CheckCircle className="w-3.5 h-3.5" /> Review</>
              ) : (
                <><PlayCircle className="w-3.5 h-3.5" /> Continue</>
              )}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
