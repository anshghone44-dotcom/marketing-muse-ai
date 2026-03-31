import type { CompanyData } from "@/components/marketing/CompanyForm";

export interface VisualAdResult {
  templateId: string;
  headline: string;
  body: string;
  cta: string;
  logoPosition: string;
  textAlign: string;
  overlayStrength: number;
  overlayColor: string;
  campaignObjective: string;
  visualDirection: string;
}

// ─── Platform → templateId mapper ────────────────────────────────
function inferTemplateId(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("story") || p.includes("stories") || p.includes("whatsapp")) return "story";
  if (p.includes("linkedin")) return "linkedin-banner";
  if (p.includes("youtube") || p.includes("thumbnail")) return "youtube-thumb";
  if (p.includes("facebook") || p.includes("fb")) return "facebook-feed";
  if (p.includes("instagram") || p.includes("ig")) return "instagram-square";
  return "instagram-square"; // sensible default
}

// ─── Build the creative-director prompt ──────────────────────────
function buildVisualAdPrompt(userRequest: string, companyData: CompanyData | null): string {
  const brandContext = companyData
    ? [
        `Brand: ${companyData.name}.`,
        `Product/Service: ${companyData.product}.`,
        `Target Audience: ${companyData.audience}.`,
        `Industry: ${companyData.industry}.`,
        `Tone: ${companyData.tone}.`,
        `Goal: ${companyData.goal}.`,
      ].join(" ")
    : "";

  return [
    "You are an expert copywriter, creative director, and layout designer for digital advertising.",
    "The user will describe an ad they want. You will generate structured ad content.",
    brandContext,
    `User request: "${userRequest}"`,
    "",
    "IMPORTANT: Respond ONLY with a raw JSON object — no markdown fences, no extra text.",
    "The JSON must have exactly these fields:",
    '{',
    '  "templateId": "instagram-square | facebook-feed | linkedin-banner | story | youtube-thumb",',
    '  "headline": "Short punchy headline (max 10 words)",',
    '  "body": "Supporting tagline or body text (max 20 words)",',
    '  "cta": "Call-to-action button label (2-5 words)",',
    '  "logoPosition": "top-left | top-right | top-center | bottom-left | bottom-right",',
    '  "textAlign": "left | center | right",',
    '  "overlayStrength": <number 30-75>,',
    '  "overlayColor": "<hex color like #0f172a>",',
    '  "campaignObjective": "One sentence describing the campaign goal",',
    '  "visualDirection": "Brief description of the visual mood and layout"',
    '}',
    "",
    "Choose templateId based on the platform mentioned (e.g. Instagram → instagram-square, Facebook → facebook-feed, LinkedIn → linkedin-banner, Story → story, YouTube → youtube-thumb).",
    "Keep it professional, persuasive, and campaign-ready.",
  ].join("\n");
}

// ─── Parse AI response safely ─────────────────────────────────────
function parseVisualAdResult(raw: string, fallbackTemplateId: string): VisualAdResult {
  // Strip markdown fences if present
  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();

  // Find the JSON object boundaries
  const start = cleaned.indexOf("{");
  const end   = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in response");

  const parsed = JSON.parse(cleaned.slice(start, end + 1));

  return {
    templateId:       parsed.templateId       ?? fallbackTemplateId,
    headline:         parsed.headline         ?? "Your Headline Here",
    body:             parsed.body             ?? "Your supporting body text goes here.",
    cta:              parsed.cta              ?? "Learn More",
    logoPosition:     parsed.logoPosition     ?? "top-left",
    textAlign:        parsed.textAlign        ?? "center",
    overlayStrength:  Number(parsed.overlayStrength) || 55,
    overlayColor:     parsed.overlayColor     ?? "#0f172a",
    campaignObjective:parsed.campaignObjective ?? "",
    visualDirection:  parsed.visualDirection  ?? "",
  };
}

// ─── Main exported function ───────────────────────────────────────
export async function callVisualAdGateway(
  userRequest: string,
  companyData: CompanyData | null
): Promise<VisualAdResult> {
  const fallbackTemplateId = inferTemplateId(userRequest);
  const prompt = buildVisualAdPrompt(userRequest, companyData);

  // ── 1. Try configured Supabase/Lovable edge gateway ─────────────
  const GATEWAY_URL  = import.meta.env.VITE_LOVABLE_API_GATEWAY_URL?.trim();
  const SYSTEM_ROUTE =
    import.meta.env.VITE_LOVABLE_AD_CREATOR_ROUTE?.trim() ||
    import.meta.env.VITE_LOVABLE_SYSTEM_ROUTE?.trim();
  const AUTH_TOKEN   =
    import.meta.env.VITE_LOVABLE_API_AUTH_TOKEN?.trim() ||
    import.meta.env.VITE_LOVABLE_API_KEY?.trim();

  if (GATEWAY_URL && SYSTEM_ROUTE) {
    try {
      const res = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
        },
        body: JSON.stringify({
          route: SYSTEM_ROUTE,
          systemRoute: SYSTEM_ROUTE,
          chatbot: "visual-ad-builder",
          task: "visual-ad-generation",
          input: prompt,
          messages: [
            {
              role: "system",
              content:
                "You are a professional ad creative director. Always respond with raw valid JSON only — no markdown, no extra text.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content =
          typeof data === "string"
            ? data
            : data?.choices?.[0]?.message?.content ??
              data?.content ??
              data?.result ??
              data?.output ??
              (typeof data === "object" ? JSON.stringify(data) : "");
        return parseVisualAdResult(content, fallbackTemplateId);
      }
      console.warn(`Configured gateway failed (${res.status}). Falling back to direct.`);
    } catch (err) {
      console.warn("Gateway fetch error. Falling back to direct:", err);
    }
  }

  // ── 2. Direct fallback to Lovable AI gateway ─────────────────────
  const directRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-flash-1.5",
      messages: [
        {
          role: "system",
          content:
            "You are a professional ad creative director. Respond ONLY with a raw JSON object — no markdown fences, no explanation.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!directRes.ok) {
    throw new Error(`AI gateway error (${directRes.status}): ${directRes.statusText}`);
  }

  const directData = await directRes.json();
  const rawContent: string = directData?.choices?.[0]?.message?.content ?? "";
  return parseVisualAdResult(rawContent, fallbackTemplateId);
}
