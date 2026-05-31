"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GeneratedPlan, ComparisonResult } from "@/lib/calculations";
import { BuiltPlan as EngineBuiltPlan, Client as EngineClient } from "@/lib/retirement-engine";
import { formatINR, formatPct } from "@/lib/format";
import { BucketCard } from "@/components/plan/BucketCard";
import { BucketPieChart, MonthlyIncomeChart, CorpusDepletionChart, PurchasingPowerChart } from "@/components/plan/PlanCharts";
import { EngineRoadmap } from "@/components/plan/EngineRoadmap";
import { SWPCorpusChart, SWPMonthlyChart } from "@/components/plan/SWPProjectionChart";
import { ArrowRight, Receipt, AlertTriangle, CheckCircle2, RefreshCw, X, TrendingUp, ShieldCheck } from "lucide-react";
import { WealthManagerCTA } from "@/components/WealthManagerCTA";

function PlanPageInner() {
  const params = useSearchParams();
  const idFromUrl = params.get("id");
  const [profileId, setProfileId] = useState<string | null>(idFromUrl);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [engineClient, setEngineClient] = useState<EngineClient | null>(null);
  const [enginePlan, setEnginePlan] = useState<EngineBuiltPlan | null>(null);
  const [profile, setProfile] = useState<{ fullName?: string | null; age: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // What-if overrides
  const [inflation, setInflation] = useState<number | null>(null);
  const [income, setIncome] = useState<number | null>(null);

  // If no id in URL, try localStorage
  useEffect(() => {
    if (!idFromUrl) {
      const stored = typeof window !== "undefined" ? localStorage.getItem("retirewell.profileId") : null;
      if (stored) setProfileId(stored);
      else setLoading(false);
    }
  }, [idFromUrl]);

  useEffect(() => {
    if (!profileId) return;
    setLoading(true);
    const query = new URLSearchParams({ id: profileId });
    if (inflation !== null) query.set("inflation", inflation.toString());
    if (income !== null) query.set("income", income.toString());

    fetch(`/api/plan?${query}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setPlan(d.plan);
        setComparison(d.comparison);
        setProfile(d.profile);
        if (d.engine) {
          setEngineClient(d.engine.client);
          setEnginePlan(d.engine.plan);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [profileId, inflation, income]);

  if (!profileId) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light text-primary mb-5">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-3">No plan yet</h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">Spend 5 minutes on the wizard. We&apos;ll show you exactly how to turn your corpus into monthly income.</p>
        <Link href="/onboarding" className="btn-primary inline-flex items-center gap-2 text-lg">
          Start the Wizard <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  if (loading && !plan) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
        <p className="text-slate-600">Building your plan…</p>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-3">Couldn&apos;t load your plan</h1>
        <p className="text-slate-600 mb-6">{error || "Plan not found."}</p>
        <Link href="/onboarding" className="btn-primary">Start over</Link>
      </div>
    );
  }

  const willLast = plan.shortfallYear === null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">Your Personalized Plan</p>
        <h1 className="mt-1 text-3xl md:text-4xl font-bold tracking-tight">
          {profile?.fullName ? `${profile.fullName}, ` : ""}here&apos;s your retirement plan
        </h1>
        <p className="mt-2 text-slate-600">
          Built around the bucket strategy. Designed to last {plan.projections.length} years.
        </p>
      </div>

      {/* In-page quick nav */}
      <div className="mb-10 flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        {[
          { id: "engine-roadmap", label: "🎯 3-Stage Roadmap" },
          { id: "stage-1", label: "Stage 1 · Income" },
          { id: "stage-2", label: "Stage 2 · Liabilities" },
          { id: "stage-3", label: "Stage 3 · Growth" },
          { id: "whatif", label: "What if?" },
          { id: "summary", label: "Lifetime summary" },
        ].map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="whitespace-nowrap px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-primary hover:text-white hover:border-primary text-sm font-medium text-slate-700 transition-colors"
          >
            {s.label}
          </a>
        ))}
      </div>

      {/* Top KPIs */}
      <div className="grid md:grid-cols-4 gap-4 mb-10">
        <KPI
          label="Monthly income (Year 1)"
          value={formatINR(plan.summary.monthlyIncomeYear1, { compact: true })}
          sublabel="After taxes"
        />
        <KPI
          label="Monthly income (Year 10)"
          value={formatINR(plan.summary.monthlyIncomeYear10, { compact: true })}
          sublabel={`= ${formatINR(plan.summary.inflationAdjustedYear10, { compact: true })} in today's ₹`}
        />
        <KPI
          label="Blended return"
          value={formatPct(plan.blendedReturn)}
          sublabel="Weighted across all buckets"
        />
        <KPI
          label="Corpus at end"
          value={formatINR(plan.legacyAtEnd, { compact: true })}
          sublabel={willLast ? "Legacy you can leave behind" : `Runs out in Year ${plan.shortfallYear}`}
          tone={willLast ? "positive" : "warning"}
        />
      </div>

      {/* WhatsApp banner — high-intent placement right after the KPIs */}
      <div className="mb-6">
        <WealthManagerCTA
          variant="banner"
          context={`I just saw my retirement plan${profile?.fullName ? ` (${profile.fullName})` : ""} and would like guidance on what to do next`}
          headline="Want a Wealth Manager to review this with you?"
          subline="Free 15-min WhatsApp call — we'll walk through your plan and answer your questions."
        />
      </div>

      {/* Verdict */}
      <div className={`rounded-2xl p-6 mb-10 flex items-start gap-4 ${willLast ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
        {willLast ? (
          <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
        ) : (
          <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />
        )}
        <div>
          <h3 className="font-bold text-lg text-slate-900">
            {willLast
              ? "✓ Your corpus is on track to last the full plan."
              : `⚠ Your corpus may run out in Year ${plan.shortfallYear}.`}
          </h3>
          <p className="text-slate-700 text-sm mt-1">
            {willLast
              ? `You'll likely have ${formatINR(plan.legacyAtEnd, { compact: true })} left at the end of ${plan.projections.length} years — enough for a legacy or extra buffer.`
              : `Consider reducing your monthly income target, working a few more years, or taking slightly more growth exposure. Try the what-if sliders below.`}
          </p>
        </div>
      </div>

      {/* THE CLINCHER — Retire 360 vs Local Agent comparison */}
      {comparison && <ComparisonPanel comparison={comparison} planYears={plan.projections.length} />}

      {/* ─────────────── ENGINE-DRIVEN 3-STAGE ROADMAP ─────────────── */}
      {engineClient && enginePlan && (
        <section id="engine-roadmap" className="mb-12 scroll-mt-20">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wide">The 3-Stage Roadmap</p>
              <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">Your specialist plan, calculated to the rupee</h2>
            </div>
            <span className="text-xs text-slate-500 bg-slate-100 rounded-full px-3 py-1">
              🔒 Calculated by Retire 360 engine — Excel-verified
            </span>
          </div>
          <EngineRoadmap client={engineClient} plan={enginePlan} />

          {/* SWP corpus survival chart */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-2">SWP corpus over time</h3>
            <p className="text-slate-600 text-sm mb-4">
              How your growth bucket evolves year by year, including monthly withdrawals starting at age {engineClient.swp.withdrawalStartAge}.
            </p>
            <div className="card">
              <SWPCorpusChart plan={enginePlan} />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Monthly SWP withdrawal (with {formatPct(engineClient.swp.yearlyStepUp * 100)} step-up)</h3>
            <div className="card">
              <SWPMonthlyChart plan={enginePlan} />
            </div>
          </div>
        </section>
      )}

      {/* Bucket allocation */}
      <section id="buckets" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold mb-2">Your bucket allocation</h2>
        <p className="text-slate-600 mb-6">Total corpus of {formatINR(plan.totalCorpus, { compact: true })} split across three time horizons.</p>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
          <div className="card">
            <BucketPieChart plan={plan} />
          </div>
          <div className="space-y-4">
            {plan.buckets.map((b) => (
              <BucketCard key={b.id} bucket={b} />
            ))}
          </div>
        </div>
      </section>

      {/* Income projection */}
      <section id="income" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold mb-2">Year-by-year monthly income</h2>
        <p className="text-slate-600 mb-6">Compared with what you&apos;ll need after inflation each year.</p>
        <div className="card">
          <MonthlyIncomeChart plan={plan} />
        </div>
      </section>

      {/* Purchasing power */}
      <section id="purchasing-power" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold mb-2">Purchasing power over time</h2>
        <p className="text-slate-600 mb-6">Nominal vs real (today&apos;s rupees) — shows the real impact of inflation.</p>
        <div className="card">
          <PurchasingPowerChart plan={plan} />
        </div>
      </section>

      {/* Corpus depletion */}
      <section id="depletion" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold mb-2">Corpus depletion curve</h2>
        <p className="text-slate-600 mb-6">How your corpus shrinks (or grows) each year.</p>
        <div className="card">
          <CorpusDepletionChart plan={plan} />
        </div>
      </section>

      {/* What-if sliders */}
      <section id="whatif" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold mb-2">What if…?</h2>
        <p className="text-slate-600 mb-6">Move the sliders to see how the plan responds.</p>
        <div className="card space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Inflation rate</span>
              <span className="font-semibold text-primary">{(inflation ?? 6).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={2}
              max={12}
              step={0.5}
              value={inflation ?? 6}
              onChange={(e) => setInflation(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>2%</span><span>12%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Desired monthly income</span>
              <span className="font-semibold text-primary">{formatINR(income ?? plan.summary.monthlyIncomeYear1 * 1.1)}</span>
            </div>
            <input
              type="range"
              min={20_000}
              max={5_00_000}
              step={5_000}
              value={income ?? Math.round(plan.summary.monthlyIncomeYear1)}
              onChange={(e) => setIncome(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>₹20k</span><span>₹5L</span>
            </div>
          </div>

          <button
            onClick={() => {
              setInflation(null);
              setIncome(null);
            }}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Reset to my numbers
          </button>
        </div>
      </section>

      {/* Lifetime summary */}
      <section id="summary" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold mb-2">Lifetime summary</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card">
            <p className="text-sm text-slate-500">Total lifetime income (after tax)</p>
            <p className="text-3xl font-bold mt-1">{formatINR(plan.summary.totalLifetimeIncome, { compact: true })}</p>
            <p className="text-sm text-slate-500 mt-2">Over {plan.projections.length} years</p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-500">Estimated total tax paid</p>
            <p className="text-3xl font-bold mt-1 text-amber-700">{formatINR(plan.summary.estimatedTaxPaid, { compact: true })}</p>
            <p className="text-sm text-slate-500 mt-2">
              <Link href="/tax" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                See how to reduce this → <Receipt className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Next steps */}
      <section className="bg-gradient-to-br from-primary-light via-white to-amber-50 rounded-2xl p-8 border border-slate-200">
        <h2 className="text-2xl font-bold mb-2">What next?</h2>
        <p className="text-slate-600 mb-6">Your plan is just the start. Talk to an expert, save tax, or ask the AI.</p>

        <div className="mb-4">
          <WealthManagerCTA
            variant="card"
            context="I've reviewed my plan and want help putting it into action"
            headline="Put your plan into action with a Wealth Manager"
            subline="Knowing the plan is half the battle. Our wealth manager helps you actually open the accounts and invest — free 15-min WhatsApp call to start."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/tax"
            className="block bg-white rounded-xl p-5 border border-slate-200 hover:border-primary hover:shadow-md transition-all group"
          >
            <Receipt className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold text-lg mb-1">Save on tax</h3>
            <p className="text-sm text-slate-600 mb-3">Compare old vs new regime. Use senior citizen deductions.</p>
            <span className="text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Open Tax Optimizer <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          <Link
            href="/advisor"
            className="block bg-white rounded-xl p-5 border border-slate-200 hover:border-primary hover:shadow-md transition-all group"
          >
            <span className="inline-flex items-center gap-1 mb-3">
              <span className="text-2xl">✨</span>
            </span>
            <h3 className="font-bold text-lg mb-1">Ask the AI Advisor</h3>
            <p className="text-sm text-slate-600 mb-3">Get plain-English answers about your numbers and choices.</p>
            <span className="text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Start chatting <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}

function ComparisonPanel({ comparison, planYears }: { comparison: ComparisonResult; planYears: number }) {
  const { retireWell, localAgent, diff } = comparison;
  const taxSaved = Math.max(0, diff.taxSaved);
  const extraWealth = Math.max(0, diff.extraWealth);
  const totalAdvantage = taxSaved + extraWealth;
  const extraYears = diff.extraYears;

  return (
    <section className="mb-12 rounded-2xl bg-gradient-to-br from-primary-light via-white to-amber-50 border-2 border-primary p-6 md:p-8">
      <div className="text-center mb-6">
        <p className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Plan With Specialists, Not Agents</p>
        <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
          What happens if you go to a local agent instead?
        </h2>
        <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
          A typical local agent parks your corpus in FDs, all in one spouse&apos;s name. Here&apos;s the difference over {planYears} years.
        </p>
      </div>

      {/* Comparison table */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Local agent side */}
        <div className="rounded-2xl bg-white border-2 border-red-200 overflow-hidden">
          <div className="bg-red-50 px-5 py-3 border-b border-red-200">
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-slate-900">Local Agent (FD-only, single name)</h3>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <Row label="Total lifetime tax paid" value={formatINR(localAgent.tax, { compact: true })} tone="bad" />
            <Row label="Corpus lasts" value={localAgent.lasts < planYears ? `Runs out in year ${localAgent.lasts}` : `Full ${planYears} years`} tone={localAgent.lasts < planYears ? "bad" : "neutral"} />
            <Row label="Legacy at end" value={formatINR(localAgent.legacy, { compact: true })} tone={localAgent.legacy > 0 ? "neutral" : "bad"} />
            <Row label="Total income received" value={formatINR(localAgent.netIncome, { compact: true })} tone="neutral" />
          </div>
        </div>

        {/* Retire 360 side */}
        <div className="rounded-2xl bg-white border-2 border-primary overflow-hidden shadow-md">
          <div className="bg-primary-light px-5 py-3 border-b border-primary">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-slate-900">Retire 360 Plan (3-stage, spouse-split, SWP)</h3>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <Row label="Total lifetime tax paid" value={formatINR(retireWell.tax, { compact: true })} tone="good" />
            <Row label="Corpus lasts" value={retireWell.lasts < planYears ? `Runs out in year ${retireWell.lasts}` : `Full ${planYears} years`} tone={retireWell.lasts < planYears ? "neutral" : "good"} />
            <Row label="Legacy at end" value={formatINR(retireWell.legacy, { compact: true })} tone={retireWell.legacy > 0 ? "good" : "neutral"} />
            <Row label="Total income received" value={formatINR(retireWell.netIncome, { compact: true })} tone="good" />
          </div>
        </div>
      </div>

      {/* The headline difference */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center">
          <Receipt className="w-6 h-6 text-emerald-700 mx-auto mb-1" />
          <p className="text-xs text-emerald-700 font-semibold uppercase">Tax saved</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{formatINR(taxSaved, { compact: true })}</p>
        </div>
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-center">
          <TrendingUp className="w-6 h-6 text-amber-700 mx-auto mb-1" />
          <p className="text-xs text-amber-700 font-semibold uppercase">Extra wealth at end</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{formatINR(extraWealth, { compact: true })}</p>
        </div>
        <div className="rounded-2xl bg-primary text-white p-4 text-center">
          <ShieldCheck className="w-6 h-6 mx-auto mb-1" />
          <p className="text-xs font-semibold uppercase opacity-90">Total advantage</p>
          <p className="text-2xl font-bold mt-1">{formatINR(totalAdvantage, { compact: true })}</p>
        </div>
      </div>

      {extraYears > 0 && (
        <p className="text-center text-slate-700 text-sm mt-4">
          <strong>Plus:</strong> Your corpus lasts <strong className="text-primary">{extraYears} more year{extraYears === 1 ? "" : "s"}</strong> with the Retire 360 plan.
        </p>
      )}

      <div className="mt-6 text-center">
        <p className="text-slate-700 text-sm mb-3">
          The difference comes from <strong>splitting income across both spouses</strong>, <strong>SWP instead of FD interest</strong>, and <strong>ring-fencing big expenses separately</strong>. A local agent rarely sets this up.
        </p>
        <WealthManagerCTA
          variant="inline"
          context={`I saw I could save ${formatINR(totalAdvantage, { compact: true })} compared to a local agent's plan`}
          headline="Lock this plan in with a specialist"
        />
      </div>
    </section>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone: "good" | "bad" | "neutral" }) {
  const valueClass = tone === "good" ? "text-emerald-700" : tone === "bad" ? "text-red-700" : "text-slate-900";
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={`font-bold text-base ${valueClass}`}>{value}</span>
    </div>
  );
}

function KPI({ label, value, sublabel, tone = "default" }: { label: string; value: string; sublabel?: string; tone?: "default" | "positive" | "warning" }) {
  const toneClass = tone === "positive" ? "text-emerald-700" : tone === "warning" ? "text-amber-700" : "text-slate-900";
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${toneClass}`}>{value}</p>
      {sublabel && <p className="text-xs text-slate-500 mt-1">{sublabel}</p>}
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-slate-500">Loading…</div>}>
      <PlanPageInner />
    </Suspense>
  );
}
