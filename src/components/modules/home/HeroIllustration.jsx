"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function HeroIllustration() {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  return (
    <div className="relative w-full max-w-xl group select-none">
      {/* Ambient Multi-Color Brand Glow Behind Image */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/30 via-orange-500/25 to-purple-600/25 rounded-[2.5rem] blur-3xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Main 3D Artwork Frame */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 dark:border-slate-800/90 bg-slate-950">
        <Image
          src="/images/hero-3d-mockup.jpg"
          alt="SmartEdu Hub Interactive Learning Platform"
          width={640}
          height={480}
          priority
          className="w-full h-auto object-cover rounded-2xl transform group-hover:scale-[1.01] transition-transform duration-700 ease-out"
        />

        {/* ============================================================== */}
        {/* ANIMATED LAYERS OVER IMAGE ICONS                               */}
        {/* ============================================================== */}

        {/* 1. 🚀 SPACE ROCKET (Top Center) - Thruster Flame & Smoke */}
        <div
          className="absolute z-10 cursor-pointer pointer-events-auto"
          style={{ left: "33%", top: "8%", width: "16%", height: "24%" }}
          onMouseEnter={() => setHoveredIcon("rocket")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {/* Flame Core Glow */}
          <motion.div
            animate={{
              scale: [0.9, 1.25, 0.9],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full blur-md bg-gradient-to-b from-orange-400 via-amber-300 to-transparent"
            style={{ left: "30%", top: "60%", width: "40%", height: "45%" }}
          />

          {/* Smoke Rings Rising & Expanding */}
          {[0, 0.4, 0.8].map((delay, idx) => (
            <motion.div
              key={`smoke-${idx}`}
              initial={{ scale: 0.5, opacity: 0.7, y: 0 }}
              animate={{
                scale: [0.5, 1.4, 1.8],
                opacity: [0.7, 0.4, 0],
                y: [0, 18, 30],
                x: [0, -6, -12],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: delay,
                ease: "easeOut",
              }}
              className="absolute rounded-full bg-white/40 blur-[2px] pointer-events-none"
              style={{ left: "32%", top: "72%", width: "22%", height: "22%" }}
            />
          ))}

          {/* Interactive Tooltip */}
          {hoveredIcon === "rocket" && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-orange-400 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-orange-500/30 backdrop-blur-md"
            >
              🚀 Launch Career
            </motion.div>
          )}
        </div>

        {/* 2. 🎓 GRADUATION CAP (Top Left) - Celestial Pulse & Gold Sparkle */}
        <div
          className="absolute z-10 cursor-pointer pointer-events-auto"
          style={{ left: "10%", top: "8%", width: "24%", height: "28%" }}
          onMouseEnter={() => setHoveredIcon("cap")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {/* Subtle Ambient Halo */}
          <motion.div
            animate={{
              scale: [0.95, 1.15, 0.95],
              opacity: [0.35, 0.75, 0.35],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-blue-500/25 blur-xl pointer-events-none"
            style={{ left: "15%", top: "15%", width: "70%", height: "70%" }}
          />

          {/* Gold Sparkle on Tassel */}
          <motion.div
            animate={{
              scale: [0, 1.3, 0],
              rotate: [0, 90, 180],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="absolute text-amber-300 text-xs font-bold pointer-events-none"
            style={{ left: "18%", top: "55%" }}
          >
            ✦
          </motion.div>

          {/* Gold Sparkle on 2024 Seal */}
          <motion.div
            animate={{
              scale: [0, 1.4, 0],
              rotate: [0, 45, 90],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
            className="absolute text-amber-300 text-xs font-bold pointer-events-none"
            style={{ left: "70%", top: "50%" }}
          >
            ✨
          </motion.div>

          {/* Interactive Tooltip */}
          {hoveredIcon === "cap" && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-blue-300 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-blue-500/30 backdrop-blur-md"
            >
              🎓 Certified Degrees
            </motion.div>
          )}
        </div>

        {/* 3. </> NEON CODE BRACKET (Top Middle Right) - Radiant Neon Pulse */}
        <div
          className="absolute z-10 cursor-pointer pointer-events-auto"
          style={{ left: "47%", top: "20%", width: "12%", height: "14%" }}
          onMouseEnter={() => setHoveredIcon("code")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {/* Intense Neon Pulsing Ring */}
          <motion.div
            animate={{
              scale: [0.92, 1.15, 0.92],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-2xl bg-orange-500/25 blur-lg border border-orange-400/40 pointer-events-none"
          />

          {/* Micro Energy Sparkles */}
          <motion.div
            animate={{
              y: [-2, -10],
              opacity: [1, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute -top-2 right-2 w-1.5 h-1.5 rounded-full bg-orange-300 blur-[1px] pointer-events-none"
          />

          {/* Interactive Tooltip */}
          {hoveredIcon === "code" && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-orange-400 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-orange-500/30 backdrop-blur-md"
            >
              💻 Real-World Code
            </motion.div>
          )}
        </div>

        {/* 4. 📡 SATELLITE (Top Right Corner) - Signal Wave Transmission */}
        <div
          className="absolute z-10 cursor-pointer pointer-events-auto"
          style={{ left: "82%", top: "10%", width: "12%", height: "16%" }}
          onMouseEnter={() => setHoveredIcon("satellite")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {/* Concentric Signal Radar Waves */}
          {[0, 0.7, 1.4].map((delay, idx) => (
            <motion.div
              key={`signal-${idx}`}
              initial={{ scale: 0.6, opacity: 0.9 }}
              animate={{
                scale: [0.6, 2.2],
                opacity: [0.9, 0],
              }}
              transition={{
                duration: 2.1,
                repeat: Infinity,
                delay: delay,
                ease: "easeOut",
              }}
              className="absolute rounded-full border border-sky-400/60 pointer-events-none"
              style={{ left: "15%", top: "35%", width: "35%", height: "35%" }}
            />
          ))}

          {/* Interactive Tooltip */}
          {hoveredIcon === "satellite" && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-sky-300 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-sky-500/30 backdrop-blur-md"
            >
              📡 24/7 Live Platform
            </motion.div>
          )}
        </div>

        {/* 5. 🏆 GOLD MEDALS & BADGES (Top Right) - Golden Shimmer & Sparkles */}
        <div
          className="absolute z-10 cursor-pointer pointer-events-auto"
          style={{ left: "73%", top: "20%", width: "22%", height: "18%" }}
          onMouseEnter={() => setHoveredIcon("medals")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {/* Medal 1 Sparkle */}
          <motion.div
            animate={{
              scale: [0, 1.3, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.0,
              repeat: Infinity,
              delay: 0.2,
              ease: "easeInOut",
            }}
            className="absolute text-yellow-300 text-sm font-bold pointer-events-none"
            style={{ left: "12%", top: "15%" }}
          >
            ✦
          </motion.div>

          {/* Medal 2 Sparkle */}
          <motion.div
            animate={{
              scale: [0, 1.4, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.0,
              repeat: Infinity,
              delay: 0.9,
              ease: "easeInOut",
            }}
            className="absolute text-amber-200 text-sm font-bold pointer-events-none"
            style={{ left: "48%", top: "30%" }}
          >
            ✨
          </motion.div>

          {/* Medal 3 Sparkle */}
          <motion.div
            animate={{
              scale: [0, 1.3, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.0,
              repeat: Infinity,
              delay: 1.5,
              ease: "easeInOut",
            }}
            className="absolute text-yellow-300 text-sm font-bold pointer-events-none"
            style={{ left: "78%", top: "45%" }}
          >
            ✦
          </motion.div>

          {/* Interactive Tooltip */}
          {hoveredIcon === "medals" && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-yellow-300 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-yellow-500/30 backdrop-blur-md"
            >
              🏆 Leaderboard Badges
            </motion.div>
          )}
        </div>

        {/* 6. 💻 CODE & CHARTS SCREEN (Center) - Holographic Scanning Beam */}
        <div
          className="absolute z-10 pointer-events-none overflow-hidden rounded-xl"
          style={{ left: "26%", top: "35%", width: "34%", height: "30%" }}
        >
          {/* Holographic Cyan Scanning Beam moving down */}
          <motion.div
            animate={{
              y: ["-20%", "220%"],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-full h-3 bg-gradient-to-b from-cyan-400/0 via-cyan-400/30 to-cyan-400/0 blur-[1px]"
          />

          {/* Chart Pulse Glow */}
          <motion.div
            animate={{
              opacity: [0.15, 0.45, 0.15],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-2 right-2 w-16 h-10 rounded-lg bg-cyan-400/20 blur-md"
          />
        </div>

        {/* 7. 📖 OPEN BOOK (Right Side) - Floating Knowledge Particles */}
        <div
          className="absolute z-10 cursor-pointer pointer-events-auto"
          style={{ left: "75%", top: "50%", width: "18%", height: "20%" }}
          onMouseEnter={() => setHoveredIcon("book")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {/* Rising Light Motes */}
          {[0, 0.8].map((delay, idx) => (
            <motion.div
              key={`spark-${idx}`}
              initial={{ y: 0, opacity: 0.8, scale: 0.6 }}
              animate={{
                y: -16,
                opacity: 0,
                scale: 1.2,
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: delay,
                ease: "easeOut",
              }}
              className="absolute w-2 h-2 rounded-full bg-blue-300 blur-[1px] pointer-events-none"
              style={{ left: "45%", top: "40%" }}
            />
          ))}

          {/* Interactive Tooltip */}
          {hoveredIcon === "book" && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-blue-200 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-blue-500/30 backdrop-blur-md"
            >
              📖 In-Depth Curriculum
            </motion.div>
          )}
        </div>

        {/* 8. 🌟 Floating Ambient Dust / Star Particles Across the Scene */}
        {[
          { left: "18%", top: "25%", color: "#60a5fa", delay: 0 },
          { left: "38%", top: "18%", color: "#fb923c", delay: 0.6 },
          { left: "62%", top: "28%", color: "#facc15", delay: 1.2 },
          { left: "72%", top: "16%", color: "#38bdf8", delay: 1.8 },
          { left: "88%", top: "38%", color: "#f472b6", delay: 0.9 },
        ].map((pt, i) => (
          <motion.div
            key={`ambient-${i}`}
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 0.9, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + (i % 2),
              repeat: Infinity,
              delay: pt.delay,
              ease: "easeInOut",
            }}
            className="absolute w-1.5 h-1.5 rounded-full blur-[0.5px] pointer-events-none"
            style={{ left: pt.left, top: pt.top, backgroundColor: pt.color }}
          />
        ))}
      </div>
    </div>
  );
}
