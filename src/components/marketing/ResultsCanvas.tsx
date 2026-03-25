import type { TaskId } from "./AppSidebar";
import type { CompanyData } from "./CompanyForm";
import ResultCard from "./ResultCard";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    title: "LeadBot Ad Creator",
    description: "Describe your campaign goal and let Isaac AI craft professional ad copy for every platform.",
  },
  keywords: {
    title: "Campaign Keyword Specialist",
    description:
      "Provide your campaign details or upload documents to generate high-precision keyword clusters tailored for your industry.",
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
  const isAdCreator = activeTask === "ads";

  return (
    <div className={cn("max-w-5xl mx-auto", isAdCreator ? "bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-border" : "")}>
      <div className={cn("mb-10 text-center", isAdCreator && "bg-white/90 p-8 rounded-2xl shadow-lg border border-border") }>
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl ai-gradient mb-6 glow animate-pulse-glow">
          <Sparkles className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className={cn("font-display text-4xl font-bold mb-3", isAdCreator ? "text-slate-900" : "bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent") }>
          {config.title}
        </h1>
        <p className={cn("text-lg max-w-2xl mx-auto leading-relaxed", isAdCreator ? "text-slate-600" : "text-muted-foreground") }>
          {config.description}
        </p>
      </div>

      {activeTask === "keywords" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-foreground mb-2">AI Keyword Agent</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Generate high-intent, long-tail, and trending keyword clusters in one click,
              optimized for your selected industry and audience.
            </p>
          </div>
          <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-foreground mb-2">Keyword Intelligence Agent</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get competitor gap keywords and search intent insights based on real-world search behavior
              so you can outrank rivals with content that converts.
            </p>
          </div>
        </div>
      )}

      {!hasContent && !isGenerating && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-3xl ai-gradient flex items-center justify-center glow animate-float">
              <Sparkles className="h-16 w-16 text-primary-foreground" />
            </div>
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl animate-pulse" />
          </div>
          <h3 className="font-display font-bold text-2xl mb-3 text-foreground">
            Ready to Generate Content
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md text-lg leading-relaxed">
            Click below to generate {config.title.toLowerCase()} tailored for{" "}
            <span className="font-semibold text-primary">{companyData?.name}</span>
          </p>
          <Button
            variant="ai"
            size="lg"
            onClick={() => onGenerate(activeTask)}
            className="h-16 px-8 text-lg font-semibold glow hover:scale-105 transition-all duration-300"
          >
            <Sparkles className="h-6 w-6 mr-3" />
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
  );
}
