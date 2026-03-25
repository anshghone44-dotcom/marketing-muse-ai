import { useState } from "react";
import TopNavigation, { type TaskId } from "@/components/marketing/TopNavigation";
import CompanyForm, { type CompanyData } from "@/components/marketing/CompanyForm";
import ResultsCanvas from "@/components/marketing/ResultsCanvas";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import {
  generateProfessionalAdCopies,
  hasLovableGatewayConfig,
} from "@/lib/lovable-gateway";

function generateMockContent(task: TaskId, data: CompanyData): string[] {
  const { name, product, audience, industry, goal, tone, platforms, competitors } = data;

  const mockByTask: Record<TaskId, string[]> = {
    ads: [
      `### Concept 1: Performance-Led Positioning

**Strategic Angle:** Position ${name} as the professional-grade answer for ${audience.toLowerCase()} who need dependable ${goal.toLowerCase()} outcomes in ${industry}.

**Primary Headline:** ${name} Helps ${audience} Turn ${product} Into Measurable Growth

**Supporting Headline:** Built for teams that need stronger performance, clearer positioning, and faster decision-making.

**Body Copy:** ${name} delivers a more professional approach to ${product}, helping ${audience.toLowerCase()} move from inconsistent execution to reliable business results. Designed for modern ${industry.toLowerCase()} demands, it brings together clarity, speed, and strategic value so teams can focus on outcomes instead of operational friction.

**CTA:** Book a Demo

**Value Proposition:** Professional execution, stronger differentiation, and practical ROI.

**Differentiation From Competitors:** Unlike generic alternatives, ${name} presents a sharper value story, clearer relevance for ${audience.toLowerCase()}, and a more credible path to ${goal.toLowerCase()}.

**Platform Adaptation Notes:** Lead with a bold outcome statement on LinkedIn, a concise performance hook on Instagram, and a proof-driven variation for YouTube or retargeting placements.`,
      `### Concept 2: Trust and Credibility

**Strategic Angle:** Use credibility-led messaging to reassure buyers that ${name} is the serious choice in a crowded ${industry.toLowerCase()} market.

**Primary Headline:** Choose ${name} When the Standard for ${product} Needs to Be Higher

**Supporting Headline:** A more professional solution for brands that want confidence, consistency, and results.

**Body Copy:** In a category filled with broad promises, ${name} offers a more disciplined and business-focused approach to ${product}. Tailored for ${audience.toLowerCase()}, it helps organizations improve execution, strengthen brand perception, and achieve ${goal.toLowerCase()} with greater confidence. The message is simple: when quality matters, the right platform matters too.

**CTA:** See How It Works

**Value Proposition:** Premium positioning with practical business value.

**Differentiation From Competitors:** While competitors compete on noise, ${name} competes on clarity, trust, and a more professional customer promise.

**Platform Adaptation Notes:** Use a polished testimonial or proof point on Facebook and LinkedIn, with shorter authority-driven copy for Instagram ads and story placements.`,
      `### Concept 3: Problem-Solution Conversion Copy

**Strategic Angle:** Speak directly to the inefficiencies and missed opportunities ${audience.toLowerCase()} face without a strong ${product} solution.

**Primary Headline:** Stop Letting Outdated ${industry} Approaches Hold Back Growth

**Supporting Headline:** ${name} gives modern teams a smarter, more strategic way to win.

**Body Copy:** If your current approach to ${product} is creating extra effort without delivering enough return, ${name} offers a stronger path forward. Created for ${audience.toLowerCase()} and aligned to ${goal.toLowerCase()}, it replaces uncertainty with a more structured, credible, and results-oriented system. The result is messaging and execution that feel more professional and perform more effectively.

**CTA:** Start Today

**Value Proposition:** Reduced friction, stronger conversion potential, and clearer strategic impact.

**Differentiation From Competitors:** ${name} stands apart by pairing professional brand presentation with sharper market relevance and more actionable value.

**Platform Adaptation Notes:** Use urgency and pain-point framing on conversion-focused placements, then adapt the supporting line into shorter hooks for Instagram and YouTube formats.`,
    ],
    keywords: [
      `### Keyword Strategy Summary\n\n**Objective:** Position ${name} as the market-leading ${industry} solution for ${audience} with high-intent, conversion-driven search traffic.\n\n**Recommended Focus:**\n- Core intent: ${goal.toLowerCase()} and efficiency in ${product.toLowerCase()}.\n- Brand anchors: ${name}, ${product}, ${industry}.\n- Content themes: implementation guides, use cases, ROI comparisons, trust signals.\n\n### Priority Keyword Cluster\n- ${name.toLowerCase()} ${product.toLowerCase()} for ${audience.toLowerCase()}\n- ${industry.toLowerCase()} ${product.toLowerCase()} ROI\n- ${product.toLowerCase()} best practices for ${audience.toLowerCase()}\n- ${name.toLowerCase()} vs ${competitors || "competitors"}\n- ${product.toLowerCase()} adoption ${new Date().getFullYear()}\n\n**Next step:** Develop one pillar blog targeting this cluster, then internal linking to supporting long-tail posts.`,
      `### Long-Tail & Intent-Based Keywords\n\n**Commercial intent:**\n- ${industry.toLowerCase()} ${product.toLowerCase()} comparison for ${audience.toLowerCase()}\n- buy ${product.toLowerCase()} with ${goal.toLowerCase()} guarantee\n\n**Informational intent:**\n- how to select ${product.toLowerCase()} for ${audience.toLowerCase()}\n- ${product.toLowerCase()} implementation checklist\n\n**Navigational intent:**\n- ${name.toLowerCase()} customer success stories\n- ${product.toLowerCase()} support ${industry.toLowerCase()} case study`,
      `### Trending + Competitive Gap Keywords\n\n- AI-enhanced ${industry.toLowerCase()} ${product.toLowerCase()}\n- ${industry.toLowerCase()} challenges ${new Date().getFullYear()}: ${audience.toLowerCase()} perspective\n- ${competitors ? competitors.split(",")[0].trim() : "competitor"} alternative strategies\n- ${product.toLowerCase()} for distributed teams\n- sustainable ${industry.toLowerCase()} performance tools\n\n**Opportunity:** Capitalize on rising interest in AI and distributed operations by publishing fast-response content and optimized PPC ads.`,
    ],
    content: [
      `### Blog Article Ideas
1. **"The Ultimate Guide to ${product} for ${audience}"** - Comprehensive how-to that establishes ${name} as a thought leader.
2. **"${industry} Trends in ${new Date().getFullYear()}: What You Need to Know"** - Timely content for organic traffic.
3. **"How ${name} Helped [Customer] Achieve [Result]"** - Case study format for social proof.
4. **"${audience}: 5 Mistakes You're Making with ${product}"** - Problem-aware content that drives urgency.`,
      `### Landing Page Copy

**Hero Section:**
# The ${product} That ${audience} Trust

${name} makes ${goal.toLowerCase()} effortless. Our ${tone.toLowerCase()} approach to ${industry.toLowerCase()} means you get results, not excuses.

**Social Proof:** "Used by 10,000+ ${audience.toLowerCase()} worldwide"

**Features Section:** Three benefit-driven cards highlighting speed, reliability, and ROI.`,
      `### Email Campaign Sequence

**Email 1 - Welcome:** "Welcome to ${name}! Here's what to expect..."

**Email 2 - Value:** "How ${audience.toLowerCase()} are using ${product} to achieve ${goal.toLowerCase()}"

**Email 3 - Social Proof:** "See why ${industry} leaders choose ${name}"

**Email 4 - Urgency:** "Limited-time offer: Get 30% off your first month"`,
    ],
    social: platforms.map(
      (p) =>
        `### ${p} Strategy

**Content Pillars:**
- Educational (40%): Tips about ${product} and ${industry}
- Behind-the-scenes (25%): Team culture, product development
- Social proof (20%): Customer stories and testimonials
- Promotional (15%): Offers, launches, and CTAs

**Post Ideas:**
1. "${audience}: Here's why ${product} will change your workflow" - carousel or thread
2. "We asked 100 ${audience.toLowerCase()} their biggest challenge..." - poll or engagement post
3. "Day in the life using ${name}" - video or story

**Hashtags:** #${name.replace(/\s/g, "")} #${industry.replace(/\s/g, "")} #${goal.replace(/\s/g, "")} #MarketingTips

**Posting Frequency:** ${p === "Twitter" ? "2-3x daily" : p === "LinkedIn" ? "3-5x weekly" : p === "TikTok" ? "1-2x daily" : "1x daily"}

**Engagement Strategy:** Respond to every comment within 2 hours. DM users who engage consistently.`
    ),
    viral: [
      `### Campaign: "The ${name} Challenge"

Invite ${audience.toLowerCase()} to share their biggest ${industry.toLowerCase()} pain point. ${name} will solve the top-voted problem live on social media.

**Why it works:** User-generated content plus problem-solving creates engagement and shareability.

**Platforms:** ${platforms.join(", ")}`,
      `### Campaign: "${industry} Myth Busters"

Create a series debunking common myths about ${product.toLowerCase()} in the ${industry.toLowerCase()} space. Use short-form video with strong statistics.

**Why it works:** Contrarian content gets shared more and positions ${name} as the truth-teller in a crowded market.`,
      `### Campaign: "Behind the Build"

Document ${name}'s journey of building ${product} in a docu-series format. Show the real challenges, pivots, and wins.

**Why it works:** Authenticity drives connection. ${audience} will root for ${name} and become loyal advocates.`,
    ],
    competitor: [
      `### Competitive Landscape

**Key Competitors:** ${competitors || "Market leaders in " + industry}

**Their Strengths:**
- Established brand recognition
- Larger marketing budgets
- Existing customer base

**Their Weaknesses:**
- Generic messaging that doesn't resonate with ${audience.toLowerCase()}
- Slow to adopt new ${industry.toLowerCase()} trends
- Poor customer support experience

**Your Differentiation Opportunities:**
1. Hyper-personalized ${tone.toLowerCase()} messaging
2. Focus on ${goal.toLowerCase()} with measurable ROI
3. Community-driven approach on ${platforms.join(" & ")}`,
      `### Content Gaps to Exploit

- Competitors lack video content about ${product}
- No one is creating interactive tools or calculators for ${audience.toLowerCase()}
- Limited presence on ${platforms.filter((p) => p === "TikTok" || p === "YouTube").join(" & ") || "emerging platforms"}
- No competitor offers a free educational resource or course about ${industry.toLowerCase()}`,
    ],
    engagement: [
      `### Attract Users

1. **Free ${industry} Resource:** Create a downloadable guide that solves a key pain point for ${audience.toLowerCase()}
2. **Interactive Quiz:** "What type of ${product.toLowerCase()} user are you?" - generates personalized recommendations
3. **Webinar Series:** Monthly expert sessions on ${industry.toLowerCase()} topics

### Increase Shares and Comments

1. **Debate Posts:** "Unpopular opinion: [Hot take about ${industry}]"
2. **User Spotlights:** Feature customers weekly
3. **Polls and Questions:** Simple engagement drivers

### Convert Followers to Customers

1. **Exclusive Follower Discounts:** "Social-only" deals
2. **Limited Free Trials:** Through social DMs only
3. **Retargeting:** Use engagement data for precise ad targeting`,
    ],
  };

  return mockByTask[task];
}

export default function Index() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [activeTask, setActiveTask] = useState<TaskId>("ads");
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
        {!companyData ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl ai-gradient mb-6 glow animate-pulse-glow">
                <Sparkles className="h-12 w-12 text-primary-foreground" />
              </div>
              <h1 className="font-display text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                Welcome to LeadBot
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Generate tailored marketing content for your business with AI-powered insights and creative strategies.
              </p>
            </div>
            <CompanyForm onSubmit={handleCompanySubmit} />
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            {!companyData ? (
              <div className="grid h-full grid-cols-1 gap-6 overflow-y-auto p-6 lg:grid-cols-[2fr_1fr] lg:p-8">
                <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm lg:p-8">
                  <CompanyForm onSubmit={handleCompanySubmit} />
                </div>
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6">
                  <h2 className="font-display text-lg font-semibold text-slate-900">How it works</h2>
                  <ol className="mt-4 space-y-4 text-sm text-slate-700">
                    <li><span className="font-semibold text-indigo-700">1.</span> Add your company profile and positioning details.</li>
                    <li><span className="font-semibold text-indigo-700">2.</span> Pick a strategy task in the left navigation.</li>
                    <li><span className="font-semibold text-indigo-700">3.</span> Generate, copy, and iterate campaign-ready ideas.</li>
                  </ol>
                </div>
              </div>
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
          </div>
        </main>
      </div>
    </div>
  );
}
