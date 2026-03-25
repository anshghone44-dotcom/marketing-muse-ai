import { useState } from "react";
import type { TaskId } from "./AppSidebar";
import type { CompanyData } from "./CompanyForm";
import ResultCard from "./ResultCard";
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
    title: "LeadBot Keyword Engine",
    description:
      "Generate high-precision keyword clusters, long-tail search opportunities, and competitor gap keywords in a single workflow.",
  },
  content: {
    title: "LeadBot Content Studio",
    description: "AI-generated blog posts, landing page copy, social captions, and email sequences.",
  },
  social: {
    title: "LeadBot Social Strategy",
    description: "Platform-specific campaign plans with post ideas, hashtag stacks, and engagement scripts.",
  },
  viral: {
    title: "LeadBot Viral Ideas",
    description: "High-velocity campaign concepts designed for shareability and growth loops.",
  },
  competitor: {
    title: "LeadBot Competitor Analyzer",
    description: "In-depth competitor intelligence, positioning opportunities, and differentiation playbooks.",
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
  const [campaignGoal, setCampaignGoal] = useState("");
  const [taskPrompt, setTaskPrompt] = useState("");

  const adGenerateLabel = campaignGoal.trim() || "Generate";
  const taskGenerateLabel = taskPrompt.trim() || "Generate";

  const taskPromptPlaceholders: Record<TaskId, string> = {
    ads: "Describe your campaign goal...",
    keywords: "Share target audience, industry and focus keywords...",
    content: "Describe the content type and topic (blog, landing page, email)...",
    social: "Share platform, audience and primary engagement objective...",
    viral: "Describe the viral hook, audience emotion and channel...",
    competitor: "Enter competitor name or URL for analysis...",
    engagement: "Share customer segment and engagement goal...",
  };

  return (
    <div className={cn("max-w-5xl mx-auto", isAdCreator ? "bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-border" : "")}>
      <div className={cn("mb-10 text-center", isAdCreator && "bg-white/90 p-8 rounded-2xl shadow-lg border border-border/40") }>
        <h1 className={cn("font-display text-4xl font-bold mb-3", isAdCreator ? "text-slate-900" : "bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent") }>
          {config.title}
        </h1>
        <p className={cn("text-lg max-w-2xl mx-auto leading-relaxed", isAdCreator ? "text-slate-600" : "text-muted-foreground") }>
          {config.description}
        </p>
      </div>

      {activeTask === "ads" && (
        <>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'TikTok', 'Google'].map((platform) => (
              <span
                key={platform}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-white/80 backdrop-blur"
              >
                {platform}
              </span>
            ))}
            <span className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10">
              Goal: Lead Generation
            </span>
          </div>
          <div className="rounded-2xl border border-border/40 bg-white/90 p-5 mb-8 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Campaign goal</label>
            <div className="flex items-center gap-3">
              <input
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/40"
                value={campaignGoal}
                onChange={(e) => setCampaignGoal(e.target.value)}
                placeholder="Describe your campaign goal (e.g. acquire 500 ecommerce leads in 30 days)..."
              />
              <Button
                onClick={() => onGenerate(activeTask)}
                variant="ai"
                className="h-12 px-5 text-sm font-semibold"
              >
                {adGenerateLabel}
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Powering results with Gemini-inspired professional ads format.</p>
          </div>
        </>
      )}
      {activeTask !== "ads" && (
        <div className="rounded-2xl border border-border/40 bg-white/90 p-5 mb-6 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Best prompt for {config.title}</label>
          <div className="flex items-center gap-3">
            <input
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/40"
              value={taskPrompt}
              onChange={(e) => setTaskPrompt(e.target.value)}
              placeholder={taskPromptPlaceholders[activeTask]}
            />
            <Button onClick={() => onGenerate(activeTask)} variant="ai" className="h-12 px-5 text-sm font-semibold">
              {taskGenerateLabel}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Send a clear goal for better AI output quality in {config.title.toLowerCase()}.
          </p>
        </div>
      )}
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
            <div className="w-32 h-32 rounded-3xl bg-primary/10 border border-primary/20" />
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
            className="h-16 px-8 text-lg font-semibold hover:scale-105 transition-all duration-300"
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
