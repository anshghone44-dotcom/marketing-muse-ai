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
  Plus,
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`File "${file.name}" uploaded successfully.`, {
        description: "Analyzing competitor documents for insights..."
      });
      // Simulate analysis start based on file
      startAnalysis(file.name.split('.')[0]);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-6xl mx-auto relative bg-transparent overflow-hidden">
      {/* Centered LeadBot Title for Empty State */}
      {messages.length === 0 && !isAnalyzing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-24 pointer-events-none px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-sans font-semibold tracking-tight text-foreground flex flex-col md:flex-row items-center gap-2 md:gap-3">
            <span className="opacity-90">LeadBot</span>
            <span className="text-muted-foreground/60 font-light">Competitor Analyzer</span>
          </h1>
        </div>
      )}

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 scroll-smooth"
      >
        {messages.length > 0 && (
          messages.map((m) => (
            <div key={m.id} className={cn("flex w-full animate-in fade-in slide-in-from-bottom-8 duration-700", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[85%] space-y-4", m.role === "user" ? "items-end" : "items-start")}>
                {/* Simplified Content Bubble (LeadBot Style) */}
                <div className={cn(
                  "p-6 md:p-8 rounded-3xl text-base leading-relaxed overflow-hidden",
                  m.role === "user" 
                    ? "bg-muted/50 text-foreground border border-border/40" 
                    : "bg-transparent text-foreground"
                )}>
                  <div className="prose prose-base dark:prose-invert font-medium">
                    {m.content}
                  </div>

                  {m.type === "results" && m.competitorData && (
                    <div className="mt-8 space-y-10 border-t border-border/10 pt-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Engagement Graph */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Social Engagement</span>
                          </div>
                          <div className="h-[250px] w-full bg-muted/20 rounded-3xl p-4 border border-border/10">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                { type: 'Likes', count: 1200 },
                                { type: 'Shares', count: 450 },
                                { type: 'Comments', count: 320 }
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                                <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'currentColor', opacity: 0.5}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'currentColor', opacity: 0.5}} />
                                <Tooltip 
                                  contentStyle={{borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.8)'}}
                                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                />
                                <Bar dataKey="count" fill="currentColor" opacity={0.8} radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Lead Gen Pie Chart */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <PieChartIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Lead Sources</span>
                          </div>
                          <div className="h-[250px] w-full bg-muted/20 rounded-3xl p-4 border border-border/10">
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
                          <div className="flex items-center gap-2">
                            <LineChartIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Growth Trajectory</span>
                          </div>
                          <div className="h-[250px] w-full bg-muted/20 rounded-3xl p-4 border border-border/10">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={m.competitorData.growth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'currentColor', opacity: 0.5}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'currentColor', opacity: 0.5}} />
                                <Tooltip 
                                  contentStyle={{borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.8)'}}
                                />
                                <Line type="monotone" dataKey="followers" stroke="currentColor" strokeWidth={2} dot={{r: 3, fill: 'currentColor'}} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Goal Insights */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Strategic Goals</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {m.competitorData.goals.map((goal, i) => (
                            <div key={i} className="p-5 rounded-2xl bg-muted/30 border border-border/10 text-sm leading-relaxed">
                              {goal}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interaction Prompts */}
                      <div className="pt-6 flex flex-wrap gap-4">
                         <Button 
                          variant="secondary" 
                          onClick={() => showRecommendations(m.competitorData!)}
                          className="px-8 h-12 rounded-full font-bold gap-2"
                         >
                            <Lightbulb className="w-4 h-4" />
                            Recommendations
                         </Button>
                         <Button 
                          variant="ghost" 
                          onClick={() => setMessages([])}
                          className="px-8 h-12 rounded-full font-bold"
                         >
                            New Analysis
                         </Button>
                      </div>
                    </div>
                  )}

                  {m.type === "recommendations" && m.competitorData && (
                    <div className="mt-6 space-y-4 animate-in fade-in zoom-in duration-500">
                      {m.competitorData.recommendations.map((rec, i) => (
                        <div key={i} className="p-5 rounded-3xl bg-muted/20 border border-border/10">
                          <p className="text-sm font-medium leading-relaxed">{rec}</p>
                        </div>
                      ))}
                      <div className="pt-8 flex flex-wrap gap-3 border-t border-border/10 mt-8">
                         <Button 
                          variant="secondary" 
                          onClick={handleExport}
                          className="px-8 h-12 rounded-full font-bold gap-2"
                         >
                            <Download className="w-4 h-4" />
                            Export
                         </Button>
                         <Button 
                          variant="ghost" 
                          className="px-8 h-12 rounded-full font-bold gap-2"
                         >
                            <Mail className="w-4 h-4" />
                            Email
                         </Button>
                      </div>
                    </div>
                  )}

                  {m.type === "export" && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button variant="ghost" className="rounded-full px-6 font-bold" onClick={() => setMessages([])}>
                         Analyze Another
                      </Button>
                      <Button variant="secondary" className="rounded-full px-6 font-bold">
                         Optimize Strategy
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {isAnalyzing && (
          <div className="flex justify-start">
            <div className="max-w-[90%] p-6 rounded-3xl bg-muted/20 animate-pulse flex items-center gap-4">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Analyzing market data...</span>
            </div>
          </div>
        )}
      </div>

      {/* LeadBot-Style Input Console */}
      <div className="pb-10 px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="w-full relative flex items-center">
            {/* Plus Icon (Source/Context Upload) */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              multiple
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-6 z-10 p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground group"
              title="Add sources, contexts, or files"
            >
              <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
            </button>

            <Textarea
              placeholder="What do you want to know?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[64px] max-h-[200px] w-full bg-muted/40 border-border/40 focus:border-border/60 hover:border-border/60 rounded-[2rem] pl-16 pr-24 py-5 text-base font-medium resize-none shadow-sm transition-all"
            />

            {/* Submit Actions */}
            <div className="absolute right-3 flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted/60 text-[11px] font-bold text-muted-foreground mr-1">
                Auto <ArrowRight className="w-3 h-3 ml-1" />
              </div>
              <Button
                onClick={() => startAnalysis(input)}
                disabled={isAnalyzing || !input.trim()}
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full transition-all duration-300",
                  input.trim()
                    ? "bg-foreground text-background hover:scale-105" 
                    : "bg-muted text-muted-foreground opacity-50 grayscale"
                )}
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
