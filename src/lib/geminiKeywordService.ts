import { supabase } from "@/integrations/supabase/client";
import { generateProfessionalKeywords, hasLovableGatewayConfig } from "./lovable-gateway";

export interface KeywordCluster {
  factor: string;
  keywords: string[];
}

export interface KeywordResult {
  summary: string;
  clusters: KeywordCluster[];
}

export async function generateKeywords(
  prompt: string,
  factors: string[],
  companyName?: string,
  industry?: string,
  product?: string,
  audience?: string
): Promise<KeywordResult> {
  // If Lovable Gateway is configured, use it for professional results
  if (hasLovableGatewayConfig()) {
    try {
      const companyData = companyName ? {
        name: companyName,
        industry: industry || "",
        product: product || "",
        audience: audience || "",
        goal: "SEO Optimization",
        tone: "Professional",
        platforms: ["SEO", "SEM"],
        competitors: ""
      } : null;

      const response = await generateProfessionalKeywords(prompt, factors, companyData);
      
      try {
        const cleaned = typeof response === 'string' 
          ? response.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim()
          : JSON.stringify(response);
          
        const parsed = JSON.parse(cleaned);
        return {
          summary: parsed.summary || "Professional keyword strategy generated.",
          clusters: Array.isArray(parsed.clusters) ? parsed.clusters : []
        };
      } catch (parseErr) {
        console.warn("Failed to parse keyword JSON, returned raw content:", parseErr);
        return {
          summary: "Professional keyword strategy.",
          clusters: [{ factor: "Results", keywords: [typeof response === 'string' ? response : JSON.stringify(response)] }]
        };
      }
    } catch (err) {
      console.warn("Lovable gateway failed, falling back to edge function:", err);
    }
  }

  const { data, error } = await supabase.functions.invoke('generate-keywords', {
    body: { prompt, factors, companyName, industry, product, audience },
  });

  if (error) {
    console.error('Edge function error:', error);
    throw new Error(error.message || 'Failed to generate keywords');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as KeywordResult;
}
