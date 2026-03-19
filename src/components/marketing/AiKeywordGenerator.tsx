import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import type { CompanyData } from "./CompanyForm";
import CompanyForm from "./CompanyForm";

export const KEYWORD_FACTORS = [
  { id: "lead", label: "Lead-Generating", description: "High-intent keywords for conversions" },
  { id: "catchy", label: "Catchy", description: "Social-friendly and attention-grabbing" },
  { id: "awareness", label: "Brand Awareness", description: "Establish authority and reach" },
  { id: "long-tail", label: "Long-Tail", description: "Specific, multi-word search queries" },
  { id: "trending", label: "Trending", description: "Current market trends and hot topics" },
  { id: "comparison", label: "Comparison", description: "Keywords for users comparing solutions" },
];

interface GeneratedKeywordGroup {
  factor: string;
  keywords: string[];
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

export default function AiKeywordGenerator({ companyData, onCompanySubmit }: Props) {
  const [formData, setFormData] = useState({
    topic: "",
    selectedFactors: ["lead", "catchy", "awareness"] as string[],
  });
  const [generatedKeywords, setGeneratedKeywords] = useState<GeneratedKeywordGroup[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null);

  const generateKeywords = () => {
    if (!formData.topic && !companyData) {
      toast.error("Please provide a topic or company details");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const topic = formData.topic || companyData?.product || "Business Solution";
      const audience = companyData?.audience || "Target Audience";
      const industry = companyData?.industry || "Industry";

      const mockKeywords: Record<string, string[]> = {
        lead: [
          `best ${topic.toLowerCase()} software for ${audience.toLowerCase()}`,
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
          `${companyData?.name || "LeadBot"}: the ultimate ${topic.toLowerCase()} toolkit`,
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
          `expert insights on ${industry.toLowerCase()} trends`,
          `common challenges with ${topic.toLowerCase()} and how to fix them`,
          `the evolution of ${industry.toLowerCase()} technology`,
          `step by step introduction to ${topic.toLowerCase()}`,
          `${companyData?.name || "Brand"} official blog on ${industry.toLowerCase()}`,
          `webinars and courses on ${topic.toLowerCase()}`,
        ],
        "long-tail": [
          `how to optimize ${topic.toLowerCase()} workflow for enterprise teams`,
          `step by step tutorial for implementing ${industry.toLowerCase()} solutions`,
          `differences between B2B and B2C ${topic.toLowerCase()} strategies`,
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
          `remote-first approaches to ${topic.toLowerCase()} management`,
        ],
        comparison: [
          `${companyData?.name || "Brand"} vs industry standard ${topic.toLowerCase()}`,
          `top 5 alternatives to legacy ${industry.toLowerCase()} platforms`,
          `is upgrading to ${topic.toLowerCase()} worth the cost?`,
          `${companyData?.name || "Brand"} pricing vs competitors ${new Date().getFullYear()}`,
          `choosing the right ${topic.toLowerCase()} vendor for ${audience.toLowerCase()}`,
        ],
      };

      const results = formData.selectedFactors.map(factorId => ({
        factor: KEYWORD_FACTORS.find(f => f.id === factorId)?.label || factorId,
        keywords: mockKeywords[factorId] || [],
      }));

      setGeneratedKeywords(results);
      setIsGenerating(false);
      toast.success("Keywords generated successfully!");
    }, 1500);
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
    navigator.clipboard.writeText(keywords.join("\n"));
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
    <div className="space-y-8">
      {/* Form Section */}
      <Card className="p-6 border border-border/50 bg-card/50 backdrop-blur">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-foreground">AI Keyword Generator</h2>
            <p className="text-sm text-muted-foreground">
              Generate high-quality keywords based on your brand goals and target audience.
            </p>
          </div>

          {/* Topic Override */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Specific Topic or Service (Optional)</label>
            <Input
              placeholder={`e.g., "${companyData.product}" or a specific campaign topic`}
              value={formData.topic}
              onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))}
              className="bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Factor Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Keyword Strategy Factors</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {KEYWORD_FACTORS.map((factor) => (
                <div
                  key={factor.id}
                  onClick={() => handleFactorToggle(factor.id)}
                  className={`cursor-pointer p-3 rounded-xl border transition-all duration-200 ${
                    formData.selectedFactors.includes(factor.id)
                      ? "bg-primary/10 border-primary/50 shadow-sm"
                      : "bg-background/50 border-border/50 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{factor.label}</span>
                    {formData.selectedFactors.includes(factor.id) && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {factor.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateKeywords}
            disabled={isGenerating || formData.selectedFactors.length === 0}
            size="lg"
            className="w-full gap-2 font-semibold h-12 shadow-lg hover:shadow-primary/20"
          >
            <Sparkles className="w-5 h-5" />
            {isGenerating ? "Analyzing & Generating..." : "Generate Research-Driven Keywords"}
          </Button>
        </div>
      </Card>

      {/* Generated Keywords Section */}
      {generatedKeywords.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Targeted Keyword Strategies
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedKeywords.map((group) => (
              <Card key={group.factor} className="overflow-hidden border border-border/40 bg-card/30 backdrop-blur-md hover:bg-card/40 transition-colors">
                <div className="p-4 border-b border-border/30 flex items-center justify-between bg-primary/5">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    {group.factor}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-xs"
                    onClick={() => copyToClipboard(group.keywords, group.factor)}
                  >
                    {copiedGroup === group.factor ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copiedGroup === group.factor ? "Copied" : "Copy List"}
                  </Button>
                </div>
                <div className="p-4 bg-muted/20">
                  <ul className="grid grid-cols-1 gap-2">
                    {group.keywords.map((kw, i) => (
                      <li key={i} className="group/item flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground/50 font-mono w-4">
                          {(i + 1).toString().padStart(2, '0')}
                        </span>
                        <div className="flex-1 px-3 py-1.5 rounded-lg bg-background/40 border border-border/20 text-sm group-hover/item:border-primary/30 group-hover/item:bg-background/60 transition-all cursor-default">
                          {kw}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {generatedKeywords.length === 0 && !isGenerating && (
        <Card className="p-16 text-center border border-dashed border-border/50 bg-card/20 rounded-3xl">
          <div className="max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary/60" />
            </div>
            <h3 className="text-xl font-bold">Launch Keyword Research</h3>
            <p className="text-muted-foreground mb-8">
              Select your priority factors above to generate a high-quality keyword strategy tailored for <span className="text-foreground font-semibold">{companyData?.name}</span>.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
