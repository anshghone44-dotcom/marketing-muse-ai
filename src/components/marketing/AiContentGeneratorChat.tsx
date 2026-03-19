import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check, Sparkles, PenTool, FileText, Layout, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import type { CompanyData } from "./CompanyForm";
import CompanyForm from "./CompanyForm";

const CONTENT_TYPES = [
  { id: "blog", label: "Blog Post", icon: FileText, description: "Detailed articles and thought leadership" },
  { id: "landing", label: "Landing Page Copy", icon: Layout, description: "High-converting web page text" },
  { id: "email", label: "Email Campaign", icon: Mail, description: "Newsletters and sales sequences" },
  { id: "social", label: "Social Caption", icon: MessageSquare, description: "Engaging posts for social platforms" },
  { id: "ad", label: "Ad Copy", icon: Sparkles, description: "Short, punchy text for digital ads" },
];

const TONES = [
  "Professional",
  "Formal",
  "Creative",
  "Persuasive",
  "Playful",
  "Empathetic",
];

interface GeneratedContent {
  id: string;
  type: string;
  title: string;
  body: string;
  tone: string;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

export default function AiContentGeneratorChat({ companyData, onCompanySubmit }: Props) {
  const [formData, setFormData] = useState({
    contentType: "blog",
    tone: "Professional",
    topic: "",
    targetAudience: "",
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateContent = () => {
    if (!formData.topic.trim()) {
      toast.error("Please enter a topic or brief description");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const { contentType, tone, topic } = formData;
      const { name, industry, product, audience } = companyData || {};
      
      const typeLabel = CONTENT_TYPES.find(t => t.id === contentType)?.label || "Content";
      
      let mockBody = "";
      let mockTitle = `${typeLabel}: ${topic}`;

      switch (contentType) {
        case "blog":
          mockBody = `# The Ultimate Guide to ${topic}\n\n*Target Audience:* ${audience || "Professionals"} in ${industry || "the industry"}\n*Reading Time:* 4 minutes\n\n## Introduction\nIn today's fast-paced ${industry || "market"}, businesses like yours are looking for ways to optimize ${product || "their workflow"}. Finding the right approach to ${topic} isn't just a competitive advantage—it's essential for survival. Whether you're a seasoned pro or just starting out, understanding the impact of ${topic} is crucial.\n\n## Why ${topic} Matters for ${audience || "Modern Professionals"}\n\nThe landscape of ${industry || "our industry"} has dramatically shifted over the past three years. Here are the core reasons why paying attention to ${topic} is critical:\n\n1. **Increased Efficiency**: Our data shows that implementing ${name || "a specialized solution"} can reduce overhead by up to 30%, freeing your team to focus on high-impact strategic work.\n2. **Unprecedented Scalability**: As ${topic} evolves, your strategy must adapt. Legacy systems bottleneck growth, whereas modern solutions scale effortlessly with your ambitions.\n3. **Enhanced Customer Experience**: At the end of the day, how you handle ${topic} directly impacts your end users. A streamlined approach ensures maximum satisfaction and retention.\n\n## Actionable Strategies to Implement Today\n\nTransitioning to a new model might seem daunting, but it doesn't have to be. Start by auditing your current processes for ${product || "core tasks"}. Identify the biggest time-sinks and look for automated solutions.\n\n> "The organizations that thrive tomorrow are the ones that embrace ${topic} today."\n\n## Conclusion\nWrapping up, the future of ${industry || "industry innovation"} lies in how we leverage tools and strategies today. Don't wait until your competitors force your hand. Start small, track your metrics, and scale what works.\n\n**Ready to take the next step?**\nDiscover how ${name || "our platform"} can help you master ${topic}. [Click here to learn more](#).`;
          break;
        case "landing":
          mockBody = `---
*Recommended Layout: Modern SaaS or B2B Lead Gen*
---

# Hero Section
**Headline:** Transform Your ${industry || "Business"} with Next-Gen ${topic}
**Sub-headline:** ${topic} is no longer just an option—it's a requirement for ${audience || "success"}. Our ${tone.toLowerCase()} approach ensures you get results without the typical ${industry || "technical"} headaches. Built specifically for ${audience || "teams like yours"}.
**Primary CTA Button:** Start Your Free Trial
**Secondary CTA Button:** Watch 2-Min Demo

---

# Social Proof & Trust Bar
*Logos of 5 industry-leading companies*
*"Trusted by over 10,000 ${audience || "professionals"} worldwide to streamline their ${product || "workflow"}."*

---

# Core Features (3-Column Grid)
### 1. Seamless Integration
Connect with your existing tools in minutes, not months. Our API guarantees zero downtime.
### 2. AI-Powered Insights
Let our models do the heavy lifting for ${topic}. Get predictive analytics that actually make sense.
### 3. Enterprise-Grade Security
Your data is protected by bank-level encryption and 24/7 dedicated support.

---

# Problem/Agitation/Solution Section
**The Problem:** Managing ${topic} manually is draining your team's resources and causing costly errors.
**The Agitation:** Every hour spent on admin tasks is an hour stolen from strategic growth. Competitors using automated ${product || "systems"} are moving 3x faster.
**The Solution:** ${name || "LeadBot"} automates the busywork. We combine powerful logic with an intuitive interface so you can focus on what matters.

---

# Bottom CTA
**Headline:** Ready to revolutionize your approach to ${topic}?
**Sub-headline:** Join thousands of successful ${audience || "users"} today.
**CTA Button:** Get Started for Free (No credit card required)`;
          break;
        case "email":
          mockBody = `---
**Email 1: The "Soft Pitch" / Value Add**
**Subject:** Quick question about your ${topic} strategy
**Preview Text:** I noticed something about your workflow...
---

Hi {{first_name}},

I was looking into ${name || "the latest research"} regarding ${industry || "your industry"} and thought of you. Many ${audience || "industry leaders"} are currently struggling to optimize ${topic}, and I'm curious how you're approaching it at the moment.

We've been helping folks in the ${industry || "business"} sector achieve significantly better results through ${product || "our new tools"}. In fact, one of our clients recently reduced their processing time by 40% just by adjusting how they handle ${topic}.

I put together a quick 1-page cheat sheet on this. Would you like me to send it over?

Best,
The ${name || "LeadBot"} Team

---
**Email 2: Value Delivery & Case Study (Sent 3 days later)**
**Subject:** How [Company X] solved their ${topic} bottleneck
**Preview Text:** As promised, here is the cheat sheet...
---

Hi {{first_name}},

Following up on my last email. Even if you hold off on the cheat sheet, I thought you might find this interesting. 

When [Company X] first approached us, their team was spending 15 hours a week managing ${topic}. By implementing our ${product || "solution"}, they not only eliminated that manual work but also increased their lead conversion rate by 22%.

You can read the full 2-minute breakdown here: [Link to Case Study]

Would you be open to a brief 5-minute chat next week to see if we could do something similar for your team?

Cheers,
The ${name || "LeadBot"} Team`;
          break;
        case "social":
          mockBody = `🚀 Are you ready to level up your ${topic} game?\n\nIn the ${industry || "marketing"} world, staying ahead means embracing ${product || "new tech"}. Here's 3 reasons why ${name || "our solution"} is an absolute game-changer for ${audience || "your team"}:\n\n✅ Automation that actually works (say goodbye to manual data entry)\n✅ Data-driven insights for ${topic} that you can act on immediately\n✅ Built to scale with your growth, not hold it back\n\nStop letting your competitors outpace you. \n\nDouble tap if you agree, and click the link in our bio to see how it works! 💡 \n\n#AI #${industry || "innovation"} #${topic} #BusinessGrowth #TechTrends`;
          break;
        default:
          mockBody = `Generated ${tone} ${typeLabel} about ${topic} for ${name || "your brand"}. Targeted at ${audience || "your customers"} in the ${industry || "industry"}.`;
      }

      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        type: contentType,
        title: mockTitle,
        body: mockBody,
        tone: tone,
      };

      setGeneratedContent([newContent, ...generatedContent]);
      setIsGenerating(false);
      toast.success("Content generated successfully!");
    }, 2000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!companyData) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
          <p className="text-muted-foreground">To use the AI Content Generator, please provide your company details below.</p>
        </div>
        <CompanyForm onSubmit={onCompanySubmit} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Configuration Section */}
      <Card className="p-6 border border-border/50 bg-card/50 backdrop-blur">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <PenTool className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">AI Content Generator</h2>
              <p className="text-sm text-muted-foreground">Expertly crafted copy for any platform</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Type</label>
              <Select value={formData.contentType} onValueChange={(val) => setFormData(p => ({ ...p, contentType: val }))}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4 opacity-70" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Writing Tone</label>
              <Select value={formData.tone} onValueChange={(val) => setFormData(p => ({ ...p, tone: val }))}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map(tone => (
                    <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">What should this content be about?</label>
            <Textarea
              placeholder="e.g., 'The benefits of AI in small business' or 'New product launch event next Friday'"
              value={formData.topic}
              onChange={(e) => setFormData(p => ({ ...p, topic: e.target.value }))}
              className="min-h-24 bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>

          <Button
            onClick={generateContent}
            disabled={isGenerating || !formData.topic.trim()}
            size="lg"
            className="w-full gap-2 font-semibold h-12 shadow-lg hover:shadow-primary/20"
          >
            <Sparkles className="w-5 h-5" />
            {isGenerating ? "Crafting Your Content..." : "Generate AI Content"}
          </Button>
        </div>
      </Card>

      {/* Results Section */}
      {generatedContent.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Generated Drafts
          </h3>
          <div className="grid gap-6">
            {generatedContent.map((content) => (
              <Card key={content.id} className="overflow-hidden border border-border/40 bg-card/30 backdrop-blur-md">
                <div className="p-4 border-b border-border/30 flex items-center justify-between bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="px-2 py-1 rounded bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-wider">
                      {content.type}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium underline underline-offset-4 decoration-primary/30">
                      Tone: {content.tone}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-xs"
                    onClick={() => copyToClipboard(content.body, content.id)}
                  >
                    {copiedId === content.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === content.id ? "Copied" : "Copy All"}
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <h4 className="text-lg font-bold text-foreground">{content.title}</h4>
                  <div className="prose prose-sm prose-invert max-w-none">
                    <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">
                      {content.body}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {generatedContent.length === 0 && !isGenerating && (
        <Card className="p-16 text-center border border-dashed border-border/50 bg-card/20 rounded-3xl">
          <div className="max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <PenTool className="w-8 h-8 text-primary/60" />
            </div>
            <h3 className="text-xl font-bold">Ready to write?</h3>
            <p className="text-muted-foreground">
              Define your topic and tone above to see the power of our AI content engine for <span className="text-foreground font-semibold">{companyData.name}</span>.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
