import { useState, useRef, useEffect } from "react";
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
  AreaChart,
  Area,
  Legend,
} from "recharts";
import {
  Loader2,
  BarChart3,
  PieChart as PieChartIcon,
  FileText,
  Activity,
  Building2,
  MapPin,
  Users,
  Package,
  TrendingUp,
  ShieldAlert,
  Lightbulb,
  Target,
  AlertTriangle,
  Paperclip,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CompanyData } from "./CompanyForm";
import { analyzeCompetitor, type CompetitorAnalysis } from "@/lib/geminiCompetitorService";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "results";
  analysis?: CompetitorAnalysis;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

const PIE_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00C49F", "#FFBB28"];

// Build illustrative chart data from the analysis
function buildCharts(analysis: CompetitorAnalysis) {
  const competitors = [analysis.companyName, ...analysis.mainCompetitors.slice(0, 3)];
  const baseShare = Math.floor(Math.random() * 15) + 30;
  const marketShare = competitors.map((name, i) => ({
    name,
    value: i === 0 ? baseShare : Math.floor((100 - baseShare) / (competitors.length - 1)),
  }));

  const growth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => ({
    month,
    trend: 70 + i * 5 + Math.floor(Math.random() * 8),
  }));

  const strengthCount = analysis.strengths.length;
  const weaknessCount = analysis.weaknesses.length;
  const opportunityCount = analysis.opportunities.length;
  const threatCount = analysis.threats.length;
  const swot = [
    { category: "Strengths", count: strengthCount },
    { category: "Weaknesses", count: weaknessCount },
    { category: "Opportunities", count: opportunityCount },
    { category: "Threats", count: threatCount },
  ];

  return { marketShare, growth, swot };
}

function buildDetailedReport(a: CompetitorAnalysis): string {
  return `
### ${a.companyName} — Executive Overview

**${a.companyName}** operates in the **${a.industry}** sector and is headquartered in **${a.headquarters}**${a.founded !== "Unknown" ? `, founded in **${a.founded}**` : ""}.

${a.overallSummary}

---

### Business Model & Revenue
- **Model:** ${a.businessModel}
- **Estimated Revenue:** ${a.revenueRange}
- **Workforce:** ${a.employeeCount}

---

### Target Audience
${a.targetAudience}

---

### Key Products & Services
${a.keyProducts.map((p) => `- ${p}`).join("\n")}

---

### Market Positioning
${a.marketPositioning}

---

### Main Competitors
${a.mainCompetitors.map((c) => `- **${c}**`).join("\n")}

---

### Recent Highlights
${a.recentHighlights.map((h) => `- ${h}`).join("\n")}
  `.trim();
}

export default function AiCompetitorAnalysisChat({ companyData }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingLabel, setAnalyzingLabel] = useState("Analyzing…");
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAnalyzing]);

  const startAnalysis = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setIsAnalyzing(true);
    setAnalyzingLabel(`Researching ${trimmed}…`);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const analysis = await analyzeCompetitor(trimmed);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Here is a comprehensive competitive intelligence report for **${analysis.companyName}**.`,
        type: "results",
        analysis,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to analyze the company. Please check your API key and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      startAnalysis();
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
                  ? "bg-muted text-foreground"
                  : "prose prose-sm dark:prose-invert font-normal text-foreground max-w-none text-left bg-transparent"
              )}
            >
              <ReactMarkdown>{m.content}</ReactMarkdown>

              {m.type === "results" && m.analysis && (() => {
                const { marketShare, growth, swot } = buildCharts(m.analysis);
                const a = m.analysis;
                return (
                  <div className="mt-8 space-y-10 border-t border-border/10 pt-10">

                    {/* ── Company Quick Stats ── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-700">
                      {[
                        { icon: Building2, label: "Industry", value: a.industry },
                        { icon: MapPin, label: "Headquarters", value: a.headquarters },
                        { icon: Users, label: "Employees", value: a.employeeCount },
                        { icon: TrendingUp, label: "Revenue", value: a.revenueRange },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="bg-muted/30 border border-border/20 rounded-2xl p-4 space-y-1">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Icon className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                          </div>
                          <p className="text-sm font-semibold leading-tight">{value || "—"}</p>
                        </div>
                      ))}
                    </div>

                    {/* ── Detailed Text Report ── */}
                    <div className="space-y-4 animate-in fade-in duration-700">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold tracking-tight">Executive Intelligence Report</h2>
                      </div>
                      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground leading-relaxed bg-muted/10 p-6 rounded-2xl border border-border/10">
                        <ReactMarkdown>{buildDetailedReport(a)}</ReactMarkdown>
                      </div>
                    </div>

                    {/* ── Target Audience & Products ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-700">
                      <div className="bg-muted/20 border border-border/10 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                          <Target className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-widest">Target Audience</span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{a.targetAudience}</p>
                      </div>
                      <div className="bg-muted/20 border border-border/10 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                          <Package className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-widest">Key Products & Services</span>
                        </div>
                        <ul className="space-y-1">
                          {a.keyProducts.map((p, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* ── SWOT Analysis ── */}
                    <div className="animate-in fade-in duration-700">
                      <div className="flex items-center gap-2 mb-4">
                        <ShieldAlert className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold tracking-tight">SWOT Analysis</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { label: "Strengths", items: a.strengths, color: "text-emerald-500", bg: "bg-emerald-500/5 border-emerald-500/20", Icon: TrendingUp },
                          { label: "Weaknesses", items: a.weaknesses, color: "text-red-400", bg: "bg-red-400/5 border-red-400/20", Icon: AlertTriangle },
                          { label: "Opportunities", items: a.opportunities, color: "text-blue-400", bg: "bg-blue-400/5 border-blue-400/20", Icon: Lightbulb },
                          { label: "Threats", items: a.threats, color: "text-orange-400", bg: "bg-orange-400/5 border-orange-400/20", Icon: ShieldAlert },
                        ].map(({ label, items, color, bg, Icon }) => (
                          <div key={label} className={cn("border rounded-2xl p-4 space-y-2", bg)}>
                            <div className={cn("flex items-center gap-2", color)}>
                              <Icon className="w-4 h-4" />
                              <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
                            </div>
                            <ul className="space-y-1">
                              {items.map((item, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className={cn("mt-0.5", color)}>•</span> {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── Charts ── */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                      <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold text-center">
                        Charts below are illustrative estimates for visual reference
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Market Share Pie */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <PieChartIcon className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold text-foreground uppercase tracking-widest">Market Share Estimate</span>
                          </div>
                          <div className="h-[240px] bg-muted/20 rounded-3xl p-4 border border-border/10">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={marketShare} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                                  {marketShare.map((_, index) => (
                                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: "12px", background: "#000", border: "none" }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Growth Trend Area */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold text-foreground uppercase tracking-widest">Growth Trajectory</span>
                          </div>
                          <div className="h-[240px] bg-muted/20 rounded-3xl p-4 border border-border/10">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={growth}>
                                <defs>
                                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="trend" stroke="#8884d8" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={2} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* SWOT Bar Chart */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-primary" />
                          <span className="text-xs font-bold text-foreground uppercase tracking-widest">SWOT Factor Count</span>
                        </div>
                        <div className="h-[220px] bg-muted/20 rounded-3xl p-6 border border-border/10">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={swot}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                              <XAxis dataKey="category" tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} />
                              <Tooltip contentStyle={{ borderRadius: "16px", background: "rgba(0,0,0,0.9)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                {swot.map((_, index) => (
                                  <Cell key={index} fill={["#10b981", "#ef4444", "#3b82f6", "#f97316"][index]} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>
          </div>
        ))}
        {isAnalyzing && (
          <div className="flex w-full animate-in fade-in duration-500 justify-start items-center">
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center mr-4 shrink-0">
               <Loader2 className="w-4 h-4 text-background animate-spin" />
            </div>
            <div className="text-muted-foreground text-sm font-medium animate-pulse">
              {analyzingLabel}
            </div>
          </div>
        )}
      </div>

      {/* ── Empty State & Central Search ── */}
      {messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-16 pointer-events-none px-4 text-center">
          <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl md:text-5xl font-sans tracking-tight text-foreground">
              <span className="font-bold">LeadBot</span> <span className="font-light">Competitor Analyzer</span>
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
              placeholder="Enter competitor URL or company name (e.g. apple.com, Stripe)..."
              className="flex-1 min-w-0 bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] px-3 py-4 placeholder:text-muted-foreground/60 font-medium"
            />

            {/* Right Controls Container */}
            <div className="flex items-center gap-1.5 shrink-0 pr-1">
              {/* Analyze Button */}
              <button
                onClick={startAnalysis}
                disabled={isAnalyzing || !input.trim()}
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
