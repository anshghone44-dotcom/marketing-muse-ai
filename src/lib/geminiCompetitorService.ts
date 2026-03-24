import { supabase } from "@/integrations/supabase/client";

export interface CompetitorAnalysis {
  companyName: string;
  industry: string;
  headquarters: string;
  founded: string;
  businessModel: string;
  targetAudience: string;
  keyProducts: string[];
  revenueRange: string;
  employeeCount: string;
  mainCompetitors: string[];
  marketPositioning: string;
  recentHighlights: string[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  overallSummary: string;
}

export async function analyzeCompetitor(query: string): Promise<CompetitorAnalysis> {
  const { data, error } = await supabase.functions.invoke('analyze-competitor', {
    body: { query },
  });

  if (error) {
    console.error('Edge function error:', error);
    throw new Error('Failed to analyze competitor');
  }

  if (data?.error) {
    console.error('Analysis error:', data.error);
    throw new Error(data.error);
  }

  return data as CompetitorAnalysis;
}
