import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  RefreshCcw, 
  Target,
  Heart,
  MessageCircle,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await generateEngagementStrategies(input, companyData);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.summary,
        type: "results",
        result,
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to generate strategies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-4xl mx-auto relative bg-transparent overflow-hidden">
      {/* ── Engagement Header ── */}
      <div className="px-4 py-5 sm:px-6 rounded-2xl bg-background/70 border border-border/40 shadow-sm backdrop-blur-lg mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Audience Engagement Architect</h1>
              <p className="text-sm text-muted-foreground">Craft professional user engagement plans with modern, data-driven tactics.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => { setMessages([]); setInput(""); }}>
              <RefreshCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button variant="secondary" size="sm" onClick={() => toast.success("Use clear, goal-focused prompts to get the best engagement blueprint.") }>
              <Sparkles className="w-4 h-4 mr-1" />
              Pro Tip
            </Button>
          </div>
        </div>
      </div>

      {/* ── Chat / Strategy Output ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto w-full px-4 md:px-6 pb-32 pt-2 space-y-6 scroll-smooth">
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4 px-4">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">Let’s build your engagement blueprint</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              Type a business challenge and get professional audience engagement protocols, loyalty frameworks, and campaign activation plans.
            </p>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={cn("flex w-full animate-in fade-in duration-500", m.role === "user" ? "justify-end" : "justify-start")}>
            {m.role === "assistant" && (
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0 mt-1">
                <span className="text-primary text-[11px] font-bold">AI</span>
              </div>
            )}
            <div className={cn("max-w-[90%] rounded-2xl px-5 py-4 text-[15px] leading-relaxed shadow-sm",
              m.role === "user"
                ? "bg-primary/5 text-foreground border border-primary/10"
                : "bg-background/80 text-foreground border border-border/30"
            )}>
              <ReactMarkdown>{m.content}</ReactMarkdown>

              {m.type === "results" && m.result && (
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm font-semibold text-primary">Executive Summary</p>
                    <p className="text-sm text-foreground/85 mt-2">{m.result.summary}</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {m.result.strategies.map((strat, i) => (
                      <article key={i} className="rounded-2xl border border-border/50 bg-background/90 p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-bold text-foreground">{strat.title}</h3>
                            <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mt-1">{strat.difficulty} effort</p>
                          </div>
                          <span className={cn(
                            "text-[10px] px-2 py-1 rounded-full font-bold uppercase",
                            strat.difficulty === "High" ? "bg-red-100 text-red-700" : strat.difficulty === "Medium" ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"
                          )}>
                            {strat.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/85 mt-4">{strat.description}</p>
                        <div className="grid grid-cols-1 gap-3 mt-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Target className="w-4 h-4" />
                            <span>Implementation</span>
                          </div>
                          <p className="text-foreground/90 pl-6">{strat.implementation}</p>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <TrendingUp className="w-4 h-4" />
                            <span>Primary benefit</span>
                          </div>
                          <p className="text-foreground/90 pl-6">{strat.benefit}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex w-full animate-in fade-in duration-500 justify-start items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
            <span className="text-sm font-medium text-muted-foreground animate-pulse">Generating professional engagement recommendations...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-8 pt-4 transition-all duration-700 ease-in-out z-20 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-3xl mx-auto w-full relative group">
          <div className="relative flex items-center bg-background rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 p-1.5 pl-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !isLoading) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask: ‘How can we improve retention in Q3?’"
              className="flex-1 min-w-0 bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] px-3 py-4 placeholder:text-muted-foreground/60 font-medium"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold text-primary bg-primary/10 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4" />
              Generate
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground uppercase tracking-wider opacity-70">Professional, modern engagement strategy output</p>
        </div>
      </div>
    </div>
  );
}
