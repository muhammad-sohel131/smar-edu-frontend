"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
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

  // Seamless repeat count for infinite carousel
  const repeatCount = useMemo(() => {
    if (categories.length === 0) return 1;
    return Math.max(11, Math.ceil(40 / categories.length));
  }, [categories]);

  const displayCategories = useMemo(() => {
    if (categories.length === 0) return [];
    return Array(repeatCount).fill(categories).flat();
  }, [categories, repeatCount]);

  // Start in the middle set of categories
  const middleStartIndex = useMemo(() => {
    if (categories.length === 0) return 0;
    return Math.floor(repeatCount / 2) * categories.length;
  }, [categories, repeatCount]);

  const [currentIndex, setCurrentIndex] = useState(middleStartIndex);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const containerRef = useRef(null);
  const resumeTimeoutRef = useRef(null);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // Sync starting index when categories load
  useEffect(() => {
    if (middleStartIndex > 0) {
      setCurrentIndex(middleStartIndex);
    }
  }, [middleStartIndex]);

  // Track container width for dead-center calculations
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  // Card dimensions (responsive)
  const isMobile = containerWidth < 768;
  const cardWidth = isMobile ? 220 : 270;
  const cardGap = isMobile ? 18 : 26;
  const itemStep = cardWidth + cardGap;

  // Auto-advance every 3 seconds (3s fixed thakbe then abar change hobe)
  useEffect(() => {
    if (categories.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [categories.length, isPaused]);

  // Seamless wrap-around reset when reaching outer bounds
  useEffect(() => {
    if (categories.length === 0) return;

    const lowerBound = categories.length * 2;
    const upperBound = categories.length * (repeatCount - 2);

    if (currentIndex >= upperBound || currentIndex <= lowerBound) {
      // Normalise to middle block silently without jump
      const normalized = middleStartIndex + (currentIndex % categories.length);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(normalized);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        });
      }, 600); // Wait for current slide transition to finish
      return () => clearTimeout(timer);
    }
  }, [currentIndex, categories.length, middleStartIndex, repeatCount]);

  const pauseAutoPlay = useCallback(() => {
    setIsPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  }, []);

  const resumeAutoPlay = useCallback((delay = 3500) => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, delay);
  }, []);

  // Controls
  const handlePrev = () => {
    pauseAutoPlay();
    setCurrentIndex((prev) => prev - 1);
    resumeAutoPlay();
  };

  const handleNext = () => {
    pauseAutoPlay();
    setCurrentIndex((prev) => prev + 1);
    resumeAutoPlay();
  };

  const handleDotClick = (categoryIdx) => {
    if (categories.length === 0) return;
    pauseAutoPlay();
    const currentCategoryIdx = currentIndex % categories.length;
    let diff = categoryIdx - currentCategoryIdx;
    setCurrentIndex((prev) => prev + diff);
    resumeAutoPlay();
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    pauseAutoPlay();
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    } else {
      resumeAutoPlay();
    }
  };

  // Mathematical center offset: placing currentIndex dead center
  const trackTranslateX = containerWidth / 2 - (currentIndex * itemStep + cardWidth / 2);

  const activeCategoryIndex = categories.length > 0 ? (currentIndex % categories.length) : 0;

  return (
    <section className="w-full bg-[var(--color-background)] py-14 relative overflow-hidden select-none">
      <div className="container mx-auto px-4 text-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/60 mb-2.5">
            Our Categories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-3">
            Top Courses & Categories
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm md:text-base">
            The right course, guided by an expert mentor, can provide invaluable insights, practical skills.
          </p>
        </motion.div>

        {/* Carousel Viewport Container */}
        <div
          ref={containerRef}
          onMouseEnter={pauseAutoPlay}
          onMouseLeave={() => resumeAutoPlay(1000)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full pt-10 pb-12 overflow-hidden"
          role="region"
          aria-label="Categories carousel"
        >
          {/* Gradient Edge Masks */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-14 md:w-36 bg-gradient-to-r from-[var(--color-background)] to-transparent z-20" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-14 md:w-36 bg-gradient-to-l from-[var(--color-background)] to-transparent z-20" />

          {/* Left Arrow Control */}
          <button
            type="button"
            aria-label="Previous Category"
            onClick={handlePrev}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full shadow-xl bg-white/95 hover:bg-[var(--color-accent)] hover:text-white text-gray-700 flex items-center justify-center transition-all duration-200 z-30 border border-gray-100 hover:scale-110 active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Right Arrow Control */}
          <button
            type="button"
            aria-label="Next Category"
            onClick={handleNext}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full shadow-xl bg-white/95 hover:bg-[var(--color-accent)] hover:text-white text-gray-700 flex items-center justify-center transition-all duration-200 z-30 border border-gray-100 hover:scale-110 active:scale-95"
          >
            <ArrowRight size={20} />
          </button>

          {/* Carousel Track */}
          <div
            className="flex items-center"
            style={{
              transform: `translateX(${trackTranslateX}px)`,
              transition: isTransitioning ? "transform 650ms cubic-bezier(0.25, 1, 0.5, 1)" : "none",
            }}
          >
            {displayCategories.map((item, idx) => {
              const isCenter = idx === currentIndex;
              const distance = Math.abs(idx - currentIndex);
              const isImmediateNeighbor = distance === 1;

              return (
                <div
                  key={`${item?.title || 'cat'}-${idx}`}
                  style={{
                    width: `${cardWidth}px`,
                    marginRight: `${cardGap}px`,
                    flexShrink: 0,
                  }}
                  className={`relative py-3 transition-all duration-500 ease-out origin-center ${
                    isCenter ? "z-20 scale-105 md:scale-110" : isImmediateNeighbor ? "z-10 scale-95 opacity-75" : "z-0 scale-90 opacity-40"
                  }`}
                >
                  <Link
                    href={`/courses?categories=${item?.title?.toLowerCase().replace(/\s+/g, '_')}`}
                    onClick={(e) => {
                      if (!isCenter) {
                        e.preventDefault();
                        pauseAutoPlay();
                        setCurrentIndex(idx);
                        resumeAutoPlay();
                      }
                    }}
                    className={`block w-full bg-white rounded-2xl p-3.5 md:p-4 text-center cursor-pointer transition-all duration-500 relative group ${
                      isCenter
                        ? "shadow-2xl shadow-orange-500/20 border-2 border-[var(--color-accent)] ring-4 ring-orange-100/70"
                        : "shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-md"
                    }`}
                  >
                    {/* Featured Center Badge */}
                    {isCenter && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md z-30 whitespace-nowrap animate-in fade-in duration-300">
                        Featured
                      </span>
                    )}

                    {/* Image Container */}
                    <div
                      className={`w-full rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center mb-3 shadow-inner border border-gray-100 transition-all duration-500 ${
                        isCenter ? "h-28 sm:h-32 md:h-36 border-orange-200" : "h-24 sm:h-28 md:h-28"
                      }`}
                    >
                      <img
                        src={item.image || "/images/ins1.jpg"}
                        alt={item.title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isCenter ? "scale-105" : "group-hover:scale-105"
                        }`}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/ins1.jpg";
                        }}
                      />
                    </div>

                    {/* Category Title */}
                    <h3
                      className={`font-semibold line-clamp-1 transition-colors px-1 ${
                        isCenter
                          ? "text-base md:text-lg font-bold text-gray-900 group-hover:text-[var(--color-accent)]"
                          : "text-xs md:text-sm text-gray-700"
                      }`}
                    >
                      {item.title}
                    </h3>

                    {/* Explore Link Indicator on Center Card */}
                    {isCenter && (
                      <div className="mt-1.5 flex items-center justify-center gap-1 text-[11px] md:text-xs font-semibold text-[var(--color-accent)]">
                        <span>Explore Courses</span>
                        <span>→</span>
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Dots Indicator */}
        {categories.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {categories.map((cat, idx) => {
              const isActive = activeCategoryIndex === idx;
              return (
                <button
                  key={`dot-${cat.title || idx}`}
                  type="button"
                  onClick={() => handleDotClick(idx)}
                  aria-label={`Go to category ${cat.title}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-8 bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm shadow-orange-500/30"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}