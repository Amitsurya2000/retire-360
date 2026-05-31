// Single source of truth for things you'll want to change without hunting through the code.

// Your WhatsApp number — country code + number, no + or spaces.
// To change it later, just edit the line below.
export const WHATSAPP_NUMBER = "916355272798";

// The default pre-filled message that opens when a user taps the CTA.
// You can personalize this with their name or context if you want.
export function whatsappLink(prefilledMessage?: string): string {
  const text = prefilledMessage ?? "Hello! I'm using the Retire 360 app and would like to speak with a Retirement Specialist about my plan. I'm looking for someone who doesn't sell products — just gives me a clear plan.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const BRAND = {
  name: "Retire 360",
  wealthManagerLabel: "Retirement Specialist",
  tagline: "Retire Easy. Plan With Specialists, Not Agents.",
  shortTagline: "Plan With Specialists, Not Agents.",
  promise: "We don't sell products. We design your monthly income, protect your big expenses, and grow what's left — for YOU.",
  ctaPrimary: "Build My Retirement Safety Plan",
  ctaSecondary: "Talk to a Specialist on WhatsApp",
};
