import { useState } from "react";
import TopNavigation, { type TaskId } from "@/components/marketing/TopNavigation";
import CompanyForm, { type CompanyData } from "@/components/marketing/CompanyForm";
import ResultsCanvas from "@/components/marketing/ResultsCanvas";
import AiAdGeneratorChat from "@/components/marketing/AiAdGeneratorChat";
import AiKeywordGenerator from "@/components/marketing/AiKeywordGenerator";
import AiContentGeneratorChat from "@/components/marketing/AiContentGeneratorChat";
import AiViralGeneratorChat from "@/components/marketing/AiViralGeneratorChat";
import AiCompetitorAnalysisChat from "@/components/marketing/AiCompetitorAnalysisChat";
import { toast } from "sonner";
import {
  generateProfessionalAdCopies,
  hasLovableGatewayConfig,
} from "@/lib/lovable-gateway";

function generateMockContent(task: TaskId, data: CompanyData): string[] {
  const { name, product, audience, industry, goal, tone, platforms, competitors } = data;

  const mockByTask: Record<TaskId, string[]> = {
    ads: [
      `### Concept 1: Performance-Led Positioning\n\n**Strategic Angle:** Position ${name} as the professional-grade answer for ${audience.toLowerCase()} who need dependable ${goal.toLowerCase()} outcomes in ${industry}.\n\n**Primary Headline:** ${name} Helps ${audience} Turn ${product} Into Measurable Growth\n\n**Supporting Headline:** Built for teams that need stronger performance, clearer positioning, and faster decision-making.\n\n**Body Copy:** ${name} delivers a more professional approach to ${product}, helping ${audience.toLowerCase()} move from inconsistent execution to reliable business results. Designed for modern ${industry.toLowerCase()} demands, it brings together clarity, speed, and strategic value so teams can focus on outcomes instead of operational friction.\n\n**CTA:** Book a Demo`,
    ],
    keywords: [
      `### Keyword Strategy Summary\n\n**Objective:** Position ${name} as the market-leading ${industry} solution for ${audience} with high-intent, conversion-driven search traffic.\n\n**Recommended Focus:**\n- Core intent: ${goal.toLowerCase()} and efficiency in ${product.toLowerCase()}.\n- Brand anchors: ${name}, ${product}, ${industry}.\n- Content themes: implementation guides, use cases, ROI comparisons, trust signals.\n\n### Priority Keyword Cluster\n- ${name.toLowerCase()} ${product.toLowerCase()} for ${audience.toLowerCase()}\n- ${industry.toLowerCase()} ${product.toLowerCase()} ROI\n- ${product.toLowerCase()} best practices for ${audience.toLowerCase()}\n- ${name.toLowerCase()} vs ${competitors || "competitors"}`
    ],
    content: [
      `### Blog Article Ideas\n1. **"The Ultimate Guide to ${product} for ${audience}"** - Comprehensive how-to that establishes ${name} as a thought leader.\n2. **"${industry} Trends in ${new Date().getFullYear()}: What You Need to Know"** - Timely content for organic traffic.`
    ],
    social: platforms.map(
      (p) =>
        `### ${p} Strategy\n\n**Content Pillars:**\n- Educational (40%): Tips about ${product} and ${industry}\n- Behind-the-scenes (25%): Team culture, product development\n- Social proof (20%): Customer stories and testimonials\n- Promotional (15%): Offers, launches, and CTAs`
    ),
    viral: [
      `### Campaign: "The ${name} Challenge"\n\nInvite ${audience.toLowerCase()} to share their biggest ${industry.toLowerCase()} pain point. ${name} will solve the top-voted problem live on social media.`
    ],
    competitor: [
      `### Competitive Landscape\n\n**Key Competitors:** ${competitors || "Market leaders in " + industry}\n\n**Their Strengths:**\n- Established brand recognition\n- Larger marketing budgets`
    ],
    engagement: [
      `### Attract Users\n\n1. **Free ${industry} Resource:** Create a downloadable guide that solves a key pain point for ${audience.toLowerCase()}\n2. **Interactive Quiz:** "What type of ${product.toLowerCase()} user are you?"`
    ],
  };

  return mockByTask[task];
}

export default function Index() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [activeTask, setActiveTask] = useState<TaskId | null>(null);
  const [generatedContent, setGeneratedContent] = useState<Record<string, string[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCompanySubmit = (data: CompanyData) => {
    setCompanyData(data);
    setGeneratedContent({});
    toast.success(`Profile saved for ${data.name}`, {
      description: "Select a task from the sidebar to generate content.",
    });
  };

  const handleGenerate = async (task: TaskId) => {
    if (!companyData) return;
    setIsGenerating(true);

    try {
      const content =
        task === "ads"
          ? await generateProfessionalAdCopies(companyData)
          : generateMockContent(task, companyData);

      setGeneratedContent((prev) => ({ ...prev, [task]: content }));
      toast.success("Content generated!", {
        description:
          task === "ads" && hasLovableGatewayConfig()
            ? "Professional ad copy was generated through the Lovable API gateway."
            : "Review and copy what you need.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred while generating content.";

      if (task === "ads") {
        const fallbackContent = generateMockContent(task, companyData);
        setGeneratedContent((prev) => ({ ...prev, [task]: fallbackContent }));
        toast.error("Lovable gateway unavailable", {
          description: `${message} Showing polished local backup copy so you can keep working.`,
        });
      } else {
        toast.error("Generation failed", { description: message });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = (task: TaskId, _index: number) => {
    handleGenerate(task);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <TopNavigation
        activeTask={activeTask}
        onTaskChange={setActiveTask}
        hasCompanyData={!!companyData}
      />

      <main className="container mx-auto px-6 py-12 relative z-10">
        {!activeTask || (activeTask === "social" && !companyData) ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16 animate-in fade-in slide-in-from-top-12 duration-1000">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent px-4">
                Welcome to LeadBot
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed opacity-80">
                Generate tailored marketing content for your business with AI-powered insights and creative strategies.
              </p>
            </div>
            <CompanyForm onSubmit={handleCompanySubmit} />
          </div>
        ) : activeTask === "ads" ? (
          <AiAdGeneratorChat 
            companyData={companyData} 
            onCompanySubmit={handleCompanySubmit} 
          />
        ) : activeTask === "keywords" ? (
          <AiKeywordGenerator
            companyData={companyData}
            onCompanySubmit={handleCompanySubmit}
          />
        ) : activeTask === "content" ? (
          <AiContentGeneratorChat
            companyData={companyData}
            onCompanySubmit={handleCompanySubmit}
          />
        ) : activeTask === "viral" ? (
          <AiViralGeneratorChat
            companyData={companyData}
            onCompanySubmit={handleCompanySubmit}
          />
        ) : activeTask === "competitor" ? (
          <AiCompetitorAnalysisChat
            companyData={companyData}
            onCompanySubmit={handleCompanySubmit}
          />
        ) : (
          <ResultsCanvas
            activeTask={activeTask}
            companyData={companyData}
            generatedContent={generatedContent}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            onRegenerate={handleRegenerate}
          />
        )}
      </main>
    </div>
  );
}
