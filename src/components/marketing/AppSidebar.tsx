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
        "flex flex-col border-r border-border bg-card transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg ai-gradient">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-base tracking-tight">
            MarketAI
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-md p-1 hover:bg-muted text-muted-foreground"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {tasks.map((task) => {
          const Icon = task.icon;
          const isActive = activeTask === task.id;
          return (
            <button
              key={task.id}
              onClick={() => onTaskChange(task.id)}
              disabled={!hasCompanyData}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                !hasCompanyData && "opacity-40 cursor-not-allowed"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{task.label}</span>}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {hasCompanyData
              ? "Select a task to generate content"
              : "Enter company details to begin"}
          </p>
        </div>
      )}
    </aside>
  );
}
