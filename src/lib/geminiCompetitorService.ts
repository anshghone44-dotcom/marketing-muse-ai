import { supabase } from "@/integrations/supabase/client";

export interface CompetitorAnalysis {
  companyName: string;
  industry: string;
  headquarters: string;
  founded: string;
  businessModel: string;
  targetAudience: string;
  keyProducts: string[];
  revenueRange: string;
  employeeCount: string;
  mainCompetitors: string[];
  marketPositioning: string;
  recentHighlights: string[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  overallSummary: string;
}

async function callViaEdgeFunction(query: string): Promise<CompetitorAnalysis> {
  const { data, error } = await supabase.functions.invoke('analyze-competitor', { body: { query } });
  if (error) throw new Error(error.message || 'Edge function error');
  if (data?.error) throw new Error(data.error);
  return data as CompetitorAnalysis;
}

async function callViaGatewayDirect(query: string): Promise<CompetitorAnalysis> {
  const prompt = `You are a world-class business intelligence analyst. Analyze the following company and provide detailed, accurate, factual information about it in JSON format only (no markdown, no code blocks, just raw JSON).

Company or URL: "${query}"

If a URL is provided, identify the company behind it.

Return a JSON object with exactly these fields:
{
  "companyName": "Full official company name",
  "industry": "Primary industry / sector",
  "headquarters": "City, Country or State, Country",
  "founded": "Year founded (e.g. '1994')",
  "businessModel": "Short description of how the company makes money",
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

Be accurate, factual and specific. Do NOT make up data. If unknown, write 'Undisclosed'.`;

  let response: Response;
  try {
    response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-flash-1.5",
        messages: [
          { role: "system", content: "You are a business intelligence analyst. Return only valid JSON, no markdown." },
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
    return JSON.parse(cleaned) as CompetitorAnalysis;
  } catch {
    return {
      companyName: query, industry: "Unknown", headquarters: "Unknown",
      founded: "Unknown", businessModel: "Unknown", targetAudience: "Unknown",
      keyProducts: [], revenueRange: "Unknown", employeeCount: "Unknown",
      mainCompetitors: [], marketPositioning: "Unknown", recentHighlights: [],
      strengths: [], weaknesses: [], opportunities: [], threats: [],
      overallSummary: text,
    };
  }
}

export async function analyzeCompetitor(query: string): Promise<CompetitorAnalysis> {
  try {
    return await callViaEdgeFunction(query);
  } catch (edgeErr) {
    console.warn('Edge function unavailable, falling back to direct gateway:', edgeErr);
    return await callViaGatewayDirect(query);
  }
}
