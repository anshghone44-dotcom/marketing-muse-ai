import { supabase } from "@/integrations/supabase/client";

export interface GeneratedContent {
  title: string;
  body: string;
}

export async function generateMarketingContent(
  topic: string,
  contentType: string,
  tone: string,
  companyName?: string,
  industry?: string,
  product?: string,
  audience?: string
): Promise<GeneratedContent> {
  const { data, error } = await supabase.functions.invoke('generate-content', {
    body: { topic, contentType, tone, companyName, industry, product, audience },
  });

  if (error) {
    console.error('Edge function error:', error);
    throw new Error(error.message || 'Failed to generate content');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as GeneratedContent;
}
