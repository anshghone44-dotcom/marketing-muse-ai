import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Megaphone,
  Search,
  FileText,
  Share2,
  Flame,
  BarChart3,
  Users,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

export type TaskId =
  | "ads"
  | "keywords"
  | "content"
  | "social"
  | "viral"
  | "competitor"
  | "engagement";

const tasks: { id: TaskId; label: string; icon: React.ElementType }[] = [
  { id: "ads", label: "Ad Creation", icon: Megaphone },
  { id: "keywords", label: "Keyword Gen", icon: Search },
  { id: "content", label: "Content Gen", icon: FileText },
  { id: "social", label: "Social Strategy", icon: Share2 },
  { id: "viral", label: "Viral Ideas", icon: Flame },
  { id: "competitor", label: "Competitor Analysis", icon: BarChart3 },
  { id: "engagement", label: "Engagement", icon: Users },
];

interface Props {
  activeTask: TaskId;
  onTaskChange: (id: TaskId) => void;
  hasCompanyData: boolean;
}

export default function AppSidebar({ activeTask, onTaskChange, hasCompanyData }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-[calc(100vh-2rem)] flex-col rounded-3xl border border-indigo-100 bg-white/90 text-slate-700 shadow-lg shadow-indigo-100/70 transition-all duration-200 lg:h-[calc(100vh-3rem)]",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center gap-2 border-b border-indigo-100 p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg ai-gradient">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-display text-base font-bold tracking-tight text-slate-900">
            MarketAI
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-md p-1 text-slate-500 hover:bg-indigo-50 hover:text-slate-800"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {tasks.map((task) => {
          const Icon = task.icon;
          const isActive = activeTask === task.id;
          return (
            <button
              key={task.id}
              onClick={() => onTaskChange(task.id)}
              disabled={!hasCompanyData}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700",
                !hasCompanyData && "cursor-not-allowed opacity-40"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{task.label}</span>}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="border-t border-indigo-100 p-4">
          <p className="text-xs text-slate-500">
            {hasCompanyData
              ? "Select a task to generate content"
              : "Enter company details to begin"}
          </p>
        </div>
      )}
    </aside>
  );
}
