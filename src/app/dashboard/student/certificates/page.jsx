"use client";
import { Award, Download } from "lucide-react";
import Image from "next/image";

export default function CertificatesPage() {
  const certificates = [
    {
      id: 1,
      course: "React for Beginners",
      instructor: "John Smith",
      date: "2024-09-10",
      image: "/images/certificate-1.jpg", 
    },
    {
      id: 2,
      course: "Advanced Next.js",
      instructor: "Emily Johnson",
      date: "2024-10-01",
      image: "/images/certificate-1.jpg",
    },
    {
      id: 3,
      course: "Tailwind CSS Mastery",
      instructor: "Michael Brown",
      date: "2024-10-05",
      image: "/images/certificate-1.jpg",
    },
  ];

  return (
    <div className="text-[var(--color-text)] space-y-8">
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

      {/* Certificates Grid */}
      {certificates.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 border-t-2 border-t-[var(--color-primary)] flex flex-col overflow-hidden"
            >
              {/* Certificate Preview */}
              <div className="relative w-full h-40 overflow-hidden">
                <Image
                  src={cert.image}
                  alt={cert.course}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="p-4 flex-1">
                <h2 className="text-base font-semibold text-[var(--color-text)] leading-snug">
                  {cert.course}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Instructor: {cert.instructor}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Issued on {cert.date}
                </p>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {certificates.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 flex items-center justify-center mb-5">
            <Award className="text-[var(--color-primary)] w-9 h-9" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text)]">
            No certificates yet
          </h3>
          <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
            Complete a course to earn your first certificate.
          </p>
        </div>
      )}
    </div>
  );
}
