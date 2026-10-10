"use client";

import { motion } from "framer-motion";

export default function OurBenefits() {
  const benefits = [
    {
      title: "Flexible Learning",
      desc: "We believe that high-quality education should be accessible to everyone. Our pricing form in models are designed.",
      icon: "📘",
      gradient: "from-indigo-100 via-purple-50 to-pink-50",
    },
    {
      title: "Lifetime Access",
      desc: "When you enroll in our courses, you're not just signing up for a temporary learning to experience you're making.",
      icon: "📕",
      gradient: "from-pink-100 via-rose-50 to-red-50",
    },
    {
      title: "Expert Instruction",
      desc: "Our instructors are seasoned professionals with years of experience in their respective fields & Experts advice.",
      icon: "🎓",
      gradient: "from-blue-100 via-cyan-50 to-teal-50",
    },
  ];

  return (
    <section className="w-full bg-white z-10 py-16">
      <div className="container mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-2">
            Our Benefits
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-3">
            Master the Skills to Drive your Career
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            The right course, guided by an expert mentor, can provide invaluable insights, practical skills.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`rounded-[var(--radius-card)] shadow-md bg-gradient-to-br ${item.gradient} p-7 flex flex-col items-start justify-center transition-all duration-300 border border-white/60`}
            >
              <div className="text-4xl mb-4 bg-white/80 p-3 rounded-2xl shadow-sm">{item.icon}</div>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-left text-gray-700 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}