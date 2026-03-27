import type { CompanyData } from "@/components/marketing/CompanyForm";

const LOVABLE_API_GATEWAY_URL = import.meta.env.VITE_LOVABLE_API_GATEWAY_URL?.trim();
const LOVABLE_AD_CREATOR_ROUTE = import.meta.env.VITE_LOVABLE_AD_CREATOR_ROUTE?.trim();
const LOVABLE_COMPETITOR_ANALYZER_ROUTE =
  import.meta.env.VITE_LOVABLE_COMPETITOR_ANALYZER_ROUTE?.trim();
const LOVABLE_KEYWORD_GENERATOR_ROUTE = import.meta.env.VITE_LOVABLE_KEYWORD_GENERATOR_ROUTE?.trim();
const LOVABLE_VIRAL_GENERATOR_ROUTE = import.meta.env.VITE_LOVABLE_VIRAL_GENERATOR_ROUTE?.trim();
const LOVABLE_SYSTEM_ROUTE = import.meta.env.VITE_LOVABLE_SYSTEM_ROUTE?.trim();
const LOVABLE_API_AUTH_TOKEN =
  import.meta.env.VITE_LOVABLE_API_AUTH_TOKEN?.trim() ||
  import.meta.env.VITE_LOVABLE_API_KEY?.trim();

const resolvedSystemRoute =
  LOVABLE_AD_CREATOR_ROUTE ||
  LOVABLE_COMPETITOR_ANALYZER_ROUTE ||
  LOVABLE_KEYWORD_GENERATOR_ROUTE ||
  LOVABLE_VIRAL_GENERATOR_ROUTE ||
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

function buildProfessionalKeywordPrompt(prompt: string, factors: string[], data: CompanyData | null): string {
  return [
    "You are a SEO and SEM expert.",
    `User request: ${prompt}`,
    `Focus factors: ${factors.join(", ")}.`,
    data ? `Brand Context: ${data.name} in ${data.industry}. Product: ${data.product}. Audience: ${data.audience}.` : "",
    "Generate a professional keyword strategy.",
    "Return the result as a raw JSON object only (no markdown, no blocks) with this structure:",
    "{",
    '  "summary": "High-level strategic overview",',
    '  "clusters": [',
    '    { "factor": "Category Name", "keywords": ["kw1", "kw2"], "difficulty": "Low/Medium/High", "intent": "Informational/Transactional/etc" }',
    '  ]',
    "}",
  ].join(" ");
}

function buildProfessionalContentPrompt(topic: string, type: string, tone: string, data: CompanyData | null): string {
  return [
    `Create a professional ${type} on the topic: ${topic}.`,
    `Tone: ${tone}.`,
    data ? `Brand: ${data.name}. Product: ${data.product}. Audience: ${data.audience}.` : "",
    "The content should be high-quality, engaging, and ready for professional use.",
  ].join(" ");
}

function buildProfessionalViralPrompt(prompt: string, data: CompanyData | null): string {
  return [
    "You are a viral marketing strategist.",
    `Goal: ${prompt}`,
    data ? `Brand: ${data.name}. Product: ${data.product}. Audience: ${data.audience}.` : "",
    "Generate 3 innovative viral marketing ideas.",
    "Return the result as a raw JSON object only (no markdown, no blocks) with this structure:",
    "{",
    '  "summary": "Overall viral growth strategy",',
    '  "ideas": [',
    '    { "title": "...", "description": "...", "mechanics": "...", "platforms": ["..."], "whyItWorks": "...", "reachEstimate": "..." }',
    '  ]',
    "}",
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
  // We now support direct fallback even if environment variables are missing
  return true;
}

export async function generateProfessionalAdCopies(data: CompanyData): Promise<string[]> {
  const prompt = buildProfessionalAdPrompt(data);
  const result = await callGateway(prompt, "ad-creator", "ads");
  return extractAdCopies(result).slice(0, 3);
}

export async function generateProfessionalKeywords(prompt: string, factors: string[], data: CompanyData | null): Promise<string> {
  const fullPrompt = buildProfessionalKeywordPrompt(prompt, factors, data);
  const result = await callGateway(fullPrompt, "keyword-generator", "keywords");
  return stringifyContent(result) || (typeof result === 'string' ? result : JSON.stringify(result));
}

export async function generateProfessionalContent(topic: string, type: string, tone: string, data: CompanyData | null): Promise<string> {
  const fullPrompt = buildProfessionalContentPrompt(topic, type, tone, data);
  const result = await callGateway(fullPrompt, "content-generator", "content");
  return stringifyContent(result) || (typeof result === 'string' ? result : JSON.stringify(result));
}

export async function generateProfessionalViralIdeas(prompt: string, data: CompanyData | null): Promise<string> {
  const fullPrompt = buildProfessionalViralPrompt(prompt, data);
  const result = await callGateway(fullPrompt, "viral-generator", "viral-ideas");
  return stringifyContent(result) || (typeof result === 'string' ? result : JSON.stringify(result));
}

async function callGateway(prompt: string, chatbot: string, task: string): Promise<any> {
  // 1. Try Configured Gateway (Edge Route)
  if (LOVABLE_API_GATEWAY_URL && resolvedSystemRoute) {
    try {
      const response = await fetch(LOVABLE_API_GATEWAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(LOVABLE_API_AUTH_TOKEN ? { Authorization: `Bearer ${LOVABLE_API_AUTH_TOKEN}` } : {}),
        },
        body: JSON.stringify({
          route: resolvedSystemRoute,
          systemRoute: resolvedSystemRoute,
          chatbot,
          task,
          input: prompt,
          messages: [
            { role: "system", content: `You are a professional AI assistant specializing in ${task}. Provide polished, high-quality responses.` },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (response.ok) {
        return await response.json();
      }
      console.warn(`Gateway route ${resolvedSystemRoute} failed: ${response.status}. Falling back to direct gateway.`);
    } catch (err) {
      console.warn("Configured gateway fetch error. Falling back to direct gateway:", err);
    }
  }

  // 2. Direct Fallback to ai.gateway.lovable.dev (Mirroring Competitor Service)
  const directResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-flash-1.5",
      messages: [
        { role: "system", content: `You are a professional AI marketing assistant specializing in ${task}. Return only valid JSON, no markdown.` },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!directResponse.ok) {
    throw new Error(`AI gateway error (${directResponse.status})`);
  }

  const data = await directResponse.json();
  return data.choices?.[0]?.message?.content || "";
}
