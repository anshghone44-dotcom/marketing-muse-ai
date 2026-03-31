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
    const { userRequest, companyName, industry, product, audience, tone, goal } = await req.json();

    if (!userRequest) {
      return new Response(JSON.stringify({ error: 'Missing required parameter: userRequest' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const brandContext = [
      companyName ? `Brand: ${companyName}.` : '',
      product ? `Product/Service: ${product}.` : '',
      audience ? `Target Audience: ${audience}.` : '',
      industry ? `Industry: ${industry}.` : '',
      tone ? `Tone: ${tone}.` : '',
      goal ? `Goal: ${goal}.` : '',
    ].filter(Boolean).join(' ');

    const prompt = `You are an expert copywriter, creative director, and layout designer for digital advertising.
The user will describe an ad they want. You will generate structured ad content.
${brandContext}
User request: "${userRequest}"

IMPORTANT: Respond ONLY with a raw JSON object — no markdown fences, no extra text.
The JSON must have exactly these fields:
{
  "templateId": "instagram-square | facebook-feed | linkedin-banner | story | youtube-thumb",
  "headline": "Short punchy headline (max 10 words)",
  "body": "Supporting tagline or body text (max 20 words)",
  "cta": "Call-to-action button label (2-5 words)",
  "logoPosition": "top-left | top-right | top-center | bottom-left | bottom-right",
  "textAlign": "left | center | right",
  "overlayStrength": <number 30-75>,
  "overlayColor": "<hex color like #0f172a>",
  "campaignObjective": "One sentence describing the campaign goal",
  "visualDirection": "Brief description of the visual mood and layout"
}

Choose templateId based on the platform mentioned (e.g. Instagram → instagram-square, Facebook → facebook-feed, LinkedIn → linkedin-banner, Story → story, YouTube → youtube-thumb).
Keep it professional, persuasive, and campaign-ready.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a professional ad creative director. Respond ONLY with a raw JSON object — no markdown fences, no explanation." },
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
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("No JSON found");
      const parsed = JSON.parse(cleaned.slice(start, end + 1));
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch {
      return new Response(JSON.stringify({
        templateId: "instagram-square",
        headline: "Your Professional Ad",
        body: "Compelling copy generated for your campaign.",
        cta: "Learn More",
        logoPosition: "top-left",
        textAlign: "center",
        overlayStrength: 55,
        overlayColor: "#0f172a",
        campaignObjective: "Drive engagement and conversions",
        visualDirection: "Clean, professional layout"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (e) {
    console.error('generate-visual-ad error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
