import { useState, useRef, useEffect, useCallback } from "react";
import {
  Download,
  Loader2,
  ArrowUp,
  Sparkles,
  Paperclip,
  UploadCloud,
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
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80", // Aviation / Clouds
  "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80", // Vintage Luggage & Maps
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", // Tropical Beach
  "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1200&q=80", // Modern Airport Terminal
  "https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&w=1200&q=80", // Global Travel / Globe
  "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?auto=format&fit=crop&w=1200&q=80", // Stunning Horizon
  "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80", // Canadian Landscape / Lake Louise
];
// ─── Autonomous Color Palettes ──────────────────────────────────────
const THEME_PALETTES: { keywords: string[]; accent: string; bg: string }[] = [
  { keywords: ["canada", "pr", "immigration", "visa", "residency", "passport"],         accent: "#dc2626", bg: "#1a0a0a" }, // Canada Red
  { keywords: ["travel", "holiday", "vacation", "trip", "tour", "fly", "airline"],       accent: "#0ea5e9", bg: "#0c1a2e" }, // Sky Blue
  { keywords: ["luxury", "premium", "gold", "elite", "vip", "exclusive"],                accent: "#d97706", bg: "#0f0b00" }, // Gold
  { keywords: ["health", "medical", "wellness", "clinic", "doctor", "pharma"],           accent: "#10b981", bg: "#021814" }, // Emerald
  { keywords: ["linkedin", "professional", "corporate", "b2b", "business", "career"],   accent: "#2563eb", bg: "#0a1628" }, // LinkedIn Blue
  { keywords: ["real estate", "property", "home", "house", "apartment", "mortgage"],     accent: "#7c3aed", bg: "#120a1f" }, // Purple
  { keywords: ["food", "restaurant", "delivery", "chef", "cuisine", "menu"],             accent: "#f97316", bg: "#1a0800" }, // Orange
  { keywords: ["tech", "app", "software", "ai", "digital", "startup", "saas"],           accent: "#8b5cf6", bg: "#0d0d1a" }, // Violet
  { keywords: ["education", "course", "learn", "school", "university", "training"],      accent: "#14b8a6", bg: "#001a18" }, // Teal
  { keywords: ["fashion", "style", "clothing", "brand", "beauty", "cosmetics"],          accent: "#ec4899", bg: "#1a001a" }, // Pink
  { keywords: ["finance", "bank", "invest", "crypto", "trading", "money", "fund"],       accent: "#22c55e", bg: "#001a0a" }, // Green
];

function pickTheme(prompt: string): { accent: string; bg: string } {
  const lower = prompt.toLowerCase();
  for (const palette of THEME_PALETTES) {
    if (palette.keywords.some((k) => lower.includes(k))) {
      return { accent: palette.accent, bg: palette.bg };
    }
  }
  return { accent: "#3b82f6", bg: "#0f172a" }; // default blue
}

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

  const isStory    = design.templateId === "story" || design.templateId === "whatsapp-story";
  const isLinkedIn = design.templateId === "linkedin-banner";
  const isYouTube  = design.templateId === "youtube-thumb";

  const [isDark, setIsDark] = useState(true); // assume dark until measured

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = backgroundUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 50; canvas.height = 50;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 50, 50);
        const data = ctx.getImageData(0, 0, 50, 50).data;
        let brightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          brightness += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
        }
        const avg = brightness / (data.length / 4);
        setIsDark(avg < 140); // dark if average brightness below 140
      } catch {
        setIsDark(true); // default to dark on CORS failure
      }
    };
  }, [backgroundUrl]);

  const contentVAlign = "flex-end"; // always anchor text to bottom for consistent professional look
  const fontScale = design.fontSize / 100;
  const headlineSize = isLinkedIn ? `${1.6 * fontScale}rem` : isStory || isYouTube ? `${2.2 * fontScale}rem` : `${2 * fontScale}rem`;
  const bodySize     = `${0.9 * fontScale}rem`;

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
    <div className="mt-6 flex flex-col gap-4 max-w-[620px]">
      {/* ── Template Canvas ── */}
      <div
        className="w-full relative overflow-hidden rounded-2xl border border-slate-200"
        style={{ backgroundColor: bgColor, aspectRatio: template.aspect }}
        ref={previewRef}
      >
        {/* Clean edge-to-edge background */}
        <img src={backgroundUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" crossOrigin="anonymous" />
        {/* Themed gradient: dark bottom tinted with the autonomous accent color */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(to top, ${accentColor}cc 0%, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.15) 70%, transparent 100%)`
        }} />
        {/* Slim accent color strip at the very bottom edge */}
        <div className="absolute bottom-0 inset-x-0 h-1" style={{ backgroundColor: accentColor, opacity: 0.9 }} />

        {/* Logo — auto-whitened on dark backgrounds */}
        <div className="absolute z-20 flex items-center" style={logoPos}>
           {logoUrl ? (
             <div className="flex items-center justify-center">
               <img
                 src={logoUrl}
                 alt="Logo"
                 className="object-contain"
                 style={{
                   maxHeight: isLinkedIn ? "4.5rem" : "7rem",
                   maxWidth: "16rem",
                   filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
                 }}
                 crossOrigin="anonymous"
               />
             </div>
           ) : (
             <div
               className="flex items-center gap-2 px-4 py-2 rounded-xl border"
               style={{
                 backgroundColor: isDark ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.85)",
                 borderColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.1)",
               }}
             >
                <Sparkles className="w-5 h-5" style={{ color: isDark ? "#ffffff" : design.customAccent }} />
                <span
                  className="font-bold text-base tracking-tight drop-shadow"
                  style={{ color: isDark ? "#ffffff" : "#0f172a" }}
                >
                  {companyName || "YourBrand"}
                </span>
             </div>
           )}
        </div>

        {/* Ad Content — Headline, Body, CTA anchored to bottom */}
        <div
          className="relative z-10 w-full h-full px-6 pb-8 pt-4 sm:px-10 sm:pb-10 flex flex-col justify-end"
          style={{ alignItems: design.textAlign === "center" ? "center" : design.textAlign === "right" ? "flex-end" : "flex-start", textAlign: design.textAlign }}
        >
          {design.headline && (
            <h1
              className="font-bold tracking-tight text-white mb-2 leading-tight"
              style={{ fontSize: headlineSize, textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}
            >
              {design.headline}
            </h1>
          )}
          {design.body && (
            <p
              className="font-medium text-white/90 mb-5"
              style={{ fontSize: bodySize, maxWidth: isLinkedIn ? "60%" : "90%", textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
            >
              {design.body}
            </p>
          )}
          {design.cta && (
            <div
              className="inline-block mt-1 px-7 py-3 rounded-full font-bold text-sm tracking-wide"
              style={{
                backgroundColor: accentColor,
                color: "#ffffff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              {design.cta}
            </div>
          )}
        </div>
      </div>

      {/* ── Controls Bar — Download + platform label ── */}
      <div className="flex items-center gap-3">
        <Button onClick={() => exportAd("png")} variant="outline" size="sm" disabled={isExporting} className="rounded-full shadow-sm text-xs font-semibold">
          {isExporting ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Download className="w-3.5 h-3.5 mr-2" />}
          Download PNG
        </Button>
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: accentColor }} />
          Auto-generated &middot; {template.label}
        </span>
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
  const [uploadedBg, setUploadedBg] = useState<string | null>(null);
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

      // Autonomous color theme from prompt
      const theme = pickTheme(trimmed);

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
        customBg: theme.bg,
        customAccent: theme.accent,
        overlayColor: "transparent",
        campaignObjective: result.campaignObjective ?? "",
        visualDirection: result.visualDirection ?? "",
      };

      const summaryMd = `### Auto-Generated Template Complete\n\nI've generated a high-converting **${matchedTemplate.label}** ad template for your campaign. The layout, sizing, and styling have been aligned securely.\n\n**Campaign Objective:** ${result.campaignObjective}\n**Visual Strategy:** ${result.visualDirection}`;
      
      const randomBg = uploadedBg || AUTONOMOUS_BACKGROUNDS[Math.floor(Math.random() * AUTONOMOUS_BACKGROUNDS.length)];

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

  const handleUnifiedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be less than 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const name = file.name.toLowerCase();
      // Auto-detect: treat as logo if filename suggests it, otherwise use as background
      const isLogo = name.includes("logo") || name.includes("icon") || name.includes("brand");
      if (isLogo || file.type === "image/png" || file.type === "image/svg+xml") {
        setUploadedLogo(result);
        toast.success("Logo ready – will appear on generated templates!");
      } else {
        setUploadedBg(result);
        toast.success("Background image ready – will be used in the next template!");
      }
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
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
                  <InlineAdPreview
                    design={m.design}
                    backgroundUrl={m.backgroundUrl}
                    companyName={m.companyName}
                    logoUrl={m.logoUrl}
                  />
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
            {/* Unified Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "p-2.5 transition-all shrink-0 flex items-center gap-2 rounded-xl",
                (uploadedLogo || uploadedBg)
                  ? "text-blue-600 bg-blue-50 border border-blue-200"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              )}
              title="Upload logo, background image, or any file"
            >
              <UploadCloud className="w-5 h-5" />
              {(uploadedLogo || uploadedBg) && (
                <span className="text-xs font-semibold">
                  {uploadedLogo && uploadedBg ? "2 files" : uploadedLogo ? "Logo" : "Bg"} ✓
                </span>
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUnifiedUpload}
              accept="image/*,application/pdf,.svg,.png,.jpg,.jpeg,.webp"
              className="hidden"
            />

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
