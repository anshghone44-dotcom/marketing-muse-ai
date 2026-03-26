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

      const result = await generateProfessionalViralIdeas(prompt, companyData);
      
      if (typeof result === 'string') {
          return {
              summary: "Viral concepts generated via Lovable AI Gateway.",
              ideas: [{
                  title: "Professional Viral Strategy",
                  description: result,
                  mechanics: "Refer to description",
                  platforms: ["Cross-platform"],
                  whyItWorks: "High-engagement professional framing"
              }]
          };
      }
      return result as ViralCampaignResult;
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
