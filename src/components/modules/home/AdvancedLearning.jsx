"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AdvancedLearning() {
  return (
    <section className="text-white bg-black py-16 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="container px-4 mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 border border-orange-500/40 mb-3">
            Advanced Learning
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-snug">
            Creating a community of learners.
          </h2>

          <p className="mb-8 leading-relaxed text-gray-300">
            We're dedicated to transforming education by providing a diverse range of high-quality courses that cater to learners of all levels.
          </p>

          <ul className="space-y-5">
            <motion.li
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-start gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="bg-[var(--color-primary)] text-white p-3 rounded-xl text-xl shadow-md">
                🌍
              </div>
              <div>
                <h4 className="font-semibold text-lg">
                  Learn from Anywhere
                </h4>
                <p className="text-sm text-gray-300">
                  Study from anywhere in the world, anytime that suits you best.
                </p>
              </div>
            </motion.li>

            <motion.li
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-start gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="bg-[var(--color-secondary)] text-white p-3 rounded-xl text-xl shadow-md">
                🎓
              </div>
              <div>
                <h4 className="font-semibold text-lg">
                  Expert Mentors
                </h4>
                <p className="text-sm text-gray-300">
                  Learn directly from industry experts and educators.
                </p>
              </div>
            </motion.li>

            <motion.li
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-start gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="bg-[var(--color-accent)] text-white p-3 rounded-xl text-xl shadow-md shadow-orange-500/20">
                💼
              </div>
              <div>
                <h4 className="font-semibold text-lg">
                  Learn In-Demand Skills
                </h4>
                <p className="text-sm text-gray-300">
                  Master the latest skills and tools required in modern careers.
                </p>
              </div>
            </motion.li>
          </ul>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="relative flex flex-col items-center md:items-end gap-6"
        >
          <div className="relative w-72 md:w-80 group">
            <Image
              src="/images/student-1.jpg"
              alt="Smiling student with notebook"
              width={320}
              height={400}
              className="rounded-3xl shadow-2xl object-cover w-full border-2 border-white/20 transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}