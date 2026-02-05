import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildGeneratePrompt, buildGradePrompt } from "./prompts";

export type ModelId =
  | "claude-sonnet-4-5-20250929"
  | "claude-opus-4-6";

export const MODELS: { id: ModelId; label: string }[] = [
  { id: "claude-sonnet-4-5-20250929", label: "Sonnet 4.5 (recommended)" },
  { id: "claude-opus-4-6", label: "Opus 4.6 (highest quality)" },
];

function getClient(apiKey: string): Anthropic {
  return new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
}

export interface GeneratedSentence {
  text: string;
  evaluation: string;
  grade: string;
  grade_reasoning: string;
}

export interface GenerateResult {
  exploration: string;
  sentences: GeneratedSentence[];
}

export interface GradeEvaluation {
  brain_stutter: string;
  compression: string;
  texture: string;
  names_vs_describes: string;
  paraphrasable: string;
}

export interface GradeResult {
  evaluation: GradeEvaluation;
  grade: string;
  grade_reasoning: string;
  suggestions: string[];
  revised_version: string | null;
}

export async function generateSentences(
  apiKey: string,
  model: ModelId,
  topic: string
): Promise<GenerateResult> {
  const client = getClient(apiKey);
  const message = await client.messages.create({
    model,
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildGeneratePrompt(topic) }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response format.");
  return JSON.parse(content.text);
}

export async function gradeSentence(
  apiKey: string,
  model: ModelId,
  topic: string,
  sentence: string
): Promise<GradeResult> {
  const client = getClient(apiKey);
  const message = await client.messages.create({
    model,
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildGradePrompt(topic, sentence) }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response format.");
  return JSON.parse(content.text);
}
