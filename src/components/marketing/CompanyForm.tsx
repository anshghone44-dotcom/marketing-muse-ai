import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface CompanyData {
  name: string;
  product: string;
  audience: string;
  industry: string;
  goal: string;
  tone: string;
  platforms: string[];
  competitors: string;
}

const PLATFORMS = ["Instagram", "LinkedIn", "YouTube", "TikTok", "Twitter"];
const TONES = ["Professional", "Fun", "Luxury", "Bold", "Friendly", "Edgy"];
const GOALS = ["Brand Awareness", "Lead Generation", "Sales"];

interface Props {
  onSubmit: (data: CompanyData) => void;
  initialData?: CompanyData | null;
}

export default function CompanyForm({ onSubmit, initialData }: Props) {
  const [data, setData] = useState<CompanyData>(
    initialData ?? {
      name: "",
      product: "",
      audience: "",
      industry: "",
      goal: "",
      tone: "",
      platforms: [],
      competitors: "",
    }
  );

  const update = (key: keyof CompanyData, value: string | string[]) =>
    setData((d) => ({ ...d, [key]: value }));

  const togglePlatform = (p: string) => {
    setData((d) => ({
      ...d,
      platforms: d.platforms.includes(p)
        ? d.platforms.filter((x) => x !== p)
        : [...d.platforms, p],
    }));
  };

  const isValid =
    data.name && data.product && data.audience && data.industry && data.goal && data.tone && data.platforms.length > 0;

  return (
    <div className="bg-card/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

      <div className="relative">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Company Profile
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Configure your AI marketing assistant with company details for personalized content generation.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Company Name
            </Label>
            <Input
              id="name"
              placeholder="Acme Inc."
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              className="h-12 bg-background/50 border-border/20 focus:border-primary/50 transition-all duration-200"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="product" className="text-sm font-medium text-foreground">
              Product / Service
            </Label>
            <Textarea
              id="product"
              placeholder="Describe your product or service in detail..."
              rows={4}
              value={data.product}
              onChange={(e) => update("product", e.target.value)}
              className="bg-background/50 border-border/20 focus:border-primary/50 transition-all duration-200 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label htmlFor="audience" className="text-sm font-medium text-foreground">
                Target Audience
              </Label>
              <Input
                id="audience"
                placeholder="e.g. Small business owners"
                value={data.audience}
                onChange={(e) => update("audience", e.target.value)}
                className="h-12 bg-background/50 border-border/20 focus:border-primary/50 transition-all duration-200"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="industry" className="text-sm font-medium text-foreground">
                Industry
              </Label>
              <Input
                id="industry"
                placeholder="e.g. SaaS, Fashion"
                value={data.industry}
                onChange={(e) => update("industry", e.target.value)}
                className="h-12 bg-background/50 border-border/20 focus:border-primary/50 transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label className="text-sm font-medium text-foreground">Marketing Goal</Label>
              <Select value={data.goal} onValueChange={(v) => update("goal", v)}>
                <SelectTrigger className="h-12 bg-background/50 border-border/20 focus:border-primary/50 transition-all duration-200">
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
                  {GOALS.map((g) => (
                    <SelectItem key={g} value={g} className="focus:bg-primary/10">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label className="text-sm font-medium text-foreground">Brand Tone</Label>
              <Select value={data.tone} onValueChange={(v) => update("tone", v)}>
                <SelectTrigger className="h-12 bg-background/50 border-border/20 focus:border-primary/50 transition-all duration-200">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t} className="focus:bg-primary/10">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3">
            <Label className="text-sm font-medium text-foreground">Target Platforms</Label>
            <div className="flex flex-wrap gap-3">
              {PLATFORMS.map((p) => (
                <Badge
                  key={p}
                  variant={data.platforms.includes(p) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer select-none px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105",
                    data.platforms.includes(p)
                      ? "bg-primary/10 text-primary border-primary/30 glow"
                      : "hover:bg-muted/50 border-border/50 hover:border-primary/30"
                  )}
                  onClick={() => togglePlatform(p)}
                >
                  {p}
                  {data.platforms.includes(p) && <X className="ml-2 h-3 w-3" />}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="competitors" className="text-sm font-medium text-foreground">
              Competitors <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="competitors"
              placeholder="e.g. CompetitorA, CompetitorB"
              value={data.competitors}
              onChange={(e) => update("competitors", e.target.value)}
              className="h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-200"
            />
          </div>
        </div>

        <Button
          variant="ai"
          size="lg"
          className="w-full h-14 mt-8 text-lg font-semibold hover:scale-[1.02] transition-all duration-200"
          disabled={!isValid}
          onClick={() => onSubmit(data)}
        >
          Initialize AI Marketing Assistant
        </Button>
      </div>
    </div>
  );
}
