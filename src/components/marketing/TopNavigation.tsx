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
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

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

export default function TopNavigation({ activeTask, onTaskChange, hasCompanyData }: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl ai-gradient glow animate-pulse-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm" />
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MarketAI
            </span>
            <div className="text-xs text-muted-foreground font-mono">v2.0</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-2">
          {tasks.map((task) => {
            const Icon = task.icon;
            const isActive = activeTask === task.id;
            return (
              <Button
                key={task.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTaskChange(task.id)}
                disabled={!hasCompanyData}
                className={cn(
                  "gap-2 transition-all duration-200 hover:scale-105",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 glow"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                  !hasCompanyData && "opacity-40 cursor-not-allowed"
                )}
              >
                <Icon className="h-4 w-4" />
                {task.label}
              </Button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 border border-border/50">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground font-mono">AI Online</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-lg hover:bg-muted/50 transition-all duration-200 hover:scale-105"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <nav className="flex overflow-x-auto px-4 py-3 space-x-2 scrollbar-hide">
          {tasks.map((task) => {
            const Icon = task.icon;
            const isActive = activeTask === task.id;
            return (
              <Button
                key={task.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTaskChange(task.id)}
                disabled={!hasCompanyData}
                className={cn(
                  "flex-shrink-0 gap-1.5 text-xs px-3 py-2 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 glow"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                  !hasCompanyData && "opacity-40 cursor-not-allowed"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {task.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}