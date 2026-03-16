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
    <div className="h-full overflow-y-auto p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900/40 p-5">
          <h1 className="font-display text-2xl font-bold text-white">{config.title}</h1>
          <p className="mt-1 text-sm text-slate-300">{config.description}</p>
        </div>

        {!hasContent && !isGenerating && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-slate-900/30 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ai-gradient">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="mb-2 font-display text-lg font-semibold text-white">
              Ready to generate
            </h3>
            <p className="mb-6 max-w-sm text-sm text-slate-300">
              Click below to generate {config.title.toLowerCase()} for{" "}
              <span className="font-medium text-white">{companyData?.name}</span>
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
              <Button variant="outline" className="border-white/20 bg-white/5 text-slate-100 hover:bg-white/10" onClick={() => onGenerate(activeTask)}>
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
