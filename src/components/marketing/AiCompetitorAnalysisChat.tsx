import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import {
  ArrowRight,
  Plus,
  Bot,
  User,
  Check,
  Loader2,
  TrendingUp,
  Target,
  Lightbulb,
  Download,
  Mail,
  RefreshCcw,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  FileText,
  Image as ImageIcon,
  Link,
  Type
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CompanyData } from "./CompanyForm";

interface CompetitorData {
  name: string;
  engagement: { type: string; count: number }[];
  leadGen: { name: string; value: number }[];
  growth: { month: string; followers: number }[];
  goals: string[];
  recommendations: string[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "intro" | "analyzing" | "results" | "recommendations" | "export";
  competitorData?: CompetitorData;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export default function AiCompetitorAnalysisChat({ companyData, onCompanySubmit }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  type SourceType = 'files' | 'screenshot' | 'competitor' | 'prompt';
  const [selectedSource, setSelectedSource] = useState<SourceType | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAnalyzing]);

  const startAnalysis = (query: string, mode: 'auto' | 'analyze' = 'auto') => {
    if (!query.trim() && !selectedSource) return;
    
    setIsAnalyzing(true);
    const userMessage: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      content: query || `Source: ${selectedSource}` 
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response delay
    setTimeout(() => {
      const competitorName = query || (selectedSource === 'competitor' ? 'Selected Competitor' : 'Target Entity');
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: mode === 'auto' 
          ? `Analysis report generated for **${competitorName}**. Based on recent activity, they are prioritizing enterprise customer satisfaction.` 
          : `Market visualization for **${competitorName}**. Data points indicate a strong growth trend in their social ecosystem.`,
        type: "results",
        competitorData: {
          name: competitorName,
          engagement: mode === 'analyze' ? [
            { type: 'Likes', count: 1200 },
            { type: 'Shares', count: 450 },
            { type: 'Comments', count: 320 }
          ] : [],
          leadGen: mode === 'analyze' ? [
            { name: 'Organic', value: 45 },
            { name: 'Paid Ads', value: 30 },
            { name: 'Social', value: 25 }
          ] : [],
          growth: mode === 'analyze' ? [
            { month: 'Jan', followers: 10000 },
            { month: 'Feb', followers: 12500 },
            { month: 'Mar', followers: 15000 }
          ] : [],
          goals: mode === 'auto' ? [
            "Increase market share by 15% in Q4",
            "Expand brand visibility in tech events",
            "Optimize sales conversion with AI tools"
          ] : [],
          recommendations: [
            "Leverage video content for better user reach",
            "Analyze and mirror their mid-tier pricing",
            "Implement a referral program to compete"
          ]
        }
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsAnalyzing(false);
      setInput("");
      setSelectedSource(null);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`File "${file.name}" uploaded successfully.`);
      startAnalysis("", 'auto');
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-6xl mx-auto relative bg-transparent overflow-hidden">
      {/* Empty State */}
      {messages.length === 0 && !isAnalyzing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-24 pointer-events-none px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-sans font-semibold tracking-tight text-foreground flex flex-col md:flex-row items-center gap-2 md:gap-3">
            <span className="opacity-90">LeadBot</span>
            <span className="text-muted-foreground/60 font-light">Competitor Analyzer</span>
          </h1>
        </div>
      )}

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 scroll-smooth"
      >
        {messages.map((m) => (
          <div key={m.id} className={cn("flex w-full animate-in fade-in slide-in-from-bottom-8 duration-700", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[85%] space-y-4", m.role === "user" ? "items-end" : "items-start")}>
              <div className={cn(
                "p-6 md:p-8 rounded-3xl text-base leading-relaxed overflow-hidden",
                m.role === "user" ? "bg-muted/50 text-foreground border border-border/40" : "bg-transparent text-foreground"
              )}>
                <div className="prose prose-base dark:prose-invert font-medium">
                  {m.content}
                </div>

                {m.type === "results" && m.competitorData && (
                  <div className="mt-8 space-y-10 border-t border-border/10 pt-10">
                    {/* Detailed Data Section */}
                    {m.competitorData.goals.length > 0 && (
                      <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="p-6 rounded-3xl bg-muted/30 border border-border/10 space-y-3">
                              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                 <Target className="w-4 h-4" /> Market Positioning
                              </h3>
                              <p className="text-base">Strategic focus on high-LTV customer segments with specialized solutions.</p>
                           </div>
                           <div className="p-6 rounded-3xl bg-muted/30 border border-border/10 space-y-3">
                              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                 <TrendingUp className="w-4 h-4" /> Growth Outlook
                              </h3>
                              <p className="text-base">Consistent upward trajectory with strong retention signals in enterprise tiers.</p>
                           </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Core Objectives</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {m.competitorData.goals.map((goal, i) => (
                              <div key={i} className="p-5 rounded-2xl bg-muted/30 border border-border/10 text-sm leading-relaxed">{goal}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Chart Data Section */}
                    {m.competitorData.growth.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Market Engagement</span>
                          </div>
                          <div className="h-[250px] bg-muted/20 rounded-3xl p-4 border border-border/10">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={m.competitorData.engagement}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                                <XAxis dataKey="type" tick={{fontSize: 10, fill: 'currentColor', opacity: 0.5}} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{borderRadius: '16px', background: '#000', border: 'none'}} />
                                <Bar dataKey="count" fill="currentColor" opacity={0.8} radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <PieChartIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Inbound Breakdown</span>
                          </div>
                          <div className="h-[250px] bg-muted/20 rounded-3xl p-4 border border-border/10">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={m.competitorData.leadGen} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                  {m.competitorData.leadGen.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isAnalyzing && (
          <div className="flex items-center gap-4 p-6 bg-muted/20 rounded-3xl max-w-fit animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Processing intelligence...</span>
          </div>
        )}
      </div>

      {/* Input Console */}
      <div className="pb-10 px-6">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className={cn(
                  "absolute left-6 z-10 p-2 hover:bg-muted rounded-full transition-all text-muted-foreground",
                  selectedSource && "bg-primary/10 text-primary"
                )}
              >
                <Plus className={cn("w-6 h-6 transition-transform", selectedSource ? "rotate-45" : "")} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 p-2 bg-background/95 backdrop-blur-xl border border-border/40 shadow-2xl rounded-2xl">
              <DropdownMenuItem onClick={() => { setSelectedSource('files'); fileInputRef.current?.click(); }} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold">Add files</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSource('screenshot')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted">
                <ImageIcon className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-semibold">Add screenshot</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSource('competitor')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted">
                <Link className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold">Add competitor</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), startAnalysis(input))}
            placeholder={selectedSource === 'competitor' ? "Enter competitor name..." : "Enter a brief or ask about a competitor..."}
            className="w-full min-h-[64px] bg-muted/40 border-border/40 rounded-[2rem] pl-16 pr-44 py-5 resize-none focus:border-primary/40 shadow-sm"
          />

          <div className="absolute right-3 flex items-center gap-2">
            <Button variant="ghost" onClick={() => startAnalysis(input, 'auto')} disabled={isAnalyzing || !input.trim() && !selectedSource} className="h-10 px-4 rounded-full text-xs font-bold gap-1.5 hover:bg-primary/10 transition-all">
              Auto <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <Button onClick={() => startAnalysis(input, 'analyze')} disabled={isAnalyzing || !input.trim() && !selectedSource} className="h-11 px-6 rounded-full font-bold bg-foreground text-background hover:scale-105 transition-all">
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
