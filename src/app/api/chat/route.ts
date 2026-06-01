import { NextRequest } from "next/server";
import type { Content } from "@google/genai";
import { prisma } from "@/lib/db";
import { generatePlan, PlanInputs, RiskAppetite } from "@/lib/calculations";
import {
  FROZEN_SYSTEM_PROMPT,
  buildProfileContext,
  buildEngineContext,
  getGeminiClient,
  ProfileExtras,
} from "@/lib/advisor";
import { buildPlan as buildEnginePlan } from "@/lib/retirement-engine";
import { profileToClient } from "@/lib/profile-to-engine";

export const runtime = "nodejs";
export const maxDuration = 300; // Allow long structured responses (tables + multi-stage plans) to stream fully.
// Deploy trigger: romanized-language + 503-retry fixes (v2).

// Detect the dominant script of a text and return a Gemini-friendly instruction
// telling the model exactly which language to reply in.
function detectLanguageInstruction(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "Reply in English.";

  // Unicode script ranges
  const ranges: Array<{ name: string; regex: RegExp; instruction: string }> = [
    { name: "Hindi", regex: /[ऀ-ॿ]/, instruction: "The user wrote in Hindi (Devanagari script). Reply ENTIRELY in Hindi using Devanagari. Do NOT mix English." },
    { name: "Bengali", regex: /[ঀ-৿]/, instruction: "The user wrote in Bengali. Reply ENTIRELY in Bengali." },
    { name: "Gujarati", regex: /[઀-૿]/, instruction: "The user wrote in Gujarati. Reply ENTIRELY in Gujarati." },
    { name: "Punjabi", regex: /[਀-੿]/, instruction: "The user wrote in Punjabi (Gurmukhi script). Reply ENTIRELY in Punjabi." },
    { name: "Tamil", regex: /[஀-௿]/, instruction: "The user wrote in Tamil. Reply ENTIRELY in Tamil." },
    { name: "Telugu", regex: /[ఀ-౿]/, instruction: "The user wrote in Telugu. Reply ENTIRELY in Telugu." },
    { name: "Kannada", regex: /[ಀ-೿]/, instruction: "The user wrote in Kannada. Reply ENTIRELY in Kannada." },
    { name: "Malayalam", regex: /[ഀ-ൿ]/, instruction: "The user wrote in Malayalam. Reply ENTIRELY in Malayalam." },
    { name: "Marathi", regex: /[ऀ-ॿ]/, instruction: "" }, // Marathi also uses Devanagari → caught by Hindi rule
  ];

  for (const r of ranges) {
    if (r.instruction && r.regex.test(trimmed)) return r.instruction;
  }

  // No Indic script detected → Latin alphabet. This is EITHER English OR a
  // romanized Indian language (Telugu/Tamil/Hindi/etc. typed in Roman letters).

  // Strong, explicit signal for romanized Hindi (Hinglish).
  const hinglishMarkers = /\b(mera|tera|aap|hum|ham|kya|kaise|nahi|nahin|hain?|tha|thi|ke|ka|ki|ko|se|mein|main|toh|to|bhi|jo|woh|wo|yeh|ye|chahiye|paisa|hindi|matlab|samjh|samajh|batao|dikhao|dikh|bata)\b/i;
  if (hinglishMarkers.test(trimmed)) {
    return "The user wrote in Hinglish (Roman-script Hindi). Reply in Hinglish — mix Hindi words written in Roman/Latin letters with English where natural. Do NOT use Devanagari script.";
  }

  // Romanized Telugu markers (Telugu typed in Roman/Latin letters).
  const romanTeluguMarkers = /\b(nenu|naaku|naku|niku|neeku|nuvvu|meeru|miru|enti|emiti|emi|em|indi|idi|adi|ela|ila|ledu|lev|ledhu|kaavali|kavali|cheppu|cheppandi|chey|chesi|chestha|ista|istha|ardham|ardam|artham|telusu|teliyadu|baagundi|bagunnara|dabbu|pani|kaani|kani|vundi|unna|undi|plan)\b/i;
  if (romanTeluguMarkers.test(trimmed)) {
    return "The user wrote in romanized Telugu (Telugu in Roman/Latin letters). Reply in Telugu written in Roman/Latin letters (transliterated — NOT Telugu script), the same way the user typed, mixing English financial terms where natural. Do NOT reply in English or Hindi.";
  }

  // Unknown Latin-script input → let the model identify the language and match it.
  // The model is reliable at detecting romanized Indian languages; only force
  // English when the text is plainly standard English.
  return "The user wrote using the Latin/Roman alphabet. This is EITHER English OR a romanized Indian language (e.g. Telugu, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi written in Roman letters). Carefully identify which language the user ACTUALLY wrote in, then reply in THAT SAME language using the SAME Roman/Latin script the user used (do not switch to a native script). ONLY if the message is plainly standard English words should you reply in English.";
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  profileId: string;
  messages: ChatMessage[];
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChatRequest;
  const { profileId, messages } = body;

  if (!profileId || !Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "profileId and messages required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const profile = await prisma.userProfile.findUnique({ where: { id: profileId } });
  if (!profile) {
    return new Response(JSON.stringify({ error: "profile not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  let ai;
  try {
    ai = getGeminiClient();
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Gemini client unavailable" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const planInputs: PlanInputs = {
    age: profile.age,
    corpus: profile.corpus,
    desiredMonthlyIncome: profile.desiredMonthlyIncome,
    otherMonthlyIncome: profile.pensionMonthly + profile.rentalMonthly + profile.dividendMonthly,
    inflationRate: profile.inflationRate,
    planningHorizon: profile.planningHorizon,
    riskAppetite: profile.riskAppetite as RiskAppetite,
    legacyAmount: profile.legacyAmount,
  };
  const plan = generatePlan(planInputs);

  const profileExtras: ProfileExtras = {
    maritalStatus: profile.maritalStatus,
    spouseAge: profile.spouseAge,
    dependents: profile.dependents,
    cityTier: profile.cityTier,
    corpus: profile.corpus,
    otherMonthlyIncome: planInputs.otherMonthlyIncome,
    desiredMonthlyIncome: profile.desiredMonthlyIncome,
    inflationRate: profile.inflationRate,
    riskAppetite: profile.riskAppetite,
    planningHorizon: profile.planningHorizon,
    hasHealthInsurance: profile.hasHealthInsurance,
    healthCover: profile.healthCover,
    bucketListGoals: profile.bucketListGoals ? JSON.parse(profile.bucketListGoals) : [],
    hobbies: profile.hobbies ? JSON.parse(profile.hobbies) : [],
    healthConditions: profile.healthConditions ? JSON.parse(profile.healthConditions) : [],
  };

  const profileContext = buildProfileContext(plan, { fullName: profile.fullName, age: profile.age }, profileExtras);

  // ── Deterministic engine output — the AI must reference THESE numbers, not compute its own.
  const engineClient = profileToClient(profile);
  const enginePlan = buildEnginePlan(engineClient);
  const engineContext = buildEngineContext(engineClient, enginePlan);

  // Detect the script of the user's MOST RECENT message and inject an explicit language instruction.
  // This is the bulletproof way to enforce language matching — the prompt-only approach is unreliable
  // when the system prompt has heavy Indian financial content that biases the model toward Hindi.
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const languageInstruction = detectLanguageInstruction(lastUserMessage);

  const systemInstruction = `${FROZEN_SYSTEM_PROMPT}\n\n---\n\n${profileContext}\n\n---\n\n${engineContext}\n\n---\n\n# 🔒 LANGUAGE FOR THIS REPLY (MACHINE-DETECTED, NON-NEGOTIABLE)\n${languageInstruction}`;

  // Gemini uses { role: "user" | "model", parts: [{text}] } shape.
  const contents: Content[] = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Models to try in order. If the primary is overloaded (503), we retry it once,
  // then fall back to a lighter model. This keeps Google's transient "high demand"
  // errors mostly invisible to the user.
  const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash", "gemini-2.0-flash"];
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const isOverloaded = (err: unknown): boolean => {
    const s = (err instanceof Error ? err.message : String(err)).toLowerCase();
    return (
      s.includes("503") ||
      s.includes("unavailable") ||
      s.includes("overloaded") ||
      s.includes("high demand") ||
      s.includes("429") ||
      s.includes("resource_exhausted") ||
      s.includes("rate limit")
    );
  };

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let enqueuedAny = false;

      for (let attempt = 0; attempt < MODELS.length; attempt++) {
        const model = MODELS[attempt];
        try {
          const response = await ai.models.generateContentStream({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          });

          for await (const chunk of response) {
            const text = chunk.text;
            if (text) {
              enqueuedAny = true;
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
          return;
        } catch (err) {
          console.error(`[chat] attempt ${attempt + 1}/${MODELS.length} (${model}) failed:`, err);

          // If we already streamed part of a reply, we can't cleanly retry — bail gracefully.
          if (enqueuedAny) {
            controller.enqueue(encoder.encode("\n\n⚠️ The reply was interrupted. Please try again."));
            controller.close();
            return;
          }

          // Transient overload and we still have attempts left → wait and retry/fall back.
          if (isOverloaded(err) && attempt < MODELS.length - 1) {
            await sleep(1000 * (attempt + 1));
            continue;
          }

          // Out of attempts (or a non-retryable error) → friendly message, no raw JSON.
          const friendly = isOverloaded(err)
            ? "⚠️ The AI is very busy right now (Google's servers are overloaded). Please wait a minute and send your message again."
            : "⚠️ Sorry, something went wrong generating a reply. Please try again.";
          controller.enqueue(encoder.encode(friendly));
          controller.close();
          return;
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
