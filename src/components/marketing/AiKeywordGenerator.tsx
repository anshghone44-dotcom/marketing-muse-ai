import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  Copy,
  Check,
  X,
  File as FileIcon,
  Image as ImageIcon,
  Target,
  BarChart,
  TrendingUp,
  Search,
  Zap,
  SendHorizontal,
  User,
  Bot,
  Loader2,
  Plus,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CompanyData } from "./CompanyForm";
import CompanyForm from "./CompanyForm";

export const KEYWORD_FACTORS = [
  { id: "lead", label: "Lead-Gen", description: "High-intent keywords", icon: Target },
  { id: "catchy", label: "Catchy", description: "Social-friendly", icon: Zap },
  { id: "awareness", label: "Awareness", description: "Establish authority", icon: Search },
  { id: "long-tail", label: "Long-Tail", description: "Specific queries", icon: BarChart },
  { id: "trending", label: "Trending", description: "Market trends", icon: TrendingUp },
];

interface GeneratedKeywordGroup {
  factor: string;
  keywords: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  files?: UploadedFile[];
  keywords?: GeneratedKeywordGroup[];
  timestamp: Date;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

type SourceType = "brief" | "files";

export default function AiKeywordGenerator({ companyData, onCompanySubmit }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>(["lead", "awareness"]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<SourceType | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const processFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles).map((f) => ({
      id: Math.random().toString(36).substring(7),
      name: f.name,
      size: f.size,
      type: f.type,
      url: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }));

    if (files.length + fileArray.length > 5) {
      toast.error("Maximum 5 files allowed.");
      return;
    }

    setFiles((prev) => [...prev, ...fileArray]);
    toast.success(`${fileArray.length} file(s) attached.`);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const generateKeywords = async () => {
    if (!input.trim() && files.length === 0) {
      toast.error("Please enter a prompt or upload files.");
      return;
    }

    if (selectedFactors.length === 0) {
      toast.error("Select at least one strategy vector.");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      files: [...files],
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setFiles([]);
    setIsGenerating(true);

    setTimeout(() => {
      const topic = userMessage.content || "Target Context";
      const industry = companyData?.industry || "industry";

      const mockKeywords: Record<string, string[]> = {
        lead: [
          `best ${topic.toLowerCase()} for ${companyData?.audience || "B2B client"}`,
          `${industry} expert consultation`,
          `${topic.toLowerCase()} performance metrics`,
          `hire ${companyData?.name || "brand"} services`,
          `high ROI ${topic.toLowerCase()} strategies`,
        ],
        catchy: [
          `the #1 ${topic.toLowerCase()} secret of ${new Date().getFullYear()}`,
          `why ${companyData?.name || "we"} outperform competitors in ${topic.toLowerCase()}`,
          `unleash growth with ${topic.toLowerCase()}`,
          `${topic.toLowerCase()} revolution ${new Date().getFullYear()}`,
        ],
        awareness: [
          `what is ${topic.toLowerCase()} in ${industry}`,
          `how to implement ${topic.toLowerCase()} effectively`,
          `${companyData?.name || "Brand"} guide to ${topic.toLowerCase()}`,
        ],
        "long-tail": [
          `step by step ${topic.toLowerCase()} for small startups`,
          `integrated ${topic.toLowerCase()} for enterprise ecosystems`,
        ],
        trending: [
          `AI powered ${topic.toLowerCase()} in ${new Date().getFullYear()}`,
          `the future of ${industry} ${topic.toLowerCase()}`,
        ],
      };

      const results = selectedFactors.map((factorId) => ({
        factor: KEYWORD_FACTORS.find((f) => f.id === factorId)?.label || factorId,
        keywords: mockKeywords[factorId] || mockKeywords.lead,
      }));

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `Here is your professional keyword intelligence set built across **${selectedFactors.length} strategy vector(s)** for **${companyData?.name || "your brand"}**.`,
        keywords: results,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsGenerating(false);
      setSelectedSource(null);
      toast.success("Keywords generated!");
    }, 2500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateKeywords();
    }
  };

  const handleFactorToggle = (factorId: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factorId) ? prev.filter((id) => id !== factorId) : [...prev, factorId]
    );
  };

  const copyToClipboard = (keywords: string[], factor: string) => {
    navigator.clipboard.writeText(keywords.join("\n"));
    setCopiedGroup(factor);
    toast.success(`${factor} keywords copied!`);
    setTimeout(() => setCopiedGroup(null), 2000);
  };

  if (!companyData) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Initialize AI Context</h2>
          <p className="text-muted-foreground">Please set up your profile to enable the AI Keyword Chatbot.</p>
        </div>
        <CompanyForm onSubmit={onCompanySubmit} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[85vh] max-w-6xl mx-auto relative bg-transparent overflow-hidden">
      {messages.length === 0 && !isGenerating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-24 pointer-events-none px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-sans font-semibold tracking-tight text-foreground flex flex-col md:flex-row items-center gap-2 md:gap-3">
            <span className="opacity-90">LeadBot</span>
            <span className="text-muted-foreground/60 font-light">Keyword Generator</span>
          </h1>
          <p className="mt-4 text-sm text-muted-foreground max-w-md">
            Describe your growth campaign and get professional keyword clusters aligned to intent, authority, and conversion.
          </p>
        </div>
      )}

      <div className="flex-shrink-0 px-6 pt-4 flex flex-wrap items-center gap-2 justify-center">
        {KEYWORD_FACTORS.map(({ id, label, icon: Icon }) => {
          const selected = selectedFactors.includes(id);
          return (
            <button
              key={id}
              onClick={() => handleFactorToggle(id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200",
                selected
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                  : "bg-muted/40 border-border/40 text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          );
        })}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border border-border/40 bg-muted/40 text-muted-foreground hover:bg-muted transition-all">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {selectedFactors.length} vectors selected
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56 bg-background/95 backdrop-blur-xl border border-border/40 rounded-2xl p-1">
            {KEYWORD_FACTORS.map((factor) => (
              <DropdownMenuItem
                key={factor.id}
                onClick={() => handleFactorToggle(factor.id)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm cursor-pointer flex items-center justify-between",
                  selectedFactors.includes(factor.id) && "text-primary font-bold bg-primary/5"
                )}
              >
                <div className="flex flex-col">
                  <span>{factor.label}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{factor.description}</span>
                </div>
                {selectedFactors.includes(factor.id) && <Check className="w-3.5 h-3.5 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 scroll-smooth">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex w-full animate-in fade-in slide-in-from-bottom-8 duration-700",
              m.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn("max-w-[90%] space-y-4", m.role === "user" ? "items-end" : "items-start")}>
              <div className="flex items-center gap-2 px-1">
                {m.role === "ai" ? <Bot className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-muted-foreground" />}
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {m.role === "user" ? "You" : "Keyword Agent"}
                </span>
              </div>

              <div
                className={cn(
                  "p-6 md:p-8 rounded-3xl text-base leading-relaxed overflow-hidden shadow-sm",
                  m.role === "user"
                    ? "bg-muted/50 text-foreground border border-border/40"
                    : "bg-card/40 backdrop-blur-xl border border-border/10 text-foreground"
                )}
              >
                {m.files && m.files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {m.files.map((f) => (
                      <div key={f.id} className="flex items-center gap-1.5 bg-black/10 rounded-lg px-2 py-1 text-[10px] font-bold">
                        {f.type.startsWith("image/") ? <ImageIcon className="w-3 h-3" /> : <FileIcon className="w-3 h-3" />}
                        <span className="max-w-[120px] truncate">{f.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-sm md:text-base text-muted-foreground">{m.content}</p>

                {m.keywords && (
                  <div className="mt-8 space-y-5 border-t border-border/10 pt-8">
                    {m.keywords.map((group, gIdx) => (
                      <div key={gIdx} className="bg-muted/20 border border-border/20 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" />
                            <h4 className="text-xs font-black uppercase tracking-widest">{group.factor} Keywords</h4>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[10px] gap-1 px-2"
                            onClick={() => copyToClipboard(group.keywords, group.factor)}
                          >
                            {copiedGroup === group.factor ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copiedGroup === group.factor ? "Copied" : "Copy"}
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {group.keywords.map((kw, kIdx) => (
                            <div key={kIdx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border/40 text-xs font-medium text-foreground/80">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                              {kw}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-muted-foreground px-1">
                {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-4 p-6 bg-muted/20 rounded-3xl max-w-fit animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-semibold tracking-tight">Architecting keyword clusters with Gemini…</span>
          </div>
        )}
      </div>

      <div className="pb-10 px-6">
        <div className="max-w-3xl mx-auto relative">
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 px-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-1.5 bg-muted border border-border rounded-full px-3 py-1 text-[10px] font-bold group">
                  {file.type.startsWith("image/") ? <ImageIcon className="w-3.5 h-3.5 text-blue-500" /> : <FileIcon className="w-3.5 h-3.5 text-orange-500" />}
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button onClick={() => removeFile(file.id)} className="text-muted-foreground hover:text-destructive ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "absolute left-6 top-1/2 -translate-y-1/2 z-10 p-2 hover:bg-muted rounded-full transition-all text-muted-foreground",
                  selectedSource && "bg-primary/10 text-primary"
                )}
              >
                <Plus className={cn("w-6 h-6 transition-transform", selectedSource ? "rotate-45" : "")} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-64 p-2 bg-background/95 backdrop-blur-xl border border-border/40 shadow-2xl rounded-2xl"
            >
              <DropdownMenuItem onClick={() => setSelectedSource("brief")} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted">
                <Sparkles className="w-4 h-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Keyword Brief</span>
                  <span className="text-[10px] text-muted-foreground">Describe the campaign context</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedSource("files");
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted"
              >
                <FileIcon className="w-4 h-4 text-blue-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Upload Brief</span>
                  <span className="text-[10px] text-muted-foreground">PDF, DOC, or Image files</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <input type="file" ref={fileInputRef} onChange={handleFileInput} multiple className="hidden" />

          <Textarea
            placeholder="Describe your keyword goal (e.g. 'Generate high-intent SEO terms for our B2B analytics platform')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[64px] bg-muted/40 border-border/40 rounded-[2rem] pl-16 pr-44 py-5 resize-none focus:border-primary/40 shadow-sm transition-shadow hover:shadow-md"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button
              onClick={generateKeywords}
              disabled={isGenerating || (!input.trim() && files.length === 0)}
              className="h-11 px-6 rounded-full font-bold bg-foreground text-background hover:scale-105 transition-all shadow-lg active:scale-95"
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
        <p className="text-[10px] text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" /> LeadBot Keyword Agent • Professional intent-mapped clusters for campaign planning.
        </p>
      </div>
    </div>
  );
}
