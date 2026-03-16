import type { TaskId } from "./AppSidebar";
import type { CompanyData } from "./CompanyForm";
import ResultCard from "./ResultCard";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GeneratedContent {
  [key: string]: string[];
}

interface Props {
  activeTask: TaskId;
  companyData: CompanyData | null;
  generatedContent: GeneratedContent;
  isGenerating: boolean;
  onGenerate: (task: TaskId) => void;
  onRegenerate: (task: TaskId, index: number) => void;
}

const TASK_CONFIG: Record<TaskId, { title: string; description: string }> = {
  ads: {
    title: "Ad Campaign Ideas",
    description: "Headlines, ad copy, CTAs, visual concepts, and emotional hooks",
  },
  keywords: {
    title: "Keyword Strategy",
    description: "High-intent, long-tail, trending, and competitor gap keywords",
  },
  content: {
    title: "Content Generation",
    description: "Blog ideas, landing page copy, social captions, email campaigns",
  },
  social: {
    title: "Social Media Strategy",
    description: "Platform-specific strategies with post ideas, hashtags, and engagement tactics",
  },
  viral: {
    title: "Viral Campaign Ideas",
    description: "Creative concepts to maximize brand visibility and sharing",
  },
  competitor: {
    title: "Competitor Analysis",
    description: "Competitive insights and differentiation strategies",
  },
  engagement: {
    title: "Customer Engagement",
    description: "Methods to attract users, increase shares, and convert followers",
  },
};

export default function ResultsCanvas({
  activeTask,
  companyData,
  generatedContent,
  isGenerating,
  onGenerate,
  onRegenerate,
}: Props) {
  const config = TASK_CONFIG[activeTask];
  const content = generatedContent[activeTask] || [];
  const hasContent = content.length > 0;

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold">{config.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
        </div>

        {!hasContent && !isGenerating && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl ai-gradient flex items-center justify-center mb-4">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">
              Ready to generate
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Click below to generate {config.title.toLowerCase()} for{" "}
              <span className="font-medium text-foreground">{companyData?.name}</span>
            </p>
            <Button variant="ai" size="lg" onClick={() => onGenerate(activeTask)}>
              <Sparkles className="h-4 w-4" />
              Generate {config.title}
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <ResultCard key={i} title="" content="" isLoading />
            ))}
          </div>
        )}

        {hasContent && !isGenerating && (
          <div className="grid gap-4">
            {content.map((item, i) => (
              <ResultCard
                key={i}
                title={`${config.title} #${i + 1}`}
                content={item}
                onRegenerate={() => onRegenerate(activeTask, i)}
              />
            ))}
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={() => onGenerate(activeTask)}>
                <Sparkles className="h-4 w-4" />
                Regenerate All
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
