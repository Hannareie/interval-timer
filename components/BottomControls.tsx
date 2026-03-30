"use client";

import { ChevronRight, Pause, Play } from "lucide-react";

type BottomControlsProps = {
  isRunning: boolean;
  onCancel: () => void;
  onPlayPause: () => void;
  onSkip: () => void;
};

export function BottomControls({
  isRunning,
  onCancel,
  onPlayPause,
  onSkip,
}: BottomControlsProps) {
  return (
    <div className="safe-bottom flex items-end justify-between px-5 pb-5 pt-2 text-[#24352e]">
      <button
        type="button"
        onClick={onCancel}
        className="py-5 text-xl font-semibold tracking-tight text-[#24352e]"
        aria-label="Cancel workout"
      >
        CANCEL
      </button>
      <button
        type="button"
        onClick={onPlayPause}
        className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#24352e] bg-[#24352e] text-white shadow-[0_18px_40px_rgba(36,53,46,0.24)]"
        aria-label={isRunning ? "Pause workout" : "Resume workout"}
      >
        {isRunning ? (
          <Pause className="h-8 w-8 fill-current" />
        ) : (
          <Play className="ml-1 h-8 w-8 fill-current" />
        )}
      </button>

      <button
        type="button"
        onClick={onSkip}
        className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#24352e]/20 bg-white/18 text-[#24352e]"
        aria-label="Skip interval"
      >
        <ChevronRight className="h-8 w-8" />
      </button>
    </div>
  );
}
