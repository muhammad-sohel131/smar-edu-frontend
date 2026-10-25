"use client";
import { useState } from "react";
import { Award, Download, Loader2, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import api from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

export default function CertificatesPage() {
  const [downloadingId, setDownloadingId] = useState(null);

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ["myCertificates"],
    queryFn: async () => {
      const res = await api.get("/enrollments/me");
      return res.data?.data || [];
    },
    refetchOnWindowFocus: false,
  });

  const completedCertificates = enrollments.filter(
    (item) => item.status === "completed"
  );

  const handleDownload = async (courseId, courseTitle) => {
    try {
      setDownloadingId(courseId);
      const response = await api.get(`/certificates/${courseId}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${courseTitle || "Course"}-Certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Failed to download certificate:", error);
      toast.error("Failed to download certificate. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="text-[var(--color-text)] px-6 sm:px-8 py-8 space-y-8">
      {/* Gradient Banner Header */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent-special)] px-8 py-10 flex items-center gap-5 shadow-md">
        <div className="flex-shrink-0 bg-white/20 rounded-full p-3">
          <Award className="text-white w-10 h-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            My Certificates
          </h1>
          <p className="text-white/80 text-sm mt-1">
            View and download certificates you&apos;ve earned by completing courses.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 text-gray-500 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
          <span className="font-medium">Loading your certificates...</span>
        </div>
      )}

      {/* Certificates Grid */}
      {!isLoading && completedCertificates.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {completedCertificates.map((item) => {
            const courseObj = typeof item.course === "object" ? item.course : {};
            const courseId = courseObj._id || item.course;
            const courseTitle = courseObj.title || "Completed Course";
            const instructorName =
              item.instructor?.name || courseObj.instructor?.name || "Engr. Kawsar Ahmed";
            const completionDate = item.completedAt
              ? new Date(item.completedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Completed";

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-emerald-500 flex flex-col overflow-hidden hover:shadow-md transition-all duration-200"
              >
                {/* Certificate Banner/Preview */}
                <div className="relative w-full h-44 bg-gradient-to-br from-emerald-600 via-teal-700 to-indigo-900 p-6 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <span className="text-xs uppercase tracking-widest font-bold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      Verified Certificate
                    </span>
                    <Award className="w-8 h-8 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg line-clamp-2 text-white">
                      {courseTitle}
                    </h3>
                    <p className="text-xs text-emerald-100 mt-1">
                      Certificate of Completion
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-900">Instructor:</strong> {instructorName}
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Issued on:</strong> {completionDate}
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      100% Completed
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 pb-5 pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => handleDownload(courseId, courseTitle)}
                    disabled={downloadingId === courseId}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {downloadingId === courseId ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Download Certificate (PDF)
                      </>
                    )}
                  </button>

                  <Link
                    href={`/course/${courseId}`}
                    className="w-full text-center text-xs text-gray-500 hover:text-emerald-600 font-medium py-1 transition"
                  >
                    Go to Course Page →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && completedCertificates.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 flex items-center justify-center mb-5">
            <Award className="text-[var(--color-primary)] w-9 h-9" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text)]">
            No certificates yet
          </h3>
          <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto mb-6">
            Complete all lessons in a course to earn your verified certificate.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition"
          >
            <BookOpen size={16} />
            Explore Courses
          </Link>
        </div>
      )}
    </div>
  );
}

