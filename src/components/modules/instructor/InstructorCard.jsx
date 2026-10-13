import Link from "next/link";
import { FiBookOpen, FiClock } from "react-icons/fi";



export default function InstructorCard({ instructor }) {
  const imageSrc = instructor?.userId?.picture && !instructor.userId.picture.includes('placeholder')
    ? instructor.userId.picture
    : '/images/ins1.jpg';

  return (
    <div className="group bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Image */}
      <div className="relative w-full h-56 sm:h-64 bg-gradient-to-b from-slate-50 to-emerald-50/20 overflow-hidden flex items-center justify-center p-3">
        <img
          src={imageSrc}
          alt={instructor?.userId?.name || 'Instructor'}
          className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/ins1.jpg";
          }}
        />
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Name + Role */}
          <h3 className="text-[var(--color-text)] font-semibold text-base hover:text-[var(--color-primary)] transition-colors">
            <Link href={`/instructors/${instructor._id}`}>{instructor?.userId?.name}</Link>
          </h3>
          <p className="text-gray-600 text-sm mb-3">{instructor?.designation || "Instructor"}</p>
        </div>

        {/* Lessons + Duration */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {instructor?.noOfCourse ? (
              <FiBookOpen className="w-4 h-4 text-[var(--color-primary)]" />
            ) : null}
            <span>{instructor?.noOfCourse ? instructor.noOfCourse + "+ Courses" : "0 Courses"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
