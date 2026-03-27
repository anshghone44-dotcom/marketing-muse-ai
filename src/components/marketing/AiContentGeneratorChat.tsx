import { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  Loader2,
  Search,
  Zap,
  Layout,
  FileText,
  Target
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CompanyData } from "./CompanyForm";
import {
  generateMarketingContent,
  type GeneratedContent,
} from "@/lib/geminiContentService";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "results";
  result?: GeneratedContent;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

export default function AiContentGeneratorChat({ companyData }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const generateContentData = async () => {
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

    try {
      // By default, generate a professional blog post or general informative content
      const result = await generateMarketingContent(
        trimmed,
        "blog",
        "Professional",
        companyName,
        companyIndustry,
        companyProduct,
        companyAudience
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.title,
        type: "results",
        result,
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err && typeof err === 'object' && 'message' in err && typeof (err as { message?: string }).message === 'string'
          ? (err as { message: string }).message
          : "Failed to generate content. Please try again.";
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
      generateContentData();
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
                  ? "bg-primary/5 text-foreground border border-primary/10 shadow-sm"
                  : "prose prose-sm dark:prose-invert font-normal text-foreground max-w-none text-left bg-transparent"
              )}
            >
              <h3 className="text-xl font-bold mb-4">{m.content}</h3>
              
              {m.type === "results" && m.result && (
                <div className="mt-6 space-y-8 animate-in fade-in duration-1000">
                  {/* Meta Information Card */}
                  {m.result.metaDescription && (
                    <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                        <Search className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">SEO Meta Data</span>
                      </div>
                      <p className="text-sm text-foreground/80 italic leading-relaxed">"{m.result.metaDescription}"</p>
                    </div>
                  )}

                  {/* Content Sections */}
                  <div className="space-y-12">
                    {m.result.sections.map((section, idx) => (
                      <div key={idx} className="space-y-4">
                        <h4 className="text-lg font-bold border-l-4 border-primary pl-4 py-1">{section.heading}</h4>
                        <div className="text-foreground/90 leading-relaxed font-sans pl-1">
                          <ReactMarkdown>{section.content}</ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Call to Action Card */}
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col items-center text-center space-y-3 mt-12">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-bold text-lg">{m.result.cta.text}</h5>
                      <p className="text-sm text-muted-foreground">{m.result.cta.subtext}</p>
                    </div>
                    <Button variant="default" className="rounded-xl px-8">
                      Copy CTA Copy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex w-full animate-in fade-in duration-500 justify-start items-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
               <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
            <div className="text-muted-foreground text-sm font-medium animate-pulse">
              Generating content...
            </div>
          </div>
        )}
      </div>

      {/* ── Empty State & Central Search ── */}
      {messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-16 pointer-events-none px-4 text-center">
          <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl md:text-5xl font-sans tracking-tight text-foreground">
              <span className="font-bold">LeadBot</span> <span className="font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]">Content Architect</span>
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
              placeholder="Generate any content draft"
              className="flex-1 min-w-0 bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] px-3 py-4 placeholder:text-muted-foreground/60 font-medium"
            />

            {/* Right Controls Container */}
            <div className="flex items-center gap-1.5 shrink-0 pr-1">
              {/* Analyze Button */}
              <button
                onClick={generateContentData}
                disabled={isGenerating || !input.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold text-primary bg-primary/10 hover:opacity-80 transition-opacity mr-1 disabled:opacity-50 disabled:pointer-events-none"
              >
                Analyze
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
