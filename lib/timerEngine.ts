export type WorkoutPhase = "warmup" | "work" | "rest" | "cooldown";

export type WorkoutConfig = {
  warmupSec: number;
  workSec: number;
  restSec: number;
  cooldownSec: number;
  rounds: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  autoStart: boolean;
};

export type WorkoutSegment = {
  id: string;
  phase: WorkoutPhase;
  durationMs: number;
  label: string;
  roundIndex: number;
  rounds: number;
};

export const defaultWorkoutConfig: WorkoutConfig = {
  warmupSec: 60,
  workSec: 45,
  restSec: 15,
  cooldownSec: 60,
  rounds: 10,
  soundEnabled: true,
  vibrationEnabled: true,
  autoStart: true,
};

export function buildWorkoutSegments(config: WorkoutConfig): WorkoutSegment[] {
  const segments: WorkoutSegment[] = [];

  const addSegment = (
    phase: WorkoutPhase,
    durationSec: number,
    label: string,
    roundIndex: number,
  ) => {
    if (durationSec <= 0) {
      return;
    }

    segments.push({
      id: `${phase}-${roundIndex}-${segments.length}`,
      phase,
      durationMs: durationSec * 1000,
      label,
      roundIndex,
      rounds: config.rounds,
    });
  };

  addSegment("warmup", config.warmupSec, "Warmup", 0);

  for (let round = 1; round <= config.rounds; round += 1) {
    addSegment("work", config.workSec, "Work", round);

    if (config.restSec > 0) {
      addSegment("rest", config.restSec, "Rest", round);
    }
  }

  addSegment("cooldown", config.cooldownSec, "Cooldown", config.rounds);

  return segments;
}

export function getTotalDurationMs(config: WorkoutConfig): number {
  const workTotalSec = config.rounds * config.workSec;
  const restTotalSec = config.rounds * config.restSec;
  const totalSec =
    config.warmupSec + workTotalSec + restTotalSec + config.cooldownSec;

  return totalSec * 1000;
}

export function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatConfigValue(
  key: "warmupSec" | "workSec" | "restSec" | "cooldownSec" | "rounds",
  value: number,
): string {
  if (key === "rounds") {
    return String(value);
  }

  return formatClock(value * 1000);
}

export function getPhaseAccent(phase: WorkoutPhase): string {
  switch (phase) {
    case "work":
      return "#b88600";
    case "rest":
      return "#1d73d9";
    case "cooldown":
      return "#18814a";
    case "warmup":
    default:
      return "#d4473a";
  }
}

export function getPhaseName(phase: WorkoutPhase): string {
  switch (phase) {
    case "work":
      return "WORK";
    case "rest":
      return "REST";
    case "cooldown":
      return "COOLDOWN";
    case "warmup":
    default:
      return "WARMUP";
  }
}
