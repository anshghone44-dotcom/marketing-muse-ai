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
      `### Fresh Professional Ad Campaign #4\n**Headline:** "Outpace Competition: How ${audience} Dominate ${industry} with ${name}"\n\n**Ad Copy:** Your competitors won't stay ahead for long. ${name}'s advanced ${product} platform empowers ${audience} to capture market share through accelerated ${goal.toLowerCase()}. Gain competitive intelligence, optimize processes, and scale faster than ever. Join industry leaders who've achieved 3X growth in their first year.\n\n**CTA:** Start Your Competitive Advantage\n\n**Visual Concept:** Dynamic comparison charts showing ${name} vs. market alternatives. Growth trajectory graphics with success metrics prominently displayed.\n\n**Lead Magnet:** Competitive benchmark report + market position analysis + implementation sprint kickoff meeting.`,
      `### Fresh Professional Ad Campaign #5\n**Headline:** "Eliminate Implementation Complexity: ${name}'s Plug-and-Play ${product} Solution"\n\n**Ad Copy:** Unlike legacy systems, ${name}'s ${product} integrates seamlessly with your existing technology stack. Our approach to implementation means zero downtime, faster time-to-value, and immediate ${goal.toLowerCase()} improvements. ${audience} organizations go live in weeks, not months.\n\n**CTA:** Get Your Implementation Timeline\n\n**Visual Concept:** Architecture diagrams showing integration points, deployment flow visualization, and timeline roadmap.\n\n**Lead Magnet:** Technical integration guide + implementation timeline + dedicated success manager assignment.`,
      `### Fresh Professional Ad Campaign #6\n**Headline:** "Future-Proof Your ${industry} Strategy with ${name}'s ${product}"\n\n**Ad Copy:** The ${industry} landscape evolves rapidly. ${name} ensures you stay ahead with continuous innovation, predictive analytics, and adaptive ${product} features. Our forward-thinking approach protects your investment while driving sustained ${goal.toLowerCase()} improvements throughout your organization.\n\n**CTA:** Explore Future-Ready Solutions\n\n**Visual Concept:** Innovation roadmap showcase, AI/ML capabilities visualization, trend forecasting tools display.\n\n**Lead Magnet:** 5-Year strategic roadmap + industry trends forecast + quarterly innovation briefings.`,
      `### Interactive Mini Quiz Ad\n**Campaign Title:** "What's Your ${industry} Maturity Score?"\n\n**Quiz Format:** 5-question interactive assessment\n\n**Questions:**\n1. "How many years of ${product.toLowerCase()} experience do you have?"\n2. "What percentage of your team is trained in ${industry} best practices?"\n3. "How satisfied are you with your current ${product.toLowerCase()} implementation?"\n4. "What's your annual budget allocation for ${industry}?"\n5. "Which area needs the most improvement: Strategy / Execution / Measurement?"\n\n**Results Page:** Personalized maturity score (Beginner / Intermediate / Advanced / Expert) with customized recommendations and lead capture form for detailed consultation.\n\n**CTA:** "Get Your Free Assessment"\n\n**Lead Magnet:** Personalized improvement roadmap delivered via email + priority consultation scheduling.`,
      `### Interactive Poll Ad\n**Campaign Title:** "Help Shape ${name}'s ${product} Roadmap"\n\n**Poll Question:** "What's your #1 priority for ${industry} in ${new Date().getFullYear()}?"\n\n**Poll Options:**\n- Option A: "Increase ${goal.toLowerCase()} by 50%+"\n- Option B: "Reduce operational complexity"\n- Option C: "Improve team collaboration & efficiency"\n- Option D: "Scale ${product} across departments"\n\n**Engagement Strategy:** Display live poll results showing how other ${audience} organizations are prioritizing. High engagement drives curiosity.\n\n**Follow-up:** Show detailed insights about winning poll option + case studies of success + lead capture for deeper discussion.\n\n**CTA:** "Vote Now & See Results"\n\n**Lead Magnet:** Exclusive industry insights report based on poll responses + strategic recommendations tailored to your vote.`,
      `### Interactive Swipe Decision Ad\n**Campaign Title:** "Build Your ${industry} Strategy in 30 Seconds"\n\n**Swipe Flow:**\n\n**Card 1 - Your Priority:**\n- Swipe Left: "Quick Wins (Fast Results)"\n- Swipe Right: "Long-Term Transformation (Sustainable Growth)"\n\n**Card 2 - Your Approach:**\n- Swipe Left: "DIY with Tools & Templates"\n- Swipe Right: "Full-Service Implementation with Experts"\n\n**Card 3 - Your Budget:**\n- Swipe Left: "Bootstrap / Limited Budget"\n- Swipe Right: "Enterprise Investment Approved"\n\n**Results:** Personalized recommendation engine matches their choices to the ideal ${name} solution tier with specific features and pricing.\n\n**CTA:** "See Your Custom Plan"\n\n**Lead Magnet:** Personalized solution package + instant ROI calculator + 15-minute planning call with specialist.\n\n**Visual Concept:** Mobile-first swipe cards with smooth transitions, professional icons, and progress indicator.`,
      `### Fresh Interactive Mini Quiz Ad #2\n**Campaign Title:** "Calculate Your ${industry} Efficiency Gap - In 60 Seconds"\n\n**Quiz Format:** 6-question diagnostic tool\n\n**Questions:**\n1. "How much time does your team spend on manual ${product} tasks weekly?"\n2. "What's your current accuracy rate in ${goal.toLowerCase()} processes?"\n3. "How many process improvements have you implemented in the last year?"\n4. "What percentage of decisions are data-driven in your organization?"\n5. "How quickly can you scale your ${industry} operations if needed?"\n6. "What's your biggest bottleneck: People / Process / Technology?"\n\n**Results Page:** Efficiency gap score with dollar value savings opportunity + peer benchmarking data + customized action plan.\n\n**CTA:** "See Your Efficiency Opportunity"\n\n**Lead Magnet:** Detailed efficiency analysis + cost-benefit projection + quarterly success metrics framework.`,
      `### Fresh Interactive Poll Ad #2\n**Campaign Title:** "Voting for the Future of ${industry}"\n\n**Poll Question:** "Which challenge impacts your organization the most?"\n\n**Poll Options:**\n- Option A: "Talent shortage in ${industry} expertise"\n- Option B: "Technology integration & legacy system constraints"\n- Option C: "Budget limitations for transformation initiatives"\n- Option D: "Difficulty measuring ${goal.toLowerCase()} impact"\n\n**Engagement Strategy:** Real-time voting with demographic insights (company size, role, industry segment).\n\n**Follow-up:** Display breakdown of how different organization types voted + expert commentary on winning challenge.\n\n**CTA:** "Share Your Vote & Get Insights"\n\n**Lead Magnet:** Challenge-specific solution brief + expert webinar recording + peer case studies addressing top challenges.`,
      `### Fresh Interactive Swipe Decision Ad #2\n**Campaign Title:** "Find Your Perfect ${name} Solution Match"\n\n**Swipe Flow:**\n\n**Card 1 - Team Size:**\n- Swipe Left: "<50 employees"\n- Swipe Right: "50+ employees"\n\n**Card 2 - ${industry} Maturity:**\n- Swipe Left: "New to ${industry} / Early stage"\n- Swipe Right: "Established practitioner"\n\n**Card 3 - Key Focus:**\n- Swipe Left: "Cost efficiency"\n- Swipe Right: "Market leadership & innovation"\n\n**Results:** Personalized ${name} edition recommendation (Starter / Professional / Enterprise) with feature comparison, pricing, and success stories.\n\n**CTA:** "Get Your Perfect Match"\n\n**Lead Magnet:** Detailed edition comparison + customer ROI examples + 20-minute solution design call.\n\n**Visual Concept:** Clean card design with edition badges, feature icons, success metrics per tier.`,
      `### Community Debate Ad (Poll/Discussion)\n**Campaign Title:** "The Great ${industry} Debate: Quality vs. Quantity"\n\n**Poll Question:** "In ${new Date().getFullYear()}, what's more important for ${goal.toLowerCase()}: High Volume or Hyper-Personalization?"\n\n**Participation Mechanics:** Users vote and immediately see a live heat-map of how leaders in their industry are voting. \n\n**Follow-up:** "You voted for Personalization. Check out how ${name} automates quality at scale."\n\n**CTA:** Join the Discussion\n\n**Visual Concept:** Split screen with bold typography, "TEAM VOLUME" vs. "TEAM QUALITY", vibrant contrasting colors.`,
      `### "Predict the Future" Challenge\n**Campaign Title:** "${industry} 2030: What's Your Prediction?"\n\n**Participation:** Users enter their top prediction for ${industry} in the next 10 years. Our AI "judges" the prediction for creativity and plausibility.\n\n**Results:** Get a "Futurist Score" and a shareable graphic. \n\n**CTA:** Make Your Prediction\n\n**Lead Magnet:** Access to ${name}'s exclusive "State of the Industry" forecasting report.`,
      `### Gamified "Price My Pain" Tool\n**Campaign Title:** "How Much Is ${industry} Inefficiency Costing You?"\n\n**Interactive:** A slider-based tool where users input their team size, hourly rate, and manual task time. \n\n**Output:** A live-updating dollar amount showing "Lost Revenue" vs. "Potential Savings with ${name}".\n\n**CTA:** Save My Revenue\n\n**Visual Concept:** Clean dashboard look with a ticking "Loss Clock" that stops when they click the button.`,
    ],
    keywords: [
      `### Lead-Generating (High-Intent)\n- best ${product.toLowerCase()} for ${audience.toLowerCase()}\n- ${industry.toLowerCase()} ${product.toLowerCase()} pricing\n- buy ${product.toLowerCase()} online\n- ${name.toLowerCase()} reviews\n- ${product.toLowerCase()} comparison ${new Date().getFullYear()}\n- top-rated ${industry.toLowerCase()} solutions`,
      `### Catchy & Social-Friendly\n- #1 ${industry.toLowerCase()} hack for ${audience.toLowerCase()}\n- why ${audience.toLowerCase()} are switching to ${name}\n- stop wasting time on ${industry.toLowerCase()}\n- the future of ${product.toLowerCase()}\n- ${name}: the only ${product.toLowerCase()} you need\n- viral ${industry.toLowerCase()} strategies ${new Date().getFullYear()}`,
      `### Brand Awareness & Authority\n- what is ${industry.toLowerCase()} automation\n- ${name} official site\n- ${industry.toLowerCase()} best practices ${new Date().getFullYear()}\n- how ${name} is changing ${industry.toLowerCase()}\n- ${audience.toLowerCase()} guide to ${product.toLowerCase()}\n- professional ${industry.toLowerCase()} insights`,
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
      `### Campaign: "The ${industry} Referral Roulette"\n\nUsers invite their network to sign up for ${name}. Every successful referral unlocks a "Spin" on the AI reward wheel. \n\n**Prizes:** Premium ${industry} templates, custom AI model training hours, or exclusive strategy sessions.\n\n**Why it works:** Gamification + network effects. People love the thrill of the win.\n\n**Platforms:** ${platforms.join(", ")}`,
      `### Campaign: "Leaderboard of Legends"\n\nWeekly competition where users earn "Growth Points" for generating and deploying high-performing content using ${name}. Top users are featured on a live public leaderboard.\n\n**Why it works:** Social proof + healthy competition among ${audience}. \n\n**Platforms:** LinkedIn, Twitter`,
      `### Campaign: "Community Co-Creation Loop"\n\nAsk the community to vote on the next "AI Skill" ${name} should learn. Everyone who votes gets early beta access to that feature.\n\n**Why it works:** Direct user participation in the product roadmap. High retention and advocacy.`,
    ],
    competitor: [
      `### Competitive Landscape\n\n**Key Competitors:** ${competitors || "Market leaders in " + industry}\n\n**Their Strengths:**\n- Established brand recognition\n- Larger marketing budgets\n- Existing customer base\n\n**Their Weaknesses:**\n- Generic messaging that doesn't resonate with ${audience.toLowerCase()}\n- Slow to adopt new ${industry.toLowerCase()} trends\n- Poor customer support experience\n\n**Your Differentiation Opportunities:**\n1. Hyper-personalized ${tone.toLowerCase()} messaging\n2. Focus on ${goal.toLowerCase()} with measurable ROI\n3. Community-driven approach on ${platforms.join(" & ")}`,
      `### Content Gaps to Exploit\n\n- Competitors lack video content about ${product}\n- No one is creating interactive tools/calculators for ${audience.toLowerCase()}\n- Limited presence on ${platforms.filter((p) => p === "TikTok" || p === "YouTube").join(" & ") || "emerging platforms"}\n- No competitor offers a free educational resource/course about ${industry.toLowerCase()}`,
    ],
    engagement: [
      `### Direct Participation Strategies\n\n1. **AI Strategy Builder Wordle:** A daily mini-game related to ${industry} terms. Completing it gives a nudge towards starting a task in ${name}.\n2. **"Rate My Ad" Community Poll:** Allow users to submit their draft copy from ${name} to a public gallery where other ${audience} can upvote or feedback.\n3. **Pulse Check Polls:** Regular, 1-click survey questions on the dashboard asking about current ${industry} trends.\n\n### Conversion Funnel through Interaction\n\n1. **Interactive Demo Loop:** A "Choose Your Own Adventure" demo of ${name} that personalizes based on their clicks.\n2. **"Unlock the Secret" Content:** Gamified gated content where users must answer 3 ${industry} questions correctly to download the premium guide.\n3. **Refer-a-Friend "Skip the Line":** Classic viral loop for high-demand AI features.`,
    ],
  };

  return mockByTask[task];
}

export default function Index() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [activeTask, setActiveTask] = useState<TaskId>("social");
  const [generatedContent, setGeneratedContent] = useState<Record<string, string[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCompanySubmit = (data: CompanyData) => {
    setCompanyData(data);
    setGeneratedContent({});
    setActiveTask("social");
    toast.success(`Profile saved for ${data.name}`, {
      description: "Generating your platform-specific marketing strategy...",
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
        {!companyData && activeTask === "social" ? (
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
