import { supabase } from "@/integrations/supabase/client";
import { generateProfessionalContent, hasLovableGatewayConfig } from "./lovable-gateway";

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
  if (hasLovableGatewayConfig()) {
    try {
      const companyData = companyName ? {
        name: companyName,
        industry: industry || "",
        product: product || "",
        audience: audience || "",
        goal: "Content Marketing",
        tone: tone || "Professional",
        platforms: ["Content"],
        competitors: ""
      } : null;

      const result = await generateProfessionalContent(topic, contentType, tone, companyData);
      
      if (typeof result === 'string') {
          return {
              title: "Professional Content Generated",
              body: result
          };
      }
      return result as GeneratedContent;
    } catch (err) {
      console.warn("Lovable gateway failed, falling back to edge function:", err);
    }
  }

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
