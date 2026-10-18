"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/modules/special/Searchbar";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/apiClient";
import { motion } from "framer-motion";
import HeroIllustration from "./HeroIllustration";

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

// 🎯 Main Hero Section (Default Export)
export default function HeroSection() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const { data: categoriesData } = useCategories()
  const categories = categoriesData?.data?.categories || [];
 

  const handleCategoryChange = (selectedCatValue) => {
    setCategory(selectedCatValue);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    // Construct search URL with parameters
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set('search', query.trim());
    }
    if (category) {
      const selected = categories.find(
        (c) =>
          String(c._id) === String(category) ||
          c.slug === category ||
          c.title?.toLowerCase() === category?.toLowerCase() ||
          c.value === category
      );
      const catParam = selected?.title
        ? selected.title.toLowerCase().replace(/\s+/g, '_')
        : String(category).toLowerCase().replace(/\s+/g, '_');
      params.set('categories', catParam);
    }

    // Redirect to courses page with search parameters
    const searchUrl = `/courses${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(searchUrl);
  };

  return (
    <section className="relative">
      {/* 🎥 Background Video */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        src="/videos/background.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-white/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/20 via-[var(--color-secondary)]/20 to-[var(--color-accent)]/10 mix-blend-multiply" />

      {/* 🌟 Main Content */}
      <section className="relative mx-auto flex min-h-[90vh] flex-col items-center justify-center overflow-hidden py-16">
        <div className="container mx-auto flex flex-col-reverse items-center justify-between gap-12 px-4 md:flex-col lg:flex-row">
          {/* Left Side */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold bg-orange-50 text-[var(--color-accent)] border border-orange-200/80 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                The Leader in Online Learning
              </span>

              <h1 className="mb-3 text-4xl font-bold leading-tight text-[var(--color-text)] md:text-5xl">
                Find the{" "}
                <span className="relative text-[var(--color-primary)]">
                  Best Courses
                  <svg
                    className="absolute left-0 -bottom-4 w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1283 132"
                  >
                    <path
                      d="M1282.46 5.79c-.91-3.88-5.18-6.65-9.04-5.54-104.37 29.02-193.78 56.87-361.6 74.53-268.41 28.16-539.6 14.6-803.08-26.38C94.9 47.97-.34 26.24.08 41.38c-1.56 14.21 19.47 12.91 29.6 17.24 32.82 8.6 66.1 15.33 99.4 21.81 238.99 44.43 482.98 55.29 725.63 49.01 92.37-4.11 185.68-9.96 275.51-33.09 18.68-6.31 42.79-9.21 55.18-25.89 6.76-13.28-12.41-21.16-13.83-6.12-17.69 11.67-39.31 15.61-59.45 21.34-114.56 25.18-245.31 30.46-361.99 30.36-191.39.45-383.13-10.13-572-42.21 277.31 36.42 560.77 44.96 837.82 2.23 104.21-15.4 195.11-42.74 260.97-61.22a7.57 7.57 0 0 0 5.54-9.05Z"
                      fill="#F97316"
                    />
                  </svg>
                </span>{" "}
                from the{" "}
                <span className="text-[var(--color-accent)]">
                  Best Mentors
                </span>{" "}
                Around the World
              </h1>

              <p className="mb-4 max-w-xl text-[var(--color-text)]/85 text-base md:text-lg">
                Our specialized online courses are designed to bring the classroom experience to you, no matter where you are.
              </p>
            </motion.div>

            {/* 🔍 Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="w-full rounded-xl p-1"
            >
              <div className="flex flex-col gap-2 md:flex-row md:gap-3">
                <SearchBar
                  category={category}
                  query={query}
                  onCategoryChange={handleCategoryChange}
                  onQueryChange={setQuery}
                  onSubmit={handleSubmit}
                  categories={categories}
                />
              </div>
            </motion.div>
          </div>

          {/* Right Side - Interactive 3D Mockup with In-Image Animated Icons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 40 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-1 justify-center md:justify-end relative mt-6 md:mt-0"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </section>
    </section>
  );
}