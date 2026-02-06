# GSB Core Loop

Personal MVP for goals, signals, actions, and relationships.

## Quick start

1) Install deps

```bash
npm install
```

2) Initialize local SQLite schema (works even when Prisma migration tooling is unavailable)

```bash
npm run db:init
```

3) (Optional) If Prisma CLI is available, generate client + run migrations

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

4) Run dev server

```bash
npm run dev
```

Open http://localhost:3000
