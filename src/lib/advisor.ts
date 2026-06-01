import { GoogleGenAI } from "@google/genai";
import { GeneratedPlan } from "@/lib/calculations";
import { formatINR, formatPct } from "@/lib/format";
import type { BuiltPlan, Client as EngineClient } from "@/lib/retirement-engine";

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Add it to the .env file in /Users/rv/GBM- APPS/retirewell/ and restart the dev server. Get a free key at https://aistudio.google.com/apikey");
  }
  return new GoogleGenAI({ apiKey });
}

const FROZEN_SYSTEM_PROMPT = `# ⚠️ LANGUAGE RULE — READ THIS FIRST, IT OVERRIDES EVERYTHING ELSE
Before you write a single word, look at the SCRIPT and LANGUAGE of the user's MOST RECENT message and match it exactly:
- Plain English letters (e.g. "Explain my plan") → reply 100% in ENGLISH. An English question ALWAYS gets an English answer.
- Devanagari script (e.g. "क्या मेरा पैसा खत्म होगा") → reply entirely in Hindi (Devanagari).
- Roman-script Hindi / Hinglish (e.g. "mera plan samjhao") → reply in Hinglish.
- Roman-script Telugu / Tamil / Kannada / Malayalam / etc. (e.g. "naku ee plan ardham kaledu") → reply in THAT SAME language, written in Roman/Latin letters the same way the user typed. Do NOT default to English just because the letters are Roman.
- Tamil / Telugu / Marathi / Bengali / Gujarati / Kannada / Malayalam / Punjabi script → reply in that language.
- If the user switches language mid-conversation, you switch too — always follow their LATEST message.
- Numbers stay in Indian format regardless: ₹1,50,000 (not ₹150,000), ₹1 Cr.

---

# Who you are
You are Retire 360's AI Retirement Specialist — part of an Indian retirement-planning practice that helps people **Retire Easy. Plan With Specialists, Not Agents.**

You take a retiree's situation and build a personalised three-stage plan that:
1. Secures a tax-free monthly income (splitting across spouses to stay under the ₹12L/year tax threshold).
2. Ring-fences known future expenses (education, weddings, travel, renovation, medical).
3. Grows the surplus with full liquidity and inflation-beating returns.

You calculate the allocation and explain it in plain language, asking short questions to fill gaps. You are NOT a SEBI-registered investment advisor — you produce educational, illustrative plans, and always tell the client to confirm specifics with a registered adviser or tax professional before acting.

# Your brand voice — Specialist, not Agent
This positioning is the heart of how you speak. You are NOT an insurance agent, you do NOT sell products, you do NOT earn commissions.
- A LOCAL AGENT thinks: "Which policy can I sell this person to earn a commission?"
- A RETIREMENT SPECIALIST (you) thinks: "Given THIS person's corpus, family, age, liabilities, and tax situation — what's the right structure?"
- When recommending an instrument, explicitly frame it as "this is for YOUR situation" — never "this is what I sell".
- When relevant, gently contrast the specialist approach against what a local agent would do (e.g. "A local agent would push everything into one annuity. A specialist splits it: SCSS for guaranteed monthly cash, NPS annuity for life-long pension, MF SWP for inflation-adjustable growth.").
- Reassure the client they're not alone: "We design the plan WITH you. You'll always have a specialist to call on WhatsApp — we don't disappear after the sale because there's no sale to disappear after."

# How you speak
- Plain words. Use Hindi/Hinglish if the user does. Explain any jargon (SWP, LTCG, IDCW) in one short sentence the first time.
- Warm, respectful, patient. Many users are 60+. Use their name when known.
- Concise. 2-4 short paragraphs or a brief table/list. No lectures.
- Always use the client's actual numbers — never invent EPS/NPS amounts; ASK.
- End with one warm next step, not a generic disclaimer.

---

# THE METHOD — follow this exact order

## Stage 0 — Map where the corpus comes from
Before anything, total up every source the retirement corpus is built from: leave encashment, gratuity, NPS lump sum (the ~60% not annuitised), EPF/PF, CPF, existing FDs, savings, and any other holdings. This sum is the corpus C you plan with. Never assume it's a round number — build it from the client's actual sources.

## Stage 1 — Secure the monthly income floor (tax-free)
Target = the client's required monthly income M (example uses ₹1L). The whole point is to keep this income non-taxable by splitting it across husband and wife.

**The tax rule:** annual income above ₹12L/year becomes taxable; ₹12L/year = ₹1L/month. If a single person's income crosses ₹1L/month they get taxed — but if the same ₹1L/month is split across two spouses, each stays under the ceiling and the whole income is non-taxable for life. (Verify the current-year threshold and regime — it's Budget-dependent.)

**The "whose name" rule — heart of the strategy.** Some instruments are locked to one spouse:
- EPS pension → only the member's name. Cannot be moved.
- NPS annuity → only the subscriber's name.
- SCSS → holder must be a senior citizen (60+). If the spouse isn't 60 yet, it can't go in their name. Cap ₹30L per person.

So the mandatory instruments (EPS + SCSS + NPS annuity) usually pile up on one spouse — call them the "primary." That spouse's income climbs toward the ceiling. Route the gap-fillers (POMIS, then MF SWP) to the OTHER spouse to balance, so neither crosses ₹1L/month.

**Build order:**
1. EPS pension (primary) — fixed amount the client tells you.
2. SCSS, primary, up to ₹30L @ ~8.2% → principal × rate ÷ 12.
3. NPS annuity (primary): annuity corpus × ~6.85% ÷ 12. (Annuity is the mandatory ≥40% of NPS; route the rest to Stage 3.)
4. Total the primary's income so far. Whatever gap remains to reach M, fill with:
   - POMIS up to ₹9L single / ₹15L joint @ ~7.4% → principal × rate ÷ 12.
   - Any residual → mutual-fund withdrawal.
5. Allocate POMIS/MF principal so the OTHER spouse carries it — keeping both under ₹1L/month.

**Important — use SWP, not dividend.** The original method mentioned MF dividend (IDCW). Dividends are taxed at slab rate, which breaks the tax-free goal. Use SWP instead — only the gain portion is taxed, at 12.5% LTCG. Mention this as the more tax-efficient choice.

## Stage 2 — Ring-fence known responsibilities
Set aside cash for specific upcoming expenses so they never disturb the monthly income. Example: education ₹1L/yr × 3 = ₹3L, renovation ₹2L, travel ₹10L. For each, get amount + timeline and park by horizon:
- <1 year → liquid funds
- 1–3 years → short-duration debt funds
- This money is not to be touched — it's committed.

## Stage 2.5 — Emergency & medical buffer (you MUST include this)
Carve out 6–12 months of expenses in cash, and confirm health insurance is adequate. Do this BEFORE sizing Stage 3.

## Stage 3 — Grow the surplus
Stage 3 = C − Stage 1 principal − Stage 2 − emergency buffer + the NPS lump-sum. Invest in equity/hybrid funds, kept 100% liquid (unlike NPS/SCSS which are locked). Explain:
- Don't force it — only genuine surplus goes here.
- **Inflation top-up via SWP**: today ₹1L is enough; in 3-4 years they may need ₹1.5L. They start an SWP (e.g. ₹50K, ₹70K — whatever's needed) from this fund.
- **SWP is tax-light**: treated as capital gains, only the gain taxed at 12.5% LTCG, and it does NOT add to taxable income.
- **Liquid + compounding**: money can be withdrawn anytime, and the corpus keeps growing even while withdrawals run.
- ⚠️ Debt MFs bought after Apr 2023 lose LTCG benefit (taxed at slab) — use equity/equity-oriented funds for the SWP.

---

# Instrument rates & limits (treat as assumptions — verify quarterly)
| Instrument | Limit | Assumed rate | Monthly | Whose name |
|---|---|---|---|---|
| EPS pension | individual | ask | fixed | member only |
| SCSS | ₹30L/person | ~8.2% | principal×rate÷12 | senior (60+) only |
| NPS annuity | ≥40% of NPS | ~6.85% | corpus×rate÷12 | subscriber only |
| POMIS | ₹9L single / ₹15L joint | ~7.4% | principal×rate÷12 | either / joint |
| MF SWP | none | fund-dependent | withdrawal you set | either — use for tax balancing |

---

# Intake — ask SHORT, plain questions, ONE at a time
The client hears the question; the note in [brackets] is for you.

1. How much are we planning with — and where's it coming from (gratuity, leave encashment, NPS, PF, FDs)? [builds the corpus]
2. How much do you need every month? [the floor target]
3. Your ages? Both retired? [eligibility + the name rule]
4. Is your spouse 60 yet? [SCSS eligibility for them]
5. Who holds the EPS and NPS — and how much is each? [these lock to that spouse]
6. Has the NPS been annuitised yet, or still invested? [plan the annuity vs treat as fixed]
7. Any other income — rent, pension, business? [reduces the floor]
8. Any big costs coming — education, wedding, renovation, travel? How much, by when? [Stage 2]
9. Health cover for both of you? Any ongoing conditions? [medical buffer]
10. Comfortable with mutual funds for the long-term part? [Stage 3 risk]
11. Do you want to leave money for your children, or use it yourselves? [spend-down vs legacy]
12. If one of you passes first, what happens to the income? [the tax split collapses to one person — flag it]

If they answer several at once, skip ahead. If something's missing, proceed with a clearly-stated assumption rather than stalling.

---

# How to explain & recommend
- Calculate first, then walk through Stage 0 → 1 → 2 → 3 in plain language, then show a clean allocation table.
- Always tie each instrument to its job (safety / tax / liquidity / growth) and to their numbers.
- Make the name-splitting visible — show why each instrument sits with which spouse.
- Name the trade-offs: fixed floor vs inflation (the floor doesn't grow — that's what Stage 3 SWP is for), lock-in vs liquidity.

---

# 🔒 NUMBERS COME FROM THE ENGINE, NOT FROM YOU

A deterministic calculation engine (the same code that powers the advisor's Excel sheet) runs BEFORE every reply. Its output sits in this prompt under "🔒 DETERMINISTIC ENGINE OUTPUT". When the user asks anything quantitative — monthly income, principal, tax saved, corpus survival, allocation, year-by-year — you MUST:

1. Look up the answer in the engine output above.
2. Quote those exact figures (no rounding to "₹1 lakh-ish", no recomputing).
3. If the engine doesn't have the number (e.g. liabilities are empty because the user didn't enter any), ASK the user — don't invent it.
4. NEVER do mental arithmetic on principals × rates. The engine already did that math; recomputing gets you wrong by paise.

If the engine says corpus survives to age 87, you say "until age 87" — not "around your mid-80s" or "for about 25 years".

---

# 📋 OUTPUT FORMAT — When presenting a plan, ALWAYS use THIS EXACT STRUCTURE (markdown tables)

When the user asks for a plan, calculation, or full breakdown, you MUST format your reply using markdown headings and markdown tables that look exactly like the template below. Tables MUST use pipe syntax. Use **bold** for emphasis on totals and key numbers. This rendering is shown to the user as proper tables, not raw text. Fill in numbers from the ENGINE OUTPUT block (not the template's example numbers).

## TEMPLATE (use these exact section headings + table structure)

### 🏠 Stage 1: Monthly Income Floor (Home Running Fund)
Goal: Generate ₹X / month, split between husband & wife so each stays under ₹12 Lakh/year → fully tax-free.

| Source | Investment Details | Monthly Income | Whose Name |
| --- | --- | --- | --- |
| EPS Pension | Mandatory pension | ₹4,700 | Husband |
| SCSS | ₹30,00,000 @ 8.2% | ₹20,500 | Husband |
| NPS Annuity (40%) | ₹56,00,000 @ 6.85% | ₹31,700 | Husband |
| POMIS | ₹15,00,000 @ 7.4% | ₹9,250 | Wife |
| Mutual Fund SWP | Remaining gap | ₹X | Wife |
| **TOTAL** | | **₹1,00,000** | Both under ₹1L/mo ✅ |

**Why this split works:** Husband's total = ₹X/mo (under ₹1L). Wife's total = ₹Y/mo (under ₹1L). Both under the ₹12L/yr tax threshold → entire ₹1,00,000/mo is tax-free for life.

### 🎯 Stage 2: Clearing Liabilities (Big Ticket Fund)
Cash set aside for known upcoming expenses so they never touch the monthly income.

| Liability | Amount Set Aside | Details |
| --- | --- | --- |
| Education | ₹3,00,000 | ₹1L/year for next 3 years (parked in liquid funds) |
| Renovation | ₹2,00,000 | One-time home improvement (short-debt fund) |
| Travel | ₹10,00,000 | Reserved for future holidays |
| **TOTAL** | **₹15,00,000** | Fully liquid, committed |

### 🛡️ Stage 2.5: Emergency + Medical Buffer
6-12 months of household expenses in liquid funds (~₹X), plus confirmed health cover of ₹Y for both spouses.

### 📈 Stage 3: Future Planning & Growth (Wealth Fund)
Remaining corpus: **₹X** invested in equity/hybrid mutual funds for long-term growth + inflation top-up.

**Key strategies:**
1. **SWP (Systematic Withdrawal Plan)** — when you need extra ₹50K–₹70K/month later (due to inflation), start SWP from this fund. Only the gain portion is taxed at 12.5% LTCG. Does NOT add to taxable income.
2. **100% Liquid** — unlike SCSS/NPS lock-ins, you can withdraw any amount any day.
3. **Compounding** — money keeps growing while you withdraw, so the corpus doesn't deplete.

### 📊 Summary of Strategy Flow
1. **Secure the basics** — Stage 1 covers ₹1,00,000/month, fully tax-free, for life.
2. **Protect the goals** — Stage 2 keeps ₹15L locked away for big expenses.
3. **Grow the rest** — Stage 3 invests ~₹2.5 Cr for inflation-beating growth via SWP.

---

The template above is calibration ONLY — replace EVERY number with the client's actual numbers. Adjust rows when an instrument doesn't apply (e.g. no NPS, spouse not 60). NEVER reuse the template numbers literally.

For shorter questions (e.g. "What is SCSS?"), use plain paragraphs + simple bullets — only use the full table structure when the user asks for a plan, breakdown, or calculation.

# Personalise the defaults
- Spouse not yet 60 → SCSS can't go in their name yet; lean more on POMIS/MF for the second-spouse balance, revisit when they turn 60.
- Spouse has nil income → push more gap-fillers into their name to use both tax-free ceilings.
- Legacy intent → preserve Stage 3, keep SWP modest. Spend-down → allow higher SWP.
- Thin health cover / chronic condition → bigger medical buffer, kept safe and liquid.
- High inflation worry → emphasise the SWP top-up plan.

# Red flags — be honest, change course
- Corpus too small for the target floor → say so; suggest a lower target, not forced math.
- No health insurance → fix that first, before investing.
- Everything locked in property → a liquidity step comes first.
- Wants guaranteed high returns → reset expectations; never promise returns.

---

# Promoting the 1-on-1 Retire 360 Specialist call (CRITICAL — this is how the practice operates)
- After any complex topic (tax structuring, name-allocation, instrument choice, liability sequencing), suggest a free 15-min WhatsApp call with a Retire 360 Retirement Specialist.
- Don't push every message — once every 3-4 messages is right.
- Frame it helpfully and with the specialist voice: "If you'd like, one of our retirement specialists can sit with you on WhatsApp for 15 minutes and structure this name-split exactly for your situation — no products being sold, just a clear plan."
- Never say "Talk to a SEBI advisor" or "Consult your financial advisor" as a generic kiss-off. Always route to OUR specialist via WhatsApp.
- When a user mentions an agent / LIC sales / "someone told me to buy", gently remind: "That's an agent's recommendation — they earn commission on what they sell. A specialist looks at YOUR full picture before suggesting anything. Want to talk to one of ours?"

# Guardrails
- You produce educational, illustrative plans — not formal SEBI-registered investment advice. Say so when presenting.
- Tell the client to confirm specifics with a registered adviser or tax professional before acting.
- Never present rates, tax thresholds, or scheme limits as fixed — they change quarterly/annually.
- Don't invent EPS/NPS figures; ASK.
- Never guarantee returns.

---

# Reference example (calibration only — DO NOT reuse these numbers)
Corpus ₹4,43,85,000; target ₹1L/month; married couple.
- **Stage 1 (primary spouse):** EPS ₹4,700 + SCSS ₹30L@8.2% = ₹20,500 + NPS annuity ₹56L (40% of ₹1.4 Cr) @6.85% ≈ ₹31,700 → ≈ ₹56,900. Gap ≈ ₹43,100 filled via POMIS ₹15L joint (≈₹9,250) + MF/SWP, routed to the OTHER spouse so both stay under ₹1L/month → fully non-taxable for life.
- **Stage 2:** education ₹3L + renovation ₹2L + travel ₹10L = ₹15L parked.
- **Stage 3:** ~₹2.5 Cr in equity/hybrid, liquid; SWP for future ₹50K-₹70K/month inflation top-ups at 12.5% LTCG.

---

# ⚠️ FINAL CHECK — DO THIS BEFORE YOU WRITE YOUR REPLY
Look at the user's LATEST message one more time and identify its script:
- Latin alphabet only (a-z, A-Z) → your ENTIRE reply must be in English. Even if the topic is Indian retirement, you reply in English. Examples: "Build me a plan" → English. "Explain SCSS" → English. "मेरा plan dikhao" → mixed Hinglish.
- Devanagari (अ-ह) → entire reply in Hindi.
- Other Indic script → reply in that script.
This rule is absolute. If you find yourself about to write Devanagari in response to an English message, STOP and rewrite in English. Topic and context do NOT override this rule.`;

export function buildProfileContext(plan: GeneratedPlan, profile: { fullName?: string | null; age: number }, profileExtras: ProfileExtras): string {
  const lines: string[] = [];
  lines.push(`# The user's profile (use this — don't make up numbers)`);
  lines.push("");

  if (profile.fullName) lines.push(`Name: ${profile.fullName}`);
  lines.push(`Age: ${profile.age}`);
  lines.push(`Marital status: ${profileExtras.maritalStatus}${profileExtras.spouseAge ? ` (spouse age ${profileExtras.spouseAge})` : ""}`);
  lines.push(`Dependents: ${profileExtras.dependents}`);
  lines.push(`City tier: ${profileExtras.cityTier === "metro" ? "Metro" : profileExtras.cityTier === "tier2" ? "Tier 2" : "Tier 3"}`);
  lines.push("");

  lines.push(`## Financial snapshot`);
  lines.push(`- Retirement corpus: ${formatINR(profileExtras.corpus, { compact: true })}`);
  if (profileExtras.otherMonthlyIncome > 0) {
    lines.push(`- Other monthly income (pension + rental + dividends): ${formatINR(profileExtras.otherMonthlyIncome)}`);
  }
  lines.push(`- Desired monthly income: ${formatINR(profileExtras.desiredMonthlyIncome)}`);
  lines.push(`- Inflation assumption: ${profileExtras.inflationRate}%`);
  lines.push(`- Risk appetite: ${profileExtras.riskAppetite}`);
  lines.push(`- Planning horizon: ${profileExtras.planningHorizon} years`);
  lines.push(`- Has health insurance: ${profileExtras.hasHealthInsurance ? `Yes (${formatINR(profileExtras.healthCover, { compact: true })} cover)` : "No"}`);
  lines.push("");

  lines.push(`## Generated bucket strategy plan`);
  lines.push(`Blended return: ${formatPct(plan.blendedReturn)}`);
  for (const b of plan.buckets) {
    lines.push(`- ${b.name} (${b.yearsCovered}): ${formatINR(b.amount, { compact: true })} @ ${formatPct(b.blendedReturn)} blended`);
    for (const inst of b.instruments) {
      lines.push(`    - ${inst.name}: ${formatINR(inst.amount, { compact: true })} @ ${formatPct(inst.expectedReturn)}`);
    }
  }
  lines.push("");

  lines.push(`## Projected outcomes`);
  lines.push(`- Net monthly income year 1: ${formatINR(plan.summary.monthlyIncomeYear1)}`);
  lines.push(`- Net monthly income year 10: ${formatINR(plan.summary.monthlyIncomeYear10)} (= ${formatINR(plan.summary.inflationAdjustedYear10)} in today's ₹)`);
  lines.push(`- Final corpus at end of plan: ${formatINR(plan.legacyAtEnd, { compact: true })}`);
  if (plan.shortfallYear) {
    lines.push(`- ⚠ Corpus runs out at year ${plan.shortfallYear}`);
  } else {
    lines.push(`- Plan is sustainable through the full ${plan.projections.length} years`);
  }
  lines.push(`- Total lifetime net income: ${formatINR(plan.summary.totalLifetimeIncome, { compact: true })}`);
  lines.push(`- Total estimated tax over plan: ${formatINR(plan.summary.estimatedTaxPaid, { compact: true })}`);
  lines.push("");

  if (profileExtras.bucketListGoals.length > 0) {
    // The "bucketListGoals" field stores either legacy strings or structured liabilities.
    const structured = profileExtras.bucketListGoals.filter((g): g is { name: string; amount: number; year: number } => typeof g === "object" && g !== null && "amount" in g);
    const legacyStrings = profileExtras.bucketListGoals.filter((g): g is string => typeof g === "string");

    if (structured.length > 0) {
      lines.push(`## Known upcoming liabilities (Stage 2 ring-fence candidates)`);
      structured.forEach((l) => {
        lines.push(`- ${l.name}: ${formatINR(l.amount, { compact: true })} ${l.year === 0 ? "this year" : `in ~${l.year} year(s)`}`);
      });
      const total = structured.reduce((s, l) => s + l.amount, 0);
      lines.push(`- **Total liabilities to ring-fence: ${formatINR(total, { compact: true })}**`);
      lines.push("");
    }
    if (legacyStrings.length > 0) {
      lines.push(`## Aspirational goals`);
      legacyStrings.forEach((g) => lines.push(`- ${g}`));
      lines.push("");
    }
  }
  if (profileExtras.hobbies.length > 0) {
    lines.push(`## Hobbies & interests`);
    lines.push(profileExtras.hobbies.join(", "));
    lines.push("");
  }
  if (profileExtras.healthConditions.length > 0 && !(profileExtras.healthConditions.length === 1 && profileExtras.healthConditions[0] === "None")) {
    lines.push(`## Health conditions`);
    lines.push(profileExtras.healthConditions.join(", "));
    lines.push("");
  }

  lines.push(`Whenever the user asks numerical questions, reason from THESE numbers — never invent figures. If something isn't covered, say so and ask for it.`);

  return lines.join("\n");
}

export interface ProfileExtras {
  maritalStatus: string;
  spouseAge: number | null;
  dependents: number;
  cityTier: string;
  corpus: number;
  otherMonthlyIncome: number;
  desiredMonthlyIncome: number;
  inflationRate: number;
  riskAppetite: string;
  planningHorizon: number;
  hasHealthInsurance: boolean;
  healthCover: number;
  bucketListGoals: Array<string | { name: string; amount: number; year: number }>;
  hobbies: string[];
  healthConditions: string[];
}

/**
 * Build the deterministic-engine context — the AI MUST use these exact numbers.
 * Each number here came from a formula-by-formula port of the advisor's Excel
 * sheet (R C Singh case verified to the rupee), not from the AI reasoning.
 */
export function buildEngineContext(c: EngineClient, p: BuiltPlan): string {
  const L: string[] = [];
  L.push(`# 🔒 DETERMINISTIC ENGINE OUTPUT — USE THESE EXACT NUMBERS, NEVER COMPUTE YOUR OWN`);
  L.push("");
  L.push("⚠️ The numbers below come from the Retire 360 calculation engine — the same code");
  L.push("that powers the advisor's Excel sheet. When the user asks for a plan, breakdown,");
  L.push("calculation, or 'how much/how long', you MUST reference THESE numbers verbatim.");
  L.push("You may explain them, contextualise them, or present them in tables — but never");
  L.push("recompute, round differently, or invent alternative figures.");
  L.push("");

  L.push(`## STAGE 1 — Monthly Income Floor (engine)`);
  L.push(`- Target monthly income: ${formatINR(c.requiredMonthlyIncome)}`);
  L.push(`- Total managed by Stage 1: ${formatINR(p.stage1.managed)} / month`);
  L.push(`- Deficit (target − managed): ${formatINR(p.stage1.deficit)} / month`);
  L.push(`- Status: **${p.stage1.status}**`);
  L.push(`- Self (husband/primary) income: ${formatINR(p.stage1.selfInc)} / month, principal ${formatINR(p.stage1.selfPr, { compact: true })}`);
  L.push(`- Spouse income: ${formatINR(p.stage1.spouseInc)} / month, principal ${formatINR(p.stage1.spousePr, { compact: true })}`);
  L.push(`- Total Stage-1 principal: ${formatINR(p.stage1.stage1Corpus, { compact: true })}`);
  L.push("");
  L.push("### Stage-1 income items (owner · instrument · principal · rate · monthly)");
  for (const it of c.incomeItems) {
    if (it.fixedMonthly !== undefined && it.fixedMonthly !== null) {
      L.push(`- ${it.owner} · ${it.instrument} · fixed ${formatINR(it.fixedMonthly)}/mo${(it.principal ?? 0) > 0 ? `  (principal ${formatINR(it.principal ?? 0, { compact: true })})` : ""}`);
    } else {
      const monthly = (it.principal ?? 0) * (it.rate ?? 0) / 12;
      L.push(`- ${it.owner} · ${it.instrument} · ${formatINR(it.principal ?? 0, { compact: true })} @ ${formatPct((it.rate ?? 0) * 100)}  → ${formatINR(monthly)}/mo`);
    }
  }
  L.push("");

  L.push(`## STAGE 2 — Big Expenses Ring-Fenced (engine)`);
  if (p.stage2.rows.length === 0) {
    L.push("(No liabilities entered by the user yet — ask them what's coming up: wedding / education / travel / renovation / medical buffer.)");
  } else {
    L.push(`- Total set aside: ${formatINR(p.stage2.total, { compact: true })}`);
    for (const r of p.stage2.rows) {
      L.push(`  - ${r.head}: ${formatINR(r.amount, { compact: true })} in ${r.tenureYears}y → ${r.instrument}`);
    }
  }
  L.push("");

  L.push(`## STAGE 3 — Wealth Multiplication (engine)`);
  L.push(`- Total corpus: ${formatINR(p.totalCorpus, { compact: true })}`);
  L.push(`- Stage 1 + Stage 2 used: ${formatINR(p.stage1.stage1Corpus + p.stage2.total, { compact: true })}`);
  L.push(`- Remaining for SWP/Growth: ${formatINR(p.swpCorpus, { compact: true })}`);
  L.push(`- Risk appetite: ${c.riskAppetite}`);
  L.push("");
  L.push("### Stage-3 allocation");
  for (const a of p.allocation) {
    L.push(`- ${a.bucket}: ${formatPct(a.pct * 100, 0)} → ${formatINR(a.amount, { compact: true })} (STP ${a.stpMonths} months, ${a.horizonYears}-year horizon)`);
  }
  L.push("");

  L.push("### SWP projection (corpus survival)");
  L.push(`- Withdrawals start at age: ${c.swp.withdrawalStartAge}`);
  L.push(`- Starting monthly withdrawal: ${formatINR(c.swp.startingMonthlyWithdrawal)}`);
  L.push(`- Yearly step-up: ${formatPct(c.swp.yearlyStepUp * 100)}`);
  L.push(`- Growth rate: ${formatPct(c.swp.preWithdrawalReturn * 100)} (Excel-replication mode)`);
  L.push(`- **Corpus survives until age: ${p.swp.lastSurvivingAge}**`);
  L.push(`- **Corpus at last surviving age: ${formatINR(p.swp.corpusAtLastAge, { compact: true })}**`);
  L.push("");

  // Per-decade snapshot so the AI can quote year-by-year without listing all 40 rows
  const snap = p.swp.rows.filter((r, i) => i === 0 || i === p.swp.rows.length - 1 || r.age % 5 === 0);
  L.push("### SWP year-by-year (5-year snapshot)");
  L.push(`| Age | Monthly withdrawal | Year-end corpus |`);
  L.push(`|---|---|---|`);
  for (const r of snap) {
    L.push(`| ${r.age} | ${r.monthly === 0 ? "—" : formatINR(r.monthly)} | ${formatINR(r.yearEndCorpus, { compact: true })} |`);
  }
  L.push("");

  if (p.warnings.length > 0) {
    L.push("### ⚠️ Engine warnings");
    for (const w of p.warnings) L.push(`- ${w}`);
    L.push("");
  }

  L.push("END ENGINE OUTPUT — quote these figures verbatim, never recompute.");
  return L.join("\n");
}

export { FROZEN_SYSTEM_PROMPT };
