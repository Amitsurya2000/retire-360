import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { BackToTop } from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Retire 360 — Plan Your Retirement Income",
  description: "Convert your retirement corpus into steady monthly income. Smart, simple planning for Indian retirees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main>{children}</main>
        <BackToTop />
        <footer className="border-t border-slate-200 bg-white mt-16">
          <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-slate-500">
            <p>Retire 360 · Educational guidance, not investment advice. Consult a SEBI-registered advisor before investing.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
