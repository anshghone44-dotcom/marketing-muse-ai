import { supabase } from "@/integrations/supabase/client";
import type { CompanyData } from "@/components/marketing/CompanyForm";

export interface VisualAdResult {
  templateId: string;
  headline: string;
  body: string;
  cta: string;
  logoPosition: string;
  textAlign: string;
  overlayStrength: number;
  overlayColor: string;
  campaignObjective: string;
  visualDirection: string;
}

export async function callVisualAdGateway(
  userRequest: string,
  companyData: CompanyData | null
): Promise<VisualAdResult> {
  const { data, error } = await supabase.functions.invoke("generate-visual-ad", {
    body: {
      userRequest,
      companyName: companyData?.name || "",
      industry: companyData?.industry || "",
      product: companyData?.product || "",
      audience: companyData?.audience || "",
      tone: companyData?.tone || "",
      goal: companyData?.goal || "",
    },
  });

  if (error) throw new Error(error.message || "Edge function error");
  if (data?.error) throw new Error(data.error);

  return {
    templateId: data.templateId ?? "instagram-square",
    headline: data.headline ?? "Your Headline Here",
    body: data.body ?? "Your supporting body text goes here.",
    cta: data.cta ?? "Learn More",
    logoPosition: data.logoPosition ?? "top-left",
    textAlign: data.textAlign ?? "center",
    overlayStrength: Number(data.overlayStrength) || 55,
    overlayColor: data.overlayColor ?? "#0f172a",
    campaignObjective: data.campaignObjective ?? "",
    visualDirection: data.visualDirection ?? "",
  };
}
