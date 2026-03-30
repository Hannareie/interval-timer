"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type TimerRingProps = {
  progress: number;
  accent: string;
  children: ReactNode;
};

const radius = 132;
const circumference = 2 * Math.PI * radius;

export function TimerRing({ progress, accent, children }: TimerRingProps) {
  const offset = circumference * (1 - Math.max(0, Math.min(progress, 1)));

  return (
    <div className="relative flex h-[min(44vh,380px)] w-[min(44vh,380px)] max-h-[380px] max-w-[380px] items-center justify-center rounded-full">
      <svg
        className="absolute inset-0 -rotate-90"
        viewBox="0 0 320 320"
        fill="none"
      >
        <circle
          cx="160"
          cy="160"
          r={radius}
          stroke="rgba(22,70,56,0.12)"
          strokeWidth="10"
        />
        <motion.circle
          cx="160"
          cy="160"
          r={radius}
          stroke={accent}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ ease: "linear", duration: 0.2 }}
          style={{ filter: `drop-shadow(0 0 8px ${accent}22)` }}
        />
      </svg>
      <div className="relative z-10 flex h-[min(30vh,260px)] w-[min(30vh,260px)] max-h-[260px] max-w-[260px] items-center justify-center rounded-full">
        {children}
      </div>
    </div>
  );
}
