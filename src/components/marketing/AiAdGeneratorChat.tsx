import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Download, Sparkles, Check } from "lucide-react";
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

// Ad Goals
export const AD_GOALS = [
  "Increase brand awareness",
  "Drive traffic to the website",
  "Promote a special offer",
  "Capture leads",
  "Highlight success stories/testimonials",
];

// Target Audiences
export const TARGET_AUDIENCES = [
  "Demographics (Age, Gender, Location)",
  "Skilled Workers",
  "IT Professionals",
  "Engineers",
  "Students",
  "Families",
  "Immigration Consultants",
];

// Visa Services/Types
export const VISA_SERVICES = [
  "Canada PR Visa",
  "Australia Work Visa",
  "New Zealand Work Visa",
  "Student Visas",
  "IELTS/PTE Preparation",
  "Visa Consultation Services",
  "Family Sponsorship",
];

// Key Benefits
export const KEY_BENEFITS = [
  "Expert guidance through the entire visa process",
  "High success rate in visa approvals",
  "Personalized consultations",
  "Free IELTS/PTE preparation support",
  "Access to job opportunities",
  "Document & application assistance",
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
  fullScriptTemplate?: string;
}

interface Props {
  companyData: CompanyData | null;
  onCompanySubmit: (data: CompanyData) => void;
}

interface AdFormData {
  // Step 1: Goals
  selectedGoals: string[];
  // Step 2: Target Audience
  targetAudiences: string[];
  audienceDemographics: string;
  // Step 3: Visa Services
  visaServices: string[];
  // Step 4: Hook/Message
  hook: string;
  // Step 5: Benefits
  selectedBenefits: string[];
  customBenefits: string;
  // Step 6: Social Proof
  testimonial: string;
  successRate: string;
  rating: string;
  caseStudy: string;
  // Step 7: Call to Action
  callToAction: string;
  // Step 8: Branding
  websiteUrl: string;
  phoneNumber: string;
  // Step 9: Ad Length
  adLength: string;
  // Step 10: Customizations
  brandColors: string;
  brandFonts: string;
  additionalVisuals: string;
  // Platforms
  platforms: string[];
}

export default function AiAdGeneratorChat({ companyData, onCompanySubmit }: Props) {
  const [formData, setFormData] = useState<AdFormData>({
    selectedGoals: [],
    targetAudiences: [],
    audienceDemographics: "",
    visaServices: [],
    hook: "",
    selectedBenefits: [],
    customBenefits: "",
    testimonial: "",
    successRate: "",
    rating: "",
    caseStudy: "",
    callToAction: "Book a free consultation",
    websiteUrl: "",
    phoneNumber: "",
    adLength: "30",
    brandColors: "",
    brandFonts: "",
    additionalVisuals: "",
    platforms: [],
  });
  const [generatedAds, setGeneratedAds] = useState<VisualAd[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateComprehensiveAdScript = () => {
    const benefitsText = [
      ...formData.selectedBenefits.slice(0, 3),
      ...(formData.customBenefits ? [formData.customBenefits] : []),
    ].join("\n• ");

    const socialProofText = [
      formData.testimonial && `"${formData.testimonial}"`,
      formData.successRate && `Success Rate: ${formData.successRate}`,
      formData.rating && `Rating: ${formData.rating}`,
    ]
      .filter(Boolean)
      .join("\n");

    const adLength = parseInt(formData.adLength);

    // Generate platform-specific scripts
    const scriptTemplate = {
      opening: formData.hook || `Ready to ${formData.visaServices[0]?.toLowerCase() || "start your immigration journey"}?`,
      benefits: benefitsText || "Expert support at every step",
      socialProof: socialProofText || "Trusted by thousands",
      cta: formData.callToAction,
      contact: `${formData.websiteUrl || (companyData?.name ? `www.${companyData.name.toLowerCase().replace(/\s+/g, '')}.com` : "visit our website")} | ${formData.phoneNumber || "contact us"}`,
    };

    return scriptTemplate;
  };

  const generateVisualAds = () => {
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

    const scriptTemplate = generateComprehensiveAdScript();

    const generatePlatformScript = (platform: string) => {
      const adLength = parseInt(formData.adLength);
      const isVideo = ["YouTube", "TikTok"].includes(platform);

      if (isVideo) {
        const secondsPerSegment = adLength / 3;
        return `
🎬 ${platform} Video Script (${adLength}s)

[0-${secondsPerSegment}s] 🎞️ Opening
${scriptTemplate.opening}
Visuals: ${formData.additionalVisuals || `Professional ${formData.visaServices[0]?.toLowerCase() || "immigration"} visuals`}

[${secondsPerSegment}-${secondsPerSegment * 2}s] 💡 Key Benefits
✓ ${formData.selectedBenefits[0] || "Expert Guidance"}
✓ ${formData.selectedBenefits[1] || "High Success Rates"}
✓ ${formData.selectedBenefits[2] || "Personalized Support"}

[${secondsPerSegment * 2}-${adLength}s] ✨ Call to Action
${scriptTemplate.cta}
${scriptTemplate.contact}
${scriptTemplate.socialProof ? `\n"${scriptTemplate.socialProof}"` : ""}
`;
      }

      // Image ad
      return `
📸 ${platform} Image Ad (${formData.adLength}s)

Headline: ${scriptTemplate.opening}

Body Copy:
${formData.selectedBenefits.slice(0, 2).join("\n") || "Expert support for your visa journey"}

Social Proof: ${scriptTemplate.socialProof || "Trusted by thousands"}

Call to Action: ${scriptTemplate.cta}

Contact: ${scriptTemplate.contact}
`;
    };

    const ads: VisualAd[] = formData.platforms.map((platform) => {
      const colors = colorSchemes[platform] || colorSchemes.Instagram;
      const isVideo = ["YouTube", "TikTok"].includes(platform);

      return {
        id: `${platform}-${Date.now()}`,
        platform,
        headline: formData.hook || formData.visaServices[0] || "Start Your Journey",
        description: formData.selectedBenefits[0] || "Expert immigration support",
        callToAction: formData.callToAction,
        backgroundColor: colors.bg,
        accentColor: colors.accent,
        adCopy: `${formData.hook}\n\n${formData.selectedBenefits.slice(0, 2).join("\n")}`,
        mediaType: isVideo ? "video" : "image",
        mediaUrl: isVideo
          ? "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          : `https://source.unsplash.com/600x400/?${formData.visaServices[0]?.toLowerCase().replace(" ", ",") || "business"},professional`,
        videoScript: isVideo ? generatePlatformScript(platform) : undefined,
        fullScriptTemplate: generatePlatformScript(platform),
      };
    });

    return ads;
  };

  const handleGenerateAds = () => {
    if (formData.platforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }
    if (formData.selectedGoals.length === 0) {
      toast.error("Please select at least one ad goal");
      return;
    }
    if (!formData.hook.trim()) {
      toast.error("Please provide an attention-grabbing hook");
      return;
    }
    if (formData.visaServices.length === 0) {
      toast.error("Please select at least one visa service");
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const newAds = generateVisualAds();
      setGeneratedAds(newAds);
      setIsGenerating(false);
      toast.success("Ad campaigns generated successfully!");
    }, 2000);
  };

  const downloadAdImage = (ad: VisualAd) => {
    toast.success(`Downloading ${ad.platform} ad...`);
  };

  const handleGoalToggle = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedGoals: prev.selectedGoals.includes(goal)
        ? prev.selectedGoals.filter((g) => g !== goal)
        : [...prev.selectedGoals, goal],
    }));
  };

  const handleAudienceToggle = (audience: string) => {
    setFormData((prev) => ({
      ...prev,
      targetAudiences: prev.targetAudiences.includes(audience)
        ? prev.targetAudiences.filter((a) => a !== audience)
        : [...prev.targetAudiences, audience],
    }));
  };

  const handleVisaServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      visaServices: prev.visaServices.includes(service)
        ? prev.visaServices.filter((s) => s !== service)
        : [...prev.visaServices, service],
    }));
  };

  const handleBenefitToggle = (benefit: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedBenefits: prev.selectedBenefits.includes(benefit)
        ? prev.selectedBenefits.filter((b) => b !== benefit)
        : [...prev.selectedBenefits, benefit],
    }));
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
      {/* Form Section - 11 Step Workflow */}
      <Card className="p-6 border border-border/50 bg-card/50 backdrop-blur">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">🎯 Immigration Ad Generator - 11 Step Workflow</h2>
            <p className="text-sm text-muted-foreground">Create professional visa & immigration ads with guided step-by-step process</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {/* Step 1: Goals */}
            <AccordionItem value="step1">
              <AccordionTrigger className="text-base font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    1
                  </span>
                  Define Your Ad Goals
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3">
                  What do you want your ad to achieve? (Choose one or more)
                </p>
                <div className="space-y-2">
                  {AD_GOALS.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.selectedGoals.includes(goal)}
                        onCheckedChange={() => handleGoalToggle(goal)}
                      />
                      <label htmlFor={goal} className="text-sm cursor-pointer">
                        {goal}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 2: Target Audience */}
            <AccordionItem value="step2">
              <AccordionTrigger className="text-base font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    2
                  </span>
                  Choose Target Audience
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Who are you targeting with this ad?</p>
                  <div className="space-y-2 mb-4">
                    {TARGET_AUDIENCES.map((audience) => (
                      <div key={audience} className="flex items-center space-x-2">
                        <Checkbox
                          id={audience}
                          checked={formData.targetAudiences.includes(audience)}
                          onCheckedChange={() => handleAudienceToggle(audience)}
                        />
                        <label htmlFor={audience} className="text-sm cursor-pointer">
                          {audience}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Demographics (optional)</label>
                  <Input
                    placeholder="e.g., 'IT professionals aged 25-35 in India looking to migrate to Canada'"
                    value={formData.audienceDemographics}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, audienceDemographics: e.target.value }))
                    }
                    className="bg-background/50 border-border/50"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 3: Visa Services */}
            <AccordionItem value="step3">
              <AccordionTrigger className="text-base font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    3
                  </span>
                  Select Visa Offering/Service
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3">Which visa type or service are you promoting?</p>
                <div className="space-y-2">
                  {VISA_SERVICES.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={formData.visaServices.includes(service)}
                        onCheckedChange={() => handleVisaServiceToggle(service)}
                      />
                      <label htmlFor={service} className="text-sm cursor-pointer">
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 4: Hook/Message */}
            <AccordionItem value="step4">
              <AccordionTrigger className="text-base font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    4
                  </span>
                  Craft Your Attention-Grabbing Hook
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3">What is your hook for the first 5 seconds?</p>
                <Textarea
                  placeholder="Examples: 'Want to live and work in Canada? Let us help you get there!' or 'Did you know? 95% of our clients get their Canadian PR approved!' or 'Ready to study in Australia? We've helped thousands of students!'"
                  value={formData.hook}
                  onChange={(e) => setFormData((prev) => ({ ...prev, hook: e.target.value }))}
                  className="min-h-20 bg-background/50 border-border/50"
                />
              </AccordionContent>
            </AccordionItem>

            {/* Step 5: Benefits */}
            <AccordionItem value="step5">
              <AccordionTrigger className="text-base font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    5
                  </span>
                  Highlight Key Benefits
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-3">What are the main benefits to highlight?</p>
                <div className="space-y-2 mb-4">
                  {KEY_BENEFITS.map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <Checkbox
                        id={benefit}
                        checked={formData.selectedBenefits.includes(benefit)}
                        onCheckedChange={() => handleBenefitToggle(benefit)}
                      />
                      <label htmlFor={benefit} className="text-sm cursor-pointer">
                        {benefit}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Benefit (optional)</label>
                  <Input
                    placeholder="Add your own unique benefit..."
                    value={formData.customBenefits}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customBenefits: e.target.value }))}
                    className="bg-background/50 border-border/50"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 6: Social Proof */}
            <AccordionItem value="step6">
              <AccordionTrigger className="text-base font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    6
                  </span>
                  Add Social Proof & Testimonials
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client Testimonial (optional)</label>
                  <Textarea
                    placeholder="e.g., 'Thanks to Nexus Migration, I received my Canada PR in just 6 months!'"
                    value={formData.testimonial}
                    onChange={(e) => setFormData((prev) => ({ ...prev, testimonial: e.target.value }))}
                    className="min-h-12 bg-background/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Success Rate (optional)</label>
                  <Input
                    placeholder="e.g., '4000+ ITA filed with 95% success rate'"
                    value={formData.successRate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, successRate: e.target.value }))}
                    className="bg-background/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating (optional)</label>
                  <Input
                    placeholder="e.g., 'Rated 4.5/5 on Trustpilot'"
                    value={formData.rating}
                    onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
                    className="bg-background/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Case Study/Story (optional)</label>
                  <Textarea
                    placeholder="Share a real-life success story..."
                    value={formData.caseStudy}
                    onChange={(e) => setFormData((prev) => ({ ...prev, caseStudy: e.target.value }))}
                    className="min-h-12 bg-background/50 border-border/50"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 7: Call to Action */}
            <AccordionItem value="step7">
              <AccordionTrigger className="text-base font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    7
                  </span>
                  Create Your Call to Action
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3">What action do you want viewers to take?</p>
                <Input
                  placeholder="e.g., 'Book a free consultation', 'Get your free visa assessment', 'Start your journey now'"
                  value={formData.callToAction}
                  onChange={(e) => setFormData((prev) => ({ ...prev, callToAction: e.target.value }))}
                  className="bg-background/50 border-border/50"
                />
              </AccordionContent>
            </AccordionItem>

            {/* Step 8: Branding */}
            <AccordionItem value="step8">
              <AccordionTrigger className="text-base font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    8
                  </span>
                  Add Branding & Contact Info
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website URL</label>
                  <Input
                    placeholder="e.g., https://www.nexusmigration.com"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                    className="bg-background/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    placeholder="e.g., +971 4 295 0122"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                    className="bg-background/50 border-border/50"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 9: Ad Length */}
            <AccordionItem value="step9">
              <AccordionTrigger className="text-base font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    9
                  </span>
                  Choose Ad Length
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Select value={formData.adLength} onValueChange={(value) => setFormData((prev) => ({ ...prev, adLength: value }))}>
                  <SelectTrigger className="w-full bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            {/* Step 10: Customizations */}
            <AccordionItem value="step10">
              <AccordionTrigger className="text-base font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    10
                  </span>
                  Final Customization
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand Colors (optional)</label>
                  <Input
                    placeholder="e.g., 'Blue (#0066CC) and White (#FFFFFF)'"
                    value={formData.brandColors}
                    onChange={(e) => setFormData((prev) => ({ ...prev, brandColors: e.target.value }))}
                    className="bg-background/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand Fonts (optional)</label>
                  <Input
                    placeholder="e.g., 'Arial Bold for headlines, Roboto for body'"
                    value={formData.brandFonts}
                    onChange={(e) => setFormData((prev) => ({ ...prev, brandFonts: e.target.value }))}
                    className="bg-background/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Visuals & Media (optional)</label>
                  <Textarea
                    placeholder="Describe any specific visuals or customizations. e.g., 'Images of Canadian landmarks, happy families, professionals at work, etc.'"
                    value={formData.additionalVisuals}
                    onChange={(e) => setFormData((prev) => ({ ...prev, additionalVisuals: e.target.value }))}
                    className="min-h-12 bg-background/50 border-border/50"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 11: Platform Selection */}
            <AccordionItem value="step11">
              <AccordionTrigger className="text-base font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    11
                  </span>
                  Preview & Select Platforms
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-3">Which platforms do you want to generate ads for?</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <Button
                      key={platform}
                      variant={formData.platforms.includes(platform) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePlatformToggle(platform)}
                      className="text-xs"
                    >
                      {formData.platforms.includes(platform) && <Check className="w-3 h-3 mr-1" />}
                      {platform}
                    </Button>
                  ))}
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateAds}
                  disabled={
                    isGenerating ||
                    formData.platforms.length === 0 ||
                    formData.selectedGoals.length === 0 ||
                    !formData.hook.trim() ||
                    formData.visaServices.length === 0
                  }
                  size="lg"
                  className="w-full gap-2 mt-4"
                >
                  <Sparkles className="w-5 h-5" />
                  {isGenerating ? "Generating Ad Campaigns..." : "🎬 Generate Ad Campaigns"}
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Card>

      {/* Generated Ads Grid */}
      {generatedAds.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">✨ Generated Ad Campaigns for {formData.visaServices[0]}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <p className="text-xs text-muted-foreground mb-1">Headline Hook</p>
                      <p className="text-sm text-foreground line-clamp-2">{ad.headline}</p>
                    </div>

                    {ad.fullScriptTemplate && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{formData.adLength}s Ad Script</p>
                        <pre className="text-xs text-foreground whitespace-pre-wrap line-clamp-6 bg-muted p-2 rounded border">
                          {ad.fullScriptTemplate}
                        </pre>
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
                          const scriptText = ad.fullScriptTemplate || `${ad.headline}\n${ad.description}\n${ad.callToAction}`;
                          navigator.clipboard.writeText(scriptText);
                          toast.success("Script copied!");
                        }}
                      >
                        Copy Script
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
          <p className="text-muted-foreground">Follow the 11-step workflow above to create professional immigration/visa ads. Fill out each section and click "Generate Ad Campaigns" when ready!</p>
        </Card>
      )}
    </div>
  );
}
