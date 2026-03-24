import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

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

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateAdCampaigns(
  brief: string,
  platforms: string[],
  goal: string,
  companyName?: string,
  industry?: string,
  product?: string,
  audience?: string
): Promise<AdCampaignResult> {
  if (!API_KEY || API_KEY.startsWith("your_")) {
    throw new Error("Missing or invalid Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });

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
  "overallStrategy": "2-3 sentence strategic rationale explaining why this campaign will work for the goal and audience",
  "budgetRecommendation": "Recommended budget split and reasoning (e.g. '60% paid social, 30% search, 10% display')",
  "kpis": ["KPI 1 with target metric", "KPI 2 with target metric", "KPI 3 with target metric"],
  "campaigns": [
    {
      "platform": "Platform name (must be one of: ${platforms.join(", ")})",
      "headline": "Compelling, platform-optimised headline (max 10 words)",
      "primaryText": "Full ad copy body text — 3-5 sentences, persuasive, specific to the platform's style and audience mindset",
      "callToAction": "Strong CTA button text (max 5 words)",
      "targetAudience": "Specific audience segment description for this platform",
      "adFormat": "Best ad format for this platform and goal (e.g. 'Carousel', 'Single Image', 'Story', 'Search Text Ad', 'In-Stream Video')",
      "tone": "Tone description (e.g. 'Authoritative & Professional', 'Friendly & Conversational', 'Urgent & Direct')",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
      "proTips": ["Expert tip 1 for maximising performance on this platform", "Expert tip 2"]
    }
  ]
}

Generate one campaign object per platform. Be specific, professional, and tailored. Use real marketing best practices. If the topic is regarding immigration or visas, provide professional marketing copy only, avoiding legal advice.`;

  try {
    const result = await model.generateContent(prompt);
    
    // Check if the response was blocked
    if (!result.response || !result.response.candidates || result.response.candidates.length === 0) {
      throw new Error("Gemini AI blocked the request due to safety filters. Please try rephrasing your goal.");
    }

    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();

    try {
      return JSON.parse(cleaned) as AdCampaignResult;
    } catch (parseError) {
      console.error("JSON Parse Error:", cleaned);
      // Fallback structure if JSON is malformed but we have text
      return {
        summary: `Ad campaign for: ${brief}`,
        overallStrategy: text.slice(0, 200),
        budgetRecommendation: "Distribute budget evenly across selected platforms.",
        kpis: ["Click-through rate > 2%", "Conversion rate > 5%", "Cost per lead < $20"],
        campaigns: platforms.map((platform) => ({
          platform,
          headline: `Grow Your Business with ${companyName || "Us"}`,
          primaryText: `Reach your ${goal.toLowerCase()} goals with a targeted ${platform} campaign designed for your audience.`,
          callToAction: "Get Started Today",
          targetAudience: audience || "General audience",
          adFormat: "Single Image",
          tone: "Professional",
          hashtags: ["#marketing", "#advertising", "#growth"],
          proTips: ["A/B test your headlines", "Use high-contrast visuals"],
        })),
      };
    }
  } catch (apiError: any) {
    console.error("Gemini API Error:", apiError);
    if (apiError.message?.includes("API key not found")) {
      throw new Error("Gemini API Key is invalid or missing in the hosted environment.");
    }
    throw apiError;
  }
}
