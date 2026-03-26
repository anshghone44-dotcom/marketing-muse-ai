import { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Paperclip,
  Mic,
  ArrowUp,
  Loader2,
  Check,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CompanyData } from "./CompanyForm";
import {
  generateAdCampaigns,
  type AdCampaignResult,
} from "@/lib/geminiAdService";

export const AD_GOALS = [
  "Lead Generation",
  "Brand Awareness",
  "Website Traffic",
  "Direct Sales",
  "App Downloads",
];

export const SOCIAL_PLATFORMS = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "TikTok",
  "Google",
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

function formatResultToMarkdown(result: AdCampaignResult): string {
  let md = `### Overall Strategy\n${result.overallStrategy}\n\n`;
  md += `**Budget Recommendation:** ${result.budgetRecommendation}\n\n`;
  md += `**KPIs to Track:**\n`;
  result.kpis.forEach((kpi) => {
    md += `- ${kpi}\n`;
  });
  md += `\n---\n\n`;

  result.campaigns.forEach((camp) => {
    md += `### ${camp.platform} Campaign: ${camp.headline}\n`;
    md += `**Format:** ${camp.adFormat} | **Tone:** ${camp.tone}\n\n`;
    md += `> ${camp.primaryText}\n\n`;
    md += `**Call to Action:** ${camp.callToAction}\n\n`;
    md += `**Target Audience:** ${camp.targetAudience}\n\n`;
    if (camp.hashtags.length > 0) {
      md += `**Hashtags:** ${camp.hashtags.map(t => t.startsWith('#') ? t : `#${t}`).join(' ')}\n\n`;
    }
    if (camp.proTips.length > 0) {
      md += `**Expert Tips:**\n`;
      camp.proTips.forEach((tip) => {
        md += `- ${tip}\n`;
      });
      md += `\n`;
    }
  });

  return md;
}

export default function AiAdGeneratorChat({ companyData, onCompanySubmit }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("Auto");
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const generateAds = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);
    setInput("");

    const companyName = companyData?.name?.trim() ?? "";
    const companyIndustry = companyData?.industry?.trim() ?? "";
    const companyProduct = companyData?.product?.trim() ?? "";
    const companyAudience = companyData?.audience?.trim() ?? "";

    const goalToUse = selectedGoal === "Auto" ? "Lead Generation" : selectedGoal;

    try {
      const result = await generateAdCampaigns(
        trimmed,
        SOCIAL_PLATFORMS, // Generate for all platforms by default for maximum value
        goalToUse,
        companyName,
        companyIndustry,
        companyProduct,
        companyAudience
      );

      const markdownContent = formatResultToMarkdown(result);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: markdownContent,
      };
      setMessages((prev) => [...prev, aiResponse]);
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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateAds();
    }
  };

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-4xl mx-auto relative bg-transparent overflow-hidden">
      
      {/* ── Chat Area / Results ── */}
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
                  ? "bg-muted text-foreground"
                  : "prose prose-sm dark:prose-invert font-normal text-foreground max-w-none text-left bg-transparent"
              )}
            >
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex w-full animate-in fade-in duration-500 justify-start items-center">
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center mr-4 shrink-0">
               <Loader2 className="w-4 h-4 text-background animate-spin" />
            </div>
            <div className="text-muted-foreground text-sm font-medium animate-pulse">
              Generating campaigns...
            </div>
          </div>
        )}
      </div>

      {/* ── Empty State & Central Search ── */}
      {messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-16 pointer-events-none px-4 text-center">
          <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl md:text-5xl font-sans tracking-tight text-foreground">
              <span className="font-bold">LeadBot</span> <span className="font-light">Ad Creator</span>
            </h1>
          </div>
        </div>
      )}

      {/* ── Input Bar (Grok Style) ── */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 px-4 pb-8 pt-4 transition-all duration-700 ease-in-out z-20",
        messages.length > 0 ? "bg-gradient-to-t from-background via-background to-transparent" : "",
        messages.length === 0 ? "top-1/2 -translate-y-1/2 pt-16 flex flex-col justify-center" : ""
      )}>
        <div className="max-w-3xl mx-auto w-full relative group">
          
          {/* Main Input Pill */}
          <div className="relative flex items-center bg-background rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 overflow-visible p-1.5 pl-3">
            
            {/* Left Attachment Icon */}
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

            {/* Main Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Generate any ad campaign"
              className="flex-1 min-w-0 bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] px-3 py-4 placeholder:text-muted-foreground/60 font-medium"
            />

            {/* Right Controls Container */}
            <div className="flex items-center gap-1.5 shrink-0 pr-1">
              
              {/* Analyze Button */}
              <button
                onClick={generateAds}
                disabled={isGenerating || !input.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold text-primary bg-primary/10 hover:opacity-80 transition-opacity mr-1 disabled:opacity-50 disabled:pointer-events-none"
              >
                Analyze
              </button>

              {/* Submit Button */}
              <button
                onClick={generateAds}
                disabled={isGenerating || !input.trim()}
                className={cn(
                  "p-2.5 rounded-full flex items-center justify-center transition-all duration-300",
                  input.trim() 
                    ? "bg-muted text-foreground hover:bg-muted/80" 
                    : "bg-muted/50 text-muted-foreground/30 pointer-events-none"
                )}
              >
                <ArrowUp className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

        </div>
        
        {/* Footer Legal Text */}
        {messages.length === 0 && (
           <p className="text-[11px] text-center text-muted-foreground/60 mt-6 absolute w-full left-0 bottom-4 animate-in fade-in duration-1000 delay-300">
             By messaging LeadBot, you agree to our Terms and Privacy Policy.
           </p>
        )}
      </div>

    </div>
  );
}
