"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { AdvisorChat } from "@/components/AdvisorChat";
import { WealthManagerCTA } from "@/components/WealthManagerCTA";

function AdvisorPageInner() {
  const params = useSearchParams();
  const idFromUrl = params.get("id");
  const [profileId, setProfileId] = useState<string | null>(idFromUrl);
  const [userName, setUserName] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!idFromUrl) {
      const stored = typeof window !== "undefined" ? localStorage.getItem("retirewell.profileId") : null;
      if (stored) setProfileId(stored);
    }
    setChecking(false);
  }, [idFromUrl]);

  useEffect(() => {
    if (!profileId) return;
    fetch(`/api/profile?id=${profileId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.fullName) setUserName(data.fullName);
      })
      .catch(() => {});
  }, [profileId]);

  if (checking) {
    return <div className="p-20 text-center text-slate-500">Loading…</div>;
  }

  if (!profileId) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Build your plan first</h1>
        <p className="text-slate-600 mb-8">
          The advisor needs your retirement profile and plan to give meaningful advice. Spend 5 minutes on the onboarding wizard first.
        </p>
        <Link href="/onboarding" className="btn-primary inline-flex items-center gap-2">
          Start the Wizard <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <div className="mb-4">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">AI Advisor</p>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">Talk to Retire 360</h1>
        <p className="text-slate-600 text-sm mt-1">
          Your advisor knows your plan. Ask anything about money, taxes, or life in retirement.
        </p>
      </div>

      <AdvisorChat profileId={profileId} userName={userName} />

      <WealthManagerCTA variant="floating" context="I'm chatting with the AI advisor and would like to speak to a wealth manager" />
    </div>
  );
}

export default function AdvisorPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-slate-500">Loading…</div>}>
      <AdvisorPageInner />
    </Suspense>
  );
}
