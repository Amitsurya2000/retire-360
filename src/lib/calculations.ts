// Core financial calculations for the bucket strategy.
// All amounts in INR. Returns are annual percentages (e.g., 8 = 8%).

export type RiskAppetite = "conservative" | "moderate" | "balanced";

export interface PlanInputs {
  age: number;
  corpus: number;
  desiredMonthlyIncome: number;
  otherMonthlyIncome: number; // pension + rental + dividends
  inflationRate: number;
  planningHorizon: number;
  riskAppetite: RiskAppetite;
  legacyAmount: number;
}

export interface InstrumentAllocation {
  name: string;
  amount: number;
  expectedReturn: number; // annual %
  notes?: string;
}

export interface Bucket {
  id: 1 | 2 | 3;
  name: string;
  description: string;
  yearsCovered: string;
  targetPercent: number;
  amount: number;
  blendedReturn: number;
  instruments: InstrumentAllocation[];
}

export interface YearlyProjection {
  year: number;
  age: number;
  grossMonthlyIncome: number;
  netMonthlyIncome: number;     // after estimated tax
  inflationAdjusted: number;    // purchasing power in today's rupees
  expensesRequired: number;     // inflated expenses required this year
  corpusEndOfYear: number;
  withdrawalThisYear: number;
}

export interface GeneratedPlan {
  buckets: Bucket[];
  totalCorpus: number;
  blendedReturn: number;
  projections: YearlyProjection[];
  shortfallYear: number | null; // year when corpus would run out, null if it lasts horizon
  legacyAtEnd: number;
  summary: {
    monthlyIncomeYear1: number;
    monthlyIncomeYear10: number;
    inflationAdjustedYear10: number;
    totalLifetimeIncome: number;
    estimatedTaxPaid: number;
  };
}

// Risk-based bucket allocation percentages.
// Conservative leans into safety, balanced takes more growth exposure.
const ALLOCATION_BY_RISK: Record<RiskAppetite, { b1: number; b2: number; b3: number }> = {
  conservative: { b1: 0.25, b2: 0.50, b3: 0.25 },
  moderate:     { b1: 0.20, b2: 0.45, b3: 0.35 },
  balanced:     { b1: 0.15, b2: 0.40, b3: 0.45 },
};

export function generateBuckets(inputs: PlanInputs): Bucket[] {
  const alloc = ALLOCATION_BY_RISK[inputs.riskAppetite];
  const { corpus, age } = inputs;

  // ---- BUCKET 1: Safety (0-3 years) ----
  const b1Amount = corpus * alloc.b1;
  // SCSS cap is ₹30 lakh, eligible if age >= 60. We treat that as the soft ceiling.
  const scssEligible = age >= 60;
  const scssCap = 30_00_000;
  const scssAlloc = scssEligible ? Math.min(b1Amount * 0.55, scssCap) : 0;
  const pomisAlloc = Math.min((b1Amount - scssAlloc) * 0.30, 9_00_000); // POMIS cap ₹9L single
  const fdLadderAlloc = (b1Amount - scssAlloc - pomisAlloc) * 0.70;
  const liquidFundAlloc = b1Amount - scssAlloc - pomisAlloc - fdLadderAlloc;

  const bucket1Instruments: InstrumentAllocation[] = [];
  if (scssAlloc > 0) {
    bucket1Instruments.push({
      name: "Senior Citizen Savings Scheme (SCSS)",
      amount: scssAlloc,
      expectedReturn: 8.2,
      notes: "Quarterly payout. 5-year lock-in (extendable). Govt-backed.",
    });
  }
  if (pomisAlloc > 0) {
    bucket1Instruments.push({
      name: "Post Office Monthly Income Scheme (POMIS)",
      amount: pomisAlloc,
      expectedReturn: 7.4,
      notes: "Monthly payout. 5-year tenure. Cap ₹9L single / ₹15L joint.",
    });
  }
  bucket1Instruments.push({
    name: "Bank FD Ladder (1y / 2y / 3y)",
    amount: fdLadderAlloc,
    expectedReturn: 7.25,
    notes: "Split across 3 maturities to reinvest at prevailing rates each year.",
  });
  bucket1Instruments.push({
    name: "Liquid Mutual Fund (emergency reserve)",
    amount: liquidFundAlloc,
    expectedReturn: 6.5,
    notes: "Instant withdrawal for medical or unexpected needs.",
  });

  // ---- BUCKET 2: Income (3-10 years) ----
  const b2Amount = corpus * alloc.b2;
  const pmvvyAlloc = scssEligible ? Math.min(b2Amount * 0.20, 15_00_000) : 0;
  const rbiBondAlloc = b2Amount * 0.20;
  const debtMfAlloc = b2Amount * 0.35;
  const corpFdAlloc = b2Amount * 0.15;
  const taxFreeBondAlloc = b2Amount - pmvvyAlloc - rbiBondAlloc - debtMfAlloc - corpFdAlloc;

  const bucket2Instruments: InstrumentAllocation[] = [];
  if (pmvvyAlloc > 0) {
    bucket2Instruments.push({
      name: "PMVVY (Pradhan Mantri Vaya Vandana Yojana)",
      amount: pmvvyAlloc,
      expectedReturn: 7.4,
      notes: "10-year guaranteed pension. Subject to availability — verify with LIC.",
    });
  }
  bucket2Instruments.push({
    name: "RBI Floating Rate Savings Bonds",
    amount: rbiBondAlloc,
    expectedReturn: 8.05,
    notes: "Rate resets every 6 months. 7-year tenure. Govt-backed.",
  });
  bucket2Instruments.push({
    name: "Debt Mutual Funds (SWP)",
    amount: debtMfAlloc,
    expectedReturn: 7.5,
    notes: "Systematic Withdrawal Plan for tax-efficient monthly income.",
  });
  bucket2Instruments.push({
    name: "AAA-rated Corporate FDs",
    amount: corpFdAlloc,
    expectedReturn: 8.0,
    notes: "Bajaj Finance, HDFC, etc. Higher yield than bank FDs.",
  });
  if (taxFreeBondAlloc > 0) {
    bucket2Instruments.push({
      name: "Tax-free Bonds (secondary market)",
      amount: taxFreeBondAlloc,
      expectedReturn: 6.0,
      notes: "Tax-free interest — effective yield ~8.5% for 30% slab.",
    });
  }

  // ---- BUCKET 3: Growth (10-25 years) ----
  const b3Amount = corpus * alloc.b3;
  const hybridAlloc = b3Amount * 0.40;
  const largeCapAlloc = b3Amount * 0.35;
  const dividendStockAlloc = b3Amount * 0.15;
  const reitAlloc = b3Amount * 0.10;

  const bucket3Instruments: InstrumentAllocation[] = [
    {
      name: "Conservative Hybrid Mutual Funds",
      amount: hybridAlloc,
      expectedReturn: 9.5,
      notes: "65-75% debt + equity. Lower volatility than pure equity.",
    },
    {
      name: "Large-cap Equity MF (SWP after year 5)",
      amount: largeCapAlloc,
      expectedReturn: 12.0,
      notes: "Index/large-cap funds. Let it compound, withdraw via SWP later.",
    },
    {
      name: "Blue-chip Dividend Stocks",
      amount: dividendStockAlloc,
      expectedReturn: 11.0,
      notes: "HDFC Bank, ITC, Hindustan Unilever, TCS etc. Dividend + appreciation.",
    },
    {
      name: "REITs (Embassy, Mindspace, Brookfield)",
      amount: reitAlloc,
      expectedReturn: 8.5,
      notes: "Quarterly distributions. Real-estate-like income without property hassle.",
    },
  ];

  const blendedReturn = (instruments: InstrumentAllocation[]): number => {
    const total = instruments.reduce((s, i) => s + i.amount, 0);
    if (total === 0) return 0;
    return instruments.reduce((s, i) => s + (i.amount / total) * i.expectedReturn, 0);
  };

  return [
    {
      id: 1,
      name: "Safety Bucket",
      description: "Capital protection for the next 3 years of expenses. Guaranteed-return instruments only.",
      yearsCovered: "Years 1–3",
      targetPercent: alloc.b1 * 100,
      amount: b1Amount,
      blendedReturn: blendedReturn(bucket1Instruments),
      instruments: bucket1Instruments,
    },
    {
      id: 2,
      name: "Income Bucket",
      description: "Reliable income for years 3–10. Mix of govt-backed schemes and high-grade debt.",
      yearsCovered: "Years 3–10",
      targetPercent: alloc.b2 * 100,
      amount: b2Amount,
      blendedReturn: blendedReturn(bucket2Instruments),
      instruments: bucket2Instruments,
    },
    {
      id: 3,
      name: "Growth Bucket",
      description: "Beats inflation across years 10–25. Equity-tilted but moderated for retirees.",
      yearsCovered: "Years 10–25",
      targetPercent: alloc.b3 * 100,
      amount: b3Amount,
      blendedReturn: blendedReturn(bucket3Instruments),
      instruments: bucket3Instruments,
    },
  ];
}

// Estimate effective tax rate on retirement income.
// Indian senior citizen (60-79) gets basic exemption of ₹3L (old) / ₹3L (new for 60+).
// Super senior (80+) gets ₹5L exemption (old regime).
// This is a simplified blended rate, not a full tax calc.
function estimateEffectiveTaxRate(annualIncome: number, age: number): number {
  const exemption = age >= 80 ? 5_00_000 : age >= 60 ? 3_00_000 : 2_50_000;
  const taxable = Math.max(0, annualIncome - exemption);
  let tax = 0;
  // Old regime senior slabs (simplified)
  if (age >= 60) {
    if (taxable > 0) tax += Math.min(taxable, 2_00_000) * 0.05;
    if (taxable > 2_00_000) tax += Math.min(taxable - 2_00_000, 5_00_000) * 0.20;
    if (taxable > 7_00_000) tax += (taxable - 7_00_000) * 0.30;
  } else {
    if (taxable > 0) tax += Math.min(taxable, 2_50_000) * 0.05;
    if (taxable > 2_50_000) tax += Math.min(taxable - 2_50_000, 5_00_000) * 0.20;
    if (taxable > 7_50_000) tax += (taxable - 7_50_000) * 0.30;
  }
  // 80TTB ₹50k deduction is applied roughly via lower effective rate at small incomes.
  if (age >= 60 && annualIncome < 8_00_000) {
    tax = Math.max(0, tax - 10_000);
  }
  return annualIncome > 0 ? tax / annualIncome : 0;
}

export function projectYears(inputs: PlanInputs, buckets: Bucket[]): YearlyProjection[] {
  const { corpus, desiredMonthlyIncome, otherMonthlyIncome, inflationRate, planningHorizon, age } = inputs;
  const projections: YearlyProjection[] = [];

  const blended = buckets.reduce((sum, b) => sum + b.blendedReturn * (b.amount / corpus), 0);

  let remainingCorpus = corpus;
  const monthlyNeedFromCorpus = Math.max(0, desiredMonthlyIncome - otherMonthlyIncome);

  for (let yearIndex = 0; yearIndex < planningHorizon; yearIndex++) {
    const year = yearIndex + 1;
    const currentAge = age + yearIndex;
    const inflationFactor = Math.pow(1 + inflationRate / 100, yearIndex);
    const requiredMonthly = monthlyNeedFromCorpus * inflationFactor;
    const requiredAnnual = requiredMonthly * 12;

    // Corpus grows at blended return, then withdrawal happens.
    const grown = remainingCorpus * (1 + blended / 100);
    const withdrawalThisYear = Math.min(requiredAnnual, Math.max(0, grown));
    remainingCorpus = Math.max(0, grown - withdrawalThisYear);

    const grossAnnualIncome = withdrawalThisYear + otherMonthlyIncome * 12;
    const taxRate = estimateEffectiveTaxRate(grossAnnualIncome, currentAge);
    const netAnnualIncome = grossAnnualIncome * (1 - taxRate);

    projections.push({
      year,
      age: currentAge,
      grossMonthlyIncome: grossAnnualIncome / 12,
      netMonthlyIncome: netAnnualIncome / 12,
      inflationAdjusted: (netAnnualIncome / 12) / inflationFactor,
      expensesRequired: requiredMonthly,
      corpusEndOfYear: remainingCorpus,
      withdrawalThisYear,
    });
  }

  return projections;
}

export function generatePlan(inputs: PlanInputs): GeneratedPlan {
  const buckets = generateBuckets(inputs);
  const projections = projectYears(inputs, buckets);
  const blended = buckets.reduce((s, b) => s + b.blendedReturn * (b.amount / inputs.corpus), 0);

  const shortfallYear = projections.find(p => p.corpusEndOfYear === 0 && p.withdrawalThisYear < p.expensesRequired * 12)?.year ?? null;
  const legacyAtEnd = projections[projections.length - 1]?.corpusEndOfYear ?? 0;

  const totalLifetimeIncome = projections.reduce((s, p) => s + p.netMonthlyIncome * 12, 0);
  const totalGrossIncome = projections.reduce((s, p) => s + p.grossMonthlyIncome * 12, 0);
  const estimatedTaxPaid = totalGrossIncome - totalLifetimeIncome;

  return {
    buckets,
    totalCorpus: inputs.corpus,
    blendedReturn: blended,
    projections,
    shortfallYear,
    legacyAtEnd,
    summary: {
      monthlyIncomeYear1: projections[0]?.netMonthlyIncome ?? 0,
      monthlyIncomeYear10: projections[9]?.netMonthlyIncome ?? 0,
      inflationAdjustedYear10: projections[9]?.inflationAdjusted ?? 0,
      totalLifetimeIncome,
      estimatedTaxPaid,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────
// "Local Agent" naive baseline — compare against the Retire 360 plan.
//
// Assumptions for the local-agent scenario:
//   • Entire corpus parked in fixed deposits at 7% (no diversification)
//   • All income credited to ONE spouse (no name-splitting tax benefit)
//     → entire FD interest taxed at marginal slab
//   • No SWP (only FD interest payouts), no liability ring-fencing
//   • Same monthly withdrawal target as the Retire 360 plan
//
// This represents the typical "park it all in FDs and trust me" advice.
// ─────────────────────────────────────────────────────────────────────

export interface NaivePlanResult {
  blendedReturn: number;          // 7%
  totalLifetimeIncome: number;    // net of tax
  estimatedTaxPaid: number;
  legacyAtEnd: number;
  shortfallYear: number | null;
  yearlyTax: number[];            // tax paid each year
}

export function generateNaivePlan(inputs: PlanInputs): NaivePlanResult {
  const { corpus, desiredMonthlyIncome, otherMonthlyIncome, inflationRate, planningHorizon, age } = inputs;
  const FD_RATE = 0.07;

  let remainingCorpus = corpus;
  let totalNetIncome = 0;
  let totalTaxPaid = 0;
  let shortfallYear: number | null = null;
  const yearlyTax: number[] = [];

  const monthlyNeedFromCorpus = Math.max(0, desiredMonthlyIncome - otherMonthlyIncome);

  for (let yearIndex = 0; yearIndex < planningHorizon; yearIndex++) {
    const inflationFactor = Math.pow(1 + inflationRate / 100, yearIndex);
    const requiredAnnual = monthlyNeedFromCorpus * 12 * inflationFactor;

    // FD interest at 7%
    const fdInterest = remainingCorpus * FD_RATE;
    // Naive plan: take interest first, dip into principal if needed
    const withdrawal = Math.min(requiredAnnual, remainingCorpus + fdInterest);
    const principalDip = Math.max(0, withdrawal - fdInterest);
    remainingCorpus = Math.max(0, remainingCorpus + fdInterest - withdrawal);

    const grossAnnual = withdrawal + otherMonthlyIncome * 12;
    // ALL income in one name (no splitting) → full slab tax
    const taxRate = estimateNaiveTaxRate(grossAnnual, age + yearIndex);
    const taxThisYear = grossAnnual * taxRate;
    const netAnnual = grossAnnual - taxThisYear;

    totalNetIncome += netAnnual;
    totalTaxPaid += taxThisYear;
    yearlyTax.push(taxThisYear);

    if (shortfallYear === null && remainingCorpus === 0 && principalDip < requiredAnnual - fdInterest - 1) {
      shortfallYear = yearIndex + 1;
    }
  }

  return {
    blendedReturn: FD_RATE * 100,
    totalLifetimeIncome: totalNetIncome,
    estimatedTaxPaid: totalTaxPaid,
    legacyAtEnd: remainingCorpus,
    shortfallYear,
    yearlyTax,
  };
}

// All income to one person → full slab tax. Distinct from the bucket plan's
// tax estimator which assumes some 80TTB benefit.
function estimateNaiveTaxRate(annualIncome: number, age: number): number {
  const exemption = age >= 80 ? 5_00_000 : age >= 60 ? 3_00_000 : 2_50_000;
  const taxable = Math.max(0, annualIncome - exemption);
  let tax = 0;
  if (age >= 60) {
    if (taxable > 0) tax += Math.min(taxable, 2_00_000) * 0.05;
    if (taxable > 2_00_000) tax += Math.min(taxable - 2_00_000, 5_00_000) * 0.20;
    if (taxable > 7_00_000) tax += (taxable - 7_00_000) * 0.30;
  } else {
    if (taxable > 0) tax += Math.min(taxable, 2_50_000) * 0.05;
    if (taxable > 2_50_000) tax += Math.min(taxable - 2_50_000, 5_00_000) * 0.20;
    if (taxable > 7_50_000) tax += (taxable - 7_50_000) * 0.30;
  }
  return annualIncome > 0 ? tax / annualIncome : 0;
}

export interface ComparisonResult {
  retireWell: {
    tax: number;
    legacy: number;
    lasts: number;       // years before depletion (= planningHorizon if no shortfall)
    netIncome: number;
  };
  localAgent: {
    tax: number;
    legacy: number;
    lasts: number;
    netIncome: number;
  };
  diff: {
    taxSaved: number;      // localAgent.tax - retireWell.tax (positive = saved)
    extraWealth: number;   // retireWell.legacy - localAgent.legacy
    extraYears: number;    // retireWell.lasts - localAgent.lasts
    totalAdvantage: number; // taxSaved + extraWealth
  };
}

export function compareWithLocalAgent(inputs: PlanInputs, retireWellPlan: GeneratedPlan): ComparisonResult {
  const naive = generateNaivePlan(inputs);

  // For the Retire 360 scenario, assume the spouse-split framework is applied:
  // income is split across both spouses so each stays under ₹12L/year → near-zero tax.
  // We use the gross income from the bucket plan but recompute tax as if each spouse
  // receives half (the spouse-split framework's whole point).
  const splitTax = retireWellPlan.projections.reduce((total, p) => {
    const grossAnnual = p.grossMonthlyIncome * 12;
    const perSpouse = grossAnnual / 2;
    const taxRate = estimateNaiveTaxRate(perSpouse, p.age);
    return total + perSpouse * taxRate * 2; // both spouses' tax combined
  }, 0);

  // Net income after the corrected split-tax
  const totalGross = retireWellPlan.projections.reduce((s, p) => s + p.grossMonthlyIncome * 12, 0);
  const splitNetIncome = totalGross - splitTax;

  const rw = {
    tax: splitTax,
    legacy: retireWellPlan.legacyAtEnd,
    lasts: retireWellPlan.shortfallYear ?? inputs.planningHorizon,
    netIncome: splitNetIncome,
  };
  const la = {
    tax: naive.estimatedTaxPaid,
    legacy: naive.legacyAtEnd,
    lasts: naive.shortfallYear ?? inputs.planningHorizon,
    netIncome: naive.totalLifetimeIncome,
  };
  return {
    retireWell: rw,
    localAgent: la,
    diff: {
      taxSaved: la.tax - rw.tax,
      extraWealth: rw.legacy - la.legacy,
      extraYears: rw.lasts - la.lasts,
      totalAdvantage: Math.max(0, (la.tax - rw.tax)) + Math.max(0, (rw.legacy - la.legacy)),
    },
  };
}
