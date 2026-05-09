# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

Open `index.html` directly in a browser — no build step, no server, no npm. There is no package.json, bundler, or test framework.

## Stack

- **Single-file React SPA** — all code lives in `index.html` (~1170 lines)
- **React 18 + Babel standalone** loaded from CDN at runtime; JSX is transpiled in the browser via `<script type="text/babel">`
- **No external state management, no router** — navigation is a `view` string + `selectedId` in `App` component state
- **All data is hardcoded** in the `DATA` section — no API calls, no backend

## Architecture

The `<script type="text/babel">` block is organized into named sections (marked by comments):

| Section | Contents |
|---|---|
| `THEME (C)` | Color token object (`C.lime`, `C.red`, etc.) |
| `DATA` | Hardcoded arrays: `CUSTOMERS`, `CONTACTS`, `ACTIVITIES`, `ONBOARDING_DATA` |
| `HELPERS` | `daysUntil()`, `formatDate()`, `healthColor()`, `healthBg()`, `healthLabel()` |
| `ICONS` | SVG icon components object |
| Shared UI | `Avatar`, `Badge`, `StatusBadge`, `PlanBadge`, `HealthBar`, `Card`, `KpiCard`, `TopBar` |
| Layout | `Sidebar` (fixed 220 px, driven by `NAV` / `NAV2` arrays), `TopBar` |
| Views | One component per route (see below) |
| `App` | Root component — holds `view` + `selectedId` state, renders layout + active view |

### Navigation model

`App` renders the view matching the `view` string. Sidebar items call `setView(id)`. The `kunden-detail` view is a drill-down from `kunden`, parameterized by `selectedId`.

| Route id | View component | Description |
|---|---|---|
| `dashboard` | `Dashboard` | KPI cards, health overview, recent activities |
| `kunden` | `KundenList` | Searchable/filterable customer table |
| `kunden-detail` | `KundeDetail` | Tabbed detail (Übersicht, Kontakte, Aktivitäten, Onboarding) |
| `kontakte` | `KontakteView` | Contacts across all customers |
| `health` | `HealthView` | Health score list with risk bands |
| `onboarding` | `OnboardingView` | Kanban pipeline |
| `renewals` | `RenewalsView` | Renewal deadlines with urgency coloring |
| `kommunikation` | `KommunikationView` | Activity feed (email/call/note/system) |
| `berichte` | `BerichteView` | Analytics with inline SVG charts |

### Data model

- **Customer**: `id`, `name`, `initials`, `color`, `plan` (Starter/Pro/Business), `mrr`, `health` (0–100), `status`, `renewal` (date), `industry`, `users`, `lastLogin`, `campaigns`, `projects`, `nps`
- **Contact**: `customerId` foreign key → customer
- **Activity**: `type` (email/call/note/system), `customerId`, user attribution

## Styling conventions

All styling uses inline `style` props with JavaScript objects. Global resets live in a `<style>` block in `<head>`. Color tokens come from the `C` object — use those rather than raw hex values.
