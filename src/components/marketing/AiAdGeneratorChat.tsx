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
import { Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { CompanyData } from "./CompanyForm";
import CompanyForm from "./CompanyForm";

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

interface VisualAd {
  id: string;
  platform: string;
  headline: string;
  description: string;
  callToAction: string;
  backgroundColor: string;
  accentColor: string;
  adCopy: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  videoScript?: string;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

export default function AiAdGeneratorChat({ companyData, onCompanySubmit }: Props) {
  const [formData, setFormData] = useState({
    platforms: [] as string[],
    adObjective: "awareness",
    callToAction: "Learn More",
    adStyle: "modern",
    targetMessage: "",
  });
  const [generatedAds, setGeneratedAds] = useState<VisualAd[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateVisualAds = (platforms: string[], objective: string, message: string) => {
    const colorSchemes: Record<string, { bg: string; accent: string }> = {
      Instagram: { bg: "from-pink-50 to-purple-50", accent: "from-pink-500 to-purple-500" },
      YouTube: { bg: "from-red-50 to-orange-50", accent: "from-red-500 to-orange-500" },
      TikTok: { bg: "from-blue-50 to-pink-50", accent: "from-blue-500 to-pink-500" },
      Facebook: { bg: "from-blue-50 to-indigo-50", accent: "from-blue-600 to-indigo-600" },
      LinkedIn: { bg: "from-blue-50 to-slate-50", accent: "from-blue-700 to-slate-700" },
      WhatsApp: { bg: "from-green-50 to-emerald-50", accent: "from-green-500 to-emerald-500" },
      "Twitter/X": { bg: "from-slate-50 to-gray-50", accent: "from-black to-gray-800" },
      Pinterest: { bg: "from-red-50 to-pink-50", accent: "from-red-600 to-pink-600" },
      Snapchat: { bg: "from-yellow-50 to-amber-50", accent: "from-yellow-400 to-amber-500" },
      Reddit: { bg: "from-orange-50 to-red-50", accent: "from-orange-600 to-red-600" },
    };

    const objectiveHeadlines: Record<string, string> = {
      awareness: `Discover ${companyData?.product || "Our Solution"}`,
      engagement: `Connect with ${companyData?.audience || "Your Audience"}`,
      conversion: `Get ${companyData?.product || "Started"} Today`,
      retention: `Stay Ahead with ${companyData?.product || "Premium Features"}`,
    };

    const makePlatformCopy = (platform: string) => {
      const base = message || `Transform your ${companyData?.industry || "business"} with ${companyData?.product || "our solution"}`;
      const callToAction = formData.callToAction;

      const videoScript = (intro: string, hook: string, close: string) =>
        `🎬 Video Script\n\n1) Intro (0-5s): ${intro}\n2) Hook (5-15s): ${hook}\n3) Call to action (15-30s): ${close}`;

      switch (platform) {
        case "YouTube":
          return {
            mediaType: "video" as const,
            mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
            adCopy: videoScript(
              `Introduce ${companyData?.name || "your brand"} with a strong value prop.`, 
              base,
              `Ask viewers to click ${callToAction} to learn more.`
            ),
            videoScript: videoScript(
              `Introduce ${companyData?.name || "your brand"} with a strong value prop.`, 
              base,
              `Ask viewers to click ${callToAction} to learn more.`
            ),
            description: `A short, attention-grabbing video spot for YouTube.`,
          };
        case "TikTok":
          return {
            mediaType: "video" as const,
            mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
            adCopy: `${base} \n\n🎵 Think fast-paced, authentic footage with a quick call to action: ${callToAction}.`,
            videoScript: videoScript(
              `Start with a relatable problem in a fun tone.`, 
              base,
              `End with a trendy prompt & ${callToAction}.`
            ),
            description: `A short vertical video ad formatted for TikTok viewers.`,
          };
        case "Instagram":
          return {
            mediaType: "image" as const,
            mediaUrl: `https://source.unsplash.com/600x400/?${companyData?.industry || "business"},${platform}`,
            adCopy: `${base} \n\nUse bold visuals and concise text to drive attention.`,
            description: `A polished visual ad designed for Instagram feeds and stories.`,
          };
        case "Facebook":
          return {
            mediaType: "image" as const,
            mediaUrl: `https://source.unsplash.com/600x400/?${companyData?.industry || "business"},${platform}`,
            adCopy: `${base} \n\nCombine a relatable message with a clear ${callToAction} button.`,
            description: `A scroll-stopping image ad tailored to Facebook audiences.`,
          };
        case "LinkedIn":
          return {
            mediaType: "image" as const,
            mediaUrl: `https://source.unsplash.com/600x400/?business,professional,${platform}`,
            adCopy: `${base} \n\nPosition your product as the smart choice for professionals.`,
            description: `A professional ad format that resonates with LinkedIn decision-makers.`,
          };
        case "WhatsApp":
          return {
            mediaType: "image" as const,
            mediaUrl: `https://source.unsplash.com/600x400/?chat,${platform}`,
            adCopy: `${base} \n\nUse conversational tone and a direct ask to ${callToAction}.`,
            description: `A chat-style campaign idea for WhatsApp Broadcasts or Status updates.`,
          };
        case "Twitter/X":
          return {
            mediaType: "image" as const,
            mediaUrl: `https://source.unsplash.com/600x400/?${companyData?.industry || "business"},${platform}`,
            adCopy: `${base} \n\nCraft a concise headline and use relevant hashtags.`,
            description: `A crisp, shareable ad concept for Twitter/X.`,
          };
        case "Pinterest":
          return {
            mediaType: "image" as const,
            mediaUrl: `https://source.unsplash.com/600x400/?design,${platform}`,
            adCopy: `${base} \n\nFocus on aspirational imagery and a strong ${callToAction}.`,
            description: `A visual-first idea optimized for Pinterest boards.`,
          };
        case "Snapchat":
          return {
            mediaType: "image" as const,
            mediaUrl: `https://source.unsplash.com/600x400/?snapchat,${companyData?.industry || "business"}`,
            adCopy: `${base} \n\nKeep it quick, playful, and full-screen ready.`,
            description: `A vertical-like style ad that matches Snapchat's immersive experience.`,
          };
        case "Reddit":
          return {
            mediaType: "image" as const,
            mediaUrl: `https://source.unsplash.com/600x400/?community,${platform}`,
            adCopy: `${base} \n\nUse an authentic voice and tie into subreddit interests.`,
            description: `A community-minded ad idea for Reddit audiences.`,
          };
        default:
          return {
            mediaType: "image" as const,
            mediaUrl: `https://source.unsplash.com/600x400/?${companyData?.industry || "business"}`,
            adCopy: base,
            description: base,
          };
      }
    };

    const ads: VisualAd[] = platforms.map((platform) => {
      const colors = colorSchemes[platform] || colorSchemes.Instagram;
      const platformAd = makePlatformCopy(platform);

      return {
        id: `${platform}-${Date.now()}`,
        platform,
        headline: objectiveHeadlines[objective] || objectiveHeadlines.awareness,
        description: platformAd.description,
        callToAction: formData.callToAction,
        backgroundColor: colors.bg,
        accentColor: colors.accent,
        adCopy: platformAd.adCopy,
        mediaType: platformAd.mediaType,
        mediaUrl: platformAd.mediaUrl,
        videoScript: platformAd.videoScript,
      };
    });

    return ads;
  };

  const handleGenerateAds = () => {
    if (formData.platforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }
    if (!formData.targetMessage.trim()) {
      toast.error("Please enter a message or campaign idea");
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const newAds = generateVisualAds(
        formData.platforms,
        formData.adObjective,
        formData.targetMessage
      );
      setGeneratedAds(newAds);
      setIsGenerating(false);
      toast.success("Visual ads generated successfully!");
    }, 2000);
  };

  const downloadAdImage = (ad: VisualAd) => {
    toast.success(`Downloading ${ad.platform} ad...`);
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  if (!companyData) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
          <p className="text-muted-foreground">To use the AI Ad Generator, please provide your company details below.</p>
        </div>
        <CompanyForm onSubmit={onCompanySubmit} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <Card className="p-6 border border-border/50 bg-card/50 backdrop-blur">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Visual Ad Generator</h2>
            <p className="text-sm text-muted-foreground">Create professional visual ads for your campaigns</p>
          </div>

          {/* Campaign Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Campaign Message or Idea</label>
            <Textarea
              placeholder="Describe your campaign idea, promotion, or message. Example: 'Summer sale: 50% off on all products with limited time offer'"
              value={formData.targetMessage}
              onChange={(e) => setFormData((prev) => ({ ...prev, targetMessage: e.target.value }))}
              className="min-h-24 bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campaign Objective */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Objective</label>
              <Select value={formData.adObjective} onValueChange={(value) => setFormData((prev) => ({ ...prev, adObjective: value }))}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="awareness">Brand Awareness</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="conversion">Conversions</SelectItem>
                  <SelectItem value="retention">Customer Retention</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Call to Action */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Call to Action</label>
              <Input
                placeholder="e.g., 'Shop Now', 'Learn More', 'Sign Up'"
                value={formData.callToAction}
                onChange={(e) => setFormData((prev) => ({ ...prev, callToAction: e.target.value }))}
                className="bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>
          </div>

          {/* Platform Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Platforms</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {SOCIAL_PLATFORMS.map((platform) => (
                <Button
                  key={platform}
                  variant={formData.platforms.includes(platform) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePlatformToggle(platform)}
                  className="text-xs"
                >
                  {platform}
                </Button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateAds}
            disabled={isGenerating || formData.platforms.length === 0 || !formData.targetMessage.trim()}
            size="lg"
            className="w-full gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {isGenerating ? "Generating Visual Ads..." : "Generate Visual Ads"}
          </Button>
        </div>
      </Card>

      {/* Generated Ads Grid */}
      {generatedAds.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Generated Visual Ads</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedAds.map((ad) => (
              <div key={ad.id} className="group">
                <Card className="overflow-hidden border border-border/50 hover:shadow-lg transition-all">
                  {/* Visual Preview */}
                  <div className={`bg-gradient-to-br ${ad.backgroundColor} aspect-video flex items-center justify-center p-6 relative overflow-hidden`}>
                    {/* Decorative elements */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${ad.accentColor} opacity-10`}></div>

                    {ad.mediaType === "video" ? (
                      <video
                        className="absolute inset-0 w-full h-full object-cover"
                        src={ad.mediaUrl}
                        muted
                        loop
                        playsInline
                        controls
                      />
                    ) : (
                      <img
                        className="absolute inset-0 w-full h-full object-cover"
                        src={ad.mediaUrl}
                        alt={`${ad.platform} ad preview`}
                      />
                    )}

                    <div className="relative z-10 text-center space-y-3 max-w-full">
                      <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-black/40 text-xs text-white">
                        {ad.mediaType === "video" ? "Video Ad" : "Image Ad"}
                        <span className="opacity-70">•</span>
                        {ad.platform}
                      </div>

                      <h4 className="text-xl md:text-2xl font-bold text-foreground leading-tight">{ad.headline}</h4>
                      <p className="text-sm text-muted-foreground">{ad.description}</p>
                      <div className={`inline-block px-6 py-2 bg-gradient-to-r ${ad.accentColor} text-white rounded-lg font-semibold text-sm`}>
                        {ad.callToAction}
                      </div>
                    </div>
                  </div>

                  {/* Ad Details */}
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Platform</p>
                      <p className="font-semibold text-sm">{ad.platform}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Ad Copy</p>
                      <p className="text-sm text-foreground line-clamp-3">{ad.adCopy}</p>
                    </div>

                    {ad.videoScript && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Video Script</p>
                        <pre className="text-sm text-foreground whitespace-pre-wrap line-clamp-4">{ad.videoScript}</pre>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => downloadAdImage(ad)}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${ad.headline}\n${ad.description}\n${ad.callToAction}`
                          );
                          toast.success("Ad details copied!");
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {generatedAds.length === 0 && !isGenerating && (
        <Card className="p-12 text-center border border-border/50 bg-card/30">
          <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">Fill out the form above and click "Generate Visual Ads" to create professional ads for your campaign.</p>
        </Card>
      )}
    </div>
  );
}
