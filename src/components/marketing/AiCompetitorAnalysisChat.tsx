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
  Legend,
  AreaChart,
  Area
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
  Type,
  TrendingDown,
  Activity,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CompanyData } from "./CompanyForm";

interface CompetitorData {
  name: string;
  engagement: { type: string; count: number }[];
  leadGen: { name: string; value: number }[];
  growth: { month: string; followers: number }[];
  financials: { year: string; revenue: number; profit: number }[];
  marketShare: { name: string; value: number }[];
  detailedReport: string;
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

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F', '#FFBB28'];

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
          ? `Comprehensive financial and strategic report for **${competitorName}**. Our analysis covers their technical formation, historical net profits, and current accounting standing.` 
          : `Financial position and performance visualization for **${competitorName}**. The following charts detail their revenue trajectory and market dominance.`,
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
          financials: mode === 'analyze' ? [
            { year: '2021', revenue: 450, profit: 85 },
            { year: '2022', revenue: 520, profit: 110 },
            { year: '2023', revenue: 610, profit: 145 },
            { year: '2024', revenue: 780, profit: 195 }
          ] : [],
          marketShare: mode === 'analyze' ? [
            { name: competitorName, value: 35 },
            { name: 'Competitor A', value: 25 },
            { name: 'Competitor B', value: 20 },
            { name: 'Others', value: 20 }
          ] : [],
          detailedReport: mode === 'auto' ? `
            ### Company Formation and Evolution
            Founded in 2015, **${competitorName}** began as a specialized niche provider before aggressively expanding into mid-market enterprise solutions. Their initial formation was backed by series-A funding which focused on architectural scalability—a decision that has allowed them to maintain high operational efficiency during rapid growth periods.

            ### Financial Performance & Net Profits
            Over the last three financial years, the company has demonstrated an impressive CAGR of 18%. In the most recent fiscal year (FY2023), they reported a record net profit of $145M, up from $110M the previous year. This growth is largely attributed to their high-margin subscription models and a significant reduction in customer acquisition costs through organic channel optimization.

            ### Accounting & Fiscal Health
            From an accounting perspective, **${competitorName}** maintains a robust balance sheet with a current ratio of 2.4, indicating strong liquidity. Their financial reports show a disciplined approach to capital expenditure, with 25% of gross profit being reinvested directly into R&D. Recent audits confirm a transparent fiscal policy, with no significant long-term debt liabilities impacting their short-term operational agility.
          ` : "",
          recommendations: [
            "Monitor their upcoming Q3 expansion into the European market",
            "Consider a more aggressive pricing strategy to challenge their high-margin segments",
            "Leverage their current R&D focus areas to identify your own innovation gaps"
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
                "p-6 md:p-8 rounded-3xl text-base leading-relaxed overflow-hidden shadow-sm",
                m.role === "user" ? "bg-muted/50 text-foreground border border-border/40" : "bg-card/40 backdrop-blur-xl border border-border/10 text-foreground"
              )}>
                <div className="prose prose-base dark:prose-invert font-medium">
                  {m.content}
                </div>

                {m.type === "results" && m.competitorData && (
                  <div className="mt-8 space-y-12 border-t border-border/10 pt-10">
                    {/* Detailed Professional Text Report */}
                    {m.competitorData.detailedReport && (
                      <div className="space-y-6 animate-in fade-in duration-700">
                        <div className="flex items-center gap-2 mb-4">
                           <FileText className="w-5 h-5 text-primary" />
                           <h2 className="text-lg font-bold tracking-tight">Executive Summary & Financial Analysis</h2>
                        </div>
                        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {m.competitorData.detailedReport}
                        </div>
                      </div>
                    )}

                    {/* Financial Position & Performance Graphs */}
                    {m.competitorData.financials.length > 0 && (
                      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        
                        {/* Financial Growth (Revenue vs Profit) */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-primary" />
                              <span className="text-xs font-bold text-foreground uppercase tracking-widest">Financial Position (Revenue vs Net Profit)</span>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] uppercase tracking-tighter font-bold">
                              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-primary rounded-full"></div> Revenue ($M)</div>
                              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Net Profit ($M)</div>
                            </div>
                          </div>
                          <div className="h-[300px] bg-muted/20 rounded-3xl p-6 border border-border/10 shadow-inner">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={m.competitorData.financials}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                                <XAxis dataKey="year" tick={{fontSize: 10, fill: 'currentColor', opacity: 0.5}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fontSize: 10, fill: 'currentColor', opacity: 0.5}} axisLine={false} tickLine={false} />
                                <Tooltip 
                                  contentStyle={{borderRadius: '16px', background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}} 
                                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                />
                                <Bar dataKey="revenue" fill="currentColor" className="text-primary" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Market Share Positioning */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <PieChartIcon className="w-4 h-4 text-primary" />
                              <span className="text-xs font-bold text-foreground uppercase tracking-widest">Market Dominance</span>
                            </div>
                            <div className="h-[250px] bg-muted/20 rounded-3xl p-4 border border-border/10">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie data={m.competitorData.marketShare} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {m.competitorData.marketShare.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                  </Pie>
                                  <Tooltip contentStyle={{borderRadius: '12px', background: '#000', border: 'none'}} />
                                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Efficiency & Growth Trajectory */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-primary" />
                              <span className="text-xs font-bold text-foreground uppercase tracking-widest">Performance Reports</span>
                            </div>
                            <div className="h-[250px] bg-muted/20 rounded-3xl p-4 border border-border/10">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={m.competitorData.growth}>
                                  <defs>
                                    <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="currentColor" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                                  <XAxis dataKey="month" tick={{fontSize: 10, fill: 'currentColor', opacity: 0.5}} axisLine={false} tickLine={false} />
                                  <Tooltip />
                                  <Area type="monotone" dataKey="followers" stroke="currentColor" fillOpacity={1} fill="url(#colorFollowers)" strokeWidth={2} />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
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
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-semibold tracking-tight">Aggregating Financial Intelligence...</span>
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
              <DropdownMenuItem onClick={() => { setSelectedSource('competitor'); }} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted">
                <Link className="w-4 h-4 text-orange-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Competitor Analysis</span>
                  <span className="text-[10px] text-muted-foreground">URL or Company Name</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedSource('files'); fileInputRef.current?.click(); }} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted">
                <FileText className="w-4 h-4 text-blue-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Financial Reports</span>
                  <span className="text-[10px] text-muted-foreground">PDF or DOC Files</span>
                </div>
              </DropdownMenuItem>
              {/* Other options simplified for focus */}
            </DropdownMenuContent>
          </DropdownMenu>

          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx" />

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), startAnalysis(input))}
            placeholder={selectedSource === 'competitor' ? "Enter competitor name for deep analysis..." : "Ask about competitor formation, profits, or accounting..."}
            className="w-full min-h-[64px] bg-muted/40 border-border/40 rounded-[2rem] pl-16 pr-44 py-5 resize-none focus:border-primary/40 shadow-sm transition-shadow hover:shadow-md"
          />

          <div className="absolute right-3 flex items-center gap-2">
            <Button variant="ghost" onClick={() => startAnalysis(input, 'auto')} disabled={isAnalyzing || !input.trim() && !selectedSource} className="h-10 px-4 rounded-full text-xs font-bold gap-1.5 hover:bg-primary/10 transition-all">
              Auto <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <Button onClick={() => startAnalysis(input, 'analyze')} disabled={isAnalyzing || !input.trim() && !selectedSource} className="h-11 px-6 rounded-full font-bold bg-foreground text-background hover:scale-105 transition-all shadow-lg active:scale-95">
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
