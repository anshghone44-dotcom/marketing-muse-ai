import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  Search,
  Bot,
  User,
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
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CompanyData } from "./CompanyForm";

interface CompetitorData {
  name: string;
  engagement: { platform: string; score: number }[];
  leadGen: { category: string; value: number }[];
  growth: { month: string; followers: number }[];
  goals: string[];
  recommendations: string[];
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  type?: "intro" | "analyzing" | "results" | "recommendations" | "export";
  competitorData?: CompetitorData;
  timestamp: Date;
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAnalyzing]);

  const startAnalysis = async (competitorName: string) => {
    if (!competitorName.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: competitorName,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsAnalyzing(true);

    // Step 2: Collection simulation
    setTimeout(() => {
      const mockData: CompetitorData = {
        name: competitorName,
        engagement: [
          { platform: "Facebook", score: 45 },
          { platform: "Instagram", score: 85 },
          { platform: "LinkedIn", score: 30 },
          { platform: "TikTok", score: 65 }
        ],
        leadGen: [
          { category: "Paid Ads", value: 40 },
          { category: "Organic", value: 35 },
          { category: "Referrals", value: 15 },
          { category: "Email", value: 10 }
        ],
        growth: [
          { month: "Jan", followers: 1200 },
          { month: "Feb", followers: 1500 },
          { month: "Mar", followers: 2200 },
          { month: "Apr", followers: 2800 }
        ],
        goals: [
          `"${competitorName} aims to increase lead generation by 25% in Q3 with Instagram ads."`,
          `"${competitorName} plans to boost brand awareness by 30% via organic content."`
        ],
        recommendations: [
          "Focus on Instagram ads to boost lead generation for high-intent professional queries.",
          "Create more educational organic content specifically for LinkedIn to establish authority.",
          "Implement an interactive ROI calculator to compete with their 'Request a Quote' flow."
        ]
      };

      const resultsMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        type: "results",
        content: `Analysis for **${competitorName}** is complete. I've aggregated their performance metrics, growth trajectory, and strategic goals.`,
        competitorData: mockData,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, resultsMessage]);
      setIsAnalyzing(false);
      toast.success("Competitor metrics synchronized.");
    }, 2500);
  };

  const showRecommendations = (data: CompetitorData) => {
    const recMessage: Message = {
      id: Date.now().toString(),
      role: "ai",
      type: "recommendations",
      content: "Based on the analysis, here are your strategic recommendations to outperform them:",
      competitorData: data,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, recMessage]);
  };

  const handleExport = () => {
    toast.success("Analysis report is being prepared for download.");
    const exportMessage: Message = {
      id: Date.now().toString(),
      role: "ai",
      type: "export",
      content: "Analysis finalized. You can now export the full report or share it with your team.",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, exportMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      startAnalysis(input);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-6xl mx-auto relative bg-background/40 border border-border/40 rounded-[2.5rem] overflow-hidden shadow-3xl backdrop-blur-xl">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-card/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tighter">AI Competitor Architect</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">Intelligence Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 scroll-smooth"
      >
        {messages.length === 0 && !isAnalyzing ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-8">
            <div className="w-24 h-24 rounded-[3rem] bg-primary/5 flex items-center justify-center border border-primary/10 shadow-2xl">
              <Bot className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-foreground tracking-tighter italic">Know Thy Competitor.</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Type a competitor's name below. I will analyze their social engagement, lead generation strategies, and growth patterns to give you actionable insights.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {['Nexus Migration', 'WWICS', 'VFS Global'].map(name => (
                <button 
                  key={name}
                  onClick={() => startAnalysis(name)}
                  className="px-6 py-2 rounded-full bg-muted/40 border border-border/50 text-[11px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={cn("flex w-full animate-in fade-in slide-in-from-bottom-8 duration-700", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[95%] space-y-4", m.role === "user" ? "items-end" : "items-start")}>
                {/* Meta Labels */}
                <div className="flex items-center gap-3 px-3">
                  {m.role === "ai" && <Bot className="w-5 h-5 text-primary" />}
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
                    {m.role === "user" ? "Target Identification" : "Intelligence Report"}
                  </span>
                </div>

                {/* Content Bubble */}
                <div className={cn(
                  "p-6 md:p-8 rounded-[2rem] text-sm leading-relaxed border shadow-2xl overflow-hidden",
                  m.role === "user" 
                    ? "bg-primary text-primary-foreground border-primary/20 rounded-tr-none" 
                    : "bg-card/90 border-border/40 rounded-tl-none backdrop-blur-3xl"
                )}>
                  <div className="prose prose-sm dark:prose-invert font-medium">
                    {m.content}
                  </div>

                  {m.type === "results" && m.competitorData && (
                    <div className="mt-8 space-y-10 border-t border-border/20 pt-10">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-2xl font-black tracking-tighter text-primary italic uppercase">{m.competitorData.name}</h4>
                        <div className="h-0.5 flex-1 mx-6 bg-gradient-to-r from-primary/40 to-transparent" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Engagement Graph */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 group">
                            <BarChart3 className="w-4 h-4 text-primary transition-transform group-hover:rotate-12" />
                            <span className="text-[11px] font-black uppercase tracking-widest">Social Engagement (Avg.)</span>
                          </div>
                          <div className="h-[250px] w-full bg-background/40 rounded-3xl p-4 border border-border/20">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                { type: 'Likes', count: 1200 },
                                { type: 'Shares', count: 450 },
                                { type: 'Comments', count: 320 }
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                                <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                                <Tooltip 
                                  contentStyle={{borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.8)'}}
                                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                />
                                <Bar dataKey="count" fill="#8884d8" radius={[8, 8, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Lead Gen Pie Chart */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 group">
                            <PieChartIcon className="w-4 h-4 text-primary transition-transform group-hover:scale-110" />
                            <span className="text-[11px] font-black uppercase tracking-widest">Lead Generation Breakdown</span>
                          </div>
                          <div className="h-[250px] w-full bg-background/40 rounded-3xl p-4 border border-border/20">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={m.competitorData.leadGen}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {m.competitorData.leadGen.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  contentStyle={{borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.8)'}}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Growth Graph */}
                        <div className="space-y-4 md:col-span-2">
                          <div className="flex items-center gap-2 group">
                            <LineChartIcon className="w-4 h-4 text-primary transition-transform group-hover:scale-110" />
                            <span className="text-[11px] font-black uppercase tracking-widest">Follower Trajectory (Market Expansion)</span>
                          </div>
                          <div className="h-[250px] w-full bg-background/40 rounded-3xl p-4 border border-border/20">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={m.competitorData.growth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                                <Tooltip 
                                  contentStyle={{borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.8)'}}
                                />
                                <Line type="monotone" dataKey="followers" stroke="#82ca9d" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Goal Insights */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-primary" />
                          <span className="text-[11px] font-black uppercase tracking-widest">Target Goal Insights</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {m.competitorData.goals.map((goal, i) => (
                            <div key={i} className="p-5 rounded-2xl bg-primary/5 border border-primary/10 text-sm font-bold italic leading-relaxed">
                              {goal}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interaction Prompts */}
                      <div className="pt-6 flex flex-wrap gap-4">
                         <Button 
                          variant="ai" 
                          onClick={() => showRecommendations(m.competitorData!)}
                          className="px-8 h-12 rounded-full font-black uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                         >
                            <Lightbulb className="w-4 h-4" />
                            Show Recommendations
                         </Button>
                         <Button 
                          variant="outline" 
                          onClick={() => setMessages([])}
                          className="px-8 h-12 rounded-full font-black uppercase tracking-widest border-border/40"
                         >
                            Analyze Another
                         </Button>
                      </div>
                    </div>
                  )}

                  {m.type === "recommendations" && m.competitorData && (
                    <div className="mt-6 space-y-4 animate-in fade-in zoom-in duration-500">
                      {m.competitorData.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-3xl bg-green-500/5 border border-green-500/10 group hover:border-green-500/30 transition-colors">
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/20">
                            <span className="text-[10px] font-black text-green-600">{i + 1}</span>
                          </div>
                          <p className="text-[13px] font-bold leading-relaxed">{rec}</p>
                        </div>
                      ))}
                      <div className="pt-8 flex flex-wrap gap-4 border-t border-border/10 mt-8">
                         <Button 
                          variant="ai" 
                          onClick={handleExport}
                          className="px-8 h-12 rounded-full font-black uppercase tracking-widest gap-2 shadow-2xl"
                         >
                            <Download className="w-4 h-4" />
                            Export Data Report
                         </Button>
                         <Button 
                          variant="outline" 
                          className="px-8 h-12 rounded-full font-black uppercase tracking-widest border-border/40 gap-2"
                         >
                            <Mail className="w-4 h-4" />
                            Share via Email
                         </Button>
                      </div>
                    </div>
                  )}

                  {m.type === "export" && (
                    <div className="mt-6 flex flex-col gap-4">
                      <div className="flex items-center gap-4 text-primary font-black uppercase tracking-widest text-[11px] mb-2">
                         <Zap className="w-4 h-4 fill-primary" />
                         Next Move Recommendation
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" className="rounded-full px-6 font-bold gap-2">
                           Analyze Another <RefreshCcw className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ai" className="rounded-full px-6 font-bold gap-2 shadow-lg shadow-primary/20">
                           Optimize My Strategy <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {isAnalyzing && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-[90%] space-y-3">
              <div className="flex items-center gap-2 px-3">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Competitor Engine</span>
              </div>
              <div className="bg-card/90 border border-border/50 p-6 rounded-3xl rounded-tl-none shadow-3xl backdrop-blur-2xl flex items-center gap-6">
                <div className="relative">
                   <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                   <Search className="absolute inset-0 m-auto w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-black text-foreground">Scraping Competitive Intelligence...</p>
                   <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Aggregating social signals and ad history for {companyData?.name || 'market context'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Console */}
      <div className="p-8 bg-card/60 border-t border-white/5 backdrop-blur-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-4">
            <div className="flex-1 relative bg-background/50 border border-border/40 rounded-[2rem] focus-within:border-primary/50 focus-within:ring-[8px] focus-within:ring-primary/5 transition-all duration-500 shadow-inner group">
              <Textarea
                placeholder="Type the competitor's name or choose from the list..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[90px] max-h-[200px] border-0 focus-visible:ring-0 bg-transparent resize-none p-6 text-base font-bold leading-relaxed placeholder:opacity-50"
              />
              <div className="absolute top-4 right-4 opacity-30 group-focus-within:opacity-100 transition-opacity">
                 <Search className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <Button
              onClick={() => startAnalysis(input)}
              disabled={isAnalyzing || !input.trim()}
              size="icon"
              className={cn(
                "h-16 w-16 rounded-3xl transition-all duration-500 shadow-3xl",
                input.trim()
                  ? "bg-primary text-primary-foreground hover:scale-105 hover:rotate-2 shadow-primary/30" 
                  : "bg-muted text-muted-foreground opacity-50 grayscale"
              )}
            >
              {isAnalyzing ? <Loader2 className="w-7 h-7 animate-spin" /> : <TrendingUp className="w-7 h-7" />}
            </Button>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-10 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000 font-black text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
             <span className="flex items-center gap-2">Performance Tracking</span>
             <span className="flex items-center gap-2">Goal Extraction</span>
             <span className="flex items-center gap-2">Export Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
