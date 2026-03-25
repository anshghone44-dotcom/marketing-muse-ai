import type { CompanyData } from "@/components/marketing/CompanyForm";

const LOVABLE_API_GATEWAY_URL = import.meta.env.VITE_LOVABLE_API_GATEWAY_URL?.trim();
const LOVABLE_AD_CREATOR_ROUTE = import.meta.env.VITE_LOVABLE_AD_CREATOR_ROUTE?.trim();
const LOVABLE_COMPETITOR_ANALYZER_ROUTE =
  import.meta.env.VITE_LOVABLE_COMPETITOR_ANALYZER_ROUTE?.trim();
const LOVABLE_SYSTEM_ROUTE = import.meta.env.VITE_LOVABLE_SYSTEM_ROUTE?.trim();
const LOVABLE_API_AUTH_TOKEN =
  import.meta.env.VITE_LOVABLE_API_AUTH_TOKEN?.trim() ||
  import.meta.env.VITE_LOVABLE_API_KEY?.trim();

const resolvedSystemRoute =
  LOVABLE_AD_CREATOR_ROUTE ||
  LOVABLE_COMPETITOR_ANALYZER_ROUTE ||
  LOVABLE_SYSTEM_ROUTE;

function buildProfessionalAdPrompt(data: CompanyData): string {
  const platformList = data.platforms.join(", ");
  const competitorContext = data.competitors
    ? `Competitors to consider: ${data.competitors}.`
    : "No named competitors were provided, so focus on clear differentiation and premium positioning.";

  return [
    "Create premium ad copy for a marketing team.",
    `Brand: ${data.name}.`,
    `Product or service: ${data.product}.`,
    `Target audience: ${data.audience}.`,
    `Industry: ${data.industry}.`,
    `Primary goal: ${data.goal}.`,
    `Brand tone: ${data.tone}.`,
    `Target platforms: ${platformList}.`,
    competitorContext,
    "Return exactly 3 polished concepts.",
    "Each concept must include: campaign angle, headline, primary copy, CTA, and platform notes.",
    "Keep the language professional, persuasive, and ready to use in live campaigns.",
    "Use Markdown with clear headings.",
  ].join(" ");
}

function stringifyContent(value: unknown): string | null {
  if (typeof value === "string") {
    return value.trim() || null;
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => stringifyContent(item))
      .filter((item): item is string => Boolean(item));

    return parts.length ? parts.join("\n\n") : null;
  }

  if (value && typeof value === "object") {
    const objectValue = value as Record<string, unknown>;

    for (const key of ["content", "text", "copy", "message", "output", "result"]) {
      const nested = stringifyContent(objectValue[key]);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
}

function splitConcepts(markdown: string): string[] {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  const sections = normalized
    .split(/(?=^#{2,3}\s+)/m)
    .map((section) => section.trim())
    .filter(Boolean);

  if (sections.length >= 2) {
    return sections;
  }

  return [normalized];
}

function extractAdCopies(payload: unknown): string[] {
  if (typeof payload === "string") {
    return splitConcepts(payload);
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;

  for (const key of [
    "copies",
    "adCopies",
    "variants",
    "results",
    "messages",
    "choices",
    "data",
    "output",
    "result",
  ]) {
    const value = record[key];

    if (Array.isArray(value)) {
      const copies = value
        .map((item) => stringifyContent(item))
        .filter((item): item is string => Boolean(item))
        .flatMap((item) => splitConcepts(item));

      if (copies.length) {
        return copies;
      }
    }

    const nestedString = stringifyContent(value);
    if (nestedString) {
      return splitConcepts(nestedString);
    }
  }

  return [];
}

export function hasLovableGatewayConfig(): boolean {
  return Boolean(LOVABLE_API_GATEWAY_URL && resolvedSystemRoute);
}

export async function generateProfessionalAdCopies(data: CompanyData): Promise<string[]> {
  if (!LOVABLE_API_GATEWAY_URL) {
    throw new Error("Missing `VITE_LOVABLE_API_GATEWAY_URL`.");
  }

  if (!resolvedSystemRoute) {
    throw new Error(
      "Missing Lovable system route. Set `VITE_LOVABLE_AD_CREATOR_ROUTE` or reuse `VITE_LOVABLE_COMPETITOR_ANALYZER_ROUTE`."
    );
  }

  const prompt = buildProfessionalAdPrompt(data);
  const response = await fetch(LOVABLE_API_GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(LOVABLE_API_AUTH_TOKEN ? { Authorization: `Bearer ${LOVABLE_API_AUTH_TOKEN}` } : {}),
    },
    body: JSON.stringify({
      route: resolvedSystemRoute,
      systemRoute: resolvedSystemRoute,
      chatbot: "ad-creator",
      task: "ads",
      mode: "professional-ad-copy",
      companyProfile: data,
      input: prompt,
      prompt,
      messages: [
        {
          role: "system",
          content:
            "You are a senior advertising copywriter who creates polished, professional, high-converting ad campaigns.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Lovable gateway request failed with status ${response.status}.`);
  }

  const payload = await response.json();
  const copies = extractAdCopies(payload).slice(0, 3);

  if (!copies.length) {
    throw new Error("The Lovable gateway response did not include ad copy content.");
  }

  return copies;
}
