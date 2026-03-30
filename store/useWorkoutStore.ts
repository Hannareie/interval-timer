"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  buildWorkoutSegments,
  defaultWorkoutConfig,
  type WorkoutConfig,
  type WorkoutSegment,
} from "@/lib/timerEngine";

type ActiveWorkout = {
  segments: WorkoutSegment[];
  currentIndex: number;
  startedAt: number;
  segmentStartedAt: number | null;
  segmentEndsAt: number | null;
  pausedRemainingMs: number | null;
  isRunning: boolean;
  isFinished: boolean;
};

type WorkoutStore = {
  config: WorkoutConfig;
  activeWorkout: ActiveWorkout | null;
  updateConfig: (partial: Partial<WorkoutConfig>) => void;
  startWorkout: (now?: number) => void;
  cancelWorkout: () => void;
  clearFinishedWorkout: () => void;
  pauseWorkout: (now?: number) => void;
  resumeWorkout: (now?: number) => void;
  skipSegment: (now?: number) => void;
  syncTimer: (now: number) => void;
};

function finishWorkout(activeWorkout: ActiveWorkout | null): Partial<WorkoutStore> {
  return {
    activeWorkout: activeWorkout
      ? {
          ...activeWorkout,
          isRunning: false,
          isFinished: true,
          segmentStartedAt: null,
          segmentEndsAt: null,
          pausedRemainingMs: 0,
        }
      : null,
  };
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      config: defaultWorkoutConfig,
      activeWorkout: null,
      updateConfig: (partial) => {
        set((state) => ({
          config: {
            ...state.config,
            ...partial,
          },
        }));
      },
      startWorkout: (now = Date.now()) => {
        const segments = buildWorkoutSegments(get().config);

        if (segments.length === 0) {
          return;
        }

        set({
          activeWorkout: {
            segments,
            currentIndex: 0,
            startedAt: now,
            segmentStartedAt: now,
            segmentEndsAt: now + segments[0].durationMs,
            pausedRemainingMs: null,
            isRunning: true,
            isFinished: false,
          },
        });
      },
      cancelWorkout: () => {
        set({ activeWorkout: null });
      },
      clearFinishedWorkout: () => {
        set((state) => ({
          activeWorkout: state.activeWorkout?.isFinished ? null : state.activeWorkout,
        }));
      },
      pauseWorkout: (now = Date.now()) => {
        set((state) => {
          const { activeWorkout } = state;

          if (!activeWorkout || !activeWorkout.isRunning || !activeWorkout.segmentEndsAt) {
            return state;
          }

          return {
            activeWorkout: {
              ...activeWorkout,
              isRunning: false,
              pausedRemainingMs: Math.max(0, activeWorkout.segmentEndsAt - now),
              segmentStartedAt: null,
              segmentEndsAt: null,
            },
          };
        });
      },
      resumeWorkout: (now = Date.now()) => {
        set((state) => {
          const { activeWorkout } = state;
          const currentSegment = activeWorkout?.segments[activeWorkout.currentIndex];

          if (!activeWorkout || activeWorkout.isFinished || activeWorkout.isRunning || !currentSegment) {
            return state;
          }

          const remainingMs = activeWorkout.pausedRemainingMs ?? currentSegment.durationMs;

          return {
            activeWorkout: {
              ...activeWorkout,
              isRunning: true,
              pausedRemainingMs: null,
              segmentStartedAt: now,
              segmentEndsAt: now + remainingMs,
            },
          };
        });
      },
      skipSegment: (now = Date.now()) => {
        set((state) => {
          const { activeWorkout } = state;

          if (!activeWorkout || activeWorkout.isFinished) {
            return state;
          }

          const nextIndex = activeWorkout.currentIndex + 1;
          const nextSegment = activeWorkout.segments[nextIndex];

          if (!nextSegment) {
            return finishWorkout(activeWorkout);
          }

          return {
            activeWorkout: {
              ...activeWorkout,
              currentIndex: nextIndex,
              segmentStartedAt: activeWorkout.isRunning ? now : null,
              segmentEndsAt: activeWorkout.isRunning ? now + nextSegment.durationMs : null,
              pausedRemainingMs: activeWorkout.isRunning ? null : nextSegment.durationMs,
            },
          };
        });
      },
      syncTimer: (now) => {
        set((state) => {
          const { activeWorkout, config } = state;

          if (
            !activeWorkout ||
            activeWorkout.isFinished ||
            !activeWorkout.isRunning ||
            activeWorkout.segmentEndsAt === null
          ) {
            return state;
          }

          let nextWorkout = { ...activeWorkout };

          while (
            nextWorkout.isRunning &&
            nextWorkout.segmentEndsAt !== null &&
            now >= nextWorkout.segmentEndsAt
          ) {
            const endedAt = nextWorkout.segmentEndsAt;
            const nextIndex = nextWorkout.currentIndex + 1;
            const nextSegment = nextWorkout.segments[nextIndex];

            if (!nextSegment) {
              return finishWorkout(nextWorkout);
            }

            nextWorkout = {
              ...nextWorkout,
              currentIndex: nextIndex,
            };

            if (!config.autoStart) {
              return {
                activeWorkout: {
                  ...nextWorkout,
                  isRunning: false,
                  pausedRemainingMs: nextSegment.durationMs,
                  segmentStartedAt: null,
                  segmentEndsAt: null,
                },
              };
            }

            nextWorkout = {
              ...nextWorkout,
              segmentStartedAt: endedAt,
              segmentEndsAt: endedAt + nextSegment.durationMs,
              pausedRemainingMs: null,
            };
          }

          return {
            activeWorkout: nextWorkout,
          };
        });
      },
    }),
    {
      name: "interval-timer-store",
      partialize: (state) => ({
        config: state.config,
      }),
    },
  ),
);

export type { ActiveWorkout };
