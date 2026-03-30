import { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  Loader2,
  Send,
  Sparkles,
  RefreshCcw,
  Target,
  Heart,
  MessageCircle,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyData } from "./CompanyForm";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { generateEngagementStrategies, EngagementResult } from "@/lib/geminiEngagementService";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "results";
  result?: EngagementResult;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

export default function AiEngagementChat({ companyData, onCompanySubmit }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (!companyData) {
      toast.error("Please complete your business profile first.");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");

    try {
      const result = await generateEngagementStrategies(input.trim(), companyData);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.summary,
        type: "results",
        result,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate engagement strategies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-4xl mx-auto relative overflow-hidden">
      {/* Chat Area / Results */}
      <div
        ref={scrollRef}
        className={cn(
          "flex-1 overflow-y-auto w-full px-4 md:px-8 pb-32 pt-8 space-y-8 scroll-smooth",
          messages.length === 0 ? "hidden" : "block"
        )}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex w-full animate-in fade-in duration-500",
              m.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0 mt-1">
                <span className="text-primary text-xs font-bold">AI</span>
              </div>
            )}
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-5 py-4 text-[15px] leading-relaxed",
                m.role === "user"
                  ? "bg-primary/5 text-foreground border border-primary/10 shadow-sm"
                  : "prose prose-sm dark:prose-invert font-normal text-foreground max-w-none text-left bg-transparent"
              )}
            >
              <ReactMarkdown>{m.content}</ReactMarkdown>

              {m.type === "results" && m.result && (
                <div className="mt-6 space-y-6 border-t border-border/10 pt-6 animate-in fade-in duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {m.result.strategies.map((strategy, i) => (
                      <div key={i} className="bg-white dark:bg-muted/30 border border-border/50 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-primary">
                            <Target className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{strategy.title}</span>
                          </div>
                        </div>
                        <p>{strategy.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full animate-in fade-in duration-500 justify-start items-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
            <div className="text-muted-foreground text-sm font-medium animate-pulse">
              Generating engagement strategies...
            </div>
          </div>
        )}
      </div>

      {/* Empty State & Central Search */}
      {messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-16 pointer-events-none px-4 text-center">
          <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl md:text-5xl font-sans tracking-tight text-foreground">
              <span className="font-bold">LeadBot</span> <span className="font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]">Engagement Architect</span>
            </h1>
          </div>
        </div>
      )}

      {/* Input Bar (Grok Style) */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 px-4 pb-8 pt-4 transition-all duration-700 ease-in-out z-20",
        messages.length > 0 ? "bg-gradient-to-t from-background via-background to-transparent" : "",
        messages.length === 0 ? "top-1/2 -translate-y-1/2 pt-16 flex flex-col justify-center" : ""
      )}>
        <div className="max-w-3xl mx-auto w-full relative group">
          <div className="relative flex items-center bg-background rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 overflow-visible p-1.5 pl-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-muted-foreground hover:opacity-80 transition-opacity shrink-0"
              title="Upload file constraints"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={() => toast.info("File upload currently processes as simple text appending.")}
              className="hidden"
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask: 'How can we improve retention in Q3?'"
              className="flex-1 min-w-0 bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] px-3 py-4 placeholder:text-muted-foreground/60 font-medium"
            />
            <div className="flex items-center gap-1.5 shrink-0 pr-1">
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold text-primary bg-primary/10 hover:opacity-80 transition-opacity mr-1 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Send className="w-4 h-4" />
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
