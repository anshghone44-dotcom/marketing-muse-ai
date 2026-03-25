import { supabase } from "@/integrations/supabase/client";

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
