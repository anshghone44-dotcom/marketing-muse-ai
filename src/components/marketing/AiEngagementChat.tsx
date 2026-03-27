import { useState, useRef, useEffect } from "react";
import { 
  Users, 
  Send, 
  Sparkles, 
  RefreshCcw, 
  ChevronRight,
  Zap,
  Target,
  Award,
  BarChart3,
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: companyData 
        ? `I have your profile for **${companyData.name}**. What's your goal for audience engagement? I can help you with community growth, customer loyalty, or interactive campaigns.`
        : "Hello! I am your AI Engagement Strategist. Please complete your business profile so I can generate tailored growth and loyalty strategies for you.",
    },
  ]);
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
    <div className="flex flex-col h-[750px] w-full max-w-5xl mx-auto bg-background/50 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-border/50 bg-background/80">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group transition-all hover:bg-primary/20">
            <Users className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Engagement Architect</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Powered by Gemini Pro</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex rounded-xl border-border/50 bg-background/50 hover:bg-muted" onClick={() => setMessages([messages[0]])}>
            <RefreshCcw className="w-3.5 h-3.5 mr-2 opacity-60" />
            Clear Chat
          </Button>
          <div className="h-8 w-[1px] bg-border/50 mx-1 hidden sm:block" />
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
            <Sparkles className="w-5 h-5 text-primary opacity-70" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth custom-scrollbar bg-gradient-to-b from-transparent to-primary/[0.02]">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex w-full animate-in slide-in-from-bottom-2 duration-500", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[85%] rounded-2xl px-6 py-4 text-[15px] leading-relaxed shadow-sm transition-all", 
              m.role === "user" 
                ? "bg-primary/5 text-foreground border border-primary/10" 
                : "bg-transparent prose prose-sm dark:prose-invert font-normal text-foreground max-w-none text-left")}>
              <ReactMarkdown>{m.content}</ReactMarkdown>

              {m.type === "results" && m.result && (
                <div className="mt-8 flex flex-col gap-6 border-t border-border/10 pt-8 animate-in slide-in-from-bottom-4 duration-700">
                  {m.result.strategies.map((strat, i) => (
                    <div key={i} className="bg-white dark:bg-muted/30 border border-border/50 rounded-2xl p-6 space-y-5 shadow-sm hover:shadow-md transition-all hover:border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-primary font-bold">
                          <Heart className="w-5 h-5" />
                          <h3 className="text-base tracking-tight">{strat.title}</h3>
                        </div>
                        <span className={cn(
                          "text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider",
                          strat.difficulty === 'High' ? "bg-red-100 text-red-600" :
                          strat.difficulty === 'Medium' ? "bg-orange-100 text-orange-600" :
                          "bg-emerald-100 text-emerald-600"
                        )}>
                          {strat.difficulty} Effort
                        </span>
                      </div>

                      <p className="text-sm italic text-muted-foreground leading-relaxed pl-7 border-l-2 border-primary/10">
                        {strat.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-primary/70">
                            <Target className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest font-display">Execution Plan</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{strat.implementation}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-primary/70">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest font-display">Key Benefit</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed font-medium">{strat.benefit}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center space-x-2 animate-pulse transition-opacity duration-300">
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <div className="w-2 h-2 rounded-full bg-primary/60" />
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">Crafting strategies...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-8 bg-background/80 border-t border-border/50">
        <div className="relative group max-w-4xl mx-auto">
          <Input h-14 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., How can I increase customer loyalty for our app?"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
            className="w-full h-14 pl-6 pr-14 rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all shadow-inner text-[15px] focus:ring-primary/20"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 h-10 w-10 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="mt-3 text-center text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] opacity-50">
          Professional Audience Growth & Retention Strategies
        </p>
      </div>
    </div>
  );
}
