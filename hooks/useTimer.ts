"use client";

import { useEffect, useRef, useState } from "react";

import { formatClock, getPhaseAccent, getPhaseName } from "@/lib/timerEngine";
import { useWorkoutStore } from "@/store/useWorkoutStore";

type AudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

function playCue(frequency: number, duration = 0.12) {
  if (typeof window === "undefined") {
    return;
  }

  const AudioContextClass = window.AudioContext || (window as AudioWindow).webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
  oscillator.onended = () => {
    void context.close();
  };
}

export function useTimer() {
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const config = useWorkoutStore((state) => state.config);
  const syncTimer = useWorkoutStore((state) => state.syncTimer);
  const pauseWorkout = useWorkoutStore((state) => state.pauseWorkout);
  const resumeWorkout = useWorkoutStore((state) => state.resumeWorkout);
  const skipSegment = useWorkoutStore((state) => state.skipSegment);
  const cancelWorkout = useWorkoutStore((state) => state.cancelWorkout);

  const [now, setNow] = useState(() => Date.now());
  const previousIndexRef = useRef<number | null>(null);
  const previousFinishedRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    let timeout = 0;

    const tick = () => {
      const currentNow = Date.now();
      setNow(currentNow);
      syncTimer(currentNow);
      frame = window.requestAnimationFrame(tick);
    };

    const hiddenTick = () => {
      const currentNow = Date.now();
      setNow(currentNow);
      syncTimer(currentNow);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(hiddenTick, 500);
    };

    const handleVisibility = () => {
      const currentNow = Date.now();
      setNow(currentNow);
      syncTimer(currentNow);

      if (document.visibilityState === "visible") {
        window.clearTimeout(timeout);
        if (!frame) {
          frame = window.requestAnimationFrame(tick);
        }
        return;
      }

      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
      frame = 0;
      hiddenTick();
    };

    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [syncTimer]);

  useEffect(() => {
    if (!activeWorkout) {
      previousIndexRef.current = null;
      previousFinishedRef.current = false;
      return;
    }

    const indexChanged = previousIndexRef.current !== null && previousIndexRef.current !== activeWorkout.currentIndex;

    if (indexChanged) {
      if (config.vibrationEnabled && typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(35);
      }

      if (config.soundEnabled) {
        playCue(720);
      }
    }

    if (activeWorkout.isFinished && !previousFinishedRef.current) {
      if (config.vibrationEnabled && typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([60, 30, 60]);
      }

      if (config.soundEnabled) {
        playCue(880, 0.16);
      }
    }

    previousIndexRef.current = activeWorkout.currentIndex;
    previousFinishedRef.current = activeWorkout.isFinished;
  }, [activeWorkout, config.soundEnabled, config.vibrationEnabled]);

  const currentSegment = activeWorkout?.segments[activeWorkout.currentIndex] ?? null;
  const currentSegmentDuration = currentSegment?.durationMs ?? 0;

  const remainingMs = activeWorkout
    ? activeWorkout.isRunning
      ? Math.max(0, (activeWorkout.segmentEndsAt ?? now) - now)
      : activeWorkout.pausedRemainingMs ?? currentSegmentDuration
    : 0;

  const totalRemainingMs = activeWorkout
    ? activeWorkout.segments.reduce((total, segment, index) => {
        if (index < activeWorkout.currentIndex) {
          return total;
        }

        if (index === activeWorkout.currentIndex) {
          return total + remainingMs;
        }

        return total + segment.durationMs;
      }, 0)
    : 0;

  const progress = currentSegmentDuration > 0 ? 1 - remainingMs / currentSegmentDuration : 0;

  return {
    activeWorkout,
    currentSegment,
    now,
    remainingMs,
    totalRemainingMs,
    progress,
    formattedRemaining: formatClock(remainingMs),
    formattedTotalRemaining: formatClock(totalRemainingMs),
    phaseName: currentSegment ? getPhaseName(currentSegment.phase) : "READY",
    accent: currentSegment ? getPhaseAccent(currentSegment.phase) : "#FF5C74",
    pauseWorkout,
    resumeWorkout,
    skipSegment,
    cancelWorkout
  };
}
