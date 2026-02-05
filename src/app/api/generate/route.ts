import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildGeneratePrompt } from "@/lib/prompts";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide a story topic." },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-opus-4-0-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildGeneratePrompt(topic.trim()),
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response format." },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content.text);
    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Generate error:", error);
    const msg =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
