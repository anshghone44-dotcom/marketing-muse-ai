import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Moon,
  Sun,
  ChevronDown,
  Sparkles,
  Search,
  PenTool,
  Zap,
  Shield,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [openDropdownId, setOpenDropdownId] = useState<TaskId | null>(null);
  const [openMobileDropdownId, setOpenMobileDropdownId] = useState<TaskId | null>(null);

  const dropdownLabels: Record<string, string> = {
    ads: "AI Ad generator",
    keywords: "AI Keyword generator",
    content: "AI Content generator",
    viral: "AI Viral ideas generator",
    competitor: "AI Competitor analyst",
    engagement: "AI Engagement generator",
  };

  const dropdownIcons: Record<string, any> = {
    ads: Sparkles,
    keywords: Search,
    content: PenTool,
    viral: Zap,
    competitor: Shield,
    engagement: MessageSquare,
  };

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
                const hasDropdown = !!dropdownLabels[task.id];
                
                if (hasDropdown) {
                  return (
                    <div
                      key={task.id}
                      onMouseEnter={() => setOpenDropdownId(task.id)}
                      onMouseLeave={() => setOpenDropdownId(null)}
                      className="relative"
                    >
                      <DropdownMenu 
                        open={openDropdownId === task.id} 
                        onOpenChange={(open) => setOpenDropdownId(open ? task.id : null)}
                      >
                        <DropdownMenuTrigger asChild>
                          <button
                            className={cn(
                              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground gap-1.5",
                              isActive
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "text-foreground"
                            )}
                          >
                            <span>{task.label}</span>
                            <ChevronDown className={cn(
                              "h-4 w-4 transition-transform duration-200 opacity-50", 
                              isActive && "opacity-100",
                              openDropdownId === task.id && "rotate-180"
                            )} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="start" 
                          className="w-56 p-1 bg-background/80 backdrop-blur-2xl border-white/10 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200"
                        >
                          {(() => {
                            const Icon = dropdownIcons[task.id];
                            return (
                              <DropdownMenuItem 
                                onClick={() => {
                                  onTaskChange(task.id);
                                  setOpenDropdownId(null);
                                }}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-primary/10 hover:text-primary group"
                              >
                                <div className="p-1 rounded-md bg-primary/5 group-hover:bg-primary/20 transition-colors">
                                  {Icon && <Icon className="h-3.5 w-3.5" />}
                                </div>
                                <span className="text-xs font-semibold tracking-tight">{dropdownLabels[task.id]}</span>
                              </DropdownMenuItem>
                            );
                          })()}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                }

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
            const hasDropdown = !!dropdownLabels[task.id];

            if (hasDropdown) {
              return (
                <DropdownMenu 
                  key={task.id} 
                  open={openMobileDropdownId === task.id} 
                  onOpenChange={(open) => setOpenMobileDropdownId(open ? task.id : null)}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 gap-1",
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <span>{task.label}</span>
                      <ChevronDown className={cn(
                        "h-3 w-3 opacity-50 transition-transform duration-200", 
                        openMobileDropdownId === task.id && "rotate-180"
                      )} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40 bg-background/95 backdrop-blur-xl border-border/50">
                    <DropdownMenuItem 
                      onClick={() => {
                        onTaskChange(task.id);
                        setOpenMobileDropdownId(null);
                      }}
                      className="text-xs py-2 cursor-pointer focus:bg-primary/10 focus:text-primary"
                    >
                      {dropdownLabels[task.id]}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

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