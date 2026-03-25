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
      <div className="space-y-3 rounded-xl border border-indigo-100 bg-white p-5">
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
    <div className="group rounded-xl border border-indigo-100 bg-white p-5 transition-shadow hover:shadow-md hover:shadow-indigo-100">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-900">{title}</h3>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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
      <div className={cn("prose prose-sm max-w-none text-sm text-slate-600",
        "[&_h1]:text-slate-900 [&_h2]:text-slate-900 [&_h3]:text-slate-900 [&_strong]:text-slate-900 [&_li]:text-slate-600"
      )}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
