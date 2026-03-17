import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import type { CompanyData } from "./CompanyForm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  platform?: string;
  generatedAd?: string;
}

export const SOCIAL_PLATFORMS = [
  "Instagram",
  "YouTube",
  "TikTok",
  "Facebook",
  "LinkedIn",
  "WhatsApp",
  "Twitter/X",
  "Pinterest",
  "Snapchat",
  "Reddit",
];

interface Props {
  companyData: CompanyData | null;
}

export default function AiAdGeneratorChat({ companyData }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hi! I'm your AI Ad Generator. I can create custom ads for ${companyData?.name || "your company"} across any social media platform. Which platform would you like to create ads for? (Instagram, YouTube, TikTok, Facebook, LinkedIn, WhatsApp, Twitter/X, Pinterest, Snapchat, or Reddit)`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAd = async (userMessage: string, platform: string) => {
    // Simulate AI ad generation
    const adTemplates: Record<string, (data: CompanyData, message: string) => string> = {
      Instagram: (data, msg) =>
        `📸 **Instagram Ad**\n\n🎯 Hook: ${data.audience} - are you ready?\n\n${msg}\n\n✨ Create stunning visuals with product showcase\n📝 Caption: "${data.product} | ${msg.substring(0, 30)}..."\n🔗 CTA: "Link in Bio for Exclusive Offer"\n\n💡 Best Practices:\n• Use trending sounds/music\n• Post Reels (60-90 seconds)\n• Include testimonials & user-generated content`,

      YouTube: (data, msg) =>
        `🎬 **YouTube Ad**\n\nTitle: "${data.product} - ${msg.substring(0, 40)}..."\n\n**Video Script Outline (30-60 seconds):**\n• Hook (0-3s): "${msg.substring(0, 50)}"\n• Problem (3-15s): Address ${data.audience} pain points\n• Solution (15-45s): Show ${data.product} in action\n• CTA (45-60s): "Subscribe & Get [Offer]"\n\n📊 Recommended Format: Tutorial/Demo\n🎯 Targeting: ${data.audience}\n💰 Budget: $10-50/day to start`,

      TikTok: (data, msg) =>
        `🎵 **TikTok Ad**\n\n⏱️ Format: 15-60 second video\n\n**Trending Trend Hook:**\n${msg}\n\n**Scene Breakdown:**\n• Scene 1 (0-3s): Grab attention with ${data.product}\n• Scene 2 (3-8s): Show benefit for ${data.audience}\n• Scene 3 (8-15s): Call to action\n\n✨ Trending Elements:\n• Use trending sounds & hashtags\n• Quick cuts & transitions\n🎭 Tone: Fun, authentic, relatable\n💬 Hashtags: #${data.name.replace(/\\s/g, "")} #${data.industry.replace(/\\s/g, "")} #FYP`,

      Facebook: (data, msg) =>
        `👥 **Facebook Ad**\n\n**Primary Text:**\n"${msg}"\n\n**Headline:** "${data.product} | Limited Time Offer"\n\n**Ad Copy (Full Version):**\nDiscover how ${data.audience} are transforming their ${data.industry.toLowerCase()} with ${data.product}.\n\n${msg}\n\n**CTA Button:** Learn More / Shop Now / Sign Up\n\n📊 Targeting Options:\n• Age: 25-55\n• Interests: ${data.industry}, ${data.product}\n• Audience Type: Lookalike audiences from existing customers`,

      LinkedIn: (data, msg) =>
        `💼 **LinkedIn Ad**\n\n**Headline:**\n"How ${data.audience} Achieve Success with ${data.product}"\n\n**Main Copy:**\n${msg}\n\n**Professional Angle:**\n• Thought leadership content\n• Case studies & statistics\n• B2B value proposition\n• ROI-focused messaging\n\n🎯 Targeting:\n• Job Title: Decision makers\n• Industry: ${data.industry}\n• Company Size: ${data.audience}\n\n📈 Best Format: Sponsored Content or Text Ads`,

      WhatsApp: (data, msg) =>
        `💬 **WhatsApp Business Ad**\n\n**Broadcast Message:**\n"Hi 👋 ${msg}"\n\n**Follow-up Message:**\n"Click here to learn more about ${data.product} →"\n\n📱 Conversation Starters:\n• Special offer for ${data.audience}\n• Quick question: Are you interested in [benefit]?\n• Limited slots available - Reply YES\n\n🔔 Engagement Tips:\n• Keep messages concise (under 160 chars)\n• Use emojis strategically\n• Include direct call buttons\n• Personal touch (No spammy language)`,

      "Twitter/X": (data, msg) =>
        `🐦 **Twitter/X Ad**\n\n**Tweet Copy:**\n"${msg}\n\n#${data.name.replace(/\\s/g, "")} #${data.industry.replace(/\\s/g, "")} #${data.goal.replace(/\\s/g, "")}'"\n\n**Thread Idea (3-5 tweets):**\n1️⃣ Hook: "${msg}"\n2️⃣ Problem: Why ${data.audience} need ${data.product}\n3️⃣ Solution: How it works\n4️⃣ Proof: Results & testimonials\n5️⃣ CTA: Link to offer\n\n🔥 Engagement Tactics:\n• Quote retweets\n• Reply threads\n• Polls & questions`,

      Pinterest: (data, msg) =>
        `📌 **Pinterest Ad**\n\n**Pin Title:** "${data.product} | ${msg.substring(0, 35)}..."\n\n**Pin Description:**\n"${msg}. Learn how ${data.audience} benefit from ${data.product}. Click to discover more."\n\n🎨 Design Guidelines:\n• Vertical format (1000x1500px recommended)\n• Bold, clear typography\n• High-quality product images\n• Use trending colors\n\n🎯 Targeting:\n• Interests: ${data.industry}, lifestyle\n• Keywords: Related to ${data.product}\n📊 Best Time to Post: Tuesday-Friday`,

      Snapchat: (data, msg) =>
        `👻 **Snapchat Ad**\n\n**Snap Format:** Video (15-30 seconds)\n\n**Message:** "${msg}"\n\n**Story Ad Elements:**\n• Eye-catching frame 1 (Product shot)\n• Frame 2: Benefit statement\n• Frame 3: Call to action\n• Swipe-up link (if eligible): [Your Landing Page]\n\n✨ Creative Tips:\n• Use Snapchat filters & AR effects\n• Fast-paced transitions\n• Authentic, unpolished feel\n• Include text overlay`,

      Reddit: (data, msg) =>
        `🤖 **Reddit Ad**\n\n**Title:** "${msg}"\n\n**Ad Copy:**\n"We've helped thousands of ${data.audience} with ${data.product}. This is a limited offer ${msg.substring(0, 30)}... Comment below to learn more!"\n\n🎯 Subreddit Targeting:\n• r/${data.industry.toLowerCase().replace(/\\s/g, "")}\n• r/${data.goal.toLowerCase().replace(/\\s/g, "")}\n• Related interest communities\n\n💡 Best Practices:\n• Be authentic (Reddit users detect spam)\n• Participate in community discussions\n• Avoid overly promotional tone\n• Engage with comments`,
    };

    const template = adTemplates[platform] || adTemplates.Instagram;
    const generatedContent = template(companyData!, userMessage);

    return generatedContent;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedPlatform || !companyData) return;

    const userMessage = inputValue.trim();
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      platform: selectedPlatform,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      generateAd(userMessage, selectedPlatform).then((generatedAd) => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I've created a custom ad for ${selectedPlatform}:`,
          platform: selectedPlatform,
          generatedAd,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsGenerating(false);
      });
    }, 1500);
  };

  const copyAdToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Ad copied to clipboard!");
  };

  if (!companyData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Please submit your company details first.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-md lg:max-w-2xl rounded-lg p-4 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-card border border-border/50 rounded-bl-none"
              }`}
            >
              <p className="text-sm leading-relaxed mb-2">{message.content}</p>
              {message.platform && message.role === "user" && (
                <Badge variant="secondary" className="text-xs">
                  {message.platform}
                </Badge>
              )}
              {message.generatedAd && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="bg-background/50 rounded-md p-3 text-sm whitespace-pre-wrap font-mono text-xs leading-relaxed mb-3">
                    {message.generatedAd}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyAdToClipboard(message.generatedAd!)}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Ad
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-card border border-border/50 rounded-lg rounded-bl-none p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-200" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-400" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <Card className="p-4 bg-card/50 backdrop-blur-xl border border-border/50">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                {SOCIAL_PLATFORMS.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Describe the ad you want to create (e.g., 'Create an ad to promote a summer sale with urgency')..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isGenerating || !selectedPlatform}
              className="flex-1 bg-background/50 border-border/50 focus:border-primary/50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isGenerating || !inputValue.trim() || !selectedPlatform}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-xs text-muted-foreground">Quick suggestions:</span>
            {[
              "Summer sale promo",
              "New product launch",
              "Limited time offer",
              "Customer testimonial",
            ].map((suggestion) => (
              <Button
                key={suggestion}
                size="sm"
                variant="outline"
                onClick={() => {
                  setInputValue(suggestion);
                }}
                disabled={isGenerating || !selectedPlatform}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
