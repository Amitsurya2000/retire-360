# Retire 360

A retirement planning app for Indian retirees. Turn a lump-sum corpus into steady monthly income using the bucket strategy. Save tax, plan for 25 years.

## What's inside

- **Landing page** — explains the bucket strategy
- **Onboarding wizard** — 5 steps that capture your situation
- **Plan page** — bucket allocation pie chart, 25-year income projection, corpus depletion curve, "what-if" sliders
- **Tax Optimizer** — old vs new regime comparison with senior-citizen deductions
- **AI Advisor** — chat with Google Gemini about your plan, taxes, and retirement life choices. Knows your numbers, replies in your language (English/Hindi/Tamil/etc.), remembers your conversation. Educational only.
- **Learn More cards** — every recommended instrument (SCSS, POMIS, FDs, etc.) has a plain-English "What is this? Why is it good for me?" explanation.
- **Talk to a Wealth Manager** — WhatsApp call-to-action buttons throughout the app connect retirees to a human advisor.

## How to run it on your Mac

### One-time setup

**Important:** since the app is now wired for Postgres (so it deploys cleanly to Vercel), local dev also needs a Postgres URL. Easiest path:

```
cd "/Users/rv/GBM- APPS/retirewell"
npm install
# Paste your Vercel Postgres DATABASE_URL into .env first, then:
npm run db:migrate
```

You can use the SAME hosted Postgres URL for both local dev and production — for a single-developer project that's perfectly fine.

### To use the AI Advisor (free)

The AI Advisor uses **Google Gemini**, which has a generous **free tier — no credit card needed**.

**Step 1.** Go to https://aistudio.google.com/apikey and sign in with your Google account.

**Step 2.** Click **"Create API key"** and copy it (it starts with `AIza...`).

**Step 3.** Open the file `/Users/rv/GBM- APPS/retirewell/.env` in any text editor.

**Step 4.** Find the `GEMINI_API_KEY` line, remove the `#` at the start, and paste your key:
```
GEMINI_API_KEY="AIza..."
```

**Step 5.** Save the file and restart the dev server (`Ctrl + C`, then `npm run dev` again).

The Advisor works in any Indian language — type in Hindi/Tamil/Telugu and it replies in the same language. If the key is missing, the Advisor page shows friendly setup instructions when you try to chat.

Free tier: ~1,500 messages/day on Gemini 2.5 Flash. More than enough for personal use.

### To set your WhatsApp number (for the "Talk to a Wealth Manager" buttons)

The app has "Connect with a Wealth Manager" buttons throughout that open WhatsApp. To make them point to your number:

**Step 1.** Open `/Users/rv/GBM- APPS/retirewell/src/lib/config.ts`.

**Step 2.** Change the `WHATSAPP_NUMBER` line to your number — country code + number, no `+` or spaces:
```
export const WHATSAPP_NUMBER = "919876543210";  // for +91 98765 43210
```

**Step 3.** Save. All the WhatsApp buttons across the app now point to you. (Until you set this, they use a placeholder and won't connect.)

### Daily use — start the app

```
cd "/Users/rv/GBM- APPS/retirewell"
npm run dev
```

Then open **http://localhost:3100** in your browser.

(Retire 360 runs on port **3100** so it never clashes with your other apps like Intelligent Advisory, which uses 3000.)

Press `Ctrl + C` in the terminal to stop the app.

### To see the saved profiles in a friendly DB UI

```
npm run db:studio
```

This opens Prisma Studio at http://localhost:5555 — a table view of every profile saved.

### To wipe all data and start fresh

```
npm run db:reset
```

## File map (for the curious)

- `src/app/page.tsx` — landing page
- `src/app/onboarding/page.tsx` — the 5-step wizard
- `src/app/plan/page.tsx` — the bucket-strategy plan + charts
- `src/app/tax/page.tsx` — tax optimizer
- `src/lib/calculations.ts` — the financial engine (bucket allocation, projection)
- `src/lib/tax.ts` — old vs new regime tax calc
- `src/lib/format.ts` — Indian number formatting (lakhs, crores)
- `prisma/schema.prisma` — the database model

## What's NOT built yet

The original spec mentioned more features beyond Features 1–3. To add later:
- AI advisor (chat with Claude about the plan)
- Health & lifestyle dashboards
- PDF export of the plan
- User accounts / auth
- Travel & bucket-list planner

These plug into the same database and calculation engine — easy follow-on work.

## Deploying to Vercel (shareable preview link)

Standard path to put Retire 360 on the internet with a `*.vercel.app` URL you can share with clients.

### 1. Push to GitHub (already done if you're reading this on GitHub)
The repo at github.com/&lt;your-username&gt;/retirewell is the source of truth. Every push to `main` auto-deploys.

### 2. Create a Vercel project
- Go to [vercel.com](https://vercel.com), sign in with GitHub
- **New Project** → **Import** → pick the `retirewell` repo
- Framework: **Next.js** (auto-detected)
- Click **Deploy** — first build will fail because env vars aren't set yet. That's expected. Continue to step 3.

### 3. Add a Postgres database
- In the Vercel project → **Storage** tab → **Create Database** → **Postgres**
- Vercel auto-injects `DATABASE_URL` (and a few related vars) into your project's environment.

### 4. Add the Gemini API key
- Project → **Settings** → **Environment Variables**
- Add: `GEMINI_API_KEY` = `AIza...` (from [aistudio.google.com/apikey](https://aistudio.google.com/apikey))
- Apply to: Production, Preview, Development

### 5. Run the first migration against the new Postgres
On your Mac, copy the `DATABASE_URL` from Vercel's Storage tab and paste it into your local `.env`. Then run:
```
npm run db:migrate -- --name init
```
This creates all the tables. Vercel auto-runs `prisma generate` on every deploy, but the first `migrate` has to be triggered once from your machine.

### 6. Redeploy
- Back on Vercel → **Deployments** → click the latest → **Redeploy**
- 1-2 minutes later you get a `https://retirewell-xxxx.vercel.app` URL. Share it with your client.

### Updating later
Just `git push` to `main` — Vercel auto-builds and deploys. Schema changes need `npm run db:migrate` run once from your machine.

## Tech notes

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Prisma + PostgreSQL (was SQLite during local development)
- Google Gemini 2.5 Flash for the AI Advisor
- Recharts for visualizations
- No login required — your profile is saved by an ID stored in your browser's localStorage

> ⚠ Educational guidance, not investment advice. Consult a SEBI-registered advisor before acting on any numbers.
