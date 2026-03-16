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
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 space-y-3">
        <div className="shimmer h-5 w-40 rounded" />
        <div className="space-y-2">
          <div className="shimmer h-4 w-full rounded" />
          <div className="shimmer h-4 w-3/4 rounded" />
          <div className="shimmer h-4 w-5/6 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 group transition-shadow hover:shadow-md hover:shadow-indigo-900/20">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-display text-sm font-semibold text-slate-100">{title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
            {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          {onRegenerate && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRegenerate}>
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
      <div className={cn("text-sm text-slate-300 prose prose-sm max-w-none prose-invert",
        "[&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground [&_li]:text-muted-foreground"
      )}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
