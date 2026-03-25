import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  Check,
  X,
  SendHorizontal,
  Bot,
  User,
  Loader2,
  Zap,
  Share2,
  Trophy,
  Users,
  Target,
  Paperclip,
  File as FileIcon,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CompanyData } from "./CompanyForm";

interface ViralCampaign {
  id: string;
  title: string;
  description: string;
  mechanics: string;
  prize?: string;
  platforms: string[];
  whyItWorks: string;
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
  campaigns?: ViralCampaign[];
  timestamp: Date;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

export default function AiViralGeneratorChat({ companyData, onCompanySubmit }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
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

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const generateViralIdeas = async () => {
    if (!input.trim() && files.length === 0) {
      toast.error("Please describe your campaign goal or upload files.");
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

    // Simulate AI generation logic
    setTimeout(() => {
      const topic = userMessage.content;
      
      const campaigns: ViralCampaign[] = [
        {
          id: "1",
          title: `The "${companyData?.product || 'Product'} VIP Referral Loop"`,
          description: `A high-conversion referral ecosystem designed to turn every customer into a lead-generating advocate for ${companyData?.name || 'your business'}.`,
          mechanics: `Users share a personalized "Golden Ticket" link. For every sign-up, the referrer earns "Impact Points". At 50 points, they unlock a 1-on-1 strategy session. At 100 points, they gain lifetime "Legacy Status" with exclusive perks.`,
          prize: `1-on-1 Executive Consulting, Lifetime Premium Access, and a "Founder's Circle" physical welcome kit.`,
          platforms: ["WhatsApp", "LinkedIn", "Email"],
          whyItWorks: "Combines scarcity (Golden Ticket) with high-value professional incentives, driving quality leads over quantity."
        },
        {
          id: "2",
          title: `"Which ${companyData?.industry || 'Industry'} Future Are You?" Quiz`,
          description: `An interactive diagnostic campaign that captures deep lead data while providing immediate value to the consumer.`,
          mechanics: `A 60-second interactive quiz that analyzes the user's current business state and gives them a "Strategy Maturity Score". To see the full 10-page custom report, users enter their professional details.`,
          prize: `Personalized 20-Page Strategy Roadmap + 15-minute diagnostic call with an AI Specialist.`,
          platforms: ["Instagram Reels", "Facebook", "LinkedIn"],
          whyItWorks: "The 'Self-Discovery' hook drives massive participation, while the gated custom report ensures high-intent lead capture."
        },
        {
          id: "3",
          title: `The "${companyData?.name || 'Brand'} Innovation Co-Lab"`,
          description: `A community-driven co-creation campaign that builds intense brand loyalty and word-of-mouth participation.`,
          mechanics: `Consumers vote on the next major update for ${companyData?.product || 'your product'}. Every voter gets a "Beta Pioneer" badge and a unique referral code that grants their friends priority access.`,
          prize: `Early Beta Access, Permanent Name in the "Innovation Wall", and Limited Edition "Co-Creator" Merch.`,
          platforms: ["Twitter/X", "Discord", "TikTok"],
          whyItWorks: "Direct participation in the product roadmap creates a 'Sense of Ownership', leading to organic viral sharing."
        }
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `I've architected a professional suite of viral campaigns for **${companyData?.name || 'your business'}**. These concepts are engineered specifically to drive high-intensity lead generation and consumer participation through value-driven loops.`,
        campaigns,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsGenerating(false);
      toast.success("Viral ideas architected successfully!");
    }, 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateViralIdeas();
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-5xl mx-auto relative bg-background/40 border border-border/40 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="p-5 border-b border-border/20 bg-card/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight flex items-center gap-2">
              AI Viral Architect
              <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-[9px] text-primary uppercase">v1.0</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Chat Stream */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 scroll-smooth"
      >
        {messages.length === 0 && !isGenerating ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-[2.5rem] bg-primary/10 flex items-center justify-center animate-pulse">
                <Bot className="w-10 h-10 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-foreground leading-tight italic tracking-tighter">Ready to Go Viral?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Describe your viral goal or upload content. I will generate professional, high-impact viral campaigns designed for your business growth.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={cn(
                  "flex animate-in fade-in slide-in-from-bottom-6 duration-500",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[90%] space-y-3",
                  m.role === "user" ? "items-end flex flex-col text-right" : "items-start flex flex-col text-left"
                )}>
                  <div className="flex items-center gap-2 mb-1 px-2">
                    {m.role === "ai" && <Bot className="w-4 h-4 text-primary" />}
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-80">
                      {m.role === "user" ? "Your Input" : "Viral Strategy"}
                    </span>
                    {m.role === "user" && <User className="w-4 h-4 text-muted-foreground/60" />}
                  </div>

                  <div className={cn(
                    "p-5 rounded-3xl text-sm leading-relaxed shadow-xl border border-white/5",
                    m.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-card/90 border-border/50 rounded-tl-none backdrop-blur-xl"
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
                    
                    {m.campaigns && (
                      <div className="mt-8 grid grid-cols-1 gap-6 pt-8 border-t border-border/20">
                        {m.campaigns.map((camp, cIdx) => (
                          <Card key={cIdx} className="overflow-hidden border border-border/40 bg-background/50 backdrop-blur shadow-xl hover:border-primary/30 transition-all">
                            <div className="p-6 space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-lg font-black text-primary tracking-tight">{camp.title}</h4>
                                <div className="flex gap-1.5">
                                  {camp.platforms.map(p => (
                                    <span key={p} className="px-2 py-0.5 rounded-md bg-muted text-[8px] font-bold text-muted-foreground uppercase">{p}</span>
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm font-bold text-foreground/90 leading-relaxed italic border-l-2 border-primary/30 pl-3">
                                {camp.description}
                              </p>
                              <div className="space-y-3 pt-2">
                                <div className="flex items-start gap-3">
                                  <Users className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                  <div className="text-[13px] leading-relaxed">
                                    <span className="font-bold">Mechanics:</span> {camp.mechanics}
                                  </div>
                                </div>
                                {camp.prize && (
                                  <div className="flex items-start gap-3">
                                    <Trophy className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                                    <div className="text-[13px] leading-relaxed">
                                      <span className="font-bold">Prizes:</span> {camp.prize}
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-start gap-3">
                                  <Target className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                  <div className="text-[13px] leading-relaxed">
                                    <span className="font-bold">Why it works:</span> {camp.whyItWorks}
                                  </div>
                                </div>
                              </div>
                              <div className="pt-4 flex justify-between items-center border-t border-border/10">
                                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Consumer Friendly • High Quality</span>
                                <Button variant="ghost" size="sm" className="h-8 text-[10px] gap-2 font-black uppercase text-primary hover:bg-primary/5 transition-all">
                                  <Share2 className="w-3.5 h-3.5" />
                                  Export Idea
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-muted-foreground px-2 font-mono">
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="max-w-[90%] space-y-3 flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-1 px-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-80">Viral Architect Response</span>
                  </div>
                  <div className="bg-card/90 border border-border/50 p-6 rounded-3xl rounded-tl-none flex items-center gap-4 shadow-2xl backdrop-blur-xl">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <div className="space-y-1">
                      <p className="text-sm font-black text-foreground">Innovating Viral Strategies...</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Designing best quality consumer friendly campaigns for {companyData?.name || 'your business'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input Console */}
      <div className="p-6 bg-card/60 border-t border-border/20 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto flex items-end gap-4 relative">
          <div className="flex-1 relative bg-background/80 border border-border/40 rounded-3xl focus-within:border-primary/50 focus-within:ring-[6px] focus-within:ring-primary/5 transition-all duration-300 shadow-sm overflow-hidden">
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
              placeholder="Describe your viral idea campaign objective..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[100px] max-h-[250px] border-0 focus-visible:ring-0 bg-transparent resize-none p-5 pb-12 text-sm leading-relaxed font-medium"
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

            <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-40 group-focus-within:opacity-100 transition-opacity">
               <div className="px-2 py-0.5 rounded-lg bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Viral Idea</div>
            </div>
          </div>

          <Button
            onClick={generateViralIdeas}
            disabled={isGenerating || (!input.trim() && files.length === 0)}
            size="icon"
            className={cn(
              "h-14 w-14 rounded-[1.5rem] transition-all duration-500 shadow-2xl",
              input.trim() || files.length > 0
                ? "bg-primary text-primary-foreground hover:scale-105 hover:rotate-2 shadow-primary/25" 
                : "bg-muted text-muted-foreground opacity-50 grayscale"
            )}
          >
            {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <SendHorizontal className="w-6 h-6 ml-0.5" />}
          </Button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 opacity-40">
           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            Professional Grade
           </p>
           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            Consumer Friendly
           </p>
           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            High Quality
           </p>
        </div>
      </div>
    </div>
  );
}
