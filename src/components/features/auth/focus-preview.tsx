import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ITEMS = [
  { label: "Team stand-up notes", done: true, priority: "High" as const },
  { label: "Finish calculus problem set", done: false, priority: "High" as const },
  { label: "Prepare for biology quiz", done: false, priority: "Medium" as const },
];

export function FocusPreview() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
      <p className="text-[10px] font-semibold tracking-[0.14em] text-white/40 uppercase">
        Today&apos;s focus
      </p>
      <div className="mt-2 flex items-center justify-between text-sm text-white">
        <span className="font-semibold">3 of 7 done</span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-[43%] rounded-full bg-gradient-to-r from-[#3b82f6] to-[#4f46e5]" />
      </div>

      <ul className="mt-5 space-y-3">
        {ITEMS.map((item) => (
          <li key={item.label} className="flex items-center gap-3">
            <span
              className={
                item.done
                  ? "grid size-5 place-items-center rounded-full bg-emerald-500 text-white"
                  : "size-5 rounded-full border border-white/20"
              }
            >
              {item.done && <Check className="size-3" strokeWidth={3} />}
            </span>
            <span
              className={
                item.done
                  ? "flex-1 text-xs text-white/40 line-through"
                  : "flex-1 text-xs text-white/80"
              }
            >
              {item.label}
            </span>
            <Badge tone={item.priority === "High" ? "high" : "medium"}>
              {item.priority}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
