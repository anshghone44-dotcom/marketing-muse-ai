import { useState } from "react";
import AppSidebar, { type TaskId } from "@/components/marketing/AppSidebar";
import CompanyForm, { type CompanyData } from "@/components/marketing/CompanyForm";
import ResultsCanvas from "@/components/marketing/ResultsCanvas";
import { toast } from "sonner";

// Mock generation - will be replaced with AI
function generateMockContent(task: TaskId, data: CompanyData): string[] {
  const { name, product, audience, industry, goal, tone, platforms, competitors } = data;

  const mockByTask: Record<TaskId, string[]> = {
    ads: [
      `### Headline Concept 1\n**"Transform Your ${industry} Game with ${name}"**\n\n**Ad Copy:** Tired of mediocre results? ${name} delivers ${product} that ${audience} actually love. Join thousands who've already made the switch.\n\n**CTA:** Start Your Free Trial →\n\n**Visual Concept:** Split-screen showing the "before" (frustrated user) and "after" (delighted customer using ${name}).\n\n**Emotional Hook:** Fear of missing out — "Your competitors are already using this."`,
      `### Headline Concept 2\n**"${audience} Deserve Better. We Built ${name}."**\n\n**Ad Copy:** We studied what ${audience} truly need and built ${product} from the ground up. No compromises, no shortcuts.\n\n**CTA:** See How It Works\n\n**Visual Concept:** Clean product showcase with customer testimonials overlaid. ${tone} color palette.\n\n**Emotional Hook:** Aspiration — "This is the tool you've been waiting for."`,
      `### Headline Concept 3\n**"Stop Wasting Money on ${industry} Tools That Don't Deliver"**\n\n**Ad Copy:** ${name}'s ${product} is built for ${goal.toLowerCase()}. Real results, measurable impact, zero fluff.\n\n**CTA:** Get Started Free\n\n**Visual Concept:** Bold typography with data/metrics graphics showing ROI improvement.\n\n**Emotional Hook:** Frustration relief — "Finally, something that actually works."`,
    ],
    keywords: [
      `### High-Intent Keywords\n- best ${product.toLowerCase()} for ${audience.toLowerCase()}\n- ${industry.toLowerCase()} ${product.toLowerCase()} pricing\n- buy ${product.toLowerCase()} online\n- ${name.toLowerCase()} reviews\n- ${product.toLowerCase()} comparison ${new Date().getFullYear()}`,
      `### Long-Tail Keywords\n- how to choose ${product.toLowerCase()} for ${audience.toLowerCase()}\n- best ${industry.toLowerCase()} tools for small business\n- ${product.toLowerCase()} vs ${competitors || "competitors"}\n- affordable ${product.toLowerCase()} for startups\n- ${industry.toLowerCase()} marketing automation tools`,
      `### Trending & Competitor Gap Keywords\n- AI-powered ${product.toLowerCase()}\n- ${industry.toLowerCase()} trends ${new Date().getFullYear()}\n- ${competitors ? competitors.split(",")[0].trim() : "competitor"} alternatives\n- ${product.toLowerCase()} for remote teams\n- sustainable ${industry.toLowerCase()} solutions`,
    ],
    content: [
      `### Blog Article Ideas\n1. **"The Ultimate Guide to ${product} for ${audience}"** — Comprehensive how-to that establishes ${name} as a thought leader.\n2. **"${industry} Trends in ${new Date().getFullYear()}: What You Need to Know"** — Timely content for organic traffic.\n3. **"How ${name} Helped [Customer] Achieve [Result]"** — Case study format for social proof.\n4. **"${audience}: 5 Mistakes You're Making with ${product}"** — Problem-aware content that drives urgency.`,
      `### Landing Page Copy\n\n**Hero Section:**\n# The ${product} That ${audience} Trust\n\n${name} makes ${goal.toLowerCase()} effortless. Our ${tone.toLowerCase()} approach to ${industry.toLowerCase()} means you get results, not excuses.\n\n**Social Proof:** "Used by 10,000+ ${audience.toLowerCase()} worldwide"\n\n**Features Section:** Three benefit-driven cards highlighting speed, reliability, and ROI.`,
      `### Email Campaign Sequence\n\n**Email 1 — Welcome:** "Welcome to ${name}! Here's what to expect..."\n\n**Email 2 — Value:** "How ${audience.toLowerCase()} are using ${product} to achieve ${goal.toLowerCase()}"\n\n**Email 3 — Social Proof:** "See why ${industry} leaders choose ${name}"\n\n**Email 4 — Urgency:** "Limited-time offer: Get 30% off your first month"`,
    ],
    social: platforms.map(
      (p) =>
        `### ${p} Strategy\n\n**Content Pillars:**\n- Educational (40%): Tips about ${product} & ${industry}\n- Behind-the-scenes (25%): Team culture, product development\n- Social proof (20%): Customer stories & testimonials\n- Promotional (15%): Offers, launches, CTAs\n\n**Post Ideas:**\n1. "${audience}: Here's why ${product} will change your workflow" — carousel/thread\n2. "We asked 100 ${audience.toLowerCase()} their biggest challenge..." — poll/engagement\n3. "Day in the life using ${name}" — video/story\n\n**Hashtags:** #${name.replace(/\s/g, "")} #${industry.replace(/\s/g, "")} #${goal.replace(/\s/g, "")} #MarketingTips\n\n**Posting Frequency:** ${p === "Twitter" ? "2-3x daily" : p === "LinkedIn" ? "3-5x weekly" : p === "TikTok" ? "1-2x daily" : "1x daily"}\n\n**Engagement Strategy:** Respond to every comment within 2 hours. DM users who engage consistently.`
    ),
    viral: [
      `### Campaign: "The ${name} Challenge"\n\nInvite ${audience.toLowerCase()} to share their biggest ${industry.toLowerCase()} pain point. ${name} will solve the top-voted problem live on social media.\n\n**Why it works:** User-generated content + problem-solving = massive engagement and shareability.\n\n**Platforms:** ${platforms.join(", ")}`,
      `### Campaign: "${industry} Myth Busters"\n\nCreate a series debunking common myths about ${product.toLowerCase()} in the ${industry.toLowerCase()} space. Use short-form video with shocking statistics.\n\n**Why it works:** Contrarian content gets shared more. Position ${name} as the truth-teller in a crowded market.`,
      `### Campaign: "Behind the Build"\n\nDocument ${name}'s journey of building ${product} in a docu-series format. Show the real challenges, pivots, and wins.\n\n**Why it works:** Authenticity drives connection. ${audience} will root for ${name} and become loyal advocates.`,
    ],
    competitor: [
      `### Competitive Landscape\n\n**Key Competitors:** ${competitors || "Market leaders in " + industry}\n\n**Their Strengths:**\n- Established brand recognition\n- Larger marketing budgets\n- Existing customer base\n\n**Their Weaknesses:**\n- Generic messaging that doesn't resonate with ${audience.toLowerCase()}\n- Slow to adopt new ${industry.toLowerCase()} trends\n- Poor customer support experience\n\n**Your Differentiation Opportunities:**\n1. Hyper-personalized ${tone.toLowerCase()} messaging\n2. Focus on ${goal.toLowerCase()} with measurable ROI\n3. Community-driven approach on ${platforms.join(" & ")}`,
      `### Content Gaps to Exploit\n\n- Competitors lack video content about ${product}\n- No one is creating interactive tools/calculators for ${audience.toLowerCase()}\n- Limited presence on ${platforms.filter((p) => p === "TikTok" || p === "YouTube").join(" & ") || "emerging platforms"}\n- No competitor offers a free educational resource/course about ${industry.toLowerCase()}`,
    ],
    engagement: [
      `### Attract Users\n\n1. **Free ${industry} Resource:** Create a downloadable guide that solves a key pain point for ${audience.toLowerCase()}\n2. **Interactive Quiz:** "What type of ${product.toLowerCase()} user are you?" — generates personalized recommendations\n3. **Webinar Series:** Monthly expert sessions on ${industry.toLowerCase()} topics\n\n### Increase Shares & Comments\n\n1. **Debate Posts:** "Unpopular opinion: [Hot take about ${industry}]"\n2. **User Spotlights:** Feature customers weekly\n3. **Polls & Questions:** Simple engagement drivers\n\n### Convert Followers to Customers\n\n1. **Exclusive Follower Discounts:** "Social-only" deals\n2. **Limited Free Trials:** Through social DMs only\n3. **Retargeting:** Use engagement data for precise ad targeting`,
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

  const handleGenerate = (task: TaskId) => {
    if (!companyData) return;
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      const content = generateMockContent(task, companyData);
      setGeneratedContent((prev) => ({ ...prev, [task]: content }));
      setIsGenerating(false);
      toast.success("Content generated!", { description: "Review and copy what you need." });
    }, 1500);
  };

  const handleRegenerate = (task: TaskId, _index: number) => {
    handleGenerate(task);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        activeTask={activeTask}
        onTaskChange={setActiveTask}
        hasCompanyData={!!companyData}
      />

      <main className="flex-1 flex overflow-hidden">
        {!companyData ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-lg">
              <CompanyForm onSubmit={handleCompanySubmit} />
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
      </main>
    </div>
  );
}
