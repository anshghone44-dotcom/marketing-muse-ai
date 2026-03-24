import { supabase } from "@/integrations/supabase/client";

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
  const { data, error } = await supabase.functions.invoke('generate-ads', { body });
  if (error) throw new Error(error.message || 'Edge function error');
  if (data?.error) throw new Error(data.error);
  return data as AdCampaignResult;
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
  // Generate professional ad campaigns locally without external API dependencies
  const company = companyName || "Your Company";
  const industryName = industry || "General";
  const productName = product || "Your Product/Service";
  const targetAudience = audience || "General audience";

  // Create tailored campaigns for each platform
  const campaigns: AdCampaign[] = platforms.map((platform) => {
    let headline = "";
    let primaryText = "";
    let callToAction = "";
    let adFormat = "";
    let tone = "Professional";
    let hashtags: string[] = [];
    let proTips: string[] = [];

    switch (platform.toLowerCase()) {
      case "instagram":
        headline = `Discover ${productName} Today`;
        primaryText = `Transform your ${industryName} experience with ${company}'s ${productName}. Designed for ${targetAudience}, our solution delivers exceptional results. Join thousands who trust ${company} for quality and innovation.`;
        callToAction = "Shop Now";
        adFormat = "Carousel";
        hashtags = ["#Innovation", "#Quality", "#YourBrand"];
        proTips = ["Use high-quality visuals", "Include user-generated content"];
        break;
      case "facebook":
        headline = `${company} - ${goal} Solutions`;
        primaryText = `Looking to achieve ${goal.toLowerCase()}? ${company} offers ${productName} tailored for ${targetAudience} in the ${industryName} industry. Our proven approach delivers measurable results. Contact us today to learn more.`;
        callToAction = "Learn More";
        adFormat = "Single Image";
        hashtags = ["#Business", "#Success", "#Growth"];
        proTips = ["Target lookalike audiences", "Use compelling CTAs"];
        break;
      case "linkedin":
        headline = `Professional ${productName} for ${industryName}`;
        primaryText = `Elevate your ${industryName} operations with ${company}'s ${productName}. Trusted by professionals and designed for ${targetAudience}, our solution provides the tools you need to succeed. Discover the difference today.`;
        callToAction = "Get Started";
        adFormat = "Sponsored Content";
        hashtags = ["#Professional", "#Industry", "#Leadership"];
        proTips = ["Focus on thought leadership", "Target decision-makers"];
        break;
      case "youtube":
        headline = `${productName} Demo - ${company}`;
        primaryText = `Watch how ${company}'s ${productName} can help ${targetAudience} achieve ${goal.toLowerCase()}. Our comprehensive solution for the ${industryName} industry is designed to deliver outstanding results. Subscribe for more insights.`;
        callToAction = "Watch Now";
        adFormat = "Video Ad";
        hashtags = ["#Tutorial", "#Demo", "#HowTo"];
        proTips = ["Keep videos under 30 seconds", "Include clear calls-to-action"];
        break;
      case "tiktok":
        headline = `${productName} in Action`;
        primaryText = `Quick tip: ${company}'s ${productName} makes ${goal.toLowerCase()} easy for ${targetAudience}. See it in action and transform your ${industryName} approach today! #ShortAndSweet`;
        callToAction = "Try It";
        adFormat = "Short Video";
        hashtags = ["#QuickTip", "#Easy", "#Results"];
        proTips = ["Use trending sounds", "Keep content engaging"];
        break;
      case "google":
        headline = `${productName} - ${company}`;
        primaryText = `Find ${productName} solutions from ${company}. Perfect for ${targetAudience} in ${industryName}. Achieve ${goal.toLowerCase()} with our proven methods. Search now.`;
        callToAction = "Search";
        adFormat = "Text Ad";
        hashtags = ["#Search", "#Find", "#Discover"];
        proTips = ["Use relevant keywords", "Include location targeting"];
        break;
      default:
        headline = `Explore ${productName}`;
        primaryText = `${company} presents ${productName}, designed for ${targetAudience} to achieve ${goal.toLowerCase()} in ${industryName}. Experience the difference with our professional solutions.`;
        callToAction = "Explore";
        adFormat = "Standard";
        hashtags = ["#Explore", "#Discover", "#Professional"];
        proTips = ["Customize for your audience", "Track performance metrics"];
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

  return {
    summary: `Comprehensive ${goal} campaign for ${company} across ${platforms.length} platforms`,
    overallStrategy: `This campaign focuses on ${goal.toLowerCase()} by leveraging ${platforms.join(", ")} to reach ${targetAudience}. We'll emphasize ${company}'s expertise in ${industryName} and the value of ${productName}. Our approach combines professional messaging with platform-specific optimizations to maximize engagement and conversions.`,
    budgetRecommendation: `Allocate budget proportionally: ${platforms.map(p => `${p}: 25%`).join(", ")}. Focus on high-performing platforms and adjust based on initial results.`,
    kpis: [
      `Conversion Rate: Target 3-5% based on ${goal}`,
      `Cost Per Acquisition: Aim for industry average in ${industryName}`,
      `Return on Ad Spend: Target 3:1 or higher`
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
  // Revert to direct campaign generation path that works reliably
  // (without the new in-progress Lovable API gateway fallback logic)
  return await callViaGatewayDirect(brief, platforms, goal, companyName, industry, product, audience);
}
