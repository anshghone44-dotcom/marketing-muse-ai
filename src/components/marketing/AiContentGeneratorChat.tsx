import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Plus,
  Loader2,
  Sparkles,
  Search,
  Check,
  Copy,
  Bot,
  User,
  Layout,
  FileText,
  Mail,
  MessageSquare,
  PenTool,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CompanyData } from "./CompanyForm";
import {
  generateMarketingContent,
  type GeneratedContent,
} from "@/lib/contentGeneratorService";

const CONTENT_TYPES = [
  { id: "blog", label: "Blog Post", icon: FileText, description: "Detailed articles and thought leadership" },
  { id: "landing", label: "Landing Page Copy", icon: Layout, description: "High-converting web page text" },
  { id: "email", label: "Email Campaign", icon: Mail, description: "Newsletters and sales sequences" },
  { id: "social", label: "Social Caption", icon: MessageSquare, description: "Engaging posts for social platforms" },
  { id: "ad", label: "Ad Copy", icon: PenTool, description: "Short, punchy text for digital ads" },
];

const TONES = [
  "Professional",
  "Formal",
  "Creative",
  "Persuasive",
  "Playful",
  "Empathetic",
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  result?: GeneratedContent;
  type?: string;
  tone?: string;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

export default function AiContentGeneratorChat({ companyData, onCompanySubmit }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [tone, setTone] = useState("Professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const handleGenerate = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      type: contentType,
      tone: tone,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);
    setInput("");

    try {
      const result = await generateMarketingContent(
        trimmed,
        contentType,
        tone,
        companyData?.name,
        companyData?.industry,
        companyData?.product,
        companyData?.audience
      );

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I've architected a professional **${contentType}** strategy in a **${tone}** tone focused on your objectives. The draft below is engineered for maximum consumer engagement.`,
        result,
      };

      setMessages((prev) => [...prev, aiMsg]);
      toast.success("Content architecture drafted!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-6xl mx-auto relative bg-transparent overflow-hidden">
      {/* ── Empty State ── */}
      {messages.length === 0 && !isGenerating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-24 pointer-events-none px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-foreground mb-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            LeadBot <span className="font-light text-muted-foreground/60">Content Architect</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed opacity-80 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Draft high-converting blog posts, landing pages, emails, and more with our specialized Gemini AI copywriting engine.
          </p>
        </div>
      )}

      {/* ── Configuration Bar ── */}
      <div className="flex-shrink-0 px-6 pt-4 flex flex-wrap items-center gap-4 justify-center">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest hidden md:inline">Format:</span>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="w-[180px] h-9 rounded-full bg-muted/40 border-border/40 text-xs font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/40 bg-background/95 backdrop-blur-xl">
              {CONTENT_TYPES.map((t) => (
                <SelectItem key={t.id} value={t.id} className="rounded-xl cursor-pointer">
                  <div className="flex items-center gap-2">
                    <t.icon className="w-3.5 h-3.5 opacity-70" />
                    <span>{t.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest hidden md:inline">Voice:</span>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="w-[140px] h-9 rounded-full bg-muted/40 border-border/40 text-xs font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/40 bg-background/95 backdrop-blur-xl">
              {TONES.map((t) => (
                <SelectItem key={t} value={t} className="rounded-xl cursor-pointer">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                  {m.role === "user" ? "Brief" : "Strategic Architect"}
                </span>
                {m.role === "user" && <User className="w-3.5 h-3.5 text-muted-foreground" />}
              </div>

              <div
                className={cn(
                  "p-6 md:p-8 rounded-3xl text-sm leading-relaxed overflow-hidden shadow-sm w-full",
                  m.role === "user"
                    ? "bg-muted/50 text-foreground border border-border/40"
                    : "bg-card/40 backdrop-blur-xl border border-border/10 text-foreground"
                )}
              >
                {m.role === "user" && (
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border/10 opacity-60">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[8px] font-bold text-primary uppercase">{m.type}</span>
                    <span className="px-2 py-0.5 rounded-full bg-muted text-[8px] font-bold text-muted-foreground uppercase">Tone: {m.tone}</span>
                  </div>
                )}
                
                <div className="prose prose-sm dark:prose-invert font-medium max-w-none">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>

                {m.result && (
                  <div className="mt-8 space-y-6 border-t border-border/10 pt-10 text-left">
                    <div className="flex items-center justify-between">
                       <h4 className="text-xl font-bold tracking-tight">{m.result.title}</h4>
                       <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(m.result!.body, m.id)}
                        className="h-8 gap-2 text-[10px] font-black uppercase text-primary hover:bg-primary/5"
                      >
                        {copiedId === m.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedId === m.id ? "Copied" : "Copy Draft"}
                      </Button>
                    </div>
                    
                    <div className="bg-muted/30 border border-border/10 rounded-3xl p-6 md:p-10 prose prose-sm dark:prose-invert max-w-none shadow-inner text-left">
                      <ReactMarkdown>{m.result.body}</ReactMarkdown>
                    </div>

                    <div className="flex items-center justify-center pt-6 opacity-30">
                       <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Expert Performance Standard</p>
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
              <span className="block text-sm font-semibold tracking-tight">Crafting Specialized Copy...</span>
              <span className="block text-[10px] uppercase font-bold text-muted-foreground">Optimizing for intent and professional voice</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Input Console ── */}
      <div className="pb-10 px-6">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <button className="absolute left-6 z-10 p-2 hover:bg-muted rounded-full transition-all text-muted-foreground">
            <PenTool className="w-5 h-5" />
          </button>

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), handleGenerate(input))
            }
            placeholder="What should this content be about? (e.g. 'Benefits of AI in solar energy')..."
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
                  Draft <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-8 mt-4 opacity-40">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Premium Logic</p>
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Audience Specific</p>
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Market Optimized</p>
        </div>
      </div>
    </div>
  );
}
