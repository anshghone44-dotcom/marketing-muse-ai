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
    const { prompt: userPrompt, companyName, industry, product, audience } = await req.json();
    
    if (!userPrompt) {
      return new Response(JSON.stringify({ error: 'Missing user prompt' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a world-class viral marketing architect. Generate 3 unique, professional, high-impact viral campaign ideas based on the user's goal. Return ONLY raw JSON with no markdown.

Company: ${companyName || "Not specified"}
Industry: ${industry || "Not specified"}
Product: ${product || "Not specified"}
Audience: ${audience || "General audience"}

Return this exact JSON structure:
{
  "summary": "Overall strategy overview",
  "ideas": [
    {
      "title": "Compelling campaign name",
      "description": "High-level campaign concept (2-3 sentences)",
      "mechanics": "Step-by-step how the viral loop works",
      "prize": "Incentive or prize (if applicable)",
      "platforms": ["Platform 1", "Platform 2"],
      "whyItWorks": "Psychological or strategic reason for virality"
    }
  ]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a viral marketing strategist. Return only valid JSON, no markdown." },
          { role: "user", content: `Goal: ${userPrompt}\n\n${systemPrompt}` },
        ],
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }), {
        status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'AI gateway error' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

    const parsed = JSON.parse(cleaned);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (e) {
    console.error('generate-viral-ideas error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
