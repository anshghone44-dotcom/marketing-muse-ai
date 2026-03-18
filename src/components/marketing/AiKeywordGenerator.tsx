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
          `best ${topic.toLowerCase()} for ${audience.toLowerCase()}`,
          `${topic.toLowerCase()} pricing and plans`,
          `buy ${topic.toLowerCase()} online`,
          `${companyData?.name?.toLowerCase() || "brand"} reviews`,
          `professional ${industry.toLowerCase()} solutions`,
          `top-rated ${topic.toLowerCase()} services`,
          `affordable ${topic.toLowerCase()} for ${audience.toLowerCase()}`,
          `get ${topic.toLowerCase()} consultation`,
          `custom ${industry.toLowerCase()} strategy`,
          `${topic.toLowerCase()} free trial`,
        ],
        catchy: [
          `#1 ${industry.toLowerCase()} hack for ${audience.toLowerCase()}`,
          `why ${audience.toLowerCase()} are switching to ${companyData?.name || "us"}`,
          `stop wasting time on ${industry.toLowerCase()}`,
          `the future of ${topic.toLowerCase()}`,
          `${companyData?.name || "LeadBot"}: the only ${topic.toLowerCase()} you need`,
          `viral ${industry.toLowerCase()} strategies ${new Date().getFullYear()}`,
          `transform your ${industry.toLowerCase()} today`,
          `unleash the power of ${topic.toLowerCase()}`,
          `the secret to ${audience.toLowerCase()} success`,
          `marketing ${topic.toLowerCase()} like a pro`,
        ],
        awareness: [
          `what is ${industry.toLowerCase()} automation`,
          `${companyData?.name || "Official"} site`,
          `${industry.toLowerCase()} best practices ${new Date().getFullYear()}`,
          `how ${companyData?.name || "we are"} changing ${industry.toLowerCase()}`,
          `${audience.toLowerCase()} guide to ${topic.toLowerCase()}`,
          `professional ${industry.toLowerCase()} insights`,
          `the evolution of ${topic.toLowerCase()}`,
          `understanding ${industry.toLowerCase()} for ${audience.toLowerCase()}`,
          `${industry.toLowerCase()} masterclass`,
          `innovative ${topic.toLowerCase()} trends`,
        ],
        "long-tail": [
          `how to optimize ${topic.toLowerCase()} for ${audience.toLowerCase()}`,
          `step by step guide to ${industry.toLowerCase()} success`,
          `why ${audience.toLowerCase()} need ${topic.toLowerCase()} in ${new Date().getFullYear()}`,
          `comparing different ${industry.toLowerCase()} strategies for small business`,
          `best way to implement ${topic.toLowerCase()} without a large budget`,
          `common mistakes ${audience.toLowerCase()} make in ${industry.toLowerCase()}`,
        ],
        trending: [
          `AI-powered ${topic.toLowerCase()} in ${new Date().getFullYear()}`,
          `the shift towards ${industry.toLowerCase()} sustainability`,
          `remote ${audience.toLowerCase()} and ${topic.toLowerCase()}`,
          `blockchain in ${industry.toLowerCase()}: what you need to know`,
          `metaverse ${topic.toLowerCase()} strategies`,
        ],
        comparison: [
          `${companyData?.name || "Brand"} vs ${industry.toLowerCase()} alternatives`,
          `top 10 ${topic.toLowerCase()} tools for ${audience.toLowerCase()}`,
          `is ${topic.toLowerCase()} better than legacy systems?`,
          `${topic.toLowerCase()} vs ${industry.toLowerCase()} manual work`,
          `choosing the right ${topic.toLowerCase()} for your ${industry.toLowerCase()} business`,
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
