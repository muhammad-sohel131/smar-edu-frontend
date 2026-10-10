"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/apiClient";
import { motion } from "framer-motion";

const useCategories = () => {
  return useQuery({
    queryKey: ['course-categories'],
    queryFn: async () => {
      const res = await api.get('/courses/categories', { params: { limit: 100 } });
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
};

export default function TopCategories() {
  const { data: categoriesData } = useCategories();
  const rawCategories = categoriesData?.data?.categories || [];

  // Filter valid categories
  const categories = useMemo(() => {
    return rawCategories.filter((cat) => cat && cat.title);
  }, [rawCategories]);

  // Seamless repeat count for infinite scrolling
  const repeatCount = useMemo(() => {
    if (categories.length === 0) return 1;
    return Math.max(4, Math.ceil(20 / categories.length));
  }, [categories]);

  const displayCategories = useMemo(() => {
    if (categories.length === 0) return [];
    return Array(repeatCount).fill(categories).flat();
  }, [categories, repeatCount]);

  const scrollerRef = useRef(null);
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef(null);

  // Auto slow scrolling loop
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || displayCategories.length === 0) return;

    let animId;
    const speed = 0.65; // Smooth slow scroll speed

    const step = () => {
      if (!isPausedRef.current && el) {
        el.scrollLeft += speed;

        const singleSetWidth = el.scrollWidth / repeatCount;
        // Seamless loop wrap
        if (singleSetWidth > 0 && el.scrollLeft >= singleSetWidth * (repeatCount - 1)) {
          el.scrollLeft -= singleSetWidth;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    const pause = () => {
      isPausedRef.current = true;
    };
    const resume = () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      isPausedRef.current = false;
    };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume);

    return () => {
      cancelAnimationFrame(animId);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, [displayCategories, repeatCount]);

  // Manual Arrow controls with temporary pause on auto-scroll
  const scrollStep = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;

    // Pause auto-scroll briefly when arrow is clicked
    isPausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 2500);

    const card = el.querySelector("[data-card]");
    const gap = 20;
    const step = (card?.offsetWidth || 220) + gap;

    if (dir === "left") {
      const singleSetWidth = el.scrollWidth / repeatCount;
      if (el.scrollLeft <= step) {
        el.scrollLeft += singleSetWidth;
      }
      el.scrollBy({ left: -step * 2, behavior: "smooth" });
    } else {
      const singleSetWidth = el.scrollWidth / repeatCount;
      if (el.scrollLeft >= singleSetWidth * (repeatCount - 1) - step * 2) {
        el.scrollLeft -= singleSetWidth;
      }
      el.scrollBy({ left: step * 2, behavior: "smooth" });
    }
  };

  // Drag / swipe interaction support
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e) => {
      isDown = true;
      isPausedRef.current = true;
      startX = "touches" in e ? e.touches[0].pageX : e.pageX;
      startScroll = el.scrollLeft;
    };

    const onMove = (e) => {
      if (!isDown) return;
      const x = "touches" in e ? e.touches[0].pageX : e.pageX;
      const delta = x - startX;
      el.scrollLeft = startScroll - delta;
    };

    const onUp = () => {
      if (!isDown) return;
      isDown = false;
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = setTimeout(() => {
        isPausedRef.current = false;
      }, 1500);
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <section className="w-full bg-[var(--color-background)] py-14 relative overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-[var(--color-primary)] font-semibold text-sm mb-2">
            Our Categories
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-3">
            Top Courses & Categories
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            The right course, guided by an expert mentor, can provide invaluable insights, practical skills.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="relative group/carousel"
        >
          {/* Gradient edges for visual fading */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-14 bg-gradient-to-r from-[var(--color-background)] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-14 bg-gradient-to-l from-[var(--color-background)] to-transparent z-10" />

          <div
            ref={scrollerRef}
            id="scrollContainer"
            role="region"
            aria-label="Top categories"
            className="flex gap-5 overflow-x-auto scrollbar-hide py-2 px-4 select-none cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayCategories.map((item, i) => (
              <Link
                href={`/courses?categories=${item?.title?.toLowerCase().replace(/\s+/g, '_')}`}
                key={`${item?.title || 'cat'}-${i}`}
                data-card
                className="cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-lg py-3 px-4 md:py-3.5 md:px-5 flex flex-col items-center justify-center transition-all duration-300 min-w-[190px] sm:min-w-[210px] md:min-w-[230px] border border-gray-100 hover:border-emerald-200 group flex-shrink-0 hover:-translate-y-0.5"
                aria-label={item.title}
              >
                {/* Large image container */}
                <div className="w-32 h-20 sm:w-36 sm:h-22 md:w-40 md:h-24 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center mb-2.5 shadow-inner border border-gray-100 group-hover:border-emerald-300 transition-colors">
                  <img
                    src={item.image || "/images/ins1.jpg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/ins1.jpg";
                    }}
                  />
                </div>

                <h3 className="text-[var(--color-text)] group-hover:text-[var(--color-primary)] font-semibold text-sm md:text-base text-center line-clamp-1 transition-colors px-1">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>

          {/* Controls (desktop) */}
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollStep("left")}
            className="hidden md:flex absolute left-2 top-[48%] -translate-y-1/2 p-2.5 rounded-full shadow-lg bg-white/95 hover:bg-[var(--color-primary)] hover:text-white text-gray-700 transition duration-200 z-20 border border-gray-100 hover:scale-105"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollStep("right")}
            className="hidden md:flex absolute right-2 top-[48%] -translate-y-1/2 p-2.5 rounded-full shadow-lg bg-white/95 hover:bg-[var(--color-primary)] hover:text-white text-gray-700 transition duration-200 z-20 border border-gray-100 hover:scale-105"
          >
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}