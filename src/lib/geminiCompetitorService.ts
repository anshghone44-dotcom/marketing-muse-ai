import { GoogleGenerativeAI } from "@google/generative-ai";

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

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export async function analyzeCompetitor(query: string): Promise<CompetitorAnalysis> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
  "keyProducts": ["Product or service 1", "Product or service 2", "Product or service 3", "..."],
  "revenueRange": "Approximate annual revenue or range (e.g. '$394B+', '$1B–$5B', 'Private / undisclosed')",
  "employeeCount": "Approximate number of employees (e.g. '160,000+', '5,000–10,000')",
  "mainCompetitors": ["Competitor 1", "Competitor 2", "Competitor 3"],
  "marketPositioning": "How the company positions itself in the market",
  "recentHighlights": ["Recent strategic move or product launch 1", "Recent highlight 2", "Recent highlight 3"],
  "strengths": ["Key strength 1", "Key strength 2", "Key strength 3"],
  "weaknesses": ["Key weakness 1", "Key weakness 2"],
  "opportunities": ["Market opportunity 1", "Market opportunity 2"],
  "threats": ["Market threat 1", "Competitive threat 2"],
  "overallSummary": "A 3–4 sentence executive summary of the company covering its history, market position, business model, and outlook."
}

Be accurate, factual and specific. Do NOT make up data. If some data is truly unknown or private, use reasonable ranges or write 'Undisclosed'.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Strip any markdown fences if present
  const cleaned = text.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned) as CompetitorAnalysis;
    return parsed;
  } catch {
    // If parse fails, return a minimal fallback with the raw text as summary
    return {
      companyName: query,
      industry: "Unknown",
      headquarters: "Unknown",
      founded: "Unknown",
      businessModel: "Unknown",
      targetAudience: "Unknown",
      keyProducts: [],
      revenueRange: "Unknown",
      employeeCount: "Unknown",
      mainCompetitors: [],
      marketPositioning: "Unknown",
      recentHighlights: [],
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
      overallSummary: text,
    };
  }
}
