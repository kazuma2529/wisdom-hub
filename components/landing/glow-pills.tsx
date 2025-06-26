"use client";

import { motion } from "framer-motion";

const pills = [
  {
    id: 1,
    className: "w-96 h-48 bg-gradient-to-r from-blue-500/10 via-teal-500/8 to-green-500/10",
    style: { top: "10%", left: "10%" },
    animationDelay: 0,
  },
  {
    id: 2,
    className: "w-80 h-40 bg-gradient-to-r from-purple-500/15 via-pink-500/10 to-rose-500/12",
    style: { top: "20%", right: "15%" },
    animationDelay: 6,
  },
  {
    id: 3,
    className: "w-72 h-36 bg-gradient-to-r from-indigo-500/8 via-blue-500/12 to-cyan-500/10",
    style: { bottom: "25%", left: "5%" },
    animationDelay: 12,
  },
  {
    id: 4,
    className: "w-88 h-44 bg-gradient-to-r from-emerald-500/6 via-teal-500/10 to-cyan-500/8",
    style: { bottom: "15%", right: "10%" },
    animationDelay: 3,
  },
  {
    id: 5,
    className: "w-64 h-32 bg-gradient-to-r from-orange-500/8 via-red-500/6 to-pink-500/10",
    style: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    animationDelay: 9,
  },
  {
    id: 6,
    className: "w-56 h-28 bg-gradient-to-r from-violet-500/12 via-purple-500/8 to-indigo-500/10",
    style: { top: "70%", right: "25%" },
    animationDelay: 15,
  },
];

export function GlowPills() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {pills.map((pill) => (
        <motion.div
          key={pill.id}
          className={`absolute rounded-full blur-[80px] mix-blend-lighten ${pill.className} will-change-transform`}
          style={pill.style}
          animate={{
            y: [-20, 40, -20],
            x: [-10, 15, -10],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20 + pill.id * 2,
            ease: "easeInOut",
            repeat: Infinity,
            delay: pill.animationDelay,
          }}
        />
      ))}
    </div>
  );
} 