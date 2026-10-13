import React from "react";

export default function PageBanner({
  badgeIcon: BadgeIcon,
  badgeSubIcon: BadgeSubIcon,
  title,
  description,
  children,
  className = "",
}) {
  return (
    <section className={`relative bg-gradient-to-r from-[#059669] to-[#0f9293] text-white overflow-hidden py-16 sm:py-20 shadow-md ${className}`}>
      {/* Ambient decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.07)_0%,transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Centered Badge Icon */}
        {BadgeIcon && (
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center transform rotate-6 shadow-2xl transition-transform duration-300 hover:rotate-0">
                <BadgeIcon className="w-10 h-10 text-white drop-shadow-md" />
              </div>
              {BadgeSubIcon && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <BadgeSubIcon className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight text-white drop-shadow-sm">
          {title}
        </h1>

        {/* Subtitle */}
        {description && (
          <p className="text-lg sm:text-xl text-emerald-50/95 max-w-2xl mx-auto leading-relaxed font-normal">
            {description}
          </p>
        )}

        {/* Optional Children */}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
