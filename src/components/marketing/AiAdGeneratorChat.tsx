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
    <div className="bg-card/40 backdrop-blur-xl border border-border/20 rounded-3xl overflow-hidden shadow-sm">
      {/* Platform header banner */}
      <div
        className={cn(
          "bg-gradient-to-br p-6 flex items-center justify-between",
          bg
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
            <PlatformIcon className="w-5 h-5 text-white" />
          </div>
          <div>
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

      {/* Ad preview */}
      <div className="p-6 space-y-5">
        {/* Headline */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Headline
          </p>
          <p className="text-xl font-black text-foreground leading-tight">
            {campaign.headline}
          </p>
        </div>

        {/* Primary text */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Ad Copy
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {campaign.primaryText}
          </p>
        </div>

        {/* CTA pill */}
        <div
          className={cn(
            "inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-black text-white shadow-lg",
            accent
          )}
        >
          <Zap className="w-3.5 h-3.5" />
          {campaign.callToAction}
        </div>

        {/* Target audience & hashtags row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-border/10">
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

        {/* Pro tips */}
        {campaign.proTips.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/10">
            <div className="flex items-center gap-1.5 text-primary">
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Expert Tips
              </span>
            </div>
            {campaign.proTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
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
    "Facebook",
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
    <div className="flex flex-col h-[85vh] max-w-6xl mx-auto relative bg-transparent overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-24 pointer-events-none px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-sans font-bold tracking-tight text-foreground mb-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            LeadBot Ad Creator
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed opacity-80 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Describe your campaign goal and let Isaac AI craft professional ad copy for every platform.
          </p>
        </div>

      {/* ── Platform selector bar (always visible) ── */}
      <div className="flex-shrink-0 px-6 pt-4 flex flex-wrap items-center gap-2 justify-center">
        {SOCIAL_PLATFORMS.map(({ id, icon: Icon, color }) => {
          const selected = selectedPlatforms.includes(id);
          return (
            <button
              key={id}
              onClick={() => togglePlatform(id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200",
                selected
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                  : "bg-muted/40 border-border/40 text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", selected ? "text-primary-foreground" : color)} />
              {id}
            </button>
          );
        })}

        {/* Goal selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border border-border/40 bg-muted/40 text-muted-foreground hover:bg-muted transition-all">
              <BarChart3 className="w-3.5 h-3.5 text-primary" />
              Goal: {selectedGoal}
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48 bg-background/95 backdrop-blur-xl border border-border/40 rounded-2xl p-1">
            {AD_GOALS.map((goal) => (
              <DropdownMenuItem
                key={goal}
                onClick={() => setSelectedGoal(goal)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm cursor-pointer",
                  selectedGoal === goal && "text-primary font-bold bg-primary/5"
                )}
              >
                {selectedGoal === goal && <Check className="w-3.5 h-3.5 mr-2 text-primary" />}
                {goal}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
            <div className={cn("max-w-[90%] space-y-4", m.role === "user" ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "p-6 md:p-8 rounded-3xl text-base leading-relaxed overflow-hidden shadow-sm",
                  m.role === "user"
                    ? "bg-muted/50 text-foreground border border-border/40"
                    : "bg-card/40 backdrop-blur-xl border border-border/10 text-foreground"
                )}
              >
                <div className="prose prose-base dark:prose-invert font-medium">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>

                {/* ── Campaign Results ── */}
                {m.result && (
                  <div className="mt-8 space-y-10 border-t border-border/10 pt-10">

                    {/* Overall strategy + KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-muted/20 border border-border/10 rounded-2xl p-5 space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Overall Strategy</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{m.result.overallStrategy}</p>
                      </div>
                      <div className="bg-muted/20 border border-border/10 rounded-2xl p-5 space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                          <BarChart3 className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">KPIs to Track</span>
                        </div>
                        <ul className="space-y-1">
                          {m.result.kpis.map((kpi, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                              {kpi}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 flex items-start gap-3">
                      <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Budget Recommendation</p>
                        <p className="text-sm text-muted-foreground">{m.result.budgetRecommendation}</p>
                      </div>
                    </div>

                    {/* Per-platform campaign cards */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold tracking-tight">Platform Campaigns</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="flex items-center gap-4 p-6 bg-muted/20 rounded-3xl max-w-fit animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-semibold tracking-tight">{generatingLabel}</span>
          </div>
        )}
      </div>

      {/* ── Input Console (mirrors Competitor Analyzer) ── */}
      <div className="pb-10 px-6">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "absolute left-6 z-10 p-2 hover:bg-muted rounded-full transition-all text-muted-foreground",
                  selectedSource && "bg-primary/10 text-primary"
                )}
              >
                <Plus
                  className={cn(
                    "w-6 h-6 transition-transform",
                    selectedSource ? "rotate-45" : ""
                  )}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-64 p-2 bg-background/95 backdrop-blur-xl border border-border/40 shadow-2xl rounded-2xl"
            >
              <DropdownMenuItem
                onClick={() => setSelectedSource("platforms")}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted"
              >
                <Megaphone className="w-4 h-4 text-orange-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Ad Campaign</span>
                  <span className="text-[10px] text-muted-foreground">
                    Describe your campaign goal
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedSource("files");
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Upload Brief</span>
                  <span className="text-[10px] text-muted-foreground">PDF or DOC Files</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <input
            type="file"
            ref={fileInputRef}
            onChange={() =>
              toast.info("For best results, describe your campaign goal in the text box.")
            }
            className="hidden"
            accept=".pdf,.doc,.docx"
          />

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), generateAds(input))
            }
            placeholder="Describe your campaign goal (e.g. 'Generate leads for our new fitness app targeting women 25–40')..."
            className="w-full min-h-[64px] bg-muted/40 border-border/40 rounded-[2rem] pl-16 pr-44 py-5 resize-none focus:border-primary/40 shadow-sm transition-shadow hover:shadow-md"
          />

          <div className="absolute right-3 flex items-center gap-2">
            <Button
              onClick={() => generateAds(input)}
              disabled={isGenerating || !input.trim()}
              className="h-11 px-6 rounded-full font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:scale-105 transition-all shadow-lg active:scale-95 border-none"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Generate <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
