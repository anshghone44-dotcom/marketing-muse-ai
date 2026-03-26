import { supabase } from "@/integrations/supabase/client";
import { generateProfessionalAdCopies, hasLovableGatewayConfig } from "./lovable-gateway";

export interface AdCampaign {
  platform: string;
  headline: string;
  primaryText: string;
  callToAction: string;
  targetAudience: string;
  adFormat: string;
  tone: string;
  hashtags: string[];
  proTips: string[];
}

export interface AdCampaignResult {
  summary: string;
  campaigns: AdCampaign[];
  overallStrategy: string;
  budgetRecommendation: string;
  kpis: string[];
}

async function callViaEdgeFunction(body: object): Promise<AdCampaignResult> {
  const { data, error } = await supabase.functions.invoke("generate-ads", { body });
  if (error) throw new Error(error.message || "Edge function error");
  if (data?.error) throw new Error(data.error);
  return data as AdCampaignResult;
}

function compactBrief(brief: string): string {
  const normalized = brief.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  return normalized.length > 180 ? `${normalized.slice(0, 177)}...` : normalized;
}

function asTitleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

async function callViaGatewayDirect(
  brief: string,
  platforms: string[],
  goal: string,
  companyName?: string,
  industry?: string,
  product?: string,
  audience?: string
): Promise<AdCampaignResult> {
  const company = companyName?.trim() || "Your Company";
  const industryName = industry?.trim() || "your industry";
  const productName = product?.trim() || "your solution";
  const targetAudience = audience?.trim() || "your target audience";
  const refinedGoal = goal?.trim() || "Growth";
  const briefContext = compactBrief(brief);

  const campaigns: AdCampaign[] = platforms.map((platform) => {
    const normalizedPlatform = platform.toLowerCase();
    const goalNoun = asTitleCase(refinedGoal);

    const commonValueLine = `Built for ${targetAudience}, ${company}'s ${productName} helps teams in ${industryName} deliver measurable ${refinedGoal.toLowerCase()} outcomes.`;
    const briefLine = briefContext
      ? `Campaign focus: ${briefContext}`
      : `Campaign focus: highlight outcomes, credibility, and clear next steps for decision-makers.`;

    let headline = `${company}: ${goalNoun} That Converts`;
    let primaryText = `${commonValueLine} ${briefLine}`;
    let callToAction = "Get Started";
    let adFormat = "Single Image";
    let tone = "Professional";
    let hashtags: string[] = ["#MarketingStrategy", "#BusinessGrowth", "#PerformanceMarketing"];
    let proTips: string[] = [
      "Lead with one business outcome and support it with a proof point.",
      "Use concise, benefit-first language and avoid generic superlatives.",
      "Align visual style with brand credibility: clean layout, high-contrast headline, and one focused CTA.",
    ];

    switch (normalizedPlatform) {
      case "instagram":
        headline = `${productName} for High-Impact ${goalNoun}`;
        primaryText = `${commonValueLine} Designed for attention in-feed, this concept pairs polished visuals with a concise value proposition and action-oriented close. ${briefLine}`;
        callToAction = "Book a Demo";
        adFormat = "Carousel";
        hashtags = ["#BrandMarketing", "#DigitalCampaign", "#CustomerAcquisition"];
        proTips = [
          "Use slide 1 for the core promise, slides 2-3 for proof, and final slide for CTA.",
          "Prioritize brand-consistent visuals with minimal copy per frame.",
          "A/B test two headline hooks: pain-point-led vs outcome-led.",
        ];
        break;
      case "facebook":
        headline = `Drive ${goalNoun} with ${company}`;
        primaryText = `${commonValueLine} This Facebook-ready copy is structured for clarity: strong opening, practical differentiator, and direct CTA for qualified prospects. ${briefLine}`;
        callToAction = "Learn More";
        adFormat = "Single Image";
        hashtags = ["#LeadGeneration", "#PaidSocial", "#MarketingROI"];
        proTips = [
          "Front-load the first sentence with a clear business benefit.",
          "Use social proof snippets to build trust before the CTA.",
          "Retarget engaged viewers with a lower-friction offer.",
        ];
        break;
      case "linkedin":
        headline = `${company} | ${goalNoun} for ${asTitleCase(industryName)}`;
        primaryText = `${commonValueLine} Crafted for a professional audience, this LinkedIn copy emphasizes strategic value, operational fit, and measurable impact. ${briefLine}`;
        callToAction = "Schedule Consultation";
        adFormat = "Sponsored Content";
        hashtags = ["#B2BMarketing", "#RevenueGrowth", "#IndustryLeadership"];
        proTips = [
          "Speak to decision-makers with business outcomes, not product features alone.",
          "Pair the ad with a practical asset (case study, benchmark, or playbook).",
          "Use clear qualification language to improve lead quality.",
        ];
        break;
      case "youtube":
        headline = `${company} ${productName}: ${goalNoun} in Action`;
        primaryText = `${commonValueLine} Video script should open with a real pain point, present a clear before/after scenario, and close with one decisive next step. ${briefLine}`;
        callToAction = "Watch Demo";
        adFormat = "Video Ad";
        hashtags = ["#VideoMarketing", "#DemandGeneration", "#GrowthStrategy"];
        proTips = [
          "Deliver the core message within the first five seconds.",
          "Use on-screen captions to maintain clarity without audio.",
          "Close with one specific CTA and landing page alignment.",
        ];
        break;
      case "tiktok":
        headline = `${goalNoun} Starts with ${productName}`;
        primaryText = `${commonValueLine} Adapted for short-form delivery: concise narrative, fast pacing, and outcome-led messaging without sacrificing professional tone. ${briefLine}`;
        callToAction = "See How";
        adFormat = "Short Video";
        hashtags = ["#PerformanceCreative", "#ModernMarketing", "#GrowthContent"];
        proTips = [
          "Start with a sharp hook framed as a business problem.",
          "Use quick proof cues (metrics, testimonials, or results snapshots).",
          "Keep CTA explicit and repeat it visually at the end card.",
        ];
        break;
      case "google":
        headline = `${company} ${productName} | ${goalNoun}`;
        primaryText = `${commonValueLine} This search-ad style copy prioritizes intent match, relevance, and clear conversion action. ${briefLine}`;
        callToAction = "Request Proposal";
        adFormat = "Text Ad";
        hashtags = ["#SearchMarketing", "#HighIntentLeads", "#ConversionFocused"];
        proTips = [
          "Mirror high-intent keywords directly in the headline.",
          "Use extensions (sitelinks/callouts) to reinforce trust signals.",
          "Route traffic to a landing page tightly matched to ad intent.",
        ];
        break;
      default:
        break;
    }

    return {
      platform,
      headline,
      primaryText,
      callToAction,
      targetAudience,
      adFormat,
      tone,
      hashtags,
      proTips,
    };
  });

  const budgetSplit = Math.max(10, Math.round(100 / Math.max(platforms.length, 1)));

  return {
    summary: `Professional ${refinedGoal.toLowerCase()} campaign framework for ${company} across ${platforms.length} selected platform(s).`,
    overallStrategy: `Position ${company}'s ${productName} around one clear outcome (${refinedGoal.toLowerCase()}) for ${targetAudience}, then adapt message framing by channel behavior while preserving a consistent professional brand voice.`,
    budgetRecommendation: `Start with ${budgetSplit}% per platform for the first 10-14 days, then reallocate toward lower CPA and stronger qualified-conversion signals. Keep 15-20% reserved for creative iteration and retargeting.`,
    kpis: [
      `Qualified conversion rate by platform (primary KPI for ${refinedGoal.toLowerCase()}).`,
      `Cost per qualified lead/opportunity benchmarked weekly against ${industryName}.`,
      "Creative hold-rate and CTR trend to identify copy-message fit.",
    ],
    campaigns,
  };
}

export async function generateAdCampaigns(
  brief: string,
  platforms: string[],
  goal: string,
  companyName?: string,
  industry?: string,
  product?: string,
  audience?: string
): Promise<AdCampaignResult> {
  // If Lovable Gateway is configured, use it for professional results
  if (hasLovableGatewayConfig()) {
    try {
      const companyData = {
        name: companyName || "",
        industry: industry || "",
        product: product || "",
        audience: audience || "",
        goal: goal || "",
        tone: "Professional",
        platforms: platforms,
        competitors: ""
      };

      const copies = await generateProfessionalAdCopies(companyData);
      
      return {
        summary: `Professional ${goal} campaign generated via Lovable AI Gateway.`,
        campaigns: copies.map((copy, index) => ({
          platform: platforms[index % platforms.length],
          headline: "Professional Headline",
          primaryText: copy,
          callToAction: "Learn More",
          targetAudience: audience || "Optimized Audience",
          adFormat: "Optimized Format",
          tone: "Professional",
          hashtags: [],
          proTips: []
        })),
        overallStrategy: "Gateway-driven precision targeting.",
        budgetRecommendation: "Optimize for highest-performing gateway variants.",
        kpis: ["Conversion Rate", "Click-Through Rate"]
      };
    } catch (err) {
      console.warn("Lovable gateway failed, falling back to local generation:", err);
    }
  }

  return await callViaGatewayDirect(brief, platforms, goal, companyName, industry, product, audience);
}
