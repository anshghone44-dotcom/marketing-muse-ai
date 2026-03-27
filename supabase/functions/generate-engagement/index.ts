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
      return new Response(JSON.stringify({ error: 'Missing prompt' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a world-class audience engagement strategist. Generate 3 unique, professional engagement strategies based on the user's objective. Return ONLY raw JSON with no markdown.

Company: ${companyName || "Not specified"}
Industry: ${industry || "Not specified"}
Product: ${product || "Not specified"}
Audience: ${audience || "General audience"}

Return this exact JSON structure:
{
  "summary": "Strategic overview of audience growth",
  "strategies": [
    {
      "title": "Strategy Name",
      "description": "High-level concept",
      "implementation": "Step-by-step execution",
      "benefit": "Primary outcome",
      "difficulty": "Low/Medium/High"
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
        model: "google/gemini-flash-1.5",
        messages: [
          { role: "system", content: "You are an engagement strategist. Return only valid JSON, no markdown." },
          { role: "user", content: `Objective: ${userPrompt}\n\n${systemPrompt}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `AI gateway error: ${response.status}` }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

    return new Response(JSON.stringify(JSON.parse(cleaned)), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
