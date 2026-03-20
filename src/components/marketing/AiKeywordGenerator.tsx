import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  Paperclip,
  SendHorizontal,
  User,
  Bot,
  Loader2
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

export default function AiKeywordGenerator({ companyData, onCompanySubmit }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>(["lead", "awareness"]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const processFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles).map(f => ({
      id: Math.random().toString(36).substring(7),
      name: f.name,
      size: f.size,
      type: f.type,
      url: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined
    }));
    
    if (files.length + fileArray.length > 5) {
      toast.error("Maximum 5 files allowed.");
      return;
    }
    
    setFiles(prev => [...prev, ...fileArray]);
    toast.success(`${fileArray.length} file(s) attached.`);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
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

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setFiles([]);
    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      const topic = userMessage.content || "Target Context";
      
      const mockKeywords: Record<string, string[]> = {
        lead: [
          `best ${topic.toLowerCase()} for ${companyData?.audience || "B2B client"}`,
          `${companyData?.industry || "industry"} expert consultation`,
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
          `what is ${topic.toLowerCase()} in ${industry || "business"}`,
          `how to implement ${topic.toLowerCase()} effectively`,
          `${companyData?.name || "Brand"} guide to ${topic.toLowerCase()}`,
        ],
        "long-tail": [
          `step by step ${topic.toLowerCase()} for small startups`,
          `integrated ${topic.toLowerCase()} for enterprise ecosystems`,
        ],
        trending: [
          `AI powered ${topic.toLowerCase()} in ${new Date().getFullYear()}`,
          `the future of ${companyData?.industry || "market"} ${topic.toLowerCase()}`,
        ],
      };

      const results = selectedFactors.map(factorId => ({
        factor: KEYWORD_FACTORS.find(f => f.id === factorId)?.label || factorId,
        keywords: mockKeywords[factorId] || mockKeywords["lead"],
      }));

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `I've analyzed your context and generated a specialized keyword architecture. Based on your "${selectedFactors.join(', ')}" vectors, here are the most effective strategies for ${companyData?.name || "your brand"}:`,
        keywords: results,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsGenerating(false);
      toast.success("Keywords generated!");
    }, 2500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateKeywords();
    }
  };

  const handleFactorToggle = (factorId: string) => {
    setSelectedFactors(prev => 
      prev.includes(factorId) ? prev.filter(id => id !== factorId) : [...prev, factorId]
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

  const industry = companyData?.industry || "Industry";

  return (
    <div className="flex flex-col h-[75vh] max-w-4xl mx-auto relative bg-background/50 border border-border/40 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
      {/* Search/Context Header */}
      <div className="p-4 border-b border-border/30 bg-card/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Keyword Intelligence Agent</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Keyword Intelligence Agent</h2>
          </div>
        </div>
      </div>

      {/* Chat History Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth"
      >
        {messages.length === 0 && !isGenerating ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center animate-pulse">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Campaign Keyword Specialist</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Provide your campaign details or upload documents to generate high-precision keyword clusters tailored for your industry.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={cn(
                  "flex animate-in fade-in slide-in-from-bottom-4 duration-300",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[85%] space-y-2",
                  m.role === "user" ? "items-end flex flex-col" : "items-start flex flex-col"
                )}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    {m.role === "ai" && <Bot className="w-3.5 h-3.5 text-primary" />}
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                      {m.role === "user" ? "You" : "Strategic Agent"}
                    </span>
                    {m.role === "user" && <User className="w-3.5 h-3.5 text-muted-foreground" />}
                  </div>

                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    m.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-card border border-border/50 rounded-tl-none backdrop-blur-md"
                  )}>
                    {m.files && m.files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {m.files.map(f => (
                          <div key={f.id} className="flex items-center gap-1.5 bg-black/10 rounded-lg px-2 py-1 text-[10px] font-bold">
                            {f.type.startsWith('image/') ? <ImageIcon className="w-3 h-3" /> : <FileIcon className="w-3 h-3" />}
                            <span className="max-w-[80px] truncate">{f.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {m.content}
                    
                    {m.keywords && (
                      <div className="mt-6 space-y-6 pt-6 border-t border-border/20">
                        {m.keywords.map((group, gIdx) => (
                          <div key={gIdx} className="group/cluster bg-muted/30 rounded-xl p-4 border border-border/40 hover:border-primary/30 transition-all">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                  <Target className="w-3 h-3" />
                                </div>
                                <h4 className="text-[11px] font-black text-foreground/90 uppercase tracking-widest leading-none">
                                  {group.factor} <span className="text-primary font-mono ml-1">Strategy</span>
                                </h4>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-6 text-[9px] gap-1 px-2 bg-background/50 hover:bg-primary/10 hover:text-primary transition-colors border-border/60"
                                onClick={() => copyToClipboard(group.keywords, group.factor)}
                              >
                                {copiedGroup === group.factor ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                                {copiedGroup === group.factor ? "Copied" : "Copy Dataset"}
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {group.keywords.map((kw, kIdx) => (
                                <div key={kIdx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border/40 text-[12px] font-medium text-foreground/80 hover:border-primary/40 hover:bg-primary/[0.02] transition-colors cursor-default">
                                  <div className="w-1 h-1 rounded-full bg-primary/40" />
                                  {kw}
                                  <span className="ml-auto text-[8px] font-mono text-muted-foreground/60 px-1.5 py-0.5 rounded-full bg-muted border border-border/20 group-hover/cluster:text-primary/60 transition-colors uppercase">
                                    High Intent
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-muted-foreground px-1">
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="max-w-[85%] space-y-2 flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Strategic Agent</span>
                  </div>
                  <div className="bg-card border border-border/50 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-xs font-medium text-muted-foreground">Architecting keyword strategies...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input Action Console */}
      <div className="p-4 bg-card/60 border-t border-border/30 shadow-inner">
        <div className="relative bg-background/80 border border-border/50 rounded-2xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 pb-0">
              {files.map(file => (
                <div key={file.id} className="flex items-center gap-1.5 bg-muted border border-border rounded-full px-3 py-1 text-[10px] font-bold animate-in fade-in zoom-in group">
                  {file.type.startsWith('image/') ? <ImageIcon className="w-3.5 h-3.5 text-blue-500" /> : <FileIcon className="w-3.5 h-3.5 text-orange-500" />}
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button onClick={() => removeFile(file.id)} className="text-muted-foreground hover:text-destructive ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Textarea
            placeholder={`Message AI strategist regarding ${companyData.product.toLowerCase()}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] max-h-[200px] border-0 focus-visible:ring-0 bg-transparent resize-none p-4 pb-12 text-sm leading-relaxed"
          />

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInput} 
            multiple 
            className="hidden" 
          />

          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>

          <div className="absolute bottom-3 right-3">
            <Button
              onClick={generateKeywords}
              disabled={isGenerating || (!input.trim() && files.length === 0)}
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full transition-all duration-300",
                input.trim() || files.length > 0 ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground"
              )}
            >
              <SendHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-[9px] text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" /> AI Keyword Chatbot v2.0 • Data-driven precision for your exact target industry.
        </p>
      </div>
    </div>
  );
}
