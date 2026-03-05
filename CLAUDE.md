# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

MoVe Track — startup intake and screening system for the [MoVe Track program](https://montreal.ventures/movetrack/) by Montreal Ventures.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (Postgres) - @docs/database/index.md
- **AI:** Claude API (Sonnet) — `claude-sonnet-4-6`
- **UI:** Tailwind CSS + shadcn/ui
- **Deploy:** Vercel

## Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## Architecture

Four modules defined in `docs/spec.md`:

1. **Landing Page** — @docs/landing
2. **Formulário Inteligente** — @docs/features/form.md
3. **CRM** — Internal dashboard for analysts to manage the application pipeline.
4. **IA Copiloto** — Automatic screening using Claude API: generates score, executive summary, and risk assessment per application.


### Next.js App Router conventions

- Route groups and server components by default; use `"use client"` only when needed.
- API routes in `app/api/` for backend logic (form submission, AI scoring, Supabase mutations).
- Server Actions for form handling where appropriate.

### Design system

Default mode is **dark**. Color tokens:

| Token       | Dark       | Light      |
|-------------|------------|------------|
| Background  | `#0A0A0A`  | `#F8F9FA`  |
| Text        | `#FAFAFA`  | `#111111`  |
| Primary     | `#FF6B00`  | `#00E676`  |
| Accent      | `#06B6D4`  | `#6C3AED`  |

Configure these as Tailwind CSS variables and use them as shadcn/ui theme tokens.



### AI Copiloto

Calls are made server-side to the Claude API. Keep prompts in dedicated files (e.g., `lib/ai/prompts.ts`). The copilot produces three outputs per application: **score** (numeric), **executive summary** (markdown), and **risk flags** (list).
