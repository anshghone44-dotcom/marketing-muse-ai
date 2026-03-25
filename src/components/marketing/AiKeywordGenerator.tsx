import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRight,
  Plus,
  Loader2,
  Target,
  Zap,
  Search,
  BarChart3,
  TrendingUp,
  Check,
  Copy,
  Bot,
  User,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CompanyData } from "./CompanyForm";
import {
  generateKeywords,
  type KeywordResult,
  type KeywordCluster,
} from "@/lib/keywordGeneratorService";

export const KEYWORD_FACTORS = [
  { id: "lead", label: "Lead-Gen", description: "High-intent keywords", icon: Target },
  { id: "catchy", label: "Catchy", description: "Social-friendly", icon: Zap },
  { id: "awareness", label: "Awareness", description: "Authority building", icon: Search },
  { id: "long-tail", label: "Long-Tail", description: "Specific queries", icon: BarChart3 },
  { id: "trending", label: "Trending", description: "Market trends", icon: TrendingUp },
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  result?: KeywordResult;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

function ClusterCard({ cluster }: { cluster: KeywordCluster }) {
  const [copied, setCopied] = useState(false);
  const factorInfo = KEYWORD_FACTORS.find((f) => f.label === cluster.factor) || KEYWORD_FACTORS[0];
  const Icon = factorInfo.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(cluster.keywords.join("\n"));
    setCopied(true);
    toast.success(`${cluster.factor} keywords copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border/20 rounded-3xl overflow-hidden shadow-sm group">
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-foreground">{cluster.factor}</h4>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tight opacity-60">Strategy Vector</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-[9px] font-black uppercase gap-1.5 border-border/40 bg-background/50 hover:bg-primary/5 hover:text-primary transition-all"
          >
            {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
            {copied ? "Copied" : "Copy List"}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {cluster.keywords.map((kw, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/30 border border-border/10 text-xs font-medium text-foreground/80 hover:bg-primary/5 hover:border-primary/20 transition-colors cursor-default"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              {kw}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AiKeywordGenerator({ companyData, onCompanySubmit }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFactors, setSelectedFactors] = useState<string[]>(["lead", "awareness"]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const toggleFactor = (id: string) => {
    setSelectedFactors((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleGenerate = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (selectedFactors.length === 0) {
      toast.error("Please select at least one strategy vector.");
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);
    setInput("");

    try {
      const selectedLabels = selectedFactors.map(id => KEYWORD_FACTORS.find(f => f.id === id)!.label);
      const result = await generateKeywords(
        trimmed,
        selectedLabels,
        companyData?.name,
        companyData?.industry,
        companyData?.product,
        companyData?.audience
      );

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I've architected a specialized keyword ecosystem targeting your goal with **${selectedFactors.length} strategy vectors**. These clusters prioritize high-intent lead capture and brand authority.`,
        result,
      };

      setMessages((prev) => [...prev, aiMsg]);
      toast.success("Keyword intelligence generated!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate keywords.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-6xl mx-auto relative bg-transparent overflow-hidden">
      {/* ── Empty State ── */}
      {messages.length === 0 && !isGenerating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-24 pointer-events-none px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-sans font-bold tracking-tight text-foreground mb-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            LeadBot Keyword Engine
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed opacity-80 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Generate high-precision keyword clusters, long-tail search opportunities, and competitor gap keywords in a single workflow.
          </p>
        </div>
      )}

      {/* ── Vector selector bar (always visible) ── */}
      <div className="flex-shrink-0 px-6 pt-4 flex flex-wrap items-center gap-2 justify-center">
        {KEYWORD_FACTORS.map(({ id, label, icon: Icon }) => {
          const selected = selectedFactors.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggleFactor(id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200",
                selected
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                  : "bg-muted/40 border-border/40 text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", selected ? "text-primary-foreground" : "text-primary")} />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Chat Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 scroll-smooth"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex w-full animate-in fade-in slide-in-from-bottom-8 duration-700",
              m.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn("max-w-[90%] space-y-4", m.role === "user" ? "items-end text-right" : "items-start text-left")}>
              <div className="flex items-center gap-2 mb-1 px-2">
                {m.role === "assistant" && <Bot className="w-3.5 h-3.5 text-primary" />}
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-80">
                  {m.role === "user" ? "Your Objective" : "Intelligence Agent"}
                </span>
                {m.role === "user" && <User className="w-3.5 h-3.5 text-muted-foreground" />}
              </div>

              <div
                className={cn(
                  "p-6 md:p-8 rounded-3xl text-sm leading-relaxed overflow-hidden shadow-sm",
                  m.role === "user"
                    ? "bg-muted/50 text-foreground border border-border/40"
                    : "bg-card/40 backdrop-blur-xl border border-border/10 text-foreground"
                )}
              >
                <div className="prose prose-sm dark:prose-invert font-medium max-w-none">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>

                {m.result && (
                  <div className="mt-8 space-y-10 border-t border-border/10 pt-10 text-left">
                    <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 flex items-start gap-4">
                      <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 text-left">Semantic Strategy</p>
                        <p className="text-sm text-muted-foreground leading-relaxed italic text-left">{m.result.summary}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {m.result.clusters.map((cluster, i) => (
                        <ClusterCard key={i} cluster={cluster} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-4 p-6 bg-muted/20 rounded-3xl max-w-fit animate-pulse ml-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <div className="space-y-1">
              <span className="block text-sm font-semibold tracking-tight">Architecting Keyword Ecosystem...</span>
              <span className="block text-[10px] uppercase font-bold text-muted-foreground">Analyzing semantic relevance and intent gaps</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Input Console ── */}
      <div className="pb-10 px-6">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="absolute left-6 z-10 p-2 hover:bg-muted rounded-full transition-all text-muted-foreground">
                <Plus className="w-6 h-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 p-2 bg-background/95 backdrop-blur-xl border border-border/40 shadow-2xl rounded-2xl">
              <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Trend Analysis</span>
                  <span className="text-[10px] text-muted-foreground">Emerging search queries</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted">
                <Search className="w-4 h-4 text-blue-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Competitor Gaps</span>
                  <span className="text-[10px] text-muted-foreground">Target their weaknesses</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), handleGenerate(input))
            }
            placeholder="Enter search context (e.g. 'Software for solar installation management')..."
            className="w-full min-h-[64px] bg-muted/40 border-border/40 rounded-[2rem] pl-16 pr-44 py-5 resize-none focus:border-primary/40 shadow-sm transition-shadow hover:shadow-md"
          />

          <div className="absolute right-3 flex items-center gap-2">
            <Button
              onClick={() => handleGenerate(input)}
              disabled={isGenerating || !input.trim()}
              className="h-11 px-6 rounded-full font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:scale-105 transition-all shadow-lg active:scale-95 border-none"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Analyze <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-8 mt-4 opacity-40 grayscale group-hover:grayscale-0 transition-all">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">High Precision</p>
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Intent Based</p>
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">SEO Optimized</p>
        </div>
      </div>
    </div>
  );
}
