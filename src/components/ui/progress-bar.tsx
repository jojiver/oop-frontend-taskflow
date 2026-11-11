import { cn } from "@/lib/cn";

type Tone = "brand" | "high" | "medium" | "low" | "slate";

const TONES: Record<Tone, string> = {
  brand: "bg-gradient-to-r from-[#3b82f6] to-[#4f46e5]",
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
  slate: "bg-slate-300",
};

type ProgressBarProps = {
  value: number;
  tone?: Tone;
  className?: string;
};

export function ProgressBar({ value, tone = "brand", className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-100", className)}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-300", TONES[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export default ProgressBar;
