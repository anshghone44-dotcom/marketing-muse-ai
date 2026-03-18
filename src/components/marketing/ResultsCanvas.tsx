import type { TaskId } from "./AppSidebar";
import type { CompanyData } from "./CompanyForm";
import ResultCard from "./ResultCard";
import AiAdGeneratorChat from "./AiAdGeneratorChat";
import AiKeywordGenerator from "./AiKeywordGenerator";
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
    description:
      "Develop sophisticated ad campaigns featuring interactive elements such as mini quiz ads (e.g., 'Check your Canada PR score in 30 seconds'), poll ads (e.g., 'Which country do you want to move?'), and swipe decision ads (e.g., 'Choose: Study / Work / PR') to engage prospects and drive high-quality lead generation.",
  },
  keywords: {
    title: "Keyword Strategy",
    description: "AI-powered, high-intent, long-tail, and catchy keywords tailored for your brand goals.",
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

  // Show AI Ad Generator Chat for ad creation task
  if (activeTask === "ads") {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-3 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
            {config.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Use the AI ad generator below to create custom ads for your company across any social media platform. Describe what you want, select a platform, and let our AI create professional ads tailored to your needs.
          </p>
        </div>
        <div className="bg-card/30 backdrop-blur-xl rounded-2xl border border-border/50 p-6 shadow-lg">
          <AiAdGeneratorChat companyData={companyData} />
        </div>
      </div>
    );
  }

  // Show AI Keyword Generator for keywords task
  if (activeTask === "keywords") {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-3 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
            {config.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Generate high-quality keywords based on your brand and target audience. Our AI considers factors like lead generation, catchy messaging, and brand awareness to provide you with the best keyword strategy.
          </p>
        </div>
        <AiKeywordGenerator companyData={companyData} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold mb-3 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
          {config.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {config.description}
        </p>
      </div>

      {!hasContent && !isGenerating && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
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
              Regenerate All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
