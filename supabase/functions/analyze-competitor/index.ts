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
    const { query } = await req.json();
    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing or invalid query parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const prompt = `You are a world-class business intelligence analyst. Analyze the following company and provide detailed, accurate, factual information about it in JSON format only (no markdown, no code blocks, just raw JSON).

Company or URL: "${query}"

If a URL is provided, identify the company behind it.

Return a JSON object with exactly these fields:
{
  "companyName": "Full official company name",
  "industry": "Primary industry / sector",
  "headquarters": "City, Country or State, Country",
  "founded": "Year founded (e.g. '1994')",
  "businessModel": "Short description of how the company makes money (B2B, B2C, SaaS, marketplace, etc.)",
  "targetAudience": "Detailed description of their primary customer segments",
  "keyProducts": ["Product or service 1", "Product or service 2", "Product or service 3"],
  "revenueRange": "Approximate annual revenue or range",
  "employeeCount": "Approximate number of employees",
  "mainCompetitors": ["Competitor 1", "Competitor 2", "Competitor 3"],
  "marketPositioning": "How the company positions itself in the market",
  "recentHighlights": ["Recent strategic move 1", "Recent highlight 2", "Recent highlight 3"],
  "strengths": ["Key strength 1", "Key strength 2", "Key strength 3"],
  "weaknesses": ["Key weakness 1", "Key weakness 2"],
  "opportunities": ["Market opportunity 1", "Market opportunity 2"],
  "threats": ["Market threat 1", "Competitive threat 2"],
  "overallSummary": "A 3-4 sentence executive summary of the company."
}

Be accurate, factual and specific. Do NOT make up data. If some data is truly unknown or private, use reasonable ranges or write 'Undisclosed'.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Failed to call Gemini API', details: errorText }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Strip markdown fences if present
    const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

    try {
      const parsed = JSON.parse(cleaned);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch {
      return new Response(JSON.stringify({
        companyName: query,
        industry: "Unknown", headquarters: "Unknown", founded: "Unknown",
        businessModel: "Unknown", targetAudience: "Unknown", keyProducts: [],
        revenueRange: "Unknown", employeeCount: "Unknown", mainCompetitors: [],
        marketPositioning: "Unknown", recentHighlights: [], strengths: [],
        weaknesses: [], opportunities: [], threats: [],
        overallSummary: text,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (e) {
    console.error('analyze-competitor error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
