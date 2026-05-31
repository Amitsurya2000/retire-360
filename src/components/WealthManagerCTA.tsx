"use client";

import { whatsappLink, BRAND } from "@/lib/config";
import { MessageCircle, Phone } from "lucide-react";

type Variant = "banner" | "inline" | "card" | "compact" | "floating";

interface Props {
  variant?: Variant;
  context?: string; // Used to personalize the pre-filled WhatsApp message
  headline?: string;
  subline?: string;
}

export function WealthManagerCTA({
  variant = "card",
  context,
  headline,
  subline,
}: Props) {
  const prefill = context
    ? `Hello! I'm using the Retire 360 app — ${context}. Could you guide me?`
    : undefined;
  const href = whatsappLink(prefill);

  const defaultHeadline = `Talk to a ${BRAND.wealthManagerLabel} on WhatsApp`;
  const defaultSubline = "Free 15-min call. No sales pitch — just a clear walk through YOUR plan. Specialists, not agents.";

  if (variant === "banner") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl p-5 shadow-md transition-all hover:shadow-lg group"
      >
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg">{headline ?? defaultHeadline}</p>
            <p className="text-sm text-emerald-50 mt-0.5">{subline ?? defaultSubline}</p>
          </div>
          <span className="hidden sm:inline shrink-0 bg-white text-emerald-700 font-semibold rounded-full px-4 py-2 text-sm group-hover:scale-105 transition-transform">
            Chat now →
          </span>
        </div>
      </a>
    );
  }

  if (variant === "inline") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl px-5 py-2.5 transition-colors text-sm"
      >
        <MessageCircle className="w-4 h-4" />
        {headline ?? "Talk to a Wealth Manager"}
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-xl p-3 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-emerald-900">Need help understanding this?</p>
            <p className="text-emerald-700 text-xs">Talk to a Wealth Manager — free 15 min</p>
          </div>
          <span className="text-emerald-700 group-hover:translate-x-0.5 transition-transform">→</span>
        </div>
      </a>
    );
  }

  if (variant === "floating") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full pl-5 pr-6 py-3 shadow-lg hover:shadow-xl transition-all animate-fade-in"
        aria-label="Connect with a Wealth Manager on WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline">Talk to a Wealth Manager</span>
        <span className="sm:hidden">Help</span>
      </a>
    );
  }

  // Default: card
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <Phone className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-900">{headline ?? defaultHeadline}</h3>
          <p className="text-slate-600 text-sm mt-1 mb-4">{subline ?? defaultSubline}</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-5 py-2.5 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
