import { supabase } from "@/integrations/supabase/client";
import { generateProfessionalViralIdeas, hasLovableGatewayConfig } from "./lovable-gateway";

export interface ViralCampaign {
  title: string;
  description: string;
  mechanics: string;
  prize?: string;
  platforms: string[];
  whyItWorks: string;
}

export interface ViralCampaignResult {
  summary: string;
  ideas: ViralCampaign[];
}

export async function generateViralIdeas(
  prompt: string,
  companyName?: string,
  industry?: string,
  product?: string,
  audience?: string
): Promise<ViralCampaignResult> {
  if (hasLovableGatewayConfig()) {
    try {
      const companyData = companyName ? {
        name: companyName,
        industry: industry || "",
        product: product || "",
        audience: audience || "",
        goal: "Viral Growth",
        tone: "Engaging",
        platforms: ["Social Media"],
        competitors: ""
      } : null;

      const response = await generateProfessionalViralIdeas(prompt, companyData);
      
      try {
        const cleaned = typeof response === 'string'
          ? response.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim()
          : JSON.stringify(response);
          
        const parsed = JSON.parse(cleaned);
        return {
          summary: parsed.summary || "Viral concepts generated via Gemini.",
          ideas: Array.isArray(parsed.ideas) ? parsed.ideas : []
        };
      } catch (parseErr) {
        console.warn("Failed to parse viral JSON:", parseErr);
        return {
          summary: "Viral concepts generated via Gemini.",
          ideas: [{
              title: "Professional Viral Strategy",
              description: typeof response === 'string' ? response : JSON.stringify(response),
              mechanics: "Refer to description",
              platforms: ["Cross-platform"],
              whyItWorks: "Professional framing"
          }]
        };
      }
    } catch (err) {
      console.warn("Lovable gateway failed, falling back to edge function:", err);
    }
  }

  const { data, error } = await supabase.functions.invoke('generate-viral-ideas', {
    body: { prompt, companyName, industry, product, audience },
  });

  if (error) {
    console.error('Edge function error:', error);
    throw new Error(error.message || 'Failed to generate viral ideas');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as ViralCampaignResult;
}
