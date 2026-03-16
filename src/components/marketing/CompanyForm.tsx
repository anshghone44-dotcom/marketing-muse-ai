import { useState } from "react";
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
import { X, Sparkles } from "lucide-react";

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
    <div className="space-y-6 text-slate-100">
      <div>
        <h2 className="font-display text-2xl font-semibold text-white">Company Profile</h2>
        <p className="mt-1 text-sm text-slate-300">
          Tell us about your business to generate tailored content.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="name" className="text-slate-200">Company Name</Label>
          <Input id="name" className="border-white/15 bg-slate-950/70 text-slate-100 placeholder:text-slate-500" placeholder="Acme Inc." value={data.name} onChange={(e) => update("name", e.target.value)} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="product" className="text-slate-200">Product / Service</Label>
          <Textarea
            id="product"
            className="border-white/15 bg-slate-950/70 text-slate-100 placeholder:text-slate-500"
            placeholder="Describe your product or service..."
            rows={2}
            value={data.product}
            onChange={(e) => update("product", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="audience" className="text-slate-200">Target Audience</Label>
            <Input
              id="audience"
              className="border-white/15 bg-slate-950/70 text-slate-100 placeholder:text-slate-500"
              placeholder="e.g. Small business owners"
              value={data.audience}
              onChange={(e) => update("audience", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="industry" className="text-slate-200">Industry</Label>
            <Input
              id="industry"
              className="border-white/15 bg-slate-950/70 text-slate-100 placeholder:text-slate-500"
              placeholder="e.g. SaaS, Fashion"
              value={data.industry}
              onChange={(e) => update("industry", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label className="text-slate-200">Marketing Goal</Label>
            <Select value={data.goal} onValueChange={(v) => update("goal", v)}>
              <SelectTrigger className="border-white/15 bg-slate-950/70 text-slate-100"><SelectValue placeholder="Select goal" /></SelectTrigger>
              <SelectContent>
                {GOALS.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-slate-200">Brand Tone</Label>
            <Select value={data.tone} onValueChange={(v) => update("tone", v)}>
              <SelectTrigger className="border-white/15 bg-slate-950/70 text-slate-100"><SelectValue placeholder="Select tone" /></SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label className="text-slate-200">Target Platforms</Label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <Badge
                key={p}
                variant={data.platforms.includes(p) ? "default" : "outline"}
                className="cursor-pointer select-none border-white/20 text-slate-200"
                onClick={() => togglePlatform(p)}
              >
                {p}
                {data.platforms.includes(p) && <X className="ml-1 h-3 w-3" />}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="competitors" className="text-slate-200">Competitors (optional)</Label>
          <Input
            id="competitors"
            className="border-white/15 bg-slate-950/70 text-slate-100 placeholder:text-slate-500"
            placeholder="e.g. CompetitorA, CompetitorB"
            value={data.competitors}
            onChange={(e) => update("competitors", e.target.value)}
          />
        </div>
      </div>

      <Button
        variant="ai"
        size="lg"
        className="w-full shadow-lg shadow-indigo-500/25"
        disabled={!isValid}
        onClick={() => onSubmit(data)}
      >
        <Sparkles className="h-4 w-4" />
        Generate Marketing Content
      </Button>
    </div>
  );
}
