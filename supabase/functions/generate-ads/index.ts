import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brief, platforms, goal, companyName, industry, product, audience } = await req.json();
    
    if (!brief || !platforms || !goal) {
      return new Response(JSON.stringify({ error: 'Missing required parameters: brief, platforms, or goal' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp",
        messages: [
          { role: "system", content: "You are a marketing strategist. Return only valid JSON, no markdown." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'AI gateway error' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

    try {
      const parsed = JSON.parse(cleaned);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch {
      // Basic fallback if JSON parsing fails but we have text
      return new Response(JSON.stringify({
        summary: `Campaign for: ${brief}`,
        overallStrategy: text.slice(0, 200),
        budgetRecommendation: "Distribute across chosen platforms.",
        kpis: ["Clicks", "Conversions", "ROI"],
        campaigns: platforms.map((p: string) => ({
          platform: p,
          headline: "Professional Ad Headline",
          primaryText: text.slice(0, 150),
          callToAction: "Learn More",
          targetAudience: audience || "General",
          adFormat: "Single Image",
          tone: "Professional",
          hashtags: ["#marketing"],
          proTips: ["Test multiple variations"]
        }))
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (e) {
    console.error('generate-ads error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
