# GSB Core Loop - Design Doc

## 1) Purpose and Context

This document captures the end-to-end product, design, and technical context for the "GSB Core Loop" MVP so another Codex agent (Codex Web) can continue development without additional briefing.

The app is a personal, mobile-first productivity system designed for a single user:

- GSB student (Class of 2028)
- CompE background, military experience
- Career outcomes: tech PM or adjacent
- Priorities: deep friendships (primary), career outcomes (secondary), skills/academics (tertiary)
- Time budget now: ~5 hrs/week, growing to 10 hrs/week by April, 20 hrs/week by June
- Workflow constraints: mobile/web-first, works on phone and restricted work laptop (web only), can integrate with Telegram later

The goal is a minimal system that actually changes daily and weekly behavior, not a broad "everything dashboard." The MVP must close a clear loop: **Goals -> Signals -> Actions -> Weekly Review**, and track meaningful relationships through a **People CRM**.

## 2) Product Goals

Primary goals:

1. Build deep, long-term GSB relationships (top priority).
2. Land first professional experience/internship by Summer 2027 (and avoid running out of capital by 2028).
3. Build durable skills and academic momentum.

Secondary goal:

- Preserve optionality for career path changes at GSB (PM vs consulting vs startup).

Success criteria (behavioral):

- User makes a weekly decision (focus + commitments).
- User takes 1-2 actions daily that move a defined signal.
- User maintains consistent relationship cadence (no stale contacts).

## 3) Non-Goals (MVP)

- Event tracking (clubs/classes) beyond a simple free-text context tag.
- Calendar integration, email ingestion, or external app sync.
- Multi-user, collaboration, or team features.
- AI suggestions, summaries, or copilots.
- Finance/personal/family life tracking.

## 4) MVP Scope

### Core Loop

- **Goals** with 3 categories: Relationships, Career, Skills.
- **Signals** per goal with weekly numeric targets.
- **Actions** tied to a signal, logged quickly from mobile/web.
- **Weekly Review** with wins, misses, commitments.

### People CRM

- Store a person, last touch, next step, optional context tag.
- Log touches and update last-touch date.
- Surface stale contacts (14+ days since last touch).

### Opinionated Dashboard

Shows:

1. Today’s actions (or "none logged").
2. Top 3 signals with progress vs target.
3. Stale contacts (max 5).
4. Quick action entry form.

The dashboard should answer in under 30 seconds:

- What matters today?
- What signals are off-track?
- Who needs a follow-up?

## 5) User Stories (MVP)

1. As a user, I want to define goals (Relationships, Career, Skills) so I know what I’m optimizing for.
2. As a user, I want signals with weekly targets so I can measure progress.
3. As a user, I want to log actions tied to signals in under 20 seconds on mobile.
4. As a user, I want a people CRM to track and nurture deep relationships.
5. As a user, I want stale contact nudges so I don’t lose momentum.
6. As a user, I want a weekly review to adjust focus and set up to 3 commitments.
7. As a user, I want an opinionated dashboard that tells me what to do today.

## 6) Current Implementation Status

Implemented:

- Next.js (App Router) + TypeScript scaffold.
- Prisma schema with SQLite.
- Server actions for CRUD on goals, signals, actions, people, touches, weekly reviews.
- Pages:
  - Dashboard (`app/page.tsx`)
  - Goals + Signals (`app/goals/page.tsx`)
  - People CRM (`app/people/page.tsx`)
  - Weekly Reviews (`app/reviews/page.tsx`)
- Basic styling in `app/globals.css`.

Known issue:

- Prisma migrations are failing with a generic "Schema engine error:" (no details) when running:
  - `prisma migrate dev` or `prisma db push`.
- Prisma version was initially 5.22.0, upgraded to 7.3.0 which introduced config breaking changes, then downgraded to v6.
- Enums were removed from schema to work with SQLite; `category` and `status` are now strings.
- Prisma generate works; Prisma migrate fails with "Schema engine error:".

Proposed fixes to try:

1. Run Prisma migrate with a fresh DB file:
   - Delete `prisma/dev.db` and re-run `prisma migrate dev --name init`.
2. Run migration with verbose logging:
   - `set PRISMA_LOG_LEVEL=debug` and `set RUST_BACKTRACE=1`.
3. If persistent, temporarily use `prisma db push` and avoid migrations, or switch to `better-sqlite3` for MVP.

## 7) Architecture

### Stack

- Next.js + TypeScript
- Prisma + SQLite (local)
- No auth (single user)

### Directory structure

```
app/
  layout.tsx
  globals.css
  page.tsx
  goals/page.tsx
  people/page.tsx
  reviews/page.tsx
lib/
  actions.ts
  dates.ts
  prisma.ts
prisma/
  schema.prisma
```

### Data model (current Prisma)

- Goal:
  - id, title, category (string), description, status (string), timestamps
- Signal:
  - id, goalId, title, weeklyTarget, active, timestamps
- Action:
  - id, signalId, happenedAt, title, notes, createdAt
- Person:
  - id, name, contextTag, lastTouchAt, nextStep, notes, timestamps
- Touch:
  - id, personId, touchedAt, summary, createdAt
- WeeklyReview:
  - id, weekStart, wins, misses, commitments, timestamps

## 8) UX and Design Principles

Design principles:

- Mobile-first, low friction, fast capture.
- Opinionated, not overloaded.
- Single-screen decision flow (dashboard).
- One form per concept, minimal inputs.

Visual direction (current CSS):

- Serif typography, warm neutral palette.
- Light background with subtle gradient.
- Simple cards and panels.

## 9) Roadmap (Post-MVP)

Phase 2 (after stable MVP):

- Event tracking (clubs/classes, group activities).
- AI suggestions or summaries for weekly reviews.
- Integrations (Telegram quick add, email/Calendar).
- Better analytics (weekly/quarterly trend lines).
- Auth + multi-device sync.

Phase 3:

- Career pipeline tracker (company, stage, contact).
- Resume versioning.
- Structured STAR story library.

## 10) Decisions and Rationale

Key decisions:

- **Optimize for GSB network and clarity now** (70% focus) with PM as a hypothesis, not a commitment.
- **People CRM only** before GSB starts; events are deferred.
- **Next.js + Prisma + SQLite** for fast iteration and future migration.
- **No auth** for speed and focus on utility.

## 11) Open Questions

1. Should "commitments" be normalized into a table (instead of a freeform field)?
2. Should actions be time-stamped or simply date-only?
3. Should "signal progress" allow manual increments not tied to actions?
4. Is the stale-contact threshold fixed (14 days) or user-configurable?

## 12) Risks and Mitigations

Risk: Overbuilding a dashboard with too much scope.
Mitigation: Keep 3-5 widgets max; insist on weekly decision outputs.

Risk: Low adoption because of friction on mobile.
Mitigation: Make all additions one form, under 20 seconds.

Risk: Prisma schema engine error blocks DB.
Mitigation: Try fresh DB and env debug. If still blocked, use `better-sqlite3` for MVP and return to Prisma later.

## 13) Handoff Notes for Codex Web

Primary goal for the next agent:

- Resolve Prisma migration issue so the app can run end-to-end.

Secondary goals:

- Confirm UI is usable on phone.
- Add minimal seed data or onboarding instructions.

Commands (PowerShell):

```
npm.cmd install
npm.cmd run prisma:generate
npm.cmd run prisma:migrate
npm.cmd run dev
```

If migration fails:

- Try delete `prisma/dev.db` and run migrate again.
- If still failing, replace Prisma with a minimal SQLite wrapper for MVP.
