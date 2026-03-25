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
          mockBody = `# Professional Guide: Mastering ${topic} in ${new Date().getFullYear()}

**Target Audience:** ${audience || "Industry Professionals"}
**Estimated Reading Time:** 6 Minutes
**Tone:** ${tone || "Professional, Authoritative, yet Accessible"}

---

## Executive Summary
The rapid evolution of the ${industry || "business"} sector has forced organizations to rethink how they approach ${topic}. In this comprehensive guide, we explore the fundamental shifts affecting ${audience || "your peers"} and provide actionable strategies to ensure your team remains competitive.

## The State of ${topic}
In recent years, the reliance on outdated processes has become a significant liability. Organizations that fail to adopt advanced ${product || "solutions"} are seeing a steady decline in efficiency. For ${name || "our clients"}, the ability to streamline and automate these workflows is no longer optional—it is a critical driver for sustainable growth.

### Three Key Pillars of Modernization:
1. **Strategic Alignment**: Ensuring your new ${product || "technology"} aligns with overarching business objectives.
2. **Process Automation**: Removing the manual friction involved in administrative tasks, which our data indicates can save up to 40% of weekly operational hours.
3. **Data-Driven Decision Making**: Utilizing intelligent analytics to preemptively address market shifts before they impact the bottom line.

## Implementing the Solution
Deploying a modern approach to ${topic} requires a structured timeline. Leadership must champion the transition, focusing on training and gradual integration rather than disruptive overhauls. 

> *“Innovation distinguishes between a leader and a follower. Adapting to ${topic} determines which side of history your organization will stand on.”*

## Conclusion and Next Steps
The cost of inaction far outweighs the investment in modernization. By adopting a proactive stance on ${topic}, ${audience || "professionals"} can unlock unprecedented scalability. 

**Call to Action:** To discover how ${name || "our specialized platform"} can facilitate this transition for your team, [Schedule a Professional Consultation](#) with our enterprise specialists today.`;
          break;
        case "landing":
          mockBody = `---
**Creative Layout Structure: High-Converting B2B Lead Generation**
---

# [HERO SECTION]
*(Visual: Clean, high-contrast background with abstract, motion-driven 3D elements)*

**Pre-Headline:** THE FUTURE OF ${industry?.toUpperCase() || "BUSINESS"} IS HERE
**Headline:** Unleash Creative Scalability with Next-Generation ${topic}
**Sub-Headline:** Specifically engineered for ${audience || "forward-thinking teams"}. ${name || "LeadBot"} replaces repetitive manual labor with an elegant, ${tone.toLowerCase()} solution that drives measurable ROI from day one.
**Primary CTA:** Start Building for Free (No Credit Card Required)
**Secondary CTA:** Watch the Product Tour (3 Min)

---

# [SOCIAL PROOF BANNER]
*(Visual: Minimalist logos in greyscale)*
**"Empowering over 15,000 ${audience || "innovators"} across the globe to redefine their ${product || "workflow"}."**

---

# [VALUE PROPOSITION / FEATURES]
**Headline:** Why Settle for Average When You Can Dominate?

**Feature 1: Frictionless Integration**
*Icon: Puzzle Piece*
Connect directly into your existing infrastructure. Our robust API and native plugins mean zero downtime and an instant productivity boost.

**Feature 2: AI-Powered ${topic} Insights**
*Icon: Brain with Nodes*
Stop guessing. Our proprietary algorithms analyze millions of data points to provide actionable insights tailored to your unique objectives.

**Feature 3: Uncompromising Security**
*Icon: Shield lock*
Your intellectual property is sacred. We utilize enterprise-grade encryption and comply with global privacy standards to keep your data bulletproof.

---

# [TRANSFORMATION / BEFORE & AFTER]
**The Old Way:** Disjointed communication, lost data, and 20+ hours wasted weekly on manual ${topic}.
**The ${name || "LeadBot"} Way:** Centralized intelligence, automated reporting, and a team that is finally free to focus on strategic, high-impact creative work.

---

# [FINAL CTA SECTION]
*(Visual: Vibrant gradient background matching brand colors)*
**Headline:** Ready to Elevate Your ${industry || "Industry"} Strategy?
**Sub-Headline:** Join the ranks of industry leaders who have already modernized their approach to ${topic}.
**Primary CTA:** Get Started Now — Free for 14 Days`;
          break;
        case "email":
          mockBody = `---
**Campaign Type:** Professional B2B Outreach Sequence
**Objective:** Schedule a discovery call regarding ${topic}
---

### Email 1: The Insightful Introduction
**Subject:** A new approach to ${topic} for {{company_name}}
**Preview Text:** I've been researching your recent expansion in...

Hi {{first_name}},

I've been following {{company_name}}'s recent developments in the ${industry || "market"} sector, and I was particularly impressed by your commitment to innovation. 

In my work with other ${audience || "executives and leaders"}, a recurring challenge is optimizing ${topic} without sacrificing quality or overwhelming the team. We recently developed a unique, ${tone.toLowerCase()} methodology at ${name || "LeadBot"} that directly addresses this by utilizing advanced ${product || "automation techniques"}.

One of our clients in a similar vertical recently saw a 35% reduction in operational bottlenecks within the first month. 

I've prepared a brief, personalized overview showing how this framework could specifically apply to {{company_name}}. Would you be open to a brief 10-minute introduction next Tuesday to discuss it?

Best regards,

**[Your Name]**
*Director of Strategic Partnerships*
${name || "Company Name"}

---
### Email 2: The Value-Add Follow-up (Wait 3 Days)
**Subject:** Re: A new approach to ${topic} for {{company_name}}
**Preview Text:** I meant to include this resource...

Hi {{first_name}},

I'm following up on my previous note. I know how busy things can get for ${audience || "management teams"}, so I want to keep this brief.

I wanted to share a recent case study we published titled *"The Executive's Guide to Modernizing ${topic}."* It formally outlines the exact strategies our top-performing clients use to increase overall throughput by leveraging ${product || "our technology"}.

[Link to Professional Case Study]

If optimizing this area of your business is a priority for this quarter, I'd love to connect. Are you available for a quick chat later this week?

Best regards,
**[Your Name]**`;
          break;
        case "social":
          mockBody = `### Platform: LinkedIn (Professional Formatting)

**Hook:** Is the traditional approach to ${topic} holding your team back in ${new Date().getFullYear()}?

**Body:** 
After analyzing the workflows of over 500 ${industry || "industry"} leaders, the data reveals a stark reality: teams that rely on manual processes are losing an average of 15 hours per week. That is time stolen from strategic innovation.

At ${name || "our organization"}, we believe that technology should empower, not encumber. 

By implementing an automated ${product || "solution"}, our partners have been able to:
🔹 Reduce administrative overhead by 40%
🔹 Scale their operations without proportional headcount increases
🔹 Maintain a rigorous, ${tone.toLowerCase()} standard of quality across all outputs

The future belongs to those who adapt. How is your team addressing the complexities of ${topic} today? 

**Call to Action:** Read our latest comprehensive report on operational modernization at the link in the comments below. 👇

#${industry ? industry.replace(/\\s+/g, '') : "Business"}Strategy #${topic ? topic.replace(/\\s+/g, '') : "Innovation"} #Leadership #Productivity #${name ? name.replace(/\\s+/g, '') : "Tech"}`;
          break;
        case "ad":
          mockBody = `### Ad Variation 1: Problem/Solution (LinkedIn/Facebook)
**Headline:** Stop Wasting Time on Manual ${topic}.
**Primary Text:** For ${audience || "professionals"} in the ${industry || "business"} sector, time is your most valuable asset. Why spend 15+ hours a week managing ${topic} when ${name || "our platform"} can automate it? Gain unparalleled insights, streamline your ${product || "workflow"}, and focus on strategic growth. Built for teams that demand excellence.
**Description:** Discover the ${tone.toLowerCase()} solution trusted by industry leaders.
**Call to Action:** Learn More ->

---
### Ad Variation 2: Social Proof / Metrics (Google Search / Display)
**Headline:** Top Rated ${topic} Solution | ${name || "Brand Name"}
**Primary Text:** Join 10,000+ ${audience || "experts"} who have modernized their approach. Increase efficiency by up to 40% with our advanced ${product || "technologies"}. Secure, scalable, and built for the modern enterprise.
**Description:** Start your 14-day free trial today. Zero commitment.
**Call to Action:** Start Free Trial ->

---
### Ad Variation 3: Direct Offer (Retargeting)
**Headline:** Ready to Master ${topic}? Download the Executive Playbook.
**Primary Text:** You explored our solutions for ${topic}—now see the exact blueprint top companies use to implement it. This comprehensive 20-page guide breaks down the financial and operational benefits of adopting ${product || "our technology"}. 
**Description:** Free professional download tailored for ${industry || "your industry"}.
**Call to Action:** Download Now ->`;
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
