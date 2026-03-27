import { supabase } from "@/integrations/supabase/client";
import { generateProfessionalContent, hasLovableGatewayConfig } from "./lovable-gateway";

export interface ContentSection {
  heading: string;
  content: string;
}

export interface GeneratedContent {
  title: string;
  metaDescription: string;
  sections: ContentSection[];
  cta: {
    text: string;
    subtext: string;
  };
}

function normalizeContentResult(response: any, topic: string): GeneratedContent {
  try {
    const cleaned = typeof response === 'string'
      ? response.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim()
      : JSON.stringify(response);
      
    const parsed = JSON.parse(cleaned);
    return {
      title: parsed.title || topic,
      metaDescription: parsed.metaDescription || "Professional marketing content generated via Gemini.",
      sections: Array.isArray(parsed.sections) ? parsed.sections : [{ heading: "Content Overview", content: typeof response === 'string' ? response : JSON.stringify(response) }],
      cta: parsed.cta || { text: "Learn More", subtext: "Contact us today" }
    };
  } catch (parseErr) {
    console.warn("Failed to parse content JSON:", parseErr);
    return {
      title: topic,
      metaDescription: "Professional marketing content generated via Gemini.",
      sections: [{ heading: "Content Overview", content: typeof response === 'string' ? response : JSON.stringify(response) }],
      cta: { text: "Learn More", subtext: "Contact us today" }
    };
  }
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

      const response = await generateProfessionalContent(topic, contentType, tone, companyData);
      return normalizeContentResult(response, topic);
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

  return normalizeContentResult(data, topic);
}
