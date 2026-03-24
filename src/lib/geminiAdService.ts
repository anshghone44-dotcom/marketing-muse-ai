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
  const prompt = `You are a world-class digital marketing strategist and copywriter. Generate a professional, detailed ad campaign based on the brief below. Return ONLY raw JSON with no markdown or code fences.

Campaign Brief: "${brief}"
Platforms: ${platforms.join(", ")}
Goal: ${goal}
Company: ${companyName || "Not specified"}
Industry: ${industry || "Not specified"}
Product/Service: ${product || "Not specified"}
Target Audience: ${audience || "General audience"}

Return this exact JSON structure:
{
  "summary": "One-sentence campaign overview",
  "overallStrategy": "2-3 sentence strategic rationale",
  "budgetRecommendation": "Recommended budget split and reasoning",
  "kpis": ["KPI 1 with target metric", "KPI 2 with target metric", "KPI 3 with target metric"],
  "campaigns": [
    {
      "platform": "Platform name (must be one of: ${platforms.join(", ")})",
      "headline": "Compelling, platform-optimised headline (max 10 words)",
      "primaryText": "Full ad copy body text — 3-5 sentences, persuasive",
      "callToAction": "Strong CTA button text (max 5 words)",
      "targetAudience": "Specific audience segment description for this platform",
      "adFormat": "Best ad format for this platform and goal",
      "tone": "Tone description",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
      "proTips": ["Expert tip 1", "Expert tip 2"]
    }
  ]
}

Generate one campaign object per platform. Be specific, professional, and tailored.`;

  let response: Response;
  try {
    response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-flash-1.5",
        messages: [
          { role: "system", content: "You are a marketing strategist. Return only valid JSON, no markdown." },
          { role: "user", content: prompt },
        ],
      }),
    });
  } catch (networkError) {
    console.error('Network error while calling AI gateway:', networkError);
    throw new Error(
      'Network error: unable to reach AI gateway. Please check your internet connection and CORS configuration.'
    );
  }

  if (response.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
  if (response.status === 402) throw new Error("AI credits exhausted. Please add funds in your Lovable workspace.");
  if (!response.ok) throw new Error(`AI gateway error (${response.status})`);

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

  try {
    return JSON.parse(cleaned) as AdCampaignResult;
  } catch {
    return {
      summary: `Campaign for: ${brief}`,
      overallStrategy: text.slice(0, 200),
      budgetRecommendation: "Distribute across chosen platforms.",
      kpis: ["Clicks", "Conversions", "ROI"],
      campaigns: platforms.map((p) => ({
        platform: p,
        headline: "Professional Ad Headline",
        primaryText: text.slice(0, 150),
        callToAction: "Learn More",
        targetAudience: audience || "General",
        adFormat: "Single Image",
        tone: "Professional",
        hashtags: ["#marketing"],
        proTips: ["Test multiple variations"],
      })),
    };
  }
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
