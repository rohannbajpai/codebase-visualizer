# codebase-visualizer

Codebase Visualizer is a Next.js foundation for an open-source repository atlas:
versioned architecture dashboards, merge-aware docs, provider-managed model
policies, and deployment templates aimed at the fastest cheap path to V1.

This repo also vendors Garry Tan's `gstack` workflows so Codex can use the
planning, review, and ship skills locally while the app is being built.

## What exists today

- Next.js App Router scaffold under `src/app`
- settings, onboarding, repository, and run-detail pages
- stubbed ingest, provider-test, webhook, refresh, and health API routes
- worker and run-pipeline foundation under `src/server` and `src/worker`
- deployment templates:
  - `Dockerfile.web`
  - `Dockerfile.worker`
  - `docker-compose.yml`
  - `railway.web.toml`
  - `railway.worker.toml`
- IaC starter modules:
  - `infra/opentofu/neon`
  - `infra/opentofu/r2`
- generated repo templates:
  - `templates/codebase-visualizer.config.ts`
  - `templates/codebase-visualizer.workflow.yml`
- planning artifact:
  - `ENGINEERING_PLAN.md`

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Start the worker in another terminal:

```bash
npm run worker
```

4. Open `http://localhost:3000`.

For a full local stack with Postgres and MinIO-style blob storage:

```bash
docker compose up --build
```

## Environment

Copy from `.env.example` and fill in the real values for:

- GitHub OAuth + GitHub App credentials
- `DATABASE_URL`
- R2 bucket credentials
- provider API keys
- `APP_ENCRYPTION_KEY`

## Deploy shape

The current default deploy path matches the engineering plan:

- `web` + `worker` on Railway
- Neon Postgres
- Cloudflare R2

The repo includes starter IaC and service config, but the infra modules should
still be verified against the latest provider docs before production use.

## Vendored gstack

Repo-local Codex wrappers point at the vendored upstream `gstack` snapshot under
`.claude/skills/gstack`.

Key files:

- `AGENTS.md`: maps gstack slash-style requests into repo-local Codex skills
- `.claude/skills/gstack`: vendored upstream snapshot
- `.codex/skills/*/SKILL.md`: repo-local wrappers

Example usage from Codex:

- `Use the gstack /plan-ceo-review workflow on this feature idea.`
- `Run the vendored gstack /review workflow on the current branch.`
- `Use the vendored gstack /qa workflow against http://localhost:3000.`
