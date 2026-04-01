import { useState, useRef, useEffect, useCallback } from "react";
import {
  Download,
  Loader2,
  ArrowUp,
  Sparkles,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CompanyData } from "./CompanyForm";
import { callVisualAdGateway, type VisualAdResult } from "@/lib/geminiVisualAdService";

// ─── Template definitions ──────────────────────────────────────────
export const AD_TEMPLATES = [
  { id: "instagram-square",  label: "Instagram Square",   width: 1080, height: 1080, aspect: "1/1",    icon: "⬛" },
  { id: "facebook-feed",     label: "Facebook Feed",      width: 1200, height: 628,  aspect: "1.91/1", icon: "📘" },
  { id: "linkedin-banner",   label: "LinkedIn Banner",    width: 1584, height: 396,  aspect: "4/1",    icon: "💼" },
  { id: "whatsapp-story",    label: "WhatsApp Status",    width: 1080, height: 1920, aspect: "9/16",   icon: "📱" },
  { id: "story",             label: "Story (9:16)",       width: 1080, height: 1920, aspect: "9/16",   icon: "📱" },
  { id: "youtube-thumb",     label: "YouTube Thumbnail",  width: 1280, height: 720,  aspect: "16/9",   icon: "▶️" },
] as const;

type TemplateId = typeof AD_TEMPLATES[number]["id"];
type LogoPosition = "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right";
type TextAlign = "left" | "center" | "right";

interface DesignState {
  templateId: TemplateId;
  headline: string;
  body: string;
  cta: string;
  logoPosition: LogoPosition;
  textAlign: TextAlign;
  overlayStrength: number;
  fontSize: number;
  ctaStyle: "filled" | "outline" | "ghost";
  themeId: string;
  customBg: string;
  customAccent: string;
  overlayColor: string;
  campaignObjective: string;
  visualDirection: string;
}

const AUTONOMOUS_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  design?: DesignState;
  backgroundUrl?: string;
  companyName?: string;
  logoUrl?: string;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

// ─── Inline Ad Preview Component ────────────────────────────────────
function InlineAdPreview({ design, backgroundUrl, companyName, logoUrl }: { design: DesignState, backgroundUrl: string, companyName: string, logoUrl?: string }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const template = AD_TEMPLATES.find((t) => t.id === design.templateId) || AD_TEMPLATES[0];
  const bgColor = design.customBg;
  const accentColor = design.customAccent;

  const logoPos: React.CSSProperties =
    design.logoPosition === "top-left"     ? { top: "5%", left: "5%" }   :
    design.logoPosition === "top-right"    ? { top: "5%", right: "5%" }  :
    design.logoPosition === "top-center"   ? { top: "5%", left: "50%", transform: "translateX(-50%)" } :
    design.logoPosition === "bottom-left"  ? { bottom: "5%", left: "5%" } :
    { bottom: "5%", right: "5%" };

  const isStory     = design.templateId === "story" || design.templateId === "whatsapp-story";
  const isLinkedIn  = design.templateId === "linkedin-banner";
  const isYouTube   = design.templateId === "youtube-thumb";

  const contentVAlign = isLinkedIn ? "center" : isStory ? "flex-end" : "center";
  const fontScale = design.fontSize / 100;
  const headlineSize = isLinkedIn ? `${1.4 * fontScale}rem` : isStory || isYouTube ? `${2 * fontScale}rem` : `${1.75 * fontScale}rem`;
  const bodySize     = `${0.875 * fontScale}rem`;

  const exportAd = async (format: "png" | "jpeg") => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      // @ts-ignore
      const { default: html2canvas } = await import("html2canvas");
      // @ts-ignore
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        scale: 3, 
        width: previewRef.current.offsetWidth,
        height: previewRef.current.offsetHeight,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `leadbot-ad-${design.templateId}-${Date.now()}.${format}`;
      link.href = canvas.toDataURL(`image/${format === "jpeg" ? "jpeg" : "png"}`, 1.0);
      link.click();
      toast.success(`Exported template successfully!`);
    } catch {
      toast.error("Export requires html2canvas. Run: npm install html2canvas");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-4 max-w-[600px]">
      <div
        className="w-full relative overflow-hidden rounded-xl shadow-lg border border-slate-200"
        style={{ backgroundColor: bgColor, aspectRatio: template.aspect }}
        ref={previewRef}
      >
        {/* Dynamic Professional Layouts */}
        {isLinkedIn ? (
          <>
            <div className="absolute inset-y-0 right-0 w-[60%] overflow-hidden">
               <img src={backgroundUrl} alt="Background" className="w-full h-full object-cover" crossOrigin="anonymous" />
               <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
            </div>
            <div className="absolute inset-y-0 left-0 w-[55%] bg-slate-900 shadow-2xl" style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)", backgroundColor: bgColor }} />
          </>
        ) : isStory ? (
          <>
            <img src={backgroundUrl} alt="Background" className="absolute inset-x-0 top-0 h-[70%] w-full object-cover" crossOrigin="anonymous" />
            <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-slate-900 via-slate-900 to-transparent" />
            <div className="absolute top-20 right-[-20px] w-32 h-32 rounded-full border-[8px] border-white/10" />
          </>
        ) : design.templateId === "instagram-square" ? (
          <>
            <img src={backgroundUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover scale-150 blur-sm brightness-50" crossOrigin="anonymous" />
            <div className="absolute inset-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden shadow-2xl">
               <img src={backgroundUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-80" crossOrigin="anonymous" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            </div>
          </>
        ) : (
          <>
            <img src={backgroundUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" crossOrigin="anonymous" />
            <div className="absolute inset-0 bg-gradient-to-tl from-slate-900/95 via-slate-900/80 to-transparent" style={{ backgroundColor: bgColor !== "#0f172a" ? bgColor : undefined }} />
            <div className="absolute bottom-[-10%] right-[-5%] w-[120%] h-[40%] bg-blue-500/20 blur-3xl rotate-12 rounded-full" />
          </>
        )}

        {/* Autonomous or Uploaded Logo */}
        <div className="absolute z-20 flex items-center" style={logoPos}>
           {logoUrl ? (
             <img src={logoUrl} alt="Logo" className="object-contain" style={{ maxHeight: isLinkedIn ? "3rem" : "4rem", maxWidth: "10rem", imageRendering: "auto" }} crossOrigin="anonymous" />
           ) : (
             <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="font-bold text-white text-sm tracking-tight">{companyName || "YourBrand"}</span>
             </div>
           )}
        </div>

        {/* Ad Text Content */}
        <div
          className="relative z-10 w-full h-full p-6 sm:p-10 flex flex-col"
          style={{ justifyContent: contentVAlign, alignItems: design.textAlign === "center" ? "center" : design.textAlign === "right" ? "flex-end" : "flex-start", textAlign: design.textAlign }}
        >
          {design.headline && (
            <h1 className="font-bold tracking-tight text-white mb-3 drop-shadow-md leading-tight" style={{ fontSize: headlineSize }}>
              {design.headline}
            </h1>
          )}
          {design.body && (
            <p className="font-medium text-white/90 mb-6 drop-shadow" style={{ fontSize: bodySize, maxWidth: isLinkedIn ? "60%" : "90%" }}>
              {design.body}
            </p>
          )}
          {design.cta && (
            <div
              className="px-6 py-2.5 rounded-full font-bold text-sm tracking-wide shadow-lg border border-transparent"
              style={{
                backgroundColor: design.ctaStyle === "filled" ? accentColor : "transparent",
                color: design.ctaStyle === "filled" ? "#ffffff" : accentColor,
                borderColor: design.ctaStyle === "outline" ? accentColor : "transparent",
              }}
            >
              {design.cta}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={() => exportAd("png")} variant="outline" size="sm" disabled={isExporting} className="rounded-full shadow-sm text-xs font-semibold">
          {isExporting ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Download className="w-3.5 h-3.5 mr-2" />}
          Download PNG
        </Button>
        <span className="text-xs text-slate-500 font-medium">Auto-generated {template.label} format</span>
      </div>
    </div>
  );
}

// ─── Main Conversational UI ──────────────────────────────────────
export default function VisualAdTemplateGenerator({ companyData }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const generateAd = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);
    setInput("");

    const companyName = companyData?.name?.trim() || "Acme Corp";

    try {
      const result: VisualAdResult = await callVisualAdGateway(trimmed, companyData);

      // Extract requested format and automatically size it
      const lowerInput = trimmed.toLowerCase();
      let selectedTemplateId: TemplateId = "instagram-square";
      if (lowerInput.includes("whatsapp")) selectedTemplateId = "whatsapp-story";
      else if (lowerInput.includes("story")) selectedTemplateId = "story";
      else if (lowerInput.includes("facebook")) selectedTemplateId = "facebook-feed";
      else if (lowerInput.includes("linkedin")) selectedTemplateId = "linkedin-banner";
      else if (lowerInput.includes("youtube") || lowerInput.includes("thumbnail")) selectedTemplateId = "youtube-thumb";

      const matchedTemplate = AD_TEMPLATES.find((t) => t.id === selectedTemplateId) || AD_TEMPLATES[0];

      // Autonomous parameter generation
      const design: DesignState = {
        templateId: matchedTemplate.id,
        headline: result.headline || "Your powerful headline",
        body: result.body || "Supporting description",
        cta: result.cta || "Apply Now",
        logoPosition: (result.logoPosition as LogoPosition) ?? "top-left",
        textAlign: (result.textAlign as TextAlign) ?? "center",
        overlayStrength: 0,
        fontSize: 100,
        ctaStyle: "filled",
        themeId: "custom",
        customBg: "#0f172a",
        customAccent: "#3b82f6",
        overlayColor: "transparent",
        campaignObjective: result.campaignObjective ?? "",
        visualDirection: result.visualDirection ?? "",
      };

      const summaryMd = `### Auto-Generated Template Complete\n\nI've generated a high-converting **${matchedTemplate.label}** ad template for your campaign. The layout, sizing, and styling have been aligned securely.\n\n**Campaign Objective:** ${result.campaignObjective}\n**Visual Strategy:** ${result.visualDirection}`;
      
      const randomBg = AUTONOMOUS_BACKGROUNDS[Math.floor(Math.random() * AUTONOMOUS_BACKGROUNDS.length)];

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: summaryMd,
        design: design,
        backgroundUrl: randomBg,
        companyName: companyName,
        logoUrl: uploadedLogo || undefined,
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate ad template. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateAd();
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedLogo(event.target?.result as string);
        toast.success("Logo uploaded and ready!");
      };
      reader.readAsDataURL(file);
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
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-4 shrink-0 mt-1 shadow-sm border border-slate-200">
                <Sparkles className="w-4 h-4 text-slate-500" />
              </div>
            )}
            <div className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}>
               <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-5 py-4 text-[15px] leading-relaxed",
                    m.role === "user"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "prose prose-sm font-normal text-slate-900 max-w-none text-left bg-transparent"
                  )}
                >
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
               
               {/* Autonomous Template Preview */}
               {m.design && m.backgroundUrl && m.companyName && (
                  <InlineAdPreview design={m.design} backgroundUrl={m.backgroundUrl} companyName={m.companyName} />
               )}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex w-full animate-in fade-in duration-500 justify-start items-center">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-4 shrink-0 border border-slate-200">
               <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
            </div>
            <div className="text-slate-500 text-sm font-medium animate-pulse">
              Architecting autonomous ad template...
            </div>
          </div>
        )}
      </div>

      {/* ── Empty State & Central Search ── */}
      {messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-16 pointer-events-none px-4 text-center">
          <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl md:text-5xl font-sans tracking-tight text-slate-900">
              <span className="font-bold">LeadBot</span> <span className="font-light drop-shadow-sm">Template Architect</span>
            </h1>
          </div>
          <p className="text-slate-500 font-medium max-w-md mx-auto text-sm">
            Describe your campaign (e.g. "Create a WhatsApp status ad for Canada PR"). I will autonomously handle the sizing, styling, and copy formatting.
          </p>
        </div>
      )}

      {/* ── Input Bar (Grok Style) ── */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 px-4 pb-8 pt-4 transition-all duration-700 ease-in-out z-20",
        messages.length > 0 ? "bg-gradient-to-t from-white via-white to-transparent" : "",
        messages.length === 0 ? "top-[60%] -translate-y-1/2 pt-16 flex flex-col justify-center" : ""
      )}>
        <div className="max-w-3xl mx-auto w-full relative group shadow-2xl rounded-[2rem] border border-slate-200">
          
          <div className="relative flex items-center bg-white rounded-[2rem] overflow-visible p-1.5 pl-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "p-2.5 transition-colors shrink-0 flex items-center gap-2", 
                uploadedLogo ? "text-blue-600 bg-blue-50 rounded-xl" : "text-slate-400 hover:text-slate-600"
              )}
              title="Upload custom logo"
            >
              <Paperclip className="w-5 h-5" />
              {uploadedLogo && <span className="text-xs font-semibold mr-1">Logo Added</span>}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Create a WhatsApp status ad for skilled workers..."
              className="flex-1 min-w-0 bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] px-3 py-4 placeholder:text-slate-400 font-medium text-slate-900"
            />

            <div className="flex items-center gap-1.5 shrink-0 pr-1">
              <button
                onClick={generateAd}
                disabled={isGenerating || !input.trim()}
                className={cn(
                  "px-4 py-2.5 rounded-full flex items-center justify-center transition-all duration-300 font-bold text-sm",
                  input.trim() 
                    ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md" 
                    : "bg-slate-100 text-slate-400 pointer-events-none"
                )}
              >
                Generate <ArrowUp className="w-4 h-4 ml-1.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
        
        {messages.length === 0 && (
           <p className="text-[11px] text-center text-slate-400 mt-6 absolute w-full left-0 bottom-4 animate-in fade-in duration-1000 delay-300">
             100% Autonomous • No image or logo uploads required.
           </p>
        )}
      </div>
    </div>
  );
}
