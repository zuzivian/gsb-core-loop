# GSB Core Loop

Personal MVP for goals, signals, actions, and relationships.

## Runtime target

This app keeps the current **Next.js App Router + server actions** architecture and is intended for a **Node.js runtime host** (recommended: Vercel with Node runtime functions).

## Database configuration

SQLite file storage is not a good fit for Vercel/serverless-style deployments because local files are ephemeral. The Prisma datasource is configured for hosted Postgres via environment variables.

Required env vars:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require"
```

Optional but recommended for migrations (unpooled direct connection):

```bash
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require"
```

## Quick start (local)

1) Install dependencies

```bash
npm install
```

2) Create `.env` with `DATABASE_URL` (and optionally `DIRECT_URL`) pointing to your Postgres database.

3) Generate Prisma client + run local migrations

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

4) Run dev server

```bash
npm run dev
```

Open http://localhost:3000

## Deployment (Vercel preferred)

1) Provision hosted Postgres (Neon, Supabase, RDS, etc.).
2) Add `DATABASE_URL` and `DIRECT_URL` in Vercel Project Settings → Environment Variables.
3) Ensure migrations run during deploy before serving traffic.

### Recommended migration step in CI/deploy

Use Prisma's deploy migration command in your pipeline:

```bash
npm run prisma:migrate:deploy
```

Example GitHub Actions job:

```yaml
name: Deploy prep
on:
  push:
    branches: [main]

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run prisma:generate
      - run: npm run prisma:migrate:deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          DIRECT_URL: ${{ secrets.DIRECT_URL }}
```

You can run this migration job before your Vercel deployment job (or as a pre-deploy step in your existing CI pipeline).
