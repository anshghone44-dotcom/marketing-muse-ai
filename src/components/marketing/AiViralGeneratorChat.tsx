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
  Zap,
  Bot,
  User,
  Share2,
  Trophy,
  Users,
  Target,
  Check,
  Megaphone,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CompanyData } from "./CompanyForm";
import {
  generateViralIdeas,
  type ViralCampaignResult,
  type ViralCampaign,
} from "@/lib/viralGeneratorService";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  result?: ViralCampaignResult;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

function IdeaCard({ idea }: { idea: ViralCampaign }) {
  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border/20 rounded-3xl overflow-hidden shadow-sm hover:border-primary/30 transition-all group">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-lg font-black tracking-tight text-foreground">{idea.title}</h4>
          </div>
          <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
            {idea.platforms.map((p) => (
              <span key={p} className="px-2 py-0.5 rounded-full bg-muted text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                {p}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-foreground font-bold italic border-l-2 border-primary/30 pl-3 leading-relaxed">
          {idea.description}
        </p>

        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-3">
            <Users className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mechanics</p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{idea.mechanics}</p>
            </div>
          </div>

          {idea.prize && (
            <div className="flex items-start gap-3">
              <Trophy className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Incentive / Prize</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{idea.prize}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Target className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Virality Hook</p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{idea.whyItWorks}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center border-t border-border/10">
          <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Strategy Optimized</span>
          <Button variant="ghost" size="sm" className="h-8 text-[10px] gap-2 font-black uppercase text-primary hover:bg-primary/5">
            <Share2 className="w-3.5 h-3.5" />
            Export Concept
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AiViralGeneratorChat({ companyData, onCompanySubmit }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const generateIdeas = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);
    setInput("");

    try {
      const result = await generateViralIdeas(
        trimmed,
        companyData?.name,
        companyData?.industry,
        companyData?.product,
        companyData?.audience
      );

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I've architected **3 specialized viral campaign strategies** optimized for your business objectives. These concepts focus on organic loops and high-intensity consumer participation.`,
        result,
      };

      setMessages((prev) => [...prev, aiMsg]);
      toast.success("Viral architecture drafted!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate viral ideas.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-6xl mx-auto relative bg-transparent overflow-hidden">
      {/* ── Empty State ── */}
      {messages.length === 0 && !isGenerating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-24 pointer-events-none px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-foreground mb-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            LeadBot <span className="font-light text-muted-foreground/60">Viral Architect</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed opacity-80 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Describe your growth objective and let Gemini AI architect professional, high-impact viral loops for your business.
          </p>
        </div>
      )}

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
                  {m.role === "user" ? "Objective" : "Strategy Architect"}
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
                    <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5 flex items-start gap-4">
                      <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 text-left">Strategic Overview</p>
                        <p className="text-sm text-muted-foreground leading-relaxed italic text-left">{m.result.summary}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {m.result.ideas.map((idea, i) => (
                        <IdeaCard key={i} idea={idea} />
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
              <span className="block text-sm font-semibold tracking-tight">Architecting Viral Loops...</span>
              <span className="block text-[10px] uppercase font-bold text-muted-foreground">Engineering high-impact participation strategies</span>
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
                <Megaphone className="w-4 h-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Growth Campaign</span>
                  <span className="text-[10px] text-muted-foreground">Traditional viral mechanics</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Incentive Loop</span>
                  <span className="text-[10px] text-muted-foreground">Reward-based virality</span>
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
              (e.preventDefault(), generateIdeas(input))
            }
            placeholder="Describe your viral goal (e.g. 'Generate buzz for our referral program launch')..."
            className="w-full min-h-[64px] bg-muted/40 border-border/40 rounded-[2rem] pl-16 pr-44 py-5 resize-none focus:border-primary/40 shadow-sm transition-shadow hover:shadow-md"
          />

          <div className="absolute right-3 flex items-center gap-2">
            <Button
              onClick={() => generateIdeas(input)}
              disabled={isGenerating || !input.trim()}
              className="h-11 px-6 rounded-full font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:scale-105 transition-all shadow-lg active:scale-95 border-none"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Draft <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-8 mt-4 opacity-40 grayscale group-hover:grayscale-0 transition-all">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Strategic Virality</p>
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Consumer Centric</p>
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">High Intensity</p>
        </div>
      </div>
    </div>
  );
}
