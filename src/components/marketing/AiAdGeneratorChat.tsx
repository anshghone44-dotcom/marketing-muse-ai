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
  Megaphone,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Globe,
  MessageSquare,
  FileText,
  Target,
  TrendingUp,
  Lightbulb,
  BarChart3,
  Check,
  Zap,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CompanyData } from "./CompanyForm";
import {
  generateAdCampaigns,
  type AdCampaignResult,
  type AdCampaign,
} from "@/lib/geminiAdService";

export const SOCIAL_PLATFORMS = [
  { id: "Instagram", icon: Instagram, color: "text-pink-500" },
  { id: "Facebook", icon: Facebook, color: "text-blue-500" },
  { id: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
  { id: "YouTube", icon: Youtube, color: "text-red-500" },
  { id: "TikTok", icon: MessageSquare, color: "text-slate-400" },
  { id: "Google", icon: Globe, color: "text-green-500" },
];

export const AD_GOALS = [
  "Lead Generation",
  "Brand Awareness",
  "Website Traffic",
  "Direct Sales",
  "App Downloads",
];

const PLATFORM_ACCENT: Record<string, string> = {
  Instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  Facebook: "bg-blue-600",
  LinkedIn: "bg-blue-700",
  YouTube: "bg-red-600",
  TikTok: "bg-slate-900",
  Google: "bg-blue-500",
};

const PLATFORM_BG: Record<string, string> = {
  Instagram: "from-purple-500/15 to-pink-500/15",
  Facebook: "from-blue-600/15 to-indigo-600/15",
  LinkedIn: "from-blue-700/15 to-slate-700/15",
  YouTube: "from-red-600/15 to-orange-600/15",
  TikTok: "from-slate-800/15 to-pink-500/15",
  Google: "from-blue-500/15 to-green-500/15",
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  result?: AdCampaignResult;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

function CampaignCard({ campaign }: { campaign: AdCampaign }) {
  const accent = PLATFORM_ACCENT[campaign.platform] || "bg-primary";
  const bg = PLATFORM_BG[campaign.platform] || "from-primary/10 to-primary/5";
  const PlatformIcon =
    SOCIAL_PLATFORMS.find((p) => p.id === campaign.platform)?.icon || Megaphone;

  return (
    <div className="bg-card backdrop-blur-xl border border-border/40 rounded-[2rem] overflow-hidden shadow-sm text-left">
      <div
        className={cn(
          "bg-gradient-to-br p-6 flex items-center justify-between",
          bg
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <PlatformIcon className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
              Platform
            </p>
            <h4 className="text-base font-black text-white">{campaign.platform}</h4>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-white uppercase tracking-wider">
            {campaign.adFormat}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-white/70 uppercase tracking-wider">
            {campaign.tone}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="space-y-1 text-left">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Headline
          </p>
          <p className="text-xl font-black text-foreground leading-tight">
            {campaign.headline}
          </p>
        </div>

        <div className="space-y-1 text-left">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Ad Copy
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {campaign.primaryText}
          </p>
        </div>

        <div
          className={cn(
            "inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-black text-white shadow-lg",
            accent
          )}
        >
          <Zap className="w-3.5 h-3.5" />
          {campaign.callToAction}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-border/10 text-left">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Target className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Target Audience
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{campaign.targetAudience}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Hashtags
            </p>
            <div className="flex flex-wrap gap-1">
              {campaign.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-muted/60 text-[10px] font-semibold text-muted-foreground"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>
        </div>

        {campaign.proTips.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/10 text-left">
            <div className="flex items-center gap-1.5 text-primary">
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Expert Tips
              </span>
            </div>
            {campaign.proTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground text-left">
                <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                {tip}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AiAdGeneratorChat({ companyData, onCompanySubmit }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingLabel, setGeneratingLabel] = useState("Crafting campaigns…");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "Instagram",
  ]);
  const [selectedGoal, setSelectedGoal] = useState("Lead Generation");
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  type SourceType = "platforms" | "files";
  const [selectedSource, setSelectedSource] = useState<SourceType | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const generateAds = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform.");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);
    setGeneratingLabel(`Crafting ${selectedPlatforms.length} campaign(s) with Gemini…`);

    const companyName = companyData?.name?.trim() ?? "";
    const companyIndustry = companyData?.industry?.trim() ?? "";
    const companyProduct = companyData?.product?.trim() ?? "";
    const companyAudience = companyData?.audience?.trim() ?? "";

    try {
      const result = await generateAdCampaigns(
        trimmed,
        selectedPlatforms,
        selectedGoal,
        companyName,
        companyIndustry,
        companyProduct,
        companyAudience
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Here are your **${selectedPlatforms.length} professional ad campaigns** targeting **${selectedGoal}**. Each is tailored to the platform's unique audience and best practices.`,
        result,
      };
      setMessages((prev) => [...prev, aiResponse]);
      toast.success("Ad campaigns generated successfully!");
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err && typeof err === 'object' && 'message' in err && typeof (err as { message?: string }).message === 'string'
          ? (err as { message: string }).message
          : "Failed to generate campaigns. Please try again.";
      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
      setInput("");
      setSelectedSource(null);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-5xl mx-auto relative bg-transparent overflow-y-auto px-4 py-8">
      {/* ── Header Card ── */}
      {messages.length === 0 && !isGenerating && (
        <div className="w-full bg-card/80 border border-border/40 rounded-[2.5rem] p-12 mb-8 text-center shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-foreground mb-4">
            LeadBot <span className="font-semibold text-muted-foreground/60">Ad Creator</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Describe your campaign goal and let Isaac AI craft professional ad copy for every platform.
          </p>
        </div>
      )}

      {/* ── Platform selection chips (Modern minimalist style) ── */}
      {messages.length === 0 && !isGenerating && (
        <div className="flex flex-wrap items-center gap-2 justify-center mb-10 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100">
          {SOCIAL_PLATFORMS.map(({ id }) => {
            const selected = selectedPlatforms.includes(id);
            return (
              <button
                key={id}
                onClick={() => togglePlatform(id)}
                className={cn(
                  "px-5 py-2 rounded-full text-[12px] font-semibold border transition-all duration-300",
                  selected
                    ? "bg-muted border-border/60 text-foreground"
                    : "bg-background border-border/30 text-muted-foreground hover:border-primary/20"
                )}
              >
                {id}
              </button>
            );
          })}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-5 py-2 rounded-full text-[12px] font-semibold border border-purple-200/50 bg-purple-50/30 text-purple-600 hover:bg-purple-100/50 transition-all flex items-center gap-1">
                Goal: {selectedGoal}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 bg-background/95 backdrop-blur-xl border border-border/40 rounded-2xl p-1.5 shadow-2xl">
              {AD_GOALS.map((goal) => (
                <DropdownMenuItem
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors",
                    selectedGoal === goal ? "text-primary font-bold bg-primary/20" : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    {goal}
                    {selectedGoal === goal && <Check className="w-4 h-4 text-primary" />}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* ── Campaign Input Card ── */}
      {messages.length === 0 && !isGenerating && (
        <div className="w-full bg-card/30 border border-border/20 rounded-[2.5rem] p-8 md:p-10 shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-16 duration-700 delay-200 text-left">
          <label className="block text-sm font-bold text-foreground mb-4">
            Campaign goal
          </label>
          <div className="relative group">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), generateAds(input))
              }
              placeholder="Describe your campaign goal (e.g. acquire 500 ecommerce leads in 30 days)..."
              className="w-full min-h-[120px] bg-background border border-border/40 rounded-2xl p-6 text-sm resize-none focus:border-primary/40 transition-shadow hover:shadow-md"
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-6">
               <Button
                onClick={() => generateAds(input)}
                disabled={isGenerating || !input.trim()}
                className="h-12 px-8 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90 transition-all shadow-md"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : "Generate"}
              </Button>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground opacity-60">
            Powering results with Gemini-inspired professional ads format.
          </p>
        </div>
      )}

      {/* ── Chat Content (After Generation) ── */}
      <div
        ref={scrollRef}
        className={cn(
          "space-y-12 scroll-smooth",
          messages.length > 0 ? "flex-1 overflow-y-auto" : "hidden"
        )}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex w-full animate-in fade-in slide-in-from-bottom-8 duration-700",
              m.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn("max-w-4xl w-full space-y-4", m.role === "user" ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "p-8 md:p-10 rounded-[2.5rem] text-sm leading-relaxed overflow-hidden shadow-sm text-left w-full",
                  m.role === "user"
                    ? "bg-muted/30 text-foreground border border-border/40"
                    : "bg-card border border-border/20 text-foreground"
                )}
              >
                <div className="prose prose-sm dark:prose-invert font-medium text-left max-w-none">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>

                {/* ── Campaign Results ── */}
                {m.result && (
                  <div className="mt-12 space-y-12 border-t border-border/10 pt-12 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-muted/10 border border-border/10 rounded-[2rem] p-6 space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                          <TrendingUp className="w-5 h-5" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Overall Strategy</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{m.result.overallStrategy}</p>
                      </div>
                      <div className="bg-muted/10 border border-border/10 rounded-[2rem] p-6 space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                          <BarChart3 className="w-5 h-5" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">KPIs to Track</span>
                        </div>
                        <ul className="space-y-2">
                          {m.result.kpis.map((kpi, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                              {kpi}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center gap-2">
                        <Megaphone className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold tracking-tight">Platform Campaigns</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {m.result.campaigns.map((camp, i) => (
                          <CampaignCard key={i} campaign={camp} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-4 p-8 bg-muted/20 rounded-[2rem] max-w-fit animate-pulse">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-base font-semibold tracking-tight">{generatingLabel}</span>
          </div>
        )}
      </div>

      {/* ── Re-draft Button (Visible after results) ── */}
      {messages.length > 0 && (
         <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
           <Button
            onClick={() => { setMessages([]); setInput(""); }}
            variant="outline"
            className="rounded-full px-8 h-12 bg-background/80 backdrop-blur-md border-border/40 hover:bg-muted font-bold flex items-center gap-2"
           >
             <Plus className="w-4 h-4" />
             Start New Campaign
           </Button>
         </div>
      )}
    </div>
  );
}
