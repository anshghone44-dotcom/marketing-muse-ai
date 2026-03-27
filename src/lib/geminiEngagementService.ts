import { supabase } from "@/integrations/supabase/client";
import { CompanyData } from "@/components/marketing/CompanyForm";

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
  const { data, error } = await supabase.functions.invoke('generate-engagement', {
    body: { 
      prompt,
      companyName: companyData?.name,
      industry: companyData?.industry,
      product: companyData?.product,
      audience: companyData?.audience
    }
  });

  if (error) {
    console.error('Engagement generation failed:', error);
    throw new Error(error.message || 'Failed to generate engagement strategies.');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as EngagementResult;
}
