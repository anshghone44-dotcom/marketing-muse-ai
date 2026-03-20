import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Download,
  Check,
  X,
  SendHorizontal,
  Bot,
  User,
  Loader2,
  Megaphone,
  Layout,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Globe,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CompanyData } from "./CompanyForm";
import CompanyForm from "./CompanyForm";

export const SOCIAL_PLATFORMS = [
  { id: "Instagram", icon: Instagram },
  { id: "Facebook", icon: Facebook },
  { id: "LinkedIn", icon: Linkedin },
  { id: "YouTube", icon: Youtube },
  { id: "TikTok", icon: MessageSquare },
  { id: "Google", icon: Globe },
];

export const AD_GOALS = [
  "Brand Awareness",
  "Website Traffic",
  "Lead Generation",
  "Direct Sales",
  "Testimonials",
];

interface VisualAd {
  id: string;
  platform: string;
  headline: string;
  description: string;
  callToAction: string;
  backgroundColor: string;
  accentColor: string;
  adCopy: string;
  mediaType: "image" | "video";
  mediaUrl: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  ads?: VisualAd[];
  timestamp: Date;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

export default function AiAdGeneratorChat({ companyData, onCompanySubmit }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Instagram", "Facebook"]);
  const [selectedGoal, setSelectedGoal] = useState("Lead Generation");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const generateAds = async () => {
    if (!input.trim()) {
      toast.error("Please describe your ad campaign goal.");
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform.");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    // Simulate AI generation logic
    setTimeout(() => {
      const topic = userMessage.content;
      const { name, industry, product, audience } = companyData || {};

      const platformConfig: Record<string, { bg: string; accent: string }> = {
        Instagram: { bg: "from-purple-500/20 to-pink-500/20", accent: "bg-gradient-to-r from-purple-600 to-pink-600" },
        Facebook: { bg: "from-blue-600/20 to-indigo-600/20", accent: "bg-blue-600" },
        LinkedIn: { bg: "from-blue-700/20 to-slate-700/20", accent: "bg-blue-700" },
        YouTube: { bg: "from-red-600/20 to-orange-600/20", accent: "bg-red-600" },
        TikTok: { bg: "from-slate-900/20 to-pink-500/20", accent: "bg-black" },
        Google: { bg: "from-blue-500/20 to-green-500/20", accent: "bg-blue-500" },
      };

      const ads: VisualAd[] = selectedPlatforms.map(platform => {
        const config = platformConfig[platform] || platformConfig.Instagram;
        return {
          id: `${platform}-${Date.now()}`,
          platform,
          headline: `Professional ${topic.split(' ').slice(0, 3).join(' ')} Strategy`,
          description: `Unlock high-quality ${selectedGoal.toLowerCase()} with ${name || "our solutions"} specifically designed for ${audience || "industry professionals"}.`,
          callToAction: "Book a Strategic Consultation",
          backgroundColor: config.bg,
          accentColor: config.accent,
          adCopy: `### AI GENERATED AD COPY (${platform})\n\n**Headline:** Elevate your ${industry || "business"} with ${product || "expert solutions"}.\n\n**Body:** Tired of subpar results? ${name || "LeadBot"} delivers a formal, data-driven approach to ${topic.toLowerCase()}. We help ${audience || "forward-thinking leaders"} achieve measurable growth through proven ${industry || "market"} methodologies.\n\n**CTA:** ${selectedGoal === "Lead Generation" ? "Claim Your Free Strategic Assessment" : "Explore Professional Solutions"}`,
          mediaType: ["YouTube", "TikTok"].includes(platform) ? "video" : "image",
          mediaUrl: `https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800`
        };
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `I've architected a professional ad campaign for "${topic}". Targeting your ${selectedGoal.toLowerCase()} goals across ${selectedPlatforms.join(', ')}. Here are the formal variations designed for ${companyData?.name || "your company"}:`,
        ads,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsGenerating(false);
      toast.success("Ad campaigns architected successfully!");
    }, 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateAds();
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  if (!companyData) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Initialize AI Context</h2>
          <p className="text-muted-foreground">Complete your profile to unlock the Strategic Ad Generator Chatbot.</p>
        </div>
        <CompanyForm onSubmit={onCompanySubmit} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[80vh] max-w-5xl mx-auto relative bg-background/40 border border-border/40 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header Context Bar */}
      <div className="p-5 border-b border-border/20 bg-card/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight flex items-center gap-2">
              Strategic Ad Architect
              <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-[9px] text-primary uppercase">v2.0</span>
            </h2>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">Formal & Professional Tone Enabled</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {SOCIAL_PLATFORMS.map(platform => {
            const Icon = platform.icon;
            const isSelected = selectedPlatforms.includes(platform.id);
            return (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all duration-300",
                  isSelected 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105" 
                    : "bg-background/50 border-border/50 text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-3 h-3" />
                {platform.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Conversation Stream */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 scroll-smooth"
      >
        {messages.length === 0 && !isGenerating ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-[2.5rem] bg-primary/10 flex items-center justify-center animate-pulse">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-background rounded-full flex items-center justify-center shadow-xl border border-border/40">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-foreground leading-tight">Elite Ad Intelligence for {companyData.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Describe your current campaign objective. I will architect high-quality, professional, and formal ad copy tailored to your industry standards.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {AD_GOALS.map(goal => (
                <button
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  className={cn(
                    "p-4 rounded-2xl border text-[11px] font-bold text-left transition-all hover:scale-[1.02]",
                    selectedGoal === goal 
                      ? "bg-primary/5 border-primary/50 text-foreground ring-1 ring-primary/20" 
                      : "bg-card/30 border-border/40 text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="uppercase tracking-widest">{goal}</span>
                    <Layout className="w-3 h-3 opacity-40" />
                  </div>
                  <span className="text-[9px] font-normal block opacity-60">Generate formal {goal.toLowerCase()} creatives.</span>
                </button>
              ))}
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
                      {m.role === "user" ? "Your Directive" : "Strategic Response"}
                    </span>
                    {m.role === "user" && <User className="w-4 h-4 text-muted-foreground/60" />}
                  </div>

                  <div className={cn(
                    "p-5 rounded-3xl text-sm leading-relaxed shadow-xl border border-white/5",
                    m.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-card/90 border-border/50 rounded-tl-none backdrop-blur-xl"
                  )}>
                    {m.content}
                    
                    {m.ads && (
                      <div className="mt-8 grid grid-cols-1 gap-8 pt-8 border-t border-border/20">
                        {m.ads.map((ad, aIdx) => (
                          <Card key={aIdx} className="overflow-hidden border border-border/40 bg-background/50 backdrop-blur shadow-2xl group transition-all hover:border-primary/30">
                            <div className={cn(
                              "relative aspect-video flex flex-col items-center justify-center p-8 bg-gradient-to-br transition-all duration-700",
                              ad.backgroundColor
                            )}>
                              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <img src={ad.mediaUrl} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 px-0" alt="Ad Visualization" />
                              
                              <div className="relative z-10 text-center space-y-4 max-w-sm">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-tighter">
                                  {ad.platform} PREVIEW
                                </div>
                                <h4 className="text-xl md:text-3xl font-black text-white leading-[1.1] drop-shadow-2xl">
                                  {ad.headline.toUpperCase()}
                                </h4>
                                <div className={cn("inline-block px-8 py-3 rounded-full text-[12px] font-black text-white shadow-2xl tracking-tight transition-transform group-hover:scale-105", ad.accentColor)}>
                                  {ad.callToAction.toUpperCase()}
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-6 space-y-4 bg-card/60">
                              <div className="flex items-center justify-between pb-4 border-b border-border/20">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">High-End Ad Copy (Formal)</span>
                                <Button variant="ghost" size="sm" className="h-8 text-[10px] gap-2 font-black uppercase text-muted-foreground hover:text-primary transition-all">
                                  <Download className="w-3.5 h-3.5" />
                                  Export Brand Asset
                                </Button>
                              </div>
                              <div className="text-[13px] text-foreground/90 font-serif leading-loose italic whitespace-pre-wrap">
                                {ad.adCopy}
                              </div>
                              <div className="flex gap-2 pt-2">
                                <span className="px-2 py-0.5 rounded-md bg-muted text-[9px] font-bold text-muted-foreground uppercase">2048x1080</span>
                                <span className="px-2 py-0.5 rounded-md bg-muted text-[9px] font-bold text-muted-foreground uppercase">Professional Tone</span>
                                <span className="px-2 py-0.5 rounded-md bg-muted text-[9px] font-bold text-muted-foreground uppercase">Verified Context</span>
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
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-80">Strategic Response</span>
                  </div>
                  <div className="bg-card/90 border border-border/50 p-6 rounded-3xl rounded-tl-none flex items-center gap-4 shadow-2xl backdrop-blur-xl">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-foreground">Analyzing Strategy...</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Designing professional formal ad variations for {companyData.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input Action Console */}
      <div className="p-6 bg-card/60 border-t border-border/20 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto flex items-end gap-4 relative">
          <div className="flex-1 relative bg-background/80 border border-border/40 rounded-3xl focus-within:border-primary/50 focus-within:ring-[6px] focus-within:ring-primary/5 transition-all duration-300 shadow-sm overflow-hidden">
            <Textarea
              placeholder={`Describe the goal for your ${companyData.industry.toLowerCase()} ad campaign...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[100px] max-h-[250px] border-0 focus-visible:ring-0 bg-transparent resize-none p-5 text-sm leading-relaxed font-medium"
            />
            
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-40 group-focus-within:opacity-100 transition-opacity">
               <div className="px-2 py-0.5 rounded-lg bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Formal</div>
            </div>
          </div>

          <Button
            onClick={generateAds}
            disabled={isGenerating || !input.trim()}
            size="icon"
            className={cn(
              "h-14 w-14 rounded-[1.5rem] transition-all duration-500 shadow-2xl",
              input.trim() 
                ? "bg-primary text-primary-foreground hover:scale-105 hover:rotate-2 shadow-primary/25" 
                : "bg-muted text-muted-foreground opacity-50 grayscale"
            )}
          >
            {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <SendHorizontal className="w-6 h-6 ml-0.5" />}
          </Button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 opacity-40">
           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Check className="w-3 h-3 text-primary" /> Verified Strategy
           </p>
           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Check className="w-3 h-3 text-primary" /> Multi-Platform Ready
           </p>
           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Check className="w-3 h-3 text-primary" /> Enterprise Content
           </p>
        </div>
      </div>
    </div>
  );
}
