"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play, Repeat, TimerReset, Waves } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfigCard } from "@/components/ConfigCard";
import { FloatingPlayButton } from "@/components/FloatingPlayButton";
import {
  formatClock,
  formatConfigValue,
  getTotalDurationMs,
  type WorkoutConfig,
} from "@/lib/timerEngine";
import { useWorkoutStore } from "@/store/useWorkoutStore";

type EditableNumberKey =
  | "warmupSec"
  | "workSec"
  | "restSec"
  | "cooldownSec"
  | "rounds";

const numberLabels: Record<EditableNumberKey, string> = {
  warmupSec: "Warmup duration",
  workSec: "Interval duration",
  restSec: "Rest duration",
  cooldownSec: "Cooldown duration",
  rounds: "Rounds",
};

function clampConfigValue(key: EditableNumberKey, value: number) {
  if (key === "rounds") {
    return Math.max(1, Math.min(50, value));
  }

  return Math.max(0, Math.min(600, value));
}

function EditorSheet({
  open,
  config,
  onClose,
  onUpdate,
}: {
  open: EditableNumberKey | null;
  config: WorkoutConfig;
  onClose: () => void;
  onUpdate: (partial: Partial<WorkoutConfig>) => void;
}) {
  if (!open) {
    return null;
  }
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end bg-black/60 px-4 pb-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="safe-bottom w-full rounded-[32px] border border-white/10 bg-[#262626] p-6 shadow-card"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/40">
            Edit workout
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-tight">
            {numberLabels[open]}
          </h3>

          <div className="mt-8">
            <div className="rounded-[28px] bg-white/[0.04] p-5 text-center">
              <div className="text-5xl font-black text-white">
                {formatConfigValue(open, config[open])}
              </div>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  onUpdate({
                    [open]: clampConfigValue(
                      open,
                      config[open] - (open === "rounds" ? 1 : 5),
                    ),
                  })
                }
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-3xl"
              >
                -
              </button>
              <input
                className="h-2 flex-1 appearance-none rounded-full bg-white/10 accent-ocean-coral"
                type="range"
                min={open === "rounds" ? 1 : 0}
                max={open === "rounds" ? 50 : 600}
                step={open === "rounds" ? 1 : 5}
                value={config[open]}
                onChange={(event) =>
                  onUpdate({
                    [open]: clampConfigValue(open, Number(event.target.value)),
                  })
                }
              />
              <button
                type="button"
                onClick={() =>
                  onUpdate({
                    [open]: clampConfigValue(
                      open,
                      config[open] + (open === "rounds" ? 1 : 5),
                    ),
                  })
                }
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-3xl"
              >
                +
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function HomePage() {
  const router = useRouter();
  const config = useWorkoutStore((state) => state.config);
  const startWorkout = useWorkoutStore((state) => state.startWorkout);
  const updateConfig = useWorkoutStore((state) => state.updateConfig);
  const [editorKey, setEditorKey] = useState<EditableNumberKey | null>(null);

  const totalDurationMs = getTotalDurationMs(config);

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden bg-[#262626] text-white">
      <EditorSheet
        open={editorKey}
        config={config}
        onClose={() => setEditorKey(null)}
        onUpdate={updateConfig}
      />

      <section className="relative z-0 shrink-0 overflow-hidden bg-[linear-gradient(180deg,#86ead4_0%,#38d4c3_42%,#2c97f2_100%)] px-6 pb-24 pt-1">
        <div className="mt-16 font-bold text-center">
          <h1 className="text-2xl text-[#0a3340]">Intervals</h1>
        </div>

        <div className="pb-2 pt-8 text-center text-[#082c37]">
          <div className="text-[62px] font-bold leading-none">
            {formatClock(totalDurationMs)}
          </div>
        </div>
      </section>

      <div className="absolute inset-x-0 top-[232px] z-20 flex justify-center">
        <FloatingPlayButton
          large
          onClick={() => {
            startWorkout();
            router.push("/workout");
          }}
        />
      </div>

      <section className="relative z-10 -mt-6 flex min-h-0 flex-1 bg-transparent px-0 pb-0 pt-0">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex -translate-y-[52px] items-end justify-center">
          <div className="flex-1 rounded-tr-[22px] bg-[#262626]" />
          <div className="h-[104px] w-[120px] rounded-t-[999px] bg-[#262626]" />
          <div className="flex-1 rounded-tl-[22px] bg-[#262626]" />
        </div>

        <div className="relative z-20 flex min-h-0 flex-1 flex-col rounded-t-[20px] bg-[#262626] px-4 pb-4 pt-20">
          <div className="space-y-3">
            <ConfigCard
              icon={Waves}
              label="Warmup duration"
              value={formatConfigValue("warmupSec", config.warmupSec)}
              accentClassName="bg-transparent text-[#79e2c2]"
              onClick={() => setEditorKey("warmupSec")}
              labelClassName="text-white/85"
              valueClassName="text-[#79e2c2] text-[26px] font-semibold"
            />
            <ConfigCard
              icon={Play}
              label="Interval duration"
              value={formatConfigValue("workSec", config.workSec)}
              accentClassName="bg-transparent text-[#72e5a4]"
              onClick={() => setEditorKey("workSec")}
              labelClassName="text-white/85"
              valueClassName="text-[#72e5a4] text-[26px] font-semibold"
            />
            <ConfigCard
              icon={TimerReset}
              label="Rest duration"
              value={formatConfigValue("restSec", config.restSec)}
              accentClassName="bg-transparent text-[#ff4967]"
              onClick={() => setEditorKey("restSec")}
              labelClassName="text-white/85"
              valueClassName="text-[#ff4967] text-[26px] font-semibold"
            />
            <ConfigCard
              icon={Repeat}
              label="Rounds"
              value={formatConfigValue("rounds", config.rounds)}
              accentClassName="bg-transparent text-white/65"
              onClick={() => setEditorKey("rounds")}
              labelClassName="text-white/85"
              valueClassName="text-white/65 text-[26px] font-semibold"
            />
            <ConfigCard
              icon={Waves}
              label="Cooldown duration"
              value={formatConfigValue("cooldownSec", config.cooldownSec)}
              accentClassName="bg-transparent text-[#7ea0ff]"
              onClick={() => setEditorKey("cooldownSec")}
              labelClassName="text-white/85"
              valueClassName="text-[#7ea0ff] text-[26px] font-semibold"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
