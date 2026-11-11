import { BookOpen, Briefcase, Folder, User } from "lucide-react";
import type { Category } from "@/services/task-service";
import { cn } from "@/lib/cn";

const ICONS = {
  school: BookOpen,
  personal: User,
  work: Briefcase,
  others: Folder,
};

export function CategoryIcon({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  const Icon = ICONS[category];
  return <Icon className={cn("size-4", className)} />;
}
