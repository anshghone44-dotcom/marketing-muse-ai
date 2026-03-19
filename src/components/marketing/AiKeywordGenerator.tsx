import { useState, useRef, ChangeEvent } from "react";
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
  SendHorizontal
} from "lucide-react";
import { toast } from "sonner";
import type { CompanyData } from "./CompanyForm";
import CompanyForm from "./CompanyForm";

export const KEYWORD_FACTORS = [
  { id: "lead", label: "Lead-Generating", description: "High-intent keywords for conversions", icon: Target },
  { id: "catchy", label: "Catchy & Viral", description: "Social-friendly and attention-grabbing", icon: Zap },
  { id: "awareness", label: "Brand Awareness", description: "Establish authority and reach", icon: Search },
  { id: "long-tail", label: "Long-Tail Queries", description: "Specific, multi-word search queries", icon: BarChart },
  { id: "trending", label: "Market Trending", description: "Current market trends and hot topics", icon: TrendingUp },
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

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

export default function AiKeywordGenerator({ companyData, onCompanySubmit }: Props) {
  const [formData, setFormData] = useState({
    topic: "",
    selectedFactors: ["lead", "awareness"] as string[],
  });
  
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [generatedKeywords, setGeneratedKeywords] = useState<GeneratedKeywordGroup[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null);

  const processFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles).map(f => ({
      id: Math.random().toString(36).substring(7),
      name: f.name,
      size: f.size,
      type: f.type,
      url: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined
    }));
    
    if (files.length + fileArray.length > 5) {
      toast.error("Maximum 5 files allowed per context upload.");
      return;
    }
    
    setFiles(prev => [...prev, ...fileArray]);
    toast.success(`${fileArray.length} file(s) attached for context.`);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateKeywords();
    }
  };

  const generateKeywords = () => {
    if (!formData.topic && !companyData && files.length === 0) {
      toast.error("Please provide a topic, upload context files, or fill company details.");
      return;
    }

    if (formData.selectedFactors.length === 0) {
      toast.error("Please select at least one strategy vector.");
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const topic = formData.topic || companyData?.product || "Business Solution";
      const audience = companyData?.audience || "Target Audience";
      const industry = companyData?.industry || "Industry";
      
      const fileContext = files.length > 0 ? " (Enhanced via uploaded context)" : "";

      const mockKeywords: Record<string, string[]> = {
        lead: [
          `best ${topic.toLowerCase()} software for ${audience.toLowerCase()}${files.length > 0 ? ' analysis' : ''}`,
          `top rated ${industry.toLowerCase()} agencies ${new Date().getFullYear()}`,
          `${topic.toLowerCase()} pricing calculator`,
          `hire a ${topic.toLowerCase()} expert near me`,
          `${companyData?.name?.toLowerCase() || "brand"} vs competitors reviews`,
          `enterprise ${topic.toLowerCase()} solutions`,
          `affordable ${topic.toLowerCase()} packages for small business`,
          `schedule ${industry.toLowerCase()} consultation`,
          `custom ${topic.toLowerCase()} strategy development`,
          `request quote for ${topic.toLowerCase()} services`,
        ],
        catchy: [
          `the #1 ${industry.toLowerCase()} growth hack for ${new Date().getFullYear()}`,
          `why top ${audience.toLowerCase()} are switching to ${companyData?.name || "our solution"}`,
          `stop losing money on outdated ${industry.toLowerCase()}`,
          `10 secrets the ${industry.toLowerCase()} experts won't tell you`,
          `${companyData?.name || "LeadBot"}: the ultimate ${topic.toLowerCase()} toolkit${fileContext}`,
          `viral ${topic.toLowerCase()} case studies that convert`,
          `transform your ${industry.toLowerCase()} approach in 7 days`,
          `unleashing the hidden ROI of ${topic.toLowerCase()}`,
          `the ${topic.toLowerCase()} revolution for ${audience.toLowerCase()}`,
          `how to dominate ${industry.toLowerCase()} with AI`,
        ],
        awareness: [
          `what is the future of ${industry.toLowerCase()}`,
          `comprehensive guide to ${topic.toLowerCase()}`,
          `${industry.toLowerCase()} best practices and standards`,
          `understanding the role of ${topic.toLowerCase()} in modern business`,
          `expert insights on ${industry.toLowerCase()} trends${fileContext}`,
          `common challenges with ${topic.toLowerCase()} and how to fix them`,
          `the evolution of ${industry.toLowerCase()} technology`,
          `step by step introduction to ${topic.toLowerCase()}`,
          `${companyData?.name || "Brand"} official blog on ${industry.toLowerCase()}`,
          `webinars and courses on ${topic.toLowerCase()}`,
        ],
        "long-tail": [
          `how to optimize ${topic.toLowerCase()} workflow for enterprise teams`,
          `step by step tutorial for implementing ${industry.toLowerCase()} solutions`,
          `differences between B2B and B2C ${topic.toLowerCase()} strategies${fileContext}`,
          `what is the average ROI of investing in ${topic.toLowerCase()}`,
          `case studies demonstrating ${companyData?.name || "brand"} success in ${industry.toLowerCase()}`,
          `common pitfalls ${audience.toLowerCase()} make when starting with ${topic.toLowerCase()}`,
          `how much does it cost to outsource ${industry.toLowerCase()}`,
        ],
        trending: [
          `AI impact on ${topic.toLowerCase()} in ${new Date().getFullYear()}`,
          `machine learning applications in ${industry.toLowerCase()}`,
          `ethical considerations for ${topic.toLowerCase()} automation`,
          `data privacy compliance in modern ${industry.toLowerCase()}`,
          `remote-first approaches to ${topic.toLowerCase()} management${fileContext}`,
        ],
      };

      const results = formData.selectedFactors.map(factorId => ({
        factor: KEYWORD_FACTORS.find(f => f.id === factorId)?.label || factorId,
        keywords: mockKeywords[factorId] || mockKeywords["lead"],
      }));

      setGeneratedKeywords(results);
      setIsGenerating(false);
      toast.success("Professional keywords generated successfully!");
    }, 2000);
  };

  const handleFactorToggle = (factorId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedFactors: prev.selectedFactors.includes(factorId)
        ? prev.selectedFactors.filter((id) => id !== factorId)
        : [...prev.selectedFactors, factorId],
    }));
  };

  const copyToClipboard = (keywords: string[], factor: string) => {
    navigator.clipboard.writeText(keywords.join("\\n"));
    setCopiedGroup(factor);
    toast.success(`${factor} keywords copied to clipboard!`);
    setTimeout(() => setCopiedGroup(null), 2000);
  };

  if (!companyData) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
          <p className="text-muted-foreground">To use the AI Keyword Generator, please provide your company details below.</p>
        </div>
        <CompanyForm onSubmit={onCompanySubmit} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-7xl mx-auto">
      {/* LEFT COLUMN: Input & Configuration */}
      <div className="md:col-span-5 space-y-6 flex flex-col h-full min-h-[500px]">
        {/* Strategy Configuration */}
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Keyword Generation Chatbot
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Configure your strategy and prompt the AI Chatbot to generate target keywords.
            </p>
          </div>

          {/* Keyword Strategy Factors */}
          <div className="space-y-3 pt-4">
            <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Strategy Vectors</label>
            <div className="grid grid-cols-1 gap-2">
              {KEYWORD_FACTORS.map((factor) => {
                const Icon = factor.icon;
                const isSelected = formData.selectedFactors.includes(factor.id);
                return (
                  <div
                    key={factor.id}
                    onClick={() => handleFactorToggle(factor.id)}
                    className={\`cursor-pointer p-3 rounded-lg border flex items-center justify-between transition-all duration-200 \${
                      isSelected
                        ? "bg-primary/5 border-primary/40 shadow-sm"
                        : "bg-background/40 border-border/40 hover:border-border/80 hover:bg-muted/30"
                    }\`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={\`\${isSelected ? 'text-primary' : 'text-muted-foreground'}\`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-foreground/90">{factor.label}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Unified Chatbot Input Container */}
        <div className="relative mt-8 bg-card border border-border/60 rounded-2xl shadow-xl shadow-primary/5 overflow-hidden transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
          {/* Uploaded Files Chips inside Chat Input */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 pb-0">
              {files.map(file => (
                <div key={file.id} className="flex items-center gap-1.5 bg-muted/50 border border-border/40 rounded-full px-3 py-1 text-[11px] font-medium animate-in fade-in slide-in-from-bottom-2">
                  {file.type.startsWith('image/') ? <ImageIcon className="w-3.5 h-3.5 text-blue-500" /> : <FileIcon className="w-3.5 h-3.5 text-orange-500" />}
                  <span className="max-w-[100px] truncate">{file.name}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                    className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Textarea
            placeholder="Message AI Keyword Generator... (e.g. Find keywords for a SaaS project management tool)"
            value={formData.topic}
            onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))}
            onKeyDown={handleKeyDown}
            className="min-h-[100px] max-h-[250px] border-0 focus-visible:ring-0 bg-transparent resize-none p-4 pb-14 text-sm"
          />
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInput} 
            multiple 
            className="hidden" 
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-background/50 rounded-full backdrop-blur">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group flex items-center justify-center border border-transparent hover:border-border"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="absolute bottom-3 right-3">
            <Button
              onClick={generateKeywords}
              disabled={isGenerating || formData.selectedFactors.length === 0}
              size="icon"
              className={\`h-10 w-10 rounded-full transition-all duration-300 \${
                formData.topic.trim().length > 0 || files.length > 0
                  ? "bg-primary text-primary-foreground shadow-lg hover:shadow-primary/25 hover:scale-105"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              }\`}
            >
              {isGenerating ? (
                <Search className="w-4 h-4 animate-spin" />
              ) : (
                <SendHorizontal className="w-4 h-4 ml-0.5" />
              )}
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-center text-muted-foreground/60 mt-3 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3" /> AI Keywords can make mistakes. Review generated strategies carefully.
        </p>
      </div>

      {/* RIGHT COLUMN: Results Display */}
      <div className="md:col-span-7 space-y-6">
        {generatedKeywords.length > 0 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Keyword Strategies
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {generatedKeywords.map((group, groupIdx) => (
                <Card key={group.factor} className="overflow-hidden border border-border/40 bg-card/60 backdrop-blur-md shadow-lg" style={{ animationDelay: \`\${groupIdx * 100}ms\` }}>
                  <div className="px-5 py-3 border-b border-border/30 flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Target className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-bold text-primary tracking-wide text-sm">
                        {group.factor.toUpperCase()}
                      </h4>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-2 text-xs bg-background/50 hover:bg-background border-border/50"
                      onClick={() => copyToClipboard(group.keywords, group.factor)}
                    >
                      {copiedGroup === group.factor ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copiedGroup === group.factor ? "Copied" : "Copy Cluster"}
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-muted/10">
                    <div className="flex flex-wrap gap-2">
                      {group.keywords.map((kw, i) => (
                        <div 
                          key={i} 
                          className="px-3 py-1.5 rounded-md bg-background border border-border/40 text-[13px] font-medium text-foreground/90 hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-text select-text flex items-center gap-2 group/kw"
                        >
                          <span className="text-primary/40 font-mono text-[10px] select-none group-hover/kw:text-primary/70">{i + 1}</span>
                          {kw}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border/40 rounded-2xl bg-muted/10 bg-[radial-gradient(circle_at_center,theme(colors.primary.DEFAULT/0.05)_0%,transparent_100%)]">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shadow-2xl backdrop-blur-3xl transform rotate-3 animate-pulse">
                <Search className="w-10 h-10 text-primary/60" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-background rounded-full flex items-center justify-center shadow-lg transform -rotate-12">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-foreground">Awaiting Your Prompt</h3>
            <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed">
              Use the chatbot interface on the left to write a prompt, attach relevant competitor files, and select vectors to generate hyper-targeted keyword datasets.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
