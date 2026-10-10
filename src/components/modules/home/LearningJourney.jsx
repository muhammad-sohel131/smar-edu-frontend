"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function LearningJourney() {
  const steps = [
    {
      id: "01",
      title: "Sign-Up or Register",
      desc: "Once you're on the website's homepage, look for the Sign-Up, Register, or Create Account button.",
    },
    {
      id: "02",
      title: "Complete Your Profile",
      desc: "After verifying your email, you may be asked to complete additional profile information.",
    },
    {
      id: "03",
      title: "Choose Courses or Programs",
      desc: "Depending on the website, after registration, you might be able to browse and choose courses or programs to enroll in.",
    },
    {
      id: "04",
      title: "Access Your Account",
      desc: "Should have access to the website's features, such as enrolling in courses, materials, or tracking progress.",
    },
  ];

  return (
    <section className="bg-[var(--color-background)] py-16 overflow-hidden">
      <div className="container px-4 mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16">
        {/* Left Image */}
        <motion.div
          initial={{ opacity: 0, x: -40, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
            <Image
              src="/images/learning-journey.jpg"
              alt="Learning Journey"
              width={520}
              height={420}
              className="object-cover w-full h-auto transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </motion.div>

        {/* Right Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-[var(--color-primary)] font-semibold mb-2">
            How it Works
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-4">
            Start your Learning Journey Today!
          </h2>
          <p className="text-[var(--color-text)] mb-6 opacity-90 leading-relaxed">
            Unlock Your Potential and Achieve Your Dreams with Our Comprehensive Learning Resources!
          </p>

          <div className="space-y-5">
            {steps.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: "easeOut" }}
                whileHover={{ x: 6 }}
                className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/60 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[var(--color-primary)] flex items-center justify-center text-lg font-bold shadow-sm flex-shrink-0">
                  {step.id}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[var(--color-text)] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text)]/80 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}