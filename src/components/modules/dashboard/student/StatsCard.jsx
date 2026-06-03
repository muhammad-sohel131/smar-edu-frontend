import React from "react";

const StatusCard = ({ icon, value, label, color = "from-[var(--color-primary)] to-[var(--color-secondary)]", trend }) => {
  return (
    <div className="group relative bg-white rounded-2xl p-5 w-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 hover:border-[var(--color-primary)]/20 overflow-hidden">
      {/* Subtle background pattern on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/3 to-[var(--color-secondary)]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon */}
      <div className={`relative inline-flex p-3 rounded-xl bg-gradient-to-br ${color} mb-4 shadow-md`}>
        <div className="text-white">
          {icon}
        </div>
      </div>

      {/* Value and label */}
      <div className="relative mb-3">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">{value}</h2>
        <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
      </div>

      {/* Trend indicator */}
      {trend && (
        <div className="relative inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--color-primary)]/8 text-[var(--color-primary)]">
          <span>{trend}</span>
        </div>
      )}

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </div>
  );
};

export default StatusCard;