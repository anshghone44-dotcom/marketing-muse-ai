import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  Loader2,
  Send,
  Download,
  RefreshCcw,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  Layers,
  Type,
  Palette,
  Layout,
  Monitor,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { CompanyData } from "./CompanyForm";
import { callVisualAdGateway, type VisualAdResult } from "@/lib/geminiVisualAdService";

// ─── Template definitions ──────────────────────────────────────────
export const AD_TEMPLATES = [
  { id: "instagram-square",  label: "Instagram Square",   width: 1080, height: 1080, aspect: "1/1",    icon: "⬛" },
  { id: "facebook-feed",     label: "Facebook Feed",      width: 1200, height: 628,  aspect: "1.91/1", icon: "📘" },
  { id: "linkedin-banner",   label: "LinkedIn Banner",    width: 1584, height: 396,  aspect: "4/1",    icon: "💼" },
  { id: "story",             label: "Story (9:16)",       width: 1080, height: 1920, aspect: "9/16",   icon: "📱" },
  { id: "youtube-thumb",     label: "YouTube Thumbnail",  width: 1280, height: 720,  aspect: "16/9",   icon: "▶️" },
] as const;

type TemplateId = typeof AD_TEMPLATES[number]["id"];

const LOGO_POSITIONS = [
  { id: "top-left",     label: "Top Left" },
  { id: "top-right",    label: "Top Right" },
  { id: "top-center",   label: "Top Center" },
  { id: "bottom-left",  label: "Bottom Left" },
  { id: "bottom-right", label: "Bottom Right" },
] as const;
type LogoPosition = typeof LOGO_POSITIONS[number]["id"];

const TEXT_ALIGNMENTS = ["left", "center", "right"] as const;
type TextAlign = typeof TEXT_ALIGNMENTS[number];

const CTA_STYLES = ["filled", "outline", "ghost"] as const;
type CtaStyle = typeof CTA_STYLES[number];

const COLOR_THEMES = [
  { id: "blue",   label: "Royal Blue",    bg: "#1a2b6b", accent: "#3b82f6", text: "#ffffff" },
  { id: "navy",   label: "Dark Navy",     bg: "#0f172a", accent: "#6366f1", text: "#ffffff" },
  { id: "emerald",label: "Emerald",       bg: "#064e3b", accent: "#10b981", text: "#ffffff" },
  { id: "amber",  label: "Warm Amber",    bg: "#78350f", accent: "#f59e0b", text: "#ffffff" },
  { id: "rose",   label: "Rose Gold",     bg: "#881337", accent: "#f43f5e", text: "#ffffff" },
  { id: "custom", label: "Custom",        bg: "#1a2b6b", accent: "#3b82f6", text: "#ffffff" },
] as const;
type ThemeId = typeof COLOR_THEMES[number]["id"];

// ─── Chat message type ────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// ─── Design state ─────────────────────────────────────────────────
interface DesignState {
  templateId: TemplateId;
  headline: string;
  body: string;
  cta: string;
  logoPosition: LogoPosition;
  textAlign: TextAlign;
  overlayStrength: number;
  fontSize: number;
  ctaStyle: CtaStyle;
  themeId: ThemeId;
  customBg: string;
  customAccent: string;
  overlayColor: string;
  campaignObjective: string;
  visualDirection: string;
}

const defaultDesign: DesignState = {
  templateId: "instagram-square",
  headline: "",
  body: "",
  cta: "",
  logoPosition: "top-left",
  textAlign: "center",
  overlayStrength: 55,
  fontSize: 100,
  ctaStyle: "filled",
  themeId: "blue",
  customBg: "#1a2b6b",
  customAccent: "#3b82f6",
  overlayColor: "#0f172a",
  campaignObjective: "",
  visualDirection: "",
};

const EXAMPLE_PROMPTS = [
  "Create an Instagram ad for Canada PR immigration services",
  "Make a Facebook feed ad for student visa assistance",
  "Generate a LinkedIn banner for immigration consultation firm",
  "Design a YouTube thumbnail for a visa success story",
  "Build a story ad for PR pathway guidance for skilled workers",
];

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

// ─── Subsection: Asset upload zone ───────────────────────────────
function AssetUploadZone({
  label,
  hint,
  value,
  onChange,
  onClear,
  icon: Icon,
  accept = "image/*",
}: {
  label: string;
  hint?: string;
  value: string | null;
  onChange: (url: string) => void;
  onClear: () => void;
  icon: React.ElementType;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-foreground/70 uppercase tracking-widest">{label}</label>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-border/50 aspect-video bg-muted/30">
          <img src={value} alt={label} className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Replace"
            >
              <RotateCcw className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              onClick={onClear}
              className="p-1.5 bg-red-500/70 hover:bg-red-500 rounded-lg transition-colors"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-border/50 hover:border-primary/40 bg-muted/20 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Icon className="w-5 h-5 text-primary/70" />
          </div>
          <span className="text-xs text-muted-foreground">Click to upload</span>
          {hint && <span className="text-[10px] text-muted-foreground/50">{hint}</span>}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(URL.createObjectURL(file));
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ─── Live Ad Preview Component ────────────────────────────────────
function AdPreview({
  design,
  assets,
  previewRef,
}: {
  design: DesignState;
  assets: { logo: string | null; background: string | null; product: string | null; icon: string | null };
  previewRef: React.RefObject<HTMLDivElement>;
}) {
  const template = AD_TEMPLATES.find((t) => t.id === design.templateId)!;
  const theme = COLOR_THEMES.find((t) => t.id === design.themeId)!;
  const bgColor   = design.themeId === "custom" ? design.customBg    : theme.bg;
  const accentColor = design.themeId === "custom" ? design.customAccent : theme.accent;
  const textColor = "#ffffff";

  const overlayStyle: React.CSSProperties = {
    backgroundColor: design.overlayColor,
    opacity: design.overlayStrength / 100,
  };

  const logoPos: React.CSSProperties =
    design.logoPosition === "top-left"     ? { top: "5%", left: "5%" }   :
    design.logoPosition === "top-right"    ? { top: "5%", right: "5%" }  :
    design.logoPosition === "top-center"   ? { top: "5%", left: "50%", transform: "translateX(-50%)" } :
    design.logoPosition === "bottom-left"  ? { bottom: "5%", left: "5%" } :
    { bottom: "5%", right: "5%" };

  const isStory     = design.templateId === "story";
  const isLinkedIn  = design.templateId === "linkedin-banner";
  const isYouTube   = design.templateId === "youtube-thumb";
  const isFacebook  = design.templateId === "facebook-feed";

  const contentVAlign = isLinkedIn ? "center" : isStory ? "flex-end" : "center";

  const fontScale = design.fontSize / 100;
  const headlineSize = isLinkedIn ? `${1.4 * fontScale}rem` : isStory || isYouTube ? `${2 * fontScale}rem` : `${1.75 * fontScale}rem`;
  const bodySize     = `${0.875 * fontScale}rem`;

  return (
    <div
      className="w-full h-full relative overflow-hidden rounded-2xl select-none"
      style={{ backgroundColor: bgColor, aspectRatio: template.aspect }}
      ref={previewRef}
    >
      {/* Background image */}
      {assets.background && (
        <img
          src={assets.background}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0" style={overlayStyle} />

      {/* Logo */}
      {assets.logo && (
        <div className="absolute z-20" style={logoPos}>
          <img
            src={assets.logo}
            alt="Logo"
            className="object-contain"
            style={{ maxHeight: isLinkedIn ? "2.5rem" : "3rem", maxWidth: "7rem" }}
            draggable={false}
          />
        </div>
      )}

      {/* Product Image */}
      {assets.product && !isLinkedIn && (
        <div
          className="absolute right-0 bottom-0 z-10"
          style={{ width: isStory ? "55%" : "40%", height: isStory ? "55%" : "70%" }}
        >
          <img
            src={assets.product}
            alt="Product"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>
      )}

      {/* Text content */}
      <div
        className="absolute inset-0 z-30 flex flex-col p-[6%]"
        style={{
          justifyContent: contentVAlign,
          alignItems:
            design.textAlign === "center" ? "center" :
            design.textAlign === "right"  ? "flex-end" : "flex-start",
          paddingBottom: isStory ? "12%" : "6%",
        }}
      >
        {/* Accent bar */}
        {design.headline && !isLinkedIn && (
          <div
            className="rounded-full mb-3"
            style={{ width: "2.5rem", height: "0.2rem", backgroundColor: accentColor }}
          />
        )}

        {design.headline && (
          <h2
            className="font-bold leading-tight tracking-tight"
            style={{
              color: textColor,
              fontSize: headlineSize,
              textAlign: design.textAlign,
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              maxWidth: assets.product && !isLinkedIn ? "58%" : "90%",
            }}
          >
            {design.headline}
          </h2>
        )}

        {design.body && (
          <p
            className="mt-2 leading-relaxed"
            style={{
              color: `${textColor}cc`,
              fontSize: bodySize,
              textAlign: design.textAlign,
              textShadow: "0 1px 6px rgba(0,0,0,0.4)",
              maxWidth: assets.product && !isLinkedIn ? "58%" : "85%",
            }}
          >
            {design.body}
          </p>
        )}

        {design.cta && (
          <div className="mt-4">
            {design.ctaStyle === "filled" && (
              <span
                className="rounded-full font-semibold"
                style={{
                  backgroundColor: accentColor,
                  color: "#fff",
                  padding: "0.4em 1.2em",
                  fontSize: `${0.8 * fontScale}rem`,
                  display: "inline-block",
                  boxShadow: `0 4px 20px ${accentColor}66`,
                }}
              >
                {design.cta}
              </span>
            )}
            {design.ctaStyle === "outline" && (
              <span
                className="rounded-full font-semibold"
                style={{
                  border: `2px solid ${accentColor}`,
                  color: accentColor,
                  padding: "0.35em 1.1em",
                  fontSize: `${0.8 * fontScale}rem`,
                  display: "inline-block",
                }}
              >
                {design.cta}
              </span>
            )}
            {design.ctaStyle === "ghost" && (
              <span
                className="font-semibold underline underline-offset-2"
                style={{
                  color: accentColor,
                  fontSize: `${0.8 * fontScale}rem`,
                  display: "inline-block",
                }}
              >
                {design.cta} →
              </span>
            )}
          </div>
        )}
      </div>

      {/* Empty state */}
      {!design.headline && !assets.background && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white/30">
          <Layout className="w-10 h-10 mb-2" />
          <p className="text-sm font-medium">Ad preview will appear here</p>
          <p className="text-xs mt-1">Use the chatbot to generate your ad</p>
        </div>
      )}
    </div>
  );
}

// ─── Slider control ───────────────────────────────────────────────
function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <span className="text-xs font-mono text-foreground/70 bg-muted px-1.5 py-0.5 rounded">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 appearance-none rounded-full bg-muted accent-primary cursor-pointer"
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function VisualAdTemplateGenerator({ companyData }: Props) {
  const [assets, setAssets] = useState<{
    logo: string | null;
    background: string | null;
    product: string | null;
    icon: string | null;
  }>({ logo: null, background: null, product: null, icon: null });

  const [design, setDesign] = useState<DesignState>(defaultDesign);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activePanel, setActivePanel] = useState<"design" | "assets">("assets");
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const updateDesign = useCallback((patch: Partial<DesignState>) => {
    setDesign((prev) => ({ ...prev, ...patch }));
  }, []);

  const clearAsset = useCallback((key: keyof typeof assets) => {
    setAssets((prev) => ({ ...prev, [key]: null }));
  }, []);

  // ── Chatbot-driven generation ────────────────────────────────
  const handleGenerate = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: trimmed };
    setMessages((p) => [...p, userMsg]);
    setChatInput("");
    setIsGenerating(true);

    try {
      const result: VisualAdResult = await callVisualAdGateway(trimmed, companyData);

      // Map result to design state
      const matchedTemplate = AD_TEMPLATES.find(
        (t) => t.id === result.templateId || t.label.toLowerCase().includes(result.templateId?.replace(/-/g, " ") ?? "")
      ) ?? AD_TEMPLATES[0];

      updateDesign({
        templateId: matchedTemplate.id,
        headline: result.headline,
        body: result.body,
        cta: result.cta,
        logoPosition: (result.logoPosition as LogoPosition) ?? "top-left",
        textAlign: (result.textAlign as TextAlign) ?? "center",
        overlayStrength: result.overlayStrength ?? 55,
        overlayColor: result.overlayColor ?? "#0f172a",
        campaignObjective: result.campaignObjective ?? "",
        visualDirection: result.visualDirection ?? "",
      });

      const summaryMd = [
        `**Format:** ${matchedTemplate.label}`,
        `**Headline:** ${result.headline}`,
        `**Body:** ${result.body}`,
        `**CTA:** ${result.cta}`,
        result.campaignObjective ? `**Objective:** ${result.campaignObjective}` : "",
        result.visualDirection   ? `**Visual Direction:** ${result.visualDirection}` : "",
        result.logoPosition      ? `**Logo Position:** ${result.logoPosition}` : "",
        result.overlayStrength !== undefined ? `**Overlay Strength:** ${result.overlayStrength}%` : "",
      ].filter(Boolean).join("\n");

      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: summaryMd };
      setMessages((p) => [...p, aiMsg]);
      setActivePanel("design");
      toast.success("Ad generated! Preview updated on the right.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate ad. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Export ───────────────────────────────────────────────────
  const exportAd = async (format: "png" | "jpeg") => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const template = AD_TEMPLATES.find((t) => t.id === design.templateId)!;
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        scale: 2,
        width: previewRef.current.offsetWidth,
        height: previewRef.current.offsetHeight,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `leadbot-ad-${design.templateId}-${Date.now()}.${format}`;
      link.href = canvas.toDataURL(`image/${format === "jpeg" ? "jpeg" : "png"}`, 0.95);
      link.click();
      toast.success(`Exported as ${format.toUpperCase()}!`);
    } catch {
      // Fallback: simple SVG-based export notice
      toast.error("Export requires html2canvas. Run: npm install html2canvas");
    } finally {
      setIsExporting(false);
    }
  };

  const resetAll = () => {
    setDesign(defaultDesign);
    setMessages([]);
    setChatInput("");
    toast.info("Design reset to defaults.");
  };

  const currentTemplate = AD_TEMPLATES.find((t) => t.id === design.templateId)!;
  const currentTheme    = COLOR_THEMES.find((t) => t.id === design.themeId)!;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full min-h-[85vh] px-2">

      {/* ══ LEFT PANEL ══════════════════════════════════════════════ */}
      <div className="w-full lg:w-[420px] xl:w-[460px] flex flex-col gap-4 shrink-0">

        {/* Panel Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Visual Ad Builder</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Chatbot-driven • No image AI</p>
          </div>
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-all"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* ── Chatbot Section ──────────────────────────────────── */}
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden flex flex-col"
          style={{ minHeight: "260px", maxHeight: "320px" }}>
          <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2 bg-primary/5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Creative Director AI</span>
          </div>

          {/* Chat history */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
            {messages.length === 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Try a prompt like:</p>
                {EXAMPLE_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setChatInput(p)}
                    className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                      m.role === "user"
                        ? "bg-primary/10 text-foreground border border-primary/20"
                        : "text-foreground/80 whitespace-pre-wrap bg-muted/40"
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {isGenerating && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Loader2 className="w-3 h-3 text-primary animate-spin" />
                </div>
                <span className="text-xs text-muted-foreground animate-pulse">Crafting your ad…</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-1 border-t border-border/20">
            <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2 border border-border/40 focus-within:border-primary/40 transition-colors">
              <textarea
                rows={2}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleGenerate(); }
                }}
                placeholder="Describe your ad (platform, service, tone…)"
                className="flex-1 bg-transparent text-xs resize-none border-none focus:outline-none placeholder:text-muted-foreground/50 leading-relaxed"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !chatInput.trim()}
                className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors disabled:opacity-40 disabled:pointer-events-none shrink-0"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Panel Tabs ──────────────────────────────────────── */}
        <div className="flex rounded-xl bg-muted/40 p-1 border border-border/30">
          {[
            { id: "assets" as const, label: "Assets", icon: ImageIcon },
            { id: "design" as const, label: "Design", icon: Palette },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActivePanel(id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all",
                activePanel === id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* ── Assets Panel ─────────────────────────────────────── */}
        {activePanel === "assets" && (
          <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <AssetUploadZone
                label="Logo" hint="PNG/SVG preferred"
                value={assets.logo}
                onChange={(url) => setAssets((p) => ({ ...p, logo: url }))}
                onClear={() => clearAsset("logo")}
                icon={ImageIcon}
              />
              <AssetUploadZone
                label="Background" hint="Any image"
                value={assets.background}
                onChange={(url) => setAssets((p) => ({ ...p, background: url }))}
                onClear={() => clearAsset("background")}
                icon={Layers}
              />
              <AssetUploadZone
                label="Product Image" hint="Optional"
                value={assets.product}
                onChange={(url) => setAssets((p) => ({ ...p, product: url }))}
                onClear={() => clearAsset("product")}
                icon={Monitor}
              />
              <AssetUploadZone
                label="Icon / Badge" hint="Optional"
                value={assets.icon}
                onChange={(url) => setAssets((p) => ({ ...p, icon: url }))}
                onClear={() => clearAsset("icon")}
                icon={Type}
              />
            </div>
          </div>
        )}

        {/* ── Design Panel ─────────────────────────────────────── */}
        {activePanel === "design" && (
          <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-5 overflow-y-auto" style={{ maxHeight: "520px" }}>

            {/* Editable text */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ad Copy</p>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Headline</label>
                <input
                  type="text"
                  value={design.headline}
                  onChange={(e) => updateDesign({ headline: e.target.value })}
                  placeholder="Your powerful headline"
                  className="w-full text-sm px-3 py-2 rounded-xl bg-muted/30 border border-border/40 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Body Text</label>
                <textarea
                  rows={2}
                  value={design.body}
                  onChange={(e) => updateDesign({ body: e.target.value })}
                  placeholder="Supporting description"
                  className="w-full text-sm px-3 py-2 rounded-xl bg-muted/30 border border-border/40 focus:outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-muted-foreground/40"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">CTA Button Text</label>
                <input
                  type="text"
                  value={design.cta}
                  onChange={(e) => updateDesign({ cta: e.target.value })}
                  placeholder="e.g. Check Eligibility"
                  className="w-full text-sm px-3 py-2 rounded-xl bg-muted/30 border border-border/40 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40"
                />
              </div>
            </div>

            <div className="border-t border-border/30" />

            {/* Layout */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Layout</p>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Text Alignment</label>
                <div className="flex gap-1.5">
                  {(["left", "center", "right"] as TextAlign[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => updateDesign({ textAlign: a })}
                      className={cn(
                        "flex-1 flex items-center justify-center py-2 rounded-lg border text-xs transition-all",
                        design.textAlign === a
                          ? "bg-primary/10 border-primary/40 text-primary"
                          : "border-border/40 text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      {a === "left" ? <AlignLeft className="w-4 h-4" /> : a === "center" ? <AlignCenter className="w-4 h-4" /> : <AlignRight className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Logo Position</label>
                <select
                  value={design.logoPosition}
                  onChange={(e) => updateDesign({ logoPosition: e.target.value as LogoPosition })}
                  className="w-full text-sm px-3 py-2 rounded-xl bg-muted/30 border border-border/40 focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                >
                  {LOGO_POSITIONS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">CTA Style</label>
                <div className="flex gap-1.5">
                  {(["filled", "outline", "ghost"] as CtaStyle[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateDesign({ ctaStyle: s })}
                      className={cn(
                        "flex-1 py-2 rounded-lg border text-xs font-medium transition-all capitalize",
                        design.ctaStyle === s
                          ? "bg-primary/10 border-primary/40 text-primary"
                          : "border-border/40 text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-border/30" />

            {/* Visual Controls */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Visual</p>

              <Slider label="Overlay Strength" value={design.overlayStrength} min={0} max={100} unit="%" onChange={(v) => updateDesign({ overlayStrength: v })} />
              <Slider label="Font Scale" value={design.fontSize} min={60} max={160} unit="%" onChange={(v) => updateDesign({ fontSize: v })} />

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Overlay Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design.overlayColor}
                    onChange={(e) => updateDesign({ overlayColor: e.target.value })}
                    className="h-8 w-12 rounded-lg cursor-pointer border border-border/40"
                  />
                  <span className="text-xs font-mono text-muted-foreground">{design.overlayColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-medium">Color Theme</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {COLOR_THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => updateDesign({ themeId: t.id as ThemeId })}
                      title={t.label}
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[10px] font-medium transition-all",
                        design.themeId === t.id
                          ? "border-primary/60 ring-1 ring-primary/40"
                          : "border-border/40 hover:border-border/60"
                      )}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ background: `linear-gradient(135deg, ${t.bg}, ${t.accent})` }}
                      />
                      <span className="truncate">{t.label}</span>
                    </button>
                  ))}
                </div>
                {design.themeId === "custom" && (
                  <div className="flex gap-2 mt-1">
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] text-muted-foreground">BG Color</span>
                      <input type="color" value={design.customBg}
                        onChange={(e) => updateDesign({ customBg: e.target.value })}
                        className="h-7 w-full rounded-lg cursor-pointer border border-border/40" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] text-muted-foreground">Accent</span>
                      <input type="color" value={design.customAccent}
                        onChange={(e) => updateDesign({ customAccent: e.target.value })}
                        className="h-7 w-full rounded-lg cursor-pointer border border-border/40" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ RIGHT PANEL ═════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">

        {/* Template selector + actions bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Template picker */}
          <div className="relative">
            <button
              onClick={() => setShowTemplateMenu((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 bg-card hover:border-primary/40 transition-all text-sm font-medium"
            >
              <span>{currentTemplate.icon}</span>
              <span>{currentTemplate.label}</span>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showTemplateMenu && "rotate-180")} />
            </button>
            {showTemplateMenu && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-background border border-border rounded-xl shadow-xl p-1.5 w-56">
                {AD_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { updateDesign({ templateId: t.id }); setShowTemplateMenu(false); }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                      design.templateId === t.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted/60 text-foreground"
                    )}
                  >
                    <span className="text-base">{t.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-xs">{t.label}</div>
                      <div className="text-[10px] text-muted-foreground">{t.width}×{t.height}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dimensions badge */}
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-mono">
            {currentTemplate.width}×{currentTemplate.height}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => exportAd("png")}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/80 transition-all disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              PNG
            </button>
            <button
              onClick={() => exportAd("jpeg")}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border/50 bg-card hover:bg-muted/40 transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              JPG
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="flex-1 rounded-2xl border border-border/50 bg-muted/20 flex items-center justify-center p-6 relative overflow-hidden">
          <div
            className="w-full"
            style={{
              maxWidth:
                design.templateId === "linkedin-banner" ? "100%" :
                design.templateId === "story"           ? "320px" :
                design.templateId === "youtube-thumb"   ? "100%" : "520px",
            }}
          >
            <AdPreview design={design} assets={assets} previewRef={previewRef} />
          </div>

          {/* Template label badge */}
          <div className="absolute bottom-4 right-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 font-mono">
            {currentTemplate.label}
          </div>
        </div>

        {/* Campaign brief section (shown when generated) */}
        {design.campaignObjective && (
          <div className="rounded-2xl border border-border/50 bg-card p-4 grid grid-cols-2 gap-4 animate-in fade-in duration-500">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Campaign Objective</p>
              <p className="text-sm text-foreground">{design.campaignObjective}</p>
            </div>
            {design.visualDirection && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Visual Direction</p>
                <p className="text-sm text-foreground">{design.visualDirection}</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
