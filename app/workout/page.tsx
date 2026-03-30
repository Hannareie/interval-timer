"use client";

import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { BottomControls } from "@/components/BottomControls";
import { TimerRing } from "@/components/TimerRing";
import { useTimer } from "@/hooks/useTimer";
import { getPhaseName } from "@/lib/timerEngine";
import { useWorkoutStore } from "@/store/useWorkoutStore";

const phaseBackgrounds: Record<string, string> = {
  WARMUP: "#ff7a6b",
  WORK: "#f4cd57",
  REST: "#67b8ff",
  COOLDOWN: "#5fd08c",
  READY: "#f4cd57",
};

export default function WorkoutPage() {
  const router = useRouter();
  const clearFinishedWorkout = useWorkoutStore(
    (state) => state.clearFinishedWorkout,
  );
  const {
    activeWorkout,
    currentSegment,
    formattedRemaining,
    formattedTotalRemaining,
    progress,
    phaseName,
    accent,
    pauseWorkout,
    resumeWorkout,
    skipSegment,
    cancelWorkout,
  } = useTimer();

  useEffect(() => {
    if (!activeWorkout) {
      return;
    }

    if (activeWorkout.isFinished) {
      const timeout = window.setTimeout(() => {
        clearFinishedWorkout();
        router.replace("/");
      }, 2200);

      return () => window.clearTimeout(timeout);
    }
  }, [activeWorkout, clearFinishedWorkout, router]);

  if (!activeWorkout || !currentSegment) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ocean-ink px-6 text-white">
        <div className="glass-card w-full max-w-sm rounded-[32px] border border-white/10 p-8 text-center shadow-card">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/40">
            No active timer
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight">
            Ready for your next run?
          </h1>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.24em] text-ocean-ink"
          >
            Back to setup
          </Link>
        </div>
      </main>
    );
  }

  return (
    <motion.main
      animate={{ backgroundColor: phaseBackgrounds[phaseName] }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="h-dvh overflow-hidden px-4 pb-4 text-[#1b4338]"
    >
      <div className="mx-auto flex h-dvh max-w-md flex-col justify-between">
        <div>
          <div className="pt-16 text-center">
            <h1 className="text-[clamp(1.5rem,3vh,2rem)] font-black">
              {activeWorkout.isFinished
                ? "Workout Complete"
                : getPhaseName(currentSegment.phase)}
            </h1>
          </div>

          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between rounded-[28px] border-2 border-white/20 px-7 py-3">
              <span className="text-[clamp(1.25rem,2.5vh,1.5rem)] font-bold tracking-tight">
                Round
              </span>
              <span className="text-[clamp(1.25rem,2.5vh,1.5rem)] font-bold tracking-tight">
                {Math.max(1, currentSegment.roundIndex)}/{currentSegment.rounds}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center py-1">
          <TimerRing progress={progress} accent={accent}>
            <div className="space-y-3 text-center text-[#1b4338]">
              <p className="text-[clamp(1.25rem,2.5vh,1.5rem)] font-bold uppercase tracking-tight">
                {phaseName}
              </p>
              <div className="text-[clamp(3rem,7vh,4rem)] font-black">
                {formattedRemaining}
              </div>
              <div className="flex items-center justify-center gap-2 text-[clamp(1.125rem,2.4vh,1.5rem)] font-bold tracking-tight">
                <Clock3 className="h-7 w-7" />
                <span>{formattedTotalRemaining}</span>
              </div>
            </div>
          </TimerRing>
        </div>

        <div className="mb-10">
          <BottomControls
            isRunning={activeWorkout.isRunning}
            onCancel={() => {
              cancelWorkout();
              router.replace("/");
            }}
            onPlayPause={() => {
              if (activeWorkout.isRunning) {
                pauseWorkout();
                return;
              }

              resumeWorkout();
            }}
            onSkip={() => skipSegment()}
          />
        </div>
      </div>
    </motion.main>
  );
}
