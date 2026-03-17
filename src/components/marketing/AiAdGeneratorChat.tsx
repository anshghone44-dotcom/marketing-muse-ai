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
  imageUrl: string;
}

interface Props {
  companyData: CompanyData | null;
}

export default function AiAdGeneratorChat({ companyData }: Props) {
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

    const ads: VisualAd[] = platforms.map((platform) => {
      const colors = colorSchemes[platform] || colorSchemes.Instagram;
      return {
        id: `${platform}-${Date.now()}`,
        platform,
        headline: objectiveHeadlines[objective] || objectiveHeadlines.awareness,
        description: message || `Transform your ${companyData?.industry || "business"} with ${companyData?.product || "our solution"}`,
        callToAction: formData.callToAction,
        backgroundColor: colors.bg,
        accentColor: colors.accent,
        adCopy: message || "Join thousands of satisfied customers",
        imageUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}-?w=600&h=400&fit=crop`,
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
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Please submit your company details first.</p>
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
                    <div className={`absolute inset-0 bg-gradient-to-r ${ad.accentColor} opacity-5`}></div>
                    
                    <div className="relative z-10 text-center space-y-3 max-w-full">
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
