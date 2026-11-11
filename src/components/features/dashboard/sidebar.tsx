import {
  BookOpen,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Folder,
  FolderOpen,
  LayoutDashboard,
  ListFilter,
  LogOut,
  Settings,
  Sun,
  User as UserIcon,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/common/logo";
import { useAuth } from "@/components/context/use-auth";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/cn";
import type { User } from "@/services/auth-service";

export type TaskCounts = {
  all: number;
  today: number;
  upcoming: number;
  pending: number;
  completed: number;
  overdue: number;
  categories: Record<string, number>;
};

type SidebarProps = {
  user: User;
  counts: TaskCounts;
  completionRate: number;
  activeStatus: string;
  activeCategory: string;
  onStatus: (status: string) => void;
  onCategory: (category: string) => void;
};

type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  count: number;
};

export function Sidebar({
  user,
  counts,
  completionRate,
  activeStatus,
  activeCategory,
  onStatus,
  onCategory,
}: SidebarProps) {
  const { logout } = useAuth();

  const workspace: NavItem[] = [
    { key: "all", label: "Dashboard", icon: LayoutDashboard, count: counts.all },
    { key: "today", label: "Today", icon: Sun, count: counts.today },
    { key: "upcoming", label: "Upcoming", icon: CalendarDays, count: counts.upcoming },
    { key: "pending", label: "Pending", icon: Clock3, count: counts.pending },
    { key: "completed", label: "Completed", icon: CheckCircle2, count: counts.completed },
  ];

  const categories: NavItem[] = [
    { key: "all", label: "All categories", icon: ListFilter, count: counts.all },
    { key: "school", label: "School", icon: BookOpen, count: counts.categories.school ?? 0 },
    { key: "personal", label: "Personal", icon: UserIcon, count: counts.categories.personal ?? 0 },
    { key: "work", label: "Work", icon: Briefcase, count: counts.categories.work ?? 0 },
    { key: "others", label: "Others", icon: Folder, count: counts.categories.others ?? 0 },
  ];

  const categoryIcons: Record<string, LucideIcon> = {
    all: ListFilter,
    school: BookOpen,
    personal: UserIcon,
    work: Briefcase,
    others: Folder,
  };

  function itemClass(active: boolean) {
    return cn(
      "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
      active
        ? "bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] text-white shadow-[0_10px_24px_-12px_rgba(59,130,246,0.9)]"
        : "text-white/60 hover:bg-white/5 hover:text-white",
    );
  }

  return (
    <aside className="sticky top-0 hidden h-svh w-[250px] shrink-0 flex-col overflow-y-auto bg-[#0b1220] px-4 py-6 lg:flex">
      <Logo dark size="md" />

      <p className="mt-8 mb-2 px-3 text-[10px] font-semibold tracking-[0.14em] text-white/25 uppercase">
        Workspace
      </p>
      <nav className="space-y-1">
        {workspace.map((item) => {
          const Icon = item.icon;
          const active = activeStatus === item.key && activeCategory === "all";

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                onCategory("all");
                onStatus(item.key);
              }}
              className={itemClass(active)}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              <span
                className={cn(
                  "text-xs font-semibold",
                  active ? "text-white/80" : "text-white/30",
                )}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </nav>

      <p className="mt-7 mb-2 px-3 text-[10px] font-semibold tracking-[0.14em] text-white/25 uppercase">
        Categories
      </p>
      <nav className="space-y-1">
        {categories.map((item) => {
          const Icon = categoryIcons[item.key] ?? FolderOpen;
          const active = activeCategory === item.key;

          return (
            <button
              key={`${item.key}-${item.label}`}
              type="button"
              onClick={() => {
                onStatus("all");
                onCategory(item.key);
              }}
              className={itemClass(active)}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              <span
                className={cn(
                  "text-xs font-semibold",
                  active ? "text-white/80" : "text-white/30",
                )}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-white/40 uppercase">
            Today&apos;s progress
          </p>
          <CheckCircle2 className="size-4 text-white/40" />
        </div>
        <p className="mt-1 text-2xl font-bold text-white">{completionRate}%</p>
        <p className="text-[11px] text-white/40">
          {counts.completed} of {counts.all} tasks done
        </p>
        <ProgressBar className="mt-3 bg-white/10" value={completionRate} />
        <p className="mt-2 text-[10px] text-white/30">Small steps add up.</p>
      </div>

      <div className="mt-auto pt-6">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#60a5fa] to-[#4f46e5] text-xs font-bold text-white">
            {user.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-[11px] text-white/40">{user.email}</p>
          </div>
          <button
            type="button"
            aria-label="Settings"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-white/40 hover:bg-white/5 hover:text-white"
          >
            <Settings className="size-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
