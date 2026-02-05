/**
 * Extract JSON from a string that may be wrapped in markdown code fences.
 */
export function extractJson(text: string): unknown {
  // Strip markdown code fences if present
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  const jsonStr = fenceMatch ? fenceMatch[1] : text;
  return JSON.parse(jsonStr.trim());
}
