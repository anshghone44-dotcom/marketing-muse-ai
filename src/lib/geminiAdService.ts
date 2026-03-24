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
  let invocationResult;
  try {
    invocationResult = await supabase.functions.invoke('generate-ads', {
      body: {
        brief,
        platforms,
        goal,
        companyName: companyName?.trim() ?? "",
        industry: industry?.trim() ?? "",
        product: product?.trim() ?? "",
        audience: audience?.trim() ?? "",
      },
    });
  } catch (invokeError) {
    console.error('Supabase edge function invocation failed:', invokeError);
    throw new Error(
      invokeError instanceof Error
        ? `Failed to call Edge Function: ${invokeError.message}`
        : 'Failed to call Edge Function: unknown error'
    );
  }

  const { data, error } = invocationResult;

  if (error) {
    console.error('Edge function error details:', error);

    const details =
      typeof error === 'object' && error !== null && 'status' in error && 'message' in error
        ? `${(error as { status?: number; message?: string }).status ?? ''} ${(error as { status?: number; message?: string }).message ?? ''}`.trim()
        : (error as Error).message ?? 'Unknown error';

    throw new Error(`Edge Function error (${details || 'Unknown'}): Failed to generate ad campaigns`);
  }

  if (!data) {
    throw new Error('Edge Function returned no data. Please check the backend route and deployment.');
  }

  if (typeof data === 'object' && data !== null && 'error' in data && (data as { error: unknown }).error) {
    const dataError = (data as { error: string }).error;
    console.error('Generation error:', dataError);
    throw new Error(typeof dataError === 'string' ? dataError : 'Unknown generation error');
  }

  return data as AdCampaignResult;
}
