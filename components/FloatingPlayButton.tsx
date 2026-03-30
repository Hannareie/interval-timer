"use client";

import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";

type FloatingPlayButtonProps = {
  onClick: () => void;
  playing?: boolean;
  disabled?: boolean;
  large?: boolean;
};

export function FloatingPlayButton({
  onClick,
  playing = false,
  disabled = false,
  large = false,
}: FloatingPlayButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center rounded-full bg-black text-[#ff4f7c] shadow-[0_16px_36px_rgba(0,0,0,0.38)] transition disabled:cursor-not-allowed disabled:opacity-50 ${
        large
          ? "h-24 w-24 border-[7px] border-[#ff4f7c]"
          : "h-20 w-20 border-[5px] border-[#ff4f7c]"
      }`}
      aria-label={playing ? "Pause timer" : "Start timer"}
    >
      {playing ? (
        <Pause
          className={large ? "h-10 w-10 fill-current" : "h-8 w-8 fill-current"}
        />
      ) : (
        <Play
          className={
            large ? "ml-1 h-10 w-10 fill-current" : "ml-1 h-8 w-8 fill-current"
          }
        />
      )}
    </motion.button>
  );
}
