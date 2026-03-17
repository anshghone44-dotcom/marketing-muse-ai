import { cn } from "@/lib/utils";
import {
  Moon,
  Sun,
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

const tasks: { id: TaskId; label: string }[] = [
  { id: "ads", label: "Ad Creation" },
  { id: "keywords", label: "Keyword Gen" },
  { id: "content", label: "Content Gen" },
  { id: "social", label: "Social Strategy" },
  { id: "viral", label: "Viral Ideas" },
  { id: "competitor", label: "Competitor Analysis" },
  { id: "engagement", label: "Engagement" },
];

interface Props {
  activeTask: TaskId;
  onTaskChange: (id: TaskId) => void;
  hasCompanyData: boolean;
}

export default function TopNavigation({ activeTask, onTaskChange, hasCompanyData }: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Premium gradient border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="relative bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          {/* Logo Section - Modern Branding */}
          <div className="flex items-center">
            <a href="/" className="group flex items-center space-x-3 transition-transform duration-300 hover:scale-105">
              {/* Logo Badge */}
              <div className="relative h-10 w-10 rounded-lg bg-gradient-to-br from-primary via-primary/80 to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-sm font-bold text-primary-foreground">LB</span>
              </div>
              {/* Brand Name */}
              <div className="hidden sm:flex flex-col">
                <span className="font-display text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  LeadBot
                </span>
                <span className="text-xs text-muted-foreground font-medium">AI Marketing Engine</span>
              </div>
            </a>
          </div>

          {/* Navigation Links - Modern Desktop */}
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
            <nav className="flex items-center space-x-1 bg-muted/30 rounded-full px-4 py-2 backdrop-blur-sm border border-border/50">
              {tasks.map((task) => {
                const isActive = activeTask === task.id;
                return (
                  <button
                    key={task.id}
                    onClick={() => onTaskChange(task.id)}
                    disabled={!hasCompanyData}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      !hasCompanyData && "opacity-40 cursor-not-allowed hover:bg-transparent"
                    )}
                  >
                    {task.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Actions - Theme Toggle */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10 rounded-full bg-muted/50 hover:bg-muted/80 transition-all duration-200"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Modern Compact */}
      <div className="md:hidden bg-background/80 backdrop-blur-xl border-t border-border/40">
        <nav className="flex overflow-x-auto px-4 py-3 space-x-2 scrollbar-hide">
          {tasks.map((task) => {
            const isActive = activeTask === task.id;
            return (
              <button
                key={task.id}
                onClick={() => onTaskChange(task.id)}
                disabled={!hasCompanyData}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  !hasCompanyData && "opacity-40 cursor-not-allowed"
                )}
              >
                {task.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}