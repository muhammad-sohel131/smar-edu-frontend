"use client";

import { motion } from "framer-motion";

export default function StudentSuccess() {
  return (
    <section className="w-full bg-white pt-16 pb-24 px-4 overflow-hidden">
      <div className="container px-0 mx-auto relative">
        {/* Image Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative rounded-3xl overflow-visible shadow-2xl"
        >
          <img
            src="/images/students-group.jpg"
            alt="Happy Students"
            className="w-full h-[450px] md:h-[420px] object-cover rounded-3xl"
          />

          {/* Stats Box */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 -bottom-12 mx-auto w-[92%] md:w-[85%] bg-gradient-to-r from-[var(--color-primary)] to-emerald-600 text-white rounded-2xl shadow-2xl p-6 md:p-9 border-2 border-white/20 backdrop-blur-sm"
          >
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-left">
              <div className="p-2">
                <h3 className="font-bold text-xl md:text-2xl mb-1">
                  15,000+
                </h3>
                <p className="text-sm font-medium text-emerald-100">
                  Students Worldwide Since 2020
                </p>
              </div>
              <div className="p-2 border-t md:border-t-0 md:border-l border-white/20 md:pl-6">
                <h3 className="font-bold text-xl md:text-2xl mb-1">
                  9.8 / 10
                </h3>
                <p className="text-sm font-medium text-emerald-100">
                  Course Approval & Satisfaction Rate
                </p>
              </div>
              <div className="p-2 border-t md:border-t-0 md:border-l border-white/20 md:pl-6">
                <h3 className="font-bold text-xl md:text-2xl mb-1">
                  13,000+
                </h3>
                <p className="text-sm font-medium text-emerald-100">
                  Certified Learners Graduated
                </p>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-5 text-sm italic bg-black/15 p-3.5 rounded-xl border border-white/10 text-center md:text-left">
              “All courses are structured and taught with exceptional quality to help achieve your career goals.”
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}