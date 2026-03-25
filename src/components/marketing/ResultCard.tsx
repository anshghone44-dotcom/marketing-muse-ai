import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Props {
  title: string;
  content: string;
  isLoading?: boolean;
  onRegenerate?: () => void;
}

export default function ResultCard({ title, content, isLoading, onRegenerate }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-4 animate-pulse">
        <div className="shimmer h-6 w-48 rounded-lg" />
        <div className="space-y-3">
          <div className="shimmer h-4 w-full rounded" />
          <div className="shimmer h-4 w-4/5 rounded" />
          <div className="shimmer h-4 w-3/4 rounded" />
          <div className="shimmer h-4 w-5/6 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl p-6 hover:bg-card/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:scale-[1.02] hover:border-primary/20">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            {onRegenerate && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200"
                onClick={onRegenerate}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className={cn(
          "text-sm text-muted-foreground prose prose-sm max-w-none leading-relaxed",
          "[&_h1]:text-foreground [&_h1]:font-bold [&_h1]:text-xl [&_h1]:mb-3",
          "[&_h2]:text-foreground [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:mb-2",
          "[&_h3]:text-foreground [&_h3]:font-semibold [&_h3]:text-base [&_h3]:mb-2",
          "[&_strong]:text-foreground [&_strong]:font-semibold",
          "[&_li]:text-muted-foreground [&_li]:mb-1",
          "[&_p]:mb-3 [&_p]:last:mb-0",
          "[&_ul]:mb-4 [&_ol]:mb-4",
          "prose-headings:font-display"
        )}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
