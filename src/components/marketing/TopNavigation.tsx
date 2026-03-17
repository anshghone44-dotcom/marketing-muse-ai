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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo Section */}
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-display text-xl font-bold tracking-tight text-foreground sm:inline-block">
              LeadBot
            </span>
          </a>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {tasks.map((task) => {
                const isActive = activeTask === task.id;
                return (
                  <button
                    key={task.id}
                    onClick={() => onTaskChange(task.id)}
                    disabled={!hasCompanyData}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-foreground",
                      !hasCompanyData && "opacity-50 cursor-not-allowed hover:bg-transparent"
                    )}
                  >
                    <span>{task.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border/40">
        <nav className="flex overflow-x-auto px-4 py-3 space-x-2 scrollbar-hide">
          {tasks.map((task) => {
            const isActive = activeTask === task.id;
            return (
              <button
                key={task.id}
                onClick={() => onTaskChange(task.id)}
                disabled={!hasCompanyData}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground",
                  !hasCompanyData && "opacity-50 cursor-not-allowed"
                )}
              >
                <span>{task.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}