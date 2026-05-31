"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Sparkles, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/onboarding", label: "Get Started" },
  { href: "/plan", label: "My Plan" },
  { href: "/tax", label: "Tax Optimizer" },
  { href: "/advisor", label: "Advisor", icon: true },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when menu open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 backdrop-blur-md bg-white/90">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center justify-center w-9 h-9 bg-primary text-white rounded-xl">
            <Sparkles className="w-5 h-5" />
          </span>
          <span className="font-bold text-xl tracking-tight">Retire 360</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`btn-ghost inline-flex items-center gap-1.5 ${active ? "text-primary bg-primary-light" : ""}`}
              >
                {link.icon && <Sparkles className="w-4 h-4 text-primary" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white animate-fade-in">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-lg font-medium transition-colors inline-flex items-center gap-2 ${
                    active ? "bg-primary-light text-primary" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.icon && <Sparkles className="w-5 h-5 text-primary" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
