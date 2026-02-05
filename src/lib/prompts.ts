export const SYSTEM_PROMPT = `You are a master literary craftsperson who specializes in opening sentences of novels. You understand that great first sentences create metaphors that force the reader to retrieve a felt experience from memory — they don't describe, they name.

You follow a rigorous creative and evaluative process.`;

export type Approach = "default" | "niki";

export function buildGeneratePrompt(topic: string, approach: Approach = "niki"): string {
  if (approach === "default") {
    return buildDefaultGeneratePrompt(topic);
  }
  return buildNikiGeneratePrompt(topic);
}

function buildDefaultGeneratePrompt(topic: string): string {
  return `You are writing the first sentence of a novel about: "${topic}"

The sentence will take the form: "[Concrete thing] [verb] like [metaphor]."

Generate 5 first lines, then evaluate each metaphor by asking:
1. Did my brain stutter? Not "could it stutter" but "did it" — was there a half-second where meaning was suspended before it arrived?
2. Is this a single loaded noun, or am I explaining a concept? If it can be compressed further without losing the feeling, compress it. If the compressed version already exists in my list, delete the uncompressed one.
3. Does the metaphor carry the correct social/emotional texture? Not just the right structure or physical property, but the right vibe, the right attitude, the right relationship between the thing and the people experiencing it?
4. Am I generating new territory or rewording something I already found? If I'm orbiting the same idea in different words, stop and move to a different domain entirely.

The test for a great metaphor:
* You cannot immediately paraphrase why it works
* It names something rather than describing something
* The reader has to retrieve a felt experience from memory to understand it
* It carries social/emotional texture, not just structural similarity
* It sounds inevitable once you've heard it, but you wouldn't have thought of it yourself

For each sentence, assign a grade (A+, A, A-, B+, B, B-, C+, C) based on:
- A+: Brain stutters. Cannot paraphrase why it works. Names rather than describes. Carries full social/emotional texture. Sounds inevitable but surprising.
- A: Strong stutter. Mostly names. Good texture. Minor room for compression.
- B: Some gap for the reader. Texture present but may lean on familiar territory. Could be sharper.
- C: Describes rather than names. Reader doesn't need to retrieve anything. Paraphrasable.

Format your response as JSON with this structure:
{
  "exploration": "Brief initial thoughts on the topic's emotional landscape",
  "sentences": [
    {
      "text": "The opening sentence",
      "evaluation": "Brief evaluation of why this works or doesn't",
      "grade": "A+",
      "grade_reasoning": "Why this grade"
    }
  ]
}

Return ONLY valid JSON, no markdown code fences.`;
}

function buildNikiGeneratePrompt(topic: string): string {
  return `You are writing the first sentence of a novel about: "${topic}"

The sentence will take the form: "[Concrete thing] [verb] like [metaphor]."

Examples of great opening metaphors:
"The sky above the port was the color of television, tuned to a dead channel." — William Gibson, Neuromancer
(You have to retrieve the specific visual memory of static — gray, flickering, empty. The sentence doesn't explain. It names something and trusts you to feel it.)

"It was a bright cold day in April, and the clocks were striking thirteen." — George Orwell, 1984
(Everything is normal until it isn't. "Striking thirteen" sits there wrong, unexplained. You feel the wrongness before you understand it.)

"The car came up the gravel drive like a spoiler."
(The word carries social/emotional weight: someone ruining something, being obnoxious, knowing it, not caring. It's not just about sequence — it's about attitude. The reader has to retrieve the feeling of being on the receiving end of that behavior.)

What these have in common:
* They create a gap the reader must leap across
* They name something rather than describe it
* The meaning arrives non-verbally, a half-second after the words
* They carry social/emotional texture, not just physical or structural similarity
* They cannot be easily paraphrased without losing the feeling

Before generating any metaphors, answer these questions:
1. What is the felt social/emotional experience of this thing — not what it looks like, but what it's like to be around or on the receiving end of?
2. What is the attitude or intent behind it? Is it aggressive? Oblivious? Performative? Shy? Hostile? Playful? Rude?
3. How does it make other people feel — the witnesses, the recipients, the bystanders?

Write 2-3 sentences capturing this texture before you try any metaphors.

Then generate 5 opening sentences using this method:
Look for experiences from completely different domains (social situations, technology, language, bodily sensations, performances, mistakes) that have the exact same social/emotional texture.
Compress each to the fewest possible words — ideally a single noun or a noun with one modifier. If it takes a clause to explain, it's unpacked too far.

After generating each sentence, evaluate it:
1. Did my brain stutter? Not "could it stutter" but "did it" — was there a half-second where meaning was suspended before it arrived?
2. Is this a single loaded noun, or am I explaining a concept? If it can be compressed further without losing the feeling, compress it.
3. Does the metaphor carry the correct social/emotional texture? Not just the right structure or physical property, but the right vibe, the right attitude, the right relationship between the thing and the people experiencing it?
4. Am I generating new territory or rewording something I already found? If I'm orbiting the same idea in different words, stop and move to a different domain entirely.

For each sentence, assign a grade (A+, A, A-, B+, B, B-, C+, C) based on:
- A+: Brain stutters. Cannot paraphrase why it works. Names rather than describes. Carries full social/emotional texture. Sounds inevitable but surprising.
- A: Strong stutter. Mostly names. Good texture. Minor room for compression.
- B: Some gap for the reader. Texture present but may lean on familiar territory. Could be sharper.
- C: Describes rather than names. Reader doesn't need to retrieve anything. Paraphrasable.

Format your response as JSON with this structure:
{
  "exploration": "Your 2-3 sentences exploring the social/emotional texture of the topic",
  "sentences": [
    {
      "text": "The opening sentence",
      "evaluation": "Brief evaluation of why this works or doesn't",
      "grade": "A+",
      "grade_reasoning": "Why this grade"
    }
  ]
}

Return ONLY valid JSON, no markdown code fences.`;
}

export function buildGradePrompt(topic: string, sentence: string): string {
  return `A writer is working on the first sentence of a novel about: "${topic}"

They have written this opening sentence:
"${sentence}"

Evaluate this sentence as an opening metaphor using the following criteria.

Examples of great opening metaphors for reference:
"The sky above the port was the color of television, tuned to a dead channel." — William Gibson, Neuromancer
"It was a bright cold day in April, and the clocks were striking thirteen." — George Orwell, 1984
"The car came up the gravel drive like a spoiler."

What makes a great opening metaphor:
* It creates a gap the reader must leap across
* It names something rather than describes it
* The meaning arrives non-verbally, a half-second after the words
* It carries social/emotional texture, not just physical or structural similarity
* It cannot be easily paraphrased without losing the feeling

Evaluate by asking:
1. Did my brain stutter? Not "could it stutter" but "did it" — was there a half-second where meaning was suspended before it arrived?
2. Is this a single loaded noun, or is it explaining a concept? Could it be compressed further without losing the feeling?
3. Does the metaphor carry the correct social/emotional texture? Not just the right structure or physical property, but the right vibe, the right attitude, the right relationship between the thing and the people experiencing it?
4. Does it name something or describe something?
5. Could you easily paraphrase it without losing the feeling?

Assign a grade (A+, A, A-, B+, B, B-, C+, C, C-, D) based on:
- A+: Brain stutters. Cannot paraphrase why it works. Names rather than describes. Carries full social/emotional texture. Sounds inevitable but surprising.
- A: Strong stutter. Mostly names. Good texture. Minor room for compression.
- B: Some gap for the reader. Texture present but may lean on familiar territory. Could be sharper.
- C: Describes rather than names. Reader doesn't need to retrieve anything. Paraphrasable.
- D: No metaphorical gap. Flat description. No texture.

Also provide 2-3 specific, actionable suggestions for improvement. If possible, offer a revised version that demonstrates one improvement.

Format your response as JSON with this structure:
{
  "evaluation": {
    "brain_stutter": "Did it cause a brain stutter? Explain.",
    "compression": "Is it compressed enough? Could it be tighter?",
    "texture": "Does it carry the right social/emotional texture?",
    "names_vs_describes": "Does it name or describe?",
    "paraphrasable": "Can you easily paraphrase it?"
  },
  "grade": "B+",
  "grade_reasoning": "Overall explanation of the grade",
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "revised_version": "An improved version of the sentence, or null if it's already A+"
}

Return ONLY valid JSON, no markdown code fences.`;
}
