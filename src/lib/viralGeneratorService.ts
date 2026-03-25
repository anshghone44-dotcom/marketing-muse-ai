import { supabase } from "@/integrations/supabase/client";

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
