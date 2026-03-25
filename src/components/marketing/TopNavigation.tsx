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
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";

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
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <a href="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary to-secondary shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 blur opacity-50" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base font-bold tracking-tight text-foreground">
                Marketing Muse AI
              </span>
              <span className="text-xs font-medium text-primary">Creation</span>
            </div>
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
          {tasks.map((task) => {
            const Icon = task.icon;
            const isActive = activeTask === task.id;
            return (
              <button
                key={task.id}
                onClick={() => onTaskChange(task.id)}
                disabled={!hasCompanyData}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                  !hasCompanyData && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{task.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-3">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground font-medium">AI online</span>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-lg hover:bg-white/10"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-lg p-0 hover:bg-white/10">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/30 to-secondary/30 text-primary font-medium text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-white/10 bg-background/50">
        <nav className="flex overflow-x-auto px-4 py-3 space-x-2 scrollbar-hide">
          {tasks.map((task) => {
            const Icon = task.icon;
            const isActive = activeTask === task.id;
            return (
              <button
                key={task.id}
                onClick={() => onTaskChange(task.id)}
                disabled={!hasCompanyData}
                className={cn(
                  "flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                  !hasCompanyData && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{task.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}