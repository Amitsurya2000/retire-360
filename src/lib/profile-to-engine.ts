/**
 * Map a saved Retire 360 profile (Prisma `UserProfile`) into a `Client`
 * input for the deterministic retirement engine.
 *
 * The current chat onboarding doesn't yet collect every engine field
 * (per-instrument NPS / EPS / SCSS breakdown). For now we make sensible
 * defaults derived from what we DO know:
 *
 *   - Total corpus → split heuristically into the Stage-1 instruments
 *     to hit the user's required monthly income at the framework's standard
 *     rates (SCSS 8.2%, POMIS 7.4%, etc.).
 *   - Liabilities → directly fed from `bucketListGoals` (the structured
 *     liability list collected in the chat).
 *   - Pension goes to "self EPS" as a fixed monthly amount.
 *
 * When we later expand the chat to ask for EPS / NPS / SCSS specifics,
 * we just replace this mapper — the engine itself stays unchanged.
 */
import { UserProfile } from "@prisma/client";
import {
  Client,
  Fund,
  IncomeItem,
  Liability,
  defaultSWPParams,
  RiskAppetite,
} from "./retirement-engine";

interface StructuredLiability {
  name: string;
  amount: number;
  year: number;
}

/** Derive a Stage-1 income build that hits the required monthly income
 *  using the same instrument hierarchy the framework uses:
 *    1. SCSS (cap ₹30 L per senior @ 8.2%)
 *    2. POMIS (cap ₹15 L joint @ 7.4%) — spouse
 *    3. NPS annuity (40% of NPS allocation @ 6.85%) — self
 *    4. Mutual-fund SWP — fills the residual */
function buildIncomeItems(profile: UserProfile): { items: IncomeItem[]; usedPrincipal: number } {
  const items: IncomeItem[] = [];
  const target = profile.desiredMonthlyIncome;
  const isSenior = profile.age >= 60;
  const spouseIsSenior = (profile.spouseAge ?? 0) >= 60;
  let coveredMonthly = 0;
  let usedPrincipal = 0;

  // 1a. EPS pension — explicit field if the user provided one
  if (profile.epsMonthly > 0) {
    items.push({ owner: "self", instrument: "EPS", fixedMonthly: profile.epsMonthly });
    coveredMonthly += profile.epsMonthly;
  }

  // 1b. Generic other pension (from the "other monthly income" question)
  if (profile.pensionMonthly > 0 && profile.epsMonthly === 0) {
    items.push({ owner: "self", instrument: "EPS", fixedMonthly: profile.pensionMonthly });
    coveredMonthly += profile.pensionMonthly;
  }

  // 1c. NPS annuity (40% mandatory) — locked to the subscriber
  if (profile.npsLumpSum > 0) {
    const annuityPrincipal = profile.npsLumpSum * 0.40;
    const monthly = annuityPrincipal * 0.0685 / 12;
    const owner = profile.npsSubscriberSelf ? "self" : "spouse";
    items.push({ owner, instrument: "NPS_ANNUITY", principal: Math.round(annuityPrincipal), rate: 0.0685 });
    coveredMonthly += monthly;
    usedPrincipal += annuityPrincipal;
  }

  // 2. Rental → spouse (income-splitting principle)
  if (profile.rentalMonthly > 0) {
    items.push({ owner: "spouse", instrument: "RENT", fixedMonthly: profile.rentalMonthly });
    coveredMonthly += profile.rentalMonthly;
  }

  // 3. SCSS (self) — only if age 60+. Cap ₹30 L
  if (isSenior && coveredMonthly < target) {
    const need = target - coveredMonthly;
    const needPrincipal = Math.min(30_00_000, (need * 12) / 0.082);
    if (needPrincipal > 0) {
      const monthly = (needPrincipal * 0.082) / 12;
      items.push({ owner: "self", instrument: "SCSS", principal: Math.round(needPrincipal), rate: 0.082 });
      coveredMonthly += monthly;
      usedPrincipal += needPrincipal;
    }
  }

  // 4. POMIS (spouse) — cap ₹15 L joint
  if (coveredMonthly < target) {
    const need = target - coveredMonthly;
    const needPrincipal = Math.min(15_00_000, (need * 12) / 0.074);
    if (needPrincipal > 0) {
      const monthly = (needPrincipal * 0.074) / 12;
      items.push({ owner: "spouse", instrument: "POMIS", principal: Math.round(needPrincipal), rate: 0.074 });
      coveredMonthly += monthly;
      usedPrincipal += needPrincipal;
    }
  }

  // 5. SCSS (spouse) — if spouse is also senior, cap ₹30 L
  if (spouseIsSenior && coveredMonthly < target) {
    const need = target - coveredMonthly;
    const needPrincipal = Math.min(30_00_000, (need * 12) / 0.082);
    if (needPrincipal > 0) {
      const monthly = (needPrincipal * 0.082) / 12;
      items.push({ owner: "spouse", instrument: "SCSS", principal: Math.round(needPrincipal), rate: 0.082 });
      coveredMonthly += monthly;
      usedPrincipal += needPrincipal;
    }
  }

  // 6. MF SWP fills the residual — routed to spouse for tax balance
  if (coveredMonthly < target) {
    const need = target - coveredMonthly;
    // Assume 8.5% blended return — matches IDCW default in the engine
    const swpPrincipal = (need * 12) / 0.085;
    items.push({ owner: "spouse", instrument: "IDCW", principal: Math.round(swpPrincipal), rate: 0.085 });
    usedPrincipal += swpPrincipal;
  }

  return { items, usedPrincipal };
}

function mapRisk(profileRisk: string): RiskAppetite {
  // engine knows conservative/moderate/aggressive; profile uses "balanced" too
  if (profileRisk === "conservative") return "conservative";
  if (profileRisk === "balanced") return "aggressive";
  return "moderate";
}

function parseLiabilities(profile: UserProfile): Liability[] {
  if (!profile.bucketListGoals) return [];
  let parsed: unknown[];
  try {
    parsed = JSON.parse(profile.bucketListGoals);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap<Liability>((raw) => {
    if (typeof raw !== "object" || raw === null) return [];
    const obj = raw as Partial<StructuredLiability>;
    if (typeof obj.amount !== "number" || typeof obj.year !== "number" || typeof obj.name !== "string") return [];
    if (obj.amount <= 0) return [];
    return [{ head: obj.name, amount: obj.amount, tenureYears: Math.max(0, obj.year) }];
  });
}

interface FundsBreakdown {
  pf: number;
  govScheme: number;
  leaveEncashment: number;
  gratuity: number;
  nps: number;
  savings: number;
}

function parseFundsBreakdown(raw: string | null): FundsBreakdown | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw) as Partial<FundsBreakdown>;
    return {
      pf: Number(obj.pf) || 0,
      govScheme: Number(obj.govScheme) || 0,
      leaveEncashment: Number(obj.leaveEncashment) || 0,
      gratuity: Number(obj.gratuity) || 0,
      nps: Number(obj.nps) || 0,
      savings: Number(obj.savings) || 0,
    };
  } catch {
    return null;
  }
}

function buildFundsArray(profile: UserProfile): Fund[] {
  const fb = parseFundsBreakdown(profile.fundsBreakdown);
  if (!fb) {
    // No itemized breakdown — fall back to a single "Retirement corpus" entry.
    return [{ head: "Retirement corpus", amount: profile.corpus }];
  }
  // Emit one row per non-zero category (mirrors the FUNDS table in the Excel template).
  const rows: Fund[] = [];
  if (fb.pf > 0)              rows.push({ head: "PF / EPF / CPF",       amount: fb.pf });
  if (fb.govScheme > 0)       rows.push({ head: "Other govt scheme",   amount: fb.govScheme });
  if (fb.leaveEncashment > 0) rows.push({ head: "Leave Encashment",    amount: fb.leaveEncashment });
  if (fb.gratuity > 0)        rows.push({ head: "Gratuity",            amount: fb.gratuity });
  if (fb.nps > 0)             rows.push({ head: "NPS",                 amount: fb.nps });
  if (fb.savings > 0)         rows.push({ head: "Existing savings",    amount: fb.savings });
  if (rows.length === 0)      rows.push({ head: "Retirement corpus",   amount: profile.corpus });
  return rows;
}

export function profileToClient(profile: UserProfile): Client {
  const { items: incomeItems, usedPrincipal } = buildIncomeItems(profile);
  const liabilities = parseLiabilities(profile);
  const liabilityTotal = liabilities.reduce((s, l) => s + l.amount, 0);

  // Per-category fund breakdown — same structure as the R C Singh Excel FUNDS table.
  const funds: Fund[] = buildFundsArray(profile);

  // SWP corpus = whatever's left after Stage 1 + Stage 2 are funded.
  const remainingForSWP = Math.max(0, profile.corpus - usedPrincipal - liabilityTotal);

  return {
    name: profile.fullName ?? "Friend",
    selfAge: profile.age,
    spouseAge: profile.spouseAge ?? null,
    requiredMonthlyIncome: profile.desiredMonthlyIncome,
    riskAppetite: mapRisk(profile.riskAppetite),
    funds,
    incomeItems,
    liabilities,
    swp: {
      ...defaultSWPParams(),
      currentAge: profile.age,
      // Withdrawals start ~2 years after retirement age, per the standard framework.
      withdrawalStartAge: profile.age + 2,
    },
    swpCorpusOverride: remainingForSWP > 0 ? Math.round(remainingForSWP) : null,
  };
}
