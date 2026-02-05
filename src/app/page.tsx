"use client";

import { useState } from "react";

type Mode = "generate" | "write";
type ModelId = "claude-sonnet-4-5-20250929" | "claude-opus-4-6";

interface GeneratedSentence {
  text: string;
  evaluation: string;
  grade: string;
  grade_reasoning: string;
}

interface GenerateResult {
  exploration: string;
  sentences: GeneratedSentence[];
}

interface GradeEvaluation {
  brain_stutter: string;
  compression: string;
  texture: string;
  names_vs_describes: string;
  paraphrasable: string;
}

interface GradeResult {
  evaluation: GradeEvaluation;
  grade: string;
  grade_reasoning: string;
  suggestions: string[];
  revised_version: string | null;
}

function gradeColor(grade: string): string {
  if (grade.startsWith("A")) return "text-emerald-400";
  if (grade.startsWith("B")) return "text-amber-400";
  if (grade.startsWith("C")) return "text-orange-400";
  return "text-red-400";
}

function gradeBg(grade: string): string {
  if (grade.startsWith("A")) return "bg-emerald-500/10 border-emerald-500/30";
  if (grade.startsWith("B")) return "bg-amber-500/10 border-amber-500/30";
  if (grade.startsWith("C")) return "bg-orange-500/10 border-orange-500/30";
  return "bg-red-500/10 border-red-500/30";
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("generate");
  const [model, setModel] = useState<ModelId>("claude-sonnet-4-5-20250929");
  const [topic, setTopic] = useState("");
  const [sentence, setSentence] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generateResult, setGenerateResult] = useState<GenerateResult | null>(
    null
  );
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setGenerateResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, model }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setGenerateResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGrade() {
    setLoading(true);
    setError(null);
    setGradeResult(null);
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, sentence, model }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setGradeResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
            MetaphorTune
          </h1>
          <p className="mt-2 text-zinc-400">
            Craft opening sentences that make the reader&rsquo;s brain stutter.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {/* Mode Toggle */}
        <div className="flex gap-1 rounded-lg bg-zinc-900 p-1 mb-8">
          <button
            onClick={() => {
              setMode("generate");
              setError(null);
              setGradeResult(null);
            }}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
              mode === "generate"
                ? "bg-zinc-700 text-zinc-50 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Generate First Lines
          </button>
          <button
            onClick={() => {
              setMode("write");
              setError(null);
              setGenerateResult(null);
            }}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
              mode === "write"
                ? "bg-zinc-700 text-zinc-50 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Write &amp; Get Graded
          </button>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              Story Topic
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. a dictator's last day in power, a phone call that changes everything..."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          {mode === "write" && (
            <div>
              <label
                htmlFor="sentence"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Your Opening Sentence
              </label>
              <textarea
                id="sentence"
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                placeholder='e.g. The letter arrived like a teeth cleaning — you knew it was coming and you still dreaded it.'
                rows={3}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 resize-none"
              />
            </div>
          )}

          {/* Model Selector */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="model"
              className="text-sm font-medium text-zinc-400 shrink-0"
            >
              Model
            </label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value as ModelId)}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option value="claude-sonnet-4-5-20250929">
                Sonnet 4.5 (recommended)
              </option>
              <option value="claude-opus-4-6">
                Opus 4.6 (highest quality)
              </option>
            </select>
          </div>

          <button
            onClick={mode === "generate" ? handleGenerate : handleGrade}
            disabled={
              loading ||
              !topic.trim() ||
              (mode === "write" && !sentence.trim())
            }
            className="w-full rounded-lg bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {mode === "generate"
                  ? "Generating metaphors..."
                  : "Evaluating your sentence..."}
              </span>
            ) : mode === "generate" ? (
              "Generate Opening Lines"
            ) : (
              "Grade My Sentence"
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Generate Results */}
        {generateResult && (
          <div className="mt-10 space-y-6">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                Emotional Texture Exploration
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed italic">
                {generateResult.exploration}
              </p>
            </div>

            <h2 className="text-lg font-semibold text-zinc-200">
              Generated Opening Lines
            </h2>

            <div className="space-y-4">
              {generateResult.sentences.map((s, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="text-zinc-100 font-serif text-lg leading-relaxed">
                      &ldquo;{s.text}&rdquo;
                    </p>
                    <span
                      className={`shrink-0 rounded-md border px-3 py-1 text-sm font-bold ${gradeBg(s.grade)} ${gradeColor(s.grade)}`}
                    >
                      {s.grade}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {s.evaluation}
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {s.grade_reasoning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grade Results */}
        {gradeResult && (
          <div className="mt-10 space-y-6">
            {/* Grade Banner */}
            <div
              className={`rounded-lg border p-6 text-center ${gradeBg(gradeResult.grade)}`}
            >
              <div
                className={`text-5xl font-bold ${gradeColor(gradeResult.grade)}`}
              >
                {gradeResult.grade}
              </div>
              <p className="mt-2 text-sm text-zinc-300">
                {gradeResult.grade_reasoning}
              </p>
            </div>

            {/* Detailed Evaluation */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Detailed Evaluation
              </h3>

              {[
                {
                  label: "Brain Stutter",
                  value: gradeResult.evaluation.brain_stutter,
                },
                {
                  label: "Compression",
                  value: gradeResult.evaluation.compression,
                },
                {
                  label: "Emotional Texture",
                  value: gradeResult.evaluation.texture,
                },
                {
                  label: "Names vs. Describes",
                  value: gradeResult.evaluation.names_vs_describes,
                },
                {
                  label: "Paraphrasable?",
                  value: gradeResult.evaluation.paraphrasable,
                },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-sm font-medium text-zinc-300">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-400 leading-relaxed">
                    {item.value}
                  </dd>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            {gradeResult.suggestions.length > 0 && (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                  Suggestions for Improvement
                </h3>
                <ul className="space-y-2">
                  {gradeResult.suggestions.map((s, i) => (
                    <li
                      key={i}
                      className="text-sm text-zinc-300 leading-relaxed flex gap-2"
                    >
                      <span className="text-zinc-500 shrink-0">{i + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Revised Version */}
            {gradeResult.revised_version && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400/70 mb-3">
                  Suggested Revision
                </h3>
                <p className="text-zinc-100 font-serif text-lg leading-relaxed italic">
                  &ldquo;{gradeResult.revised_version}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-16">
        <div className="mx-auto max-w-3xl px-6 py-6 text-center text-xs text-zinc-600">
          Powered by Claude &middot; Metaphors should make your brain stutter
        </div>
      </footer>
    </div>
  );
}
