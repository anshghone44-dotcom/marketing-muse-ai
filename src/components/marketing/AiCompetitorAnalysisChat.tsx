import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  AreaChart,
  Area,
  Legend,
} from "recharts";
import {
  ArrowRight,
  Plus,
  Loader2,
  BarChart3,
  PieChart as PieChartIcon,
  FileText,
  Link,
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

export default function AiCompetitorAnalysisChat({ companyData, onCompanySubmit }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingLabel, setAnalyzingLabel] = useState("Analyzing…");
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  type SourceType = "files" | "competitor";
  const [selectedSource, setSelectedSource] = useState<SourceType | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAnalyzing]);

  const startAnalysis = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsAnalyzing(true);
    setAnalyzingLabel(`Researching ${trimmed}…`);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const analysis = await analyzeCompetitor(trimmed);

      const detailedReport = buildDetailedReport(analysis);

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
      setInput("");
      setSelectedSource(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`File "${file.name}" uploaded. For best results, type the company name directly.`);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-6xl mx-auto relative bg-transparent overflow-hidden">
      {/* Empty State */}
      {messages.length === 0 && !isAnalyzing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-24 pointer-events-none px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-foreground mb-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            LeadBot <span className="font-light text-muted-foreground/60">Competitor Analyzer</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed opacity-80 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            In-depth competitor intelligence, positioning opportunities, and differentiation playbooks.
          </p>
        </div>
      )}

      {/* Chat Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 scroll-smooth"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex w-full animate-in fade-in slide-in-from-bottom-8 duration-700",
              m.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn("max-w-[90%] space-y-4", m.role === "user" ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "p-6 md:p-8 rounded-3xl text-base leading-relaxed overflow-hidden shadow-sm",
                  m.role === "user"
                    ? "bg-muted/50 text-foreground border border-border/40"
                    : "bg-card/40 backdrop-blur-xl border border-border/10 text-foreground"
                )}
              >
                <div className="prose prose-base dark:prose-invert font-medium">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>

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
                        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
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
          </div>
        ))}

        {isAnalyzing && (
          <div className="flex items-center gap-4 p-6 bg-muted/20 rounded-3xl max-w-fit animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-semibold tracking-tight">{analyzingLabel}</span>
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
              <DropdownMenuItem onClick={() => setSelectedSource("competitor")} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted">
                <Link className="w-4 h-4 text-orange-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Competitor Analysis</span>
                  <span className="text-[10px] text-muted-foreground">URL or Company Name</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => { setSelectedSource("files"); fileInputRef.current?.click(); }}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Upload File</span>
                  <span className="text-[10px] text-muted-foreground">PDF or DOC Files</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx" />

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), startAnalysis(input))}
            placeholder={
              selectedSource === "competitor"
                ? "Enter competitor URL or company name (e.g. apple.com, Zomato)..."
                : "Enter a company name or URL to analyze (e.g. tesla.com, OpenAI)..."
            }
            className="w-full min-h-[64px] bg-muted/40 border-border/40 rounded-[2rem] pl-16 pr-44 py-5 resize-none focus:border-primary/40 shadow-sm transition-shadow hover:shadow-md"
          />

          <div className="absolute right-3 flex items-center gap-2">
            <Button
              onClick={() => startAnalysis(input)}
              disabled={isAnalyzing || !input.trim()}
              className="h-11 px-6 rounded-full font-bold bg-foreground text-background hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Analyze <ArrowRight className="w-3.5 h-3.5 ml-1" /></>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
