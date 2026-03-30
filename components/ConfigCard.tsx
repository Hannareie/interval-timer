import type { LucideIcon } from "lucide-react";

type ConfigCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  accentClassName: string;
  onClick: () => void;
  labelClassName?: string;
  valueClassName?: string;
};

export function ConfigCard({
  icon: Icon,
  label,
  value,
  accentClassName,
  onClick,
  labelClassName,
  valueClassName,
}: ConfigCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-lg border border-white/5 px-5 py-5 text-left shadow-card transition active:scale-[0.99]"
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${accentClassName}`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[18px] font-semibold tracking-tight ${labelClassName ?? "text-white/85"}`}
        >
          {label}
        </p>
      </div>
      <span
        className={`text-[18px] font-medium tracking-tight ${valueClassName ?? "text-white/80"}`}
      >
        {value}
      </span>
    </button>
  );
}
