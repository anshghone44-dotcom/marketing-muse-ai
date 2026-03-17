import { useState } from "react";
import TopNavigation, { type TaskId } from "@/components/marketing/TopNavigation";
import CompanyForm, { type CompanyData } from "@/components/marketing/CompanyForm";
import ResultsCanvas from "@/components/marketing/ResultsCanvas";
import { toast } from "sonner";


// Mock generation - will be replaced with AI
function generateMockContent(task: TaskId, data: CompanyData): string[] {
  const { name, product, audience, industry, goal, tone, platforms, competitors } = data;

  const mockByTask: Record<TaskId, string[]> = {
    ads: [
      `### Professional Ad Campaign #1\n**Headline:** "Maximize Your ${industry} ROI with ${name}'s ${product} Solution"\n\n**Ad Copy:** Enterprise-grade ${product} designed specifically for ${audience} who demand measurable results. ${name} delivers a ${goal.toLowerCase()} platform backed by industry expertise and proven performance metrics. Access our free strategic consultation to discover how organizations like yours achieve 40%+ efficiency gains.\n\n**CTA:** Schedule Your Free Consultation\n\n**Visual Concept:** Professional corporate design with testimonial quotes from recognized industry leaders, performance charts, and case study metrics.\n\n**Lead Magnet:** Complimentary 1-on-1 discovery call with certified ${industry} specialist. No obligation.`,
      `### Professional Ad Campaign #2\n**Headline:** "Executive Guide to ${industry} Excellence: ${name}'s Proven Framework"\n\n**Ad Copy:** Decision-makers across the ${industry} sector trust ${name} for strategic ${product} implementation. Our comprehensive framework ensures alignment with your business objectives while reducing operational friction. Download our exclusive white paper detailing how leading ${audience} organizations optimize ${goal.toLowerCase()}.\n\n**CTA:** Download White Paper (Free)\n\n**Visual Concept:** Sophisticated layout featuring industry benchmarks, ROI statistics, and professional case study previews. Executive-focused color scheme.\n\n**Lead Magnet:** Proprietary industry report + personalized ROI calculator + 30-minute expert assessment.`,
      `### Professional Ad Campaign #3\n**Headline:** "Risk-Free ${industry} Transformation: ${name} Guarantees Results"\n\n**Ad Copy:** Leading ${audience} organizations are achieving unprecedented ${goal.toLowerCase()} success with ${name}'s proven ${product} methodology. Our guaranteed performance model eliminates implementation risk while delivering transparent, measurable outcomes within 90 days. Book a confidential strategy session to explore your organization's potential.\n\n**CTA:** Claim Your Strategy Session\n\n**Visual Concept:** Professional testimonials with verified company logos, performance dashboards, and success metrics. Trust-building design with certifications and awards.\n\n**Lead Magnet:** Custom benchmark analysis of your current performance vs. industry standards + executive briefing document.`,
      `### Interactive Mini Quiz Ad\n**Campaign Title:** "What's Your ${industry} Maturity Score?"\n\n**Quiz Format:** 5-question interactive assessment\n\n**Questions:**\n1. "How many years of ${product.toLowerCase()} experience do you have?"\n2. "What percentage of your team is trained in ${industry} best practices?"\n3. "How satisfied are you with your current ${product.toLowerCase()} implementation?"\n4. "What's your annual budget allocation for ${industry}?"\n5. "Which area needs the most improvement: Strategy / Execution / Measurement?"\n\n**Results Page:** Personalized maturity score (Beginner / Intermediate / Advanced / Expert) with customized recommendations and lead capture form for detailed consultation.\n\n**CTA:** "Get Your Free Assessment"\n\n**Lead Magnet:** Personalized improvement roadmap delivered via email + priority consultation scheduling.`,
      `### Interactive Poll Ad\n**Campaign Title:** "Help Shape ${name}'s ${product} Roadmap"\n\n**Poll Question:** "What's your #1 priority for ${industry} in ${new Date().getFullYear()}?"\n\n**Poll Options:**\n- Option A: "Increase ${goal.toLowerCase()} by 50%+"\n- Option B: "Reduce operational complexity"\n- Option C: "Improve team collaboration & efficiency"\n- Option D: "Scale ${product} across departments"\n\n**Engagement Strategy:** Display live poll results showing how other ${audience} organizations are prioritizing. High engagement drives curiosity.\n\n**Follow-up:** Show detailed insights about winning poll option + case studies of success + lead capture for deeper discussion.\n\n**CTA:** "Vote Now & See Results"\n\n**Lead Magnet:** Exclusive industry insights report based on poll responses + strategic recommendations tailored to your vote.`,
      `### Interactive Swipe Decision Ad\n**Campaign Title:** "Build Your ${industry} Strategy in 30 Seconds"\n\n**Swipe Flow:**\n\n**Card 1 - Your Priority:**\n- Swipe Left: "Quick Wins (Fast Results)"\n- Swipe Right: "Long-Term Transformation (Sustainable Growth)"\n\n**Card 2 - Your Approach:**\n- Swipe Left: "DIY with Tools & Templates"\n- Swipe Right: "Full-Service Implementation with Experts"\n\n**Card 3 - Your Budget:**\n- Swipe Left: "Bootstrap / Limited Budget"\n- Swipe Right: "Enterprise Investment Approved"\n\n**Results:** Personalized recommendation engine matches their choices to the ideal ${name} solution tier with specific features and pricing.\n\n**CTA:** "See Your Custom Plan"\n\n**Lead Magnet:** Personalized solution package + instant ROI calculator + 15-minute planning call with specialist.\n\n**Visual Concept:** Mobile-first swipe cards with smooth transitions, professional icons, and progress indicator.`,
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <TopNavigation
        activeTask={activeTask}
        onTaskChange={setActiveTask}
        hasCompanyData={!!companyData}
      />

      <main className="container mx-auto px-6 py-12 relative z-10">
        {!companyData ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-display text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                Welcome to LeadBot
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Generate tailored marketing content for your business with AI-powered insights and creative strategies.
              </p>
            </div>
            <CompanyForm onSubmit={handleCompanySubmit} />
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
