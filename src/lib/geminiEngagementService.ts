import { supabase } from "@/integrations/supabase/client";
import { CompanyData } from "@/components/marketing/CompanyForm";
import { generateProfessionalEngagement, hasLovableGatewayConfig } from "./lovable-gateway";

export interface EngagementStrategy {
  title: string;
  description: string;
  implementation: string;
  benefit: string;
  difficulty: string;
}

export interface EngagementResult {
  summary: string;
  strategies: EngagementStrategy[];
}

export async function generateEngagementStrategies(prompt: string, companyData: CompanyData | null): Promise<EngagementResult> {
  // 1. Try Lovable AI Gateway First (Unified Strategy)
  if (hasLovableGatewayConfig()) {
    try {
      const response = await generateProfessionalEngagement(prompt, companyData);
      
      try {
        const cleaned = typeof response === 'string'
          ? response.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim()
          : JSON.stringify(response);
          
        const parsed = JSON.parse(cleaned);
        return {
          summary: parsed.summary || "Audience engagement strategies generated.",
          strategies: Array.isArray(parsed.strategies) ? parsed.strategies : []
        };
      } catch (parseErr) {
        console.warn("Failed to parse engagement JSON:", parseErr);
        return {
          summary: "Audience engagement strategies.",
          strategies: [{
            title: "Community Outreach",
            description: typeof response === 'string' ? response : JSON.stringify(response),
            implementation: "Refer to description",
            benefit: "High retention",
            difficulty: "Medium"
          }]
        };
      }
    } catch (err) {
      console.warn("Lovable gateway failed, falling back to edge function:", err);
    }
  }

  // 2. Fallback to Supabase Edge Function
  try {
    const { data, error } = await supabase.functions.invoke('generate-engagement', {
      body: { 
        prompt,
        companyName: companyData?.name,
        industry: companyData?.industry,
        product: companyData?.product,
        audience: companyData?.audience
      }
    });

    if (error) throw new Error(error.message || 'Edge function error');
    return data as EngagementResult;
  } catch (err) {
    console.error('Engagement generation failed:', err);
    throw new Error('Failed to generate engagement strategies. Please try again.');
  }
}
