# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # install dependencies (first time)
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## Stack

- **Next.js 15** with App Router and TypeScript
- **React 19** (server + client components)
- **Tailwind CSS v4** — configured via `app/globals.css` (`@theme` block), no `tailwind.config.ts`
- **DM Sans** via `next/font/google`
- **All data is hardcoded** in `lib/data.ts` — no backend, no API calls

## Architecture

```
app/                  # Next.js App Router pages
  layout.tsx          # Root layout: sidebar + topbar + <main>
  page.tsx            # Dashboard
  kunden/
    page.tsx          # Customer list (client — search/filter state)
    [id]/page.tsx     # Customer detail (client — tab state, useParams)
  kontakte/page.tsx   # Contacts (client — search state)
  health/page.tsx     # Health scores (server)
  onboarding/page.tsx # Kanban pipeline (server)
  renewals/page.tsx   # Renewal table (server)
  kommunikation/page.tsx  # Activity feed (client — filter state)
  berichte/page.tsx   # Analytics + SVG charts (server)
  einstellungen/ hilfe/   # Placeholder stubs

components/
  Sidebar.tsx         # 'use client' — usePathname for active state; Link-based nav
  TopBar.tsx          # 'use client' — derives title + back button from usePathname
  Icons.tsx           # Named SVG exports (DashboardIcon, HealthIcon, etc.)
  Avatar.tsx          # Circular avatar with inline color from data
  Badge.tsx           # Badge, StatusBadge, PlanBadge
  HealthBar.tsx       # Colored progress bar + score label
  Card.tsx            # Card + KpiCard

lib/
  types.ts            # Customer, Contact, Activity, OnboardingEntry, Plan, etc.
  data.ts             # CUSTOMERS, CONTACTS, ACTIVITIES, ONBOARDING_DATA, ONBOARDING_PHASES
  helpers.ts          # daysUntil, formatDate, healthColor, healthBg, healthLabel
```

## Key conventions

**Client vs server components**: Pages with local state (`useState`) are `'use client'`. Pages that only render data (health, onboarding, renewals, berichte) are server components. `Sidebar` and `TopBar` are always client components because they use `usePathname`.

**Navigation**: `Sidebar` uses `next/link` with `usePathname()` to determine active state. `/kunden/[id]` highlights the Kunden nav item via `pathname.startsWith('/kunden')`.

**Dynamic colors**: Avatar background, health bar color, badge colors come from data and use inline `style` props — Tailwind cannot handle runtime hex values.

**Custom Tailwind colors** (defined in `app/globals.css` `@theme`):
- `lime` → `#C8FF00` (active nav item background)
- `app-bg` → `#F2F2F2` (page background)
- `app-border` → `#E8E8E8`
- `app-text` → `#1A1A1A`
- `app-text2` → `#6B6B6B`
- `app-text3` → `#ABABAB`
- `orange-light` → `#FFF0E5`

Standard Tailwind colors used: `violet-600` (#7C3AED for purple), `green-600`, `orange-600`, `red-600`, `blue-600`.

**Data model**:
- `Customer`: id, name, initials, color, plan (Starter/Pro/Business), mrr, health (0–100), status, renewal (date string), industry, users, lastLogin, campaigns, projects, nps
- `Contact`: customerId FK → Customer
- `Activity`: type (email/call/note/system), customerId, user, date, time

## Environment variables

`.env.local` contains placeholder keys for Supabase (not yet connected):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
