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
  ChevronDown,
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

const tasks: { id: TaskId; label: string; description: string; icon: React.ElementType }[] = [
  { id: "ads", label: "Ad Creation", description: "Generate high-converting ad copy", icon: Megaphone },
  { id: "keywords", label: "Keyword Gen", description: "SEO & SEM keyword strategy", icon: Search },
  { id: "content", label: "Content Gen", description: "Blogs, articles & landing pages", icon: FileText },
  { id: "social", label: "Social Strategy", description: "Viral campaign planning", icon: Share2 },
  { id: "viral", label: "Viral Ideas", icon: Flame, description: "Trend-driven viral hooks" },
  { id: "competitor", label: "Competitor Analysis", description: "Market gap & competitor audit", icon: BarChart3 },
  { id: "engagement", label: "Engagement", description: "Audience growth & loyalty", icon: Users },
];

interface Props {
  activeTask: TaskId;
  onTaskChange: (id: TaskId) => void;
  hasCompanyData: boolean;
}

export default function TopNavigation({ activeTask, onTaskChange, hasCompanyData }: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border/40">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6">
        {/* Logo Section */}
        <div className="mr-8 flex items-center">
          <a href="/" className="flex items-center space-x-3 transition-opacity hover:opacity-90">
            <span className="font-display text-lg font-bold tracking-tight text-foreground sm:inline-block">
              LeadBot
            </span>
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
          {tasks.map((task) => {
            const Icon = task.icon;
            const isActive = activeTask === task.id;
            const buttonElement = (
              <div
                key={`${task.id}-btn`}
                onClick={() => {
                  if (task.id === "social") onTaskChange(task.id);
                }}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-primary bg-primary/5 border border-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  task.id !== "social" && "cursor-default" 
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{task.label}</span>
                {task.id !== "social" && <ChevronDown className="h-3 w-3 ml-1 opacity-50 transition-transform duration-200 group-hover:rotate-180" />}
              </div>
            );

            if (task.id === "social") {
              return <div key={task.id}>{buttonElement}</div>;
            }

            return (
              <div key={task.id} className="relative group flex items-center h-full cursor-pointer py-2">
                {buttonElement}
                
                <div className="absolute top-12 left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] transform scale-95 group-hover:scale-100 origin-top-left">
                  <div className="w-72 bg-background border border-border rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] opacity-50">
                      Productivity Suite
                    </div>
                    <button
                      onClick={() => onTaskChange(task.id)}
                      className="group/item w-full flex items-center justify-between rounded-xl px-3 py-3 text-sm cursor-pointer hover:bg-muted transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2.5 rounded-xl bg-primary/5 text-primary group-hover/item:bg-primary/10 group-hover/item:scale-105 transition-all">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col items-start translate-y-[-1px]">
                          <span className="font-bold text-[14px] text-foreground tracking-tight">{task.label}</span>
                          <span className="text-[11px] text-muted-foreground group-hover/item:text-foreground/70 transition-colors uppercase font-medium tracking-wide leading-none mt-1">{task.id} chatbot</span>
                        </div>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-primary/40 opacity-0 group-hover/item:opacity-100 transition-all scale-50 group-hover/item:scale-100" />
                    </button>
                    
                    <div className="mt-2 px-3 py-2 border-t border-border/40">
                       <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                         {task.description}
                       </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-lg hover:bg-muted"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border bg-background/50">
        <nav className="flex overflow-x-auto px-4 py-3 space-x-2 scrollbar-hide">
          {tasks.map((task) => {
            const Icon = task.icon;
            const isActive = activeTask === task.id;
            const buttonElement = (
              <div
                key={`${task.id}-mobile-btn`}
                onClick={() => {
                  if (task.id === "social") onTaskChange(task.id);
                }}
                className={cn(
                  "flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200",
                  isActive
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{task.label}</span>
                {task.id !== "social" && <ChevronDown className="h-3 w-3 ml-0.5 opacity-50 transition-transform duration-200 group-hover:rotate-180" />}
              </div>
            );

            if (task.id === "social") {
              return <div key={`${task.id}-mobile`}>{buttonElement}</div>;
            }

            return (
              <div key={`${task.id}-mobile`} className="relative group flex items-center h-full cursor-pointer">
                {buttonElement}
                
                <div className="absolute bottom-full left-0 pb-2 mb-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] transform scale-95 group-hover:scale-100 origin-bottom-left">
                  <div className="w-56 bg-background border border-border rounded-2xl p-1.5 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => onTaskChange(task.id)}
                      className="group/item w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs cursor-pointer hover:bg-muted/80 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-primary/5 text-primary group-hover/item:bg-primary/10 transition-colors">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium text-foreground">{task.label} Chatbot</span>
                      </div>
                      <div className="h-1 w-1 rounded-full bg-primary/40 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}