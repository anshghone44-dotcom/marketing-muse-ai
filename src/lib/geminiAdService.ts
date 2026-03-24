import { supabase } from "@/integrations/supabase/client";

export interface AdCampaign {
  platform: string;
  headline: string;
  primaryText: string;
  callToAction: string;
  targetAudience: string;
  adFormat: string;
  tone: string;
  hashtags: string[];
  proTips: string[];
}

export interface AdCampaignResult {
  summary: string;
  campaigns: AdCampaign[];
  overallStrategy: string;
  budgetRecommendation: string;
  kpis: string[];
}

export async function generateAdCampaigns(
  brief: string,
  platforms: string[],
  goal: string,
  companyName?: string,
  industry?: string,
  product?: string,
  audience?: string
): Promise<AdCampaignResult> {
  const { data, error } = await supabase.functions.invoke('generate-ads', {
    body: {
      brief,
      platforms,
      goal,
      companyName,
      industry,
      product,
      audience,
    },
  });

  if (error) {
    console.error('Edge function error:', error);
    throw new Error(error.message || 'Failed to generate ad campaigns');
  }

  if (data?.error) {
    console.error('Generation error:', data.error);
    throw new Error(data.error);
  }

  return data as AdCampaignResult;
}
