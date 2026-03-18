# Engineering Plan: Codebase Visualizer

Generated on 2026-03-17 via `plan-eng-review`.

## Goal

Build an open-source Next.js app that keeps architecture visualizations and generated docs in sync with fast-moving codebases. A repo owner installs the app, connects GitHub, adds provider API keys, merges a setup PR once, and every merge to `main` refreshes the dashboard automatically.

## Step 0: Scope Challenge

### What already exists

- This repo currently contains only gstack workflow wrappers plus a README.
- There is no existing product code, auth layer, database schema, worker, or GitHub integration to reuse.
- The plan should therefore optimize for the smallest clean starting point, not for compatibility with legacy code.

### Recommended scope reduction

The product brief naturally expands into a platform. V1 should be reduced to a single, complete path:

- One deployable Next.js app.
- One background worker backed by Neon/Postgres jobs.
- One repo at a time per workspace.
- JS/TS repositories only.
- One visualization family in V1:
  - repo map
  - dependency graph
  - generated architecture/docs pages
  - diff summary from previous successful `main` run
- One continuous update trigger:
  - GitHub Action on push to `main`
- One key-management model:
  - user pastes provider keys into the app
- One artifact publishing model:
  - publish to dashboard storage, not back into the repo

This is a deliberate scope reduction from the broader CEO vision. It keeps onboarding smooth without committing V1 to org-wide views, PR previews, multi-language support, or docs write-back.

### Easy deploy requirement

The default hosted stack should optimize for low ops burden:

- Next.js app deployed as a standard Node service.
- One worker process from the same repo.
- Neon Postgres for primary database and job queue storage.
- S3-compatible blob storage, with Cloudflare R2 as the default recommendation.
- Every deployable part represented in templates or IaC checked into the repo.
- Prefer the lowest monthly floor that still supports long-running analysis jobs cleanly.

This keeps the app deployable without Redis, Kubernetes, or extra infrastructure coordination.

### Completeness check

Within that reduced scope, the implementation should still be complete:

- full run lifecycle states
- visible failure states
- schema-validated LLM outputs
- retries and backoff
- versioned artifacts by commit SHA
- test coverage for happy path, retry path, malformed model output, and stale dashboard behavior

### NOT in scope

- Multi-repo or org-level dashboards.
- Non-JS/TS repository support.
- PR preview visualizations before merge.
- Auto-committing generated docs into the repo.
- In-browser diagram editing.
- IDE plugins.
- Agentic code changes or autofixes.
- Redis, Kafka, or multi-service orchestration.

## Engineering review outcome

Scope is accepted in reduced form. The plan should be implemented as a boring-by-default single-app system, not a monorepo platform on day one.

## Architecture Review

### Core decisions

- Use a single Next.js App Router codebase.
- Keep all server code under `src/server/*` and the queue worker under `src/worker/*`.
- Use Neon Postgres for both relational storage and job queue metadata.
- Use `pg-boss` for background jobs to avoid adding Redis.
- Use GitHub OAuth for user login and a GitHub App for repo installation and repository access.
- Use a signed GitHub Actions trigger. Recommended default: GitHub OIDC verification on the backend so onboarding does not require manual repo secrets.
- Use `ts-morph` plus the TypeScript compiler for JS/TS analysis.
- Use Zod for every external payload and every LLM response schema.
- Use S3-compatible object storage for artifact snapshots.
- Use a small provider adapter layer, not a general-purpose workflow DSL.

### Why this shape

- A single Next.js codebase is the minimal diff for a greenfield app.
- Neon Postgres plus `pg-boss` spends zero extra infrastructure tokens on Redis and keeps hosted setup simple.
- Thin GitHub Actions keep secrets, retries, and observability centralized in the app.
- JS/TS-only analysis prevents the parser layer from becoming the real project.
- Artifacts stored as Markdown, Mermaid, and JSON remain inspectable and exportable.

### Repository layout

```text
src/
  app/
    (marketing)/
    (app)/
      onboarding/
      repos/[repoId]/
      repos/[repoId]/runs/[runId]/
      settings/providers/
      settings/github/
    api/
      github/webhook/route.ts
      actions/ingest/route.ts
      providers/test/route.ts
      repos/[repoId]/refresh/route.ts
  components/
  server/
    auth/
    db/
    github/
    providers/
    analyzer/
    artifacts/
    runs/
    observability/
  worker/
    index.ts
    jobs/
```

### System architecture

```text
                          +----------------------+
                          |   Next.js Web App    |
                          |  UI + API routes     |
                          +----------+-----------+
                                     |
                                     v
+------------------+        +--------+---------+         +------------------+
| GitHub OAuth     |        |  Neon Postgres   |         |  Object Storage  |
| User login       |<------>| app data + jobs  |<------->| artifacts/json   |
+------------------+        +--------+---------+         +------------------+
                                     ^
                                     |
                          +----------+-----------+
                          |   Worker process     |
                          |   pg-boss consumer   |
                          +----------+-----------+
                                     ^
                                     |
                         +-----------+------------+
                         | GitHub App + Actions   |
                         | install + OIDC trigger |
                         +-----------+------------+
                                     |
                                     v
                             +-------+-------+
                             |  GitHub repo   |
                             | source archive |
                             +---------------+
```

### Main data flow

```text
merge to main
  -> GitHub Action requests OIDC token
  -> POST /api/actions/ingest
  -> verify repo, branch, and signature
  -> create run row with status=queued
  -> enqueue process-run job
  -> worker fetches repo snapshot via GitHub App installation token
  -> analyzer builds file graph and symbol summaries
  -> model adapter generates structured explanations
  -> artifact builder emits markdown + mermaid + json
  -> upload artifact set
  -> atomically mark run=published
  -> dashboard points to newest successful run
```

### Shadow paths

```text
happy path:    trigger -> queue -> analyze -> generate -> publish -> dashboard updates
nil path:      repo not configured -> reject trigger -> dashboard stays on old run
empty path:    repo has too little analyzable code -> publish limited docs + warning badge
error path:    provider timeout or invalid JSON -> retry -> fail run visibly -> old dashboard remains live
```

### Production failure scenarios to design for

- GitHub Action posts duplicate events.
  - Mitigation: idempotency key on `{repo_id, sha}`.
- Repo fetch succeeds but artifact publish fails.
  - Mitigation: never switch `published_run_id` until upload completes.
- Provider returns invalid JSON.
  - Mitigation: strict schema validation, one repair attempt, then fail visibly.
- Queue backlog grows.
  - Mitigation: per-workspace concurrency limit and stale-data banner.
- A new merge lands during an in-flight run.
  - Mitigation: do not cancel active run automatically; mark older result superseded if a newer successful run publishes first.

## Schema Plan

Use Neon Postgres with explicit migrations. Keep the schema small.

| Table | Purpose | Key columns |
| --- | --- | --- |
| `users` | app users | `id`, `email`, `github_user_id` |
| `workspaces` | top-level tenant boundary | `id`, `name`, `owner_user_id`, `published_run_id` |
| `workspace_members` | team access | `workspace_id`, `user_id`, `role` |
| `github_installations` | GitHub App install mapping | `id`, `workspace_id`, `github_installation_id`, `github_account_login` |
| `repositories` | tracked repos | `id`, `workspace_id`, `github_repo_id`, `owner`, `name`, `default_branch`, `status` |
| `provider_credentials` | encrypted BYOK secrets | `id`, `workspace_id`, `provider`, `label`, `encrypted_secret`, `status` |
| `repository_settings` | per-repo analysis settings | `repository_id`, `primary_provider_credential_id`, `primary_model`, `review_model`, `token_budget`, `path_filters_json` |
| `runs` | every analysis attempt | `id`, `repository_id`, `sha`, `branch`, `status`, `trigger_source`, `error_code`, `started_at`, `finished_at`, `artifact_manifest_url` |
| `run_events` | debug timeline | `id`, `run_id`, `stage`, `level`, `message`, `metadata_json`, `created_at` |
| `artifacts` | versioned generated outputs | `id`, `run_id`, `artifact_type`, `storage_key`, `content_hash`, `metadata_json` |

### Recommended enums

- `repositories.status`
  - `pending_setup`
  - `active`
  - `disabled`
  - `error`
- `provider_credentials.status`
  - `valid`
  - `invalid`
  - `revoked`
- `runs.status`
  - `queued`
  - `fetching`
  - `analyzing`
  - `generating`
  - `publishing`
  - `published`
  - `failed`
  - `superseded`

### Run state machine

```text
queued
  -> fetching
  -> analyzing
  -> generating
  -> publishing
  -> published

failure edges:
fetching   -> failed
analyzing  -> failed
generating -> failed
publishing -> failed

publish race:
published -> superseded
```

## Route Plan

### App routes

| Route | Purpose |
| --- | --- |
| `/` | marketing page with demo screenshots and install CTA |
| `/login` | auth entry |
| `/onboarding` | connect GitHub, choose repo, add key, generate setup PR |
| `/repos/[repoId]` | latest published dashboard |
| `/repos/[repoId]/runs/[runId]` | run details, logs, artifacts, retry CTA |
| `/settings/providers` | add/test/revoke API keys |
| `/settings/github` | GitHub App install and reconnect state |

### API routes

| Route | Purpose |
| --- | --- |
| `/api/github/webhook` | GitHub App installation and repo metadata sync |
| `/api/actions/ingest` | signed trigger endpoint from GitHub Actions |
| `/api/providers/test` | verify provider key and supported models |
| `/api/repos/[repoId]/refresh` | manual re-run from UI |

## Onboarding Flow

```text
user signs in
  -> creates workspace
  -> installs GitHub App
  -> picks repo
  -> pastes provider key
  -> picks model preset
  -> app creates setup PR
  -> user merges PR
  -> first push-to-main run triggers automatically
  -> dashboard becomes available
```

### UX defaults

- Default preset: `Balanced`.
- Hide advanced model routing until after first successful run.
- Test provider key immediately when pasted.
- Show exact next step at every screen.
- Keep onboarding blocked only by true prerequisites:
  - no GitHub install
  - no valid provider key
  - no merged setup PR

## GitHub Action Contract

The workflow should be thin. It should not run the analyzer locally.

### Generated files

- `.github/workflows/codebase-visualizer.yml`
- `codebase-visualizer.config.ts`

### Workflow behavior

1. Trigger on `push` to the repo default branch.
2. Request a GitHub OIDC token.
3. POST repo metadata to the app:
   - repository ID
   - owner/name
   - branch
   - commit SHA
   - workflow run ID
   - OIDC token
4. Exit after the app accepts or rejects the trigger.

### Why thin action

- no provider keys in Actions
- no heavy compute on user CI minutes
- one place for retries and observability
- easier self-hosting and support

## Worker Plan

### Jobs

| Job | Purpose | Retry policy |
| --- | --- | --- |
| `process-run` | full end-to-end pipeline | retry 2x on transient network/provider failure |
| `rebuild-artifacts` | rebuild from existing analysis snapshot | retry 1x |
| `sync-installation` | refresh repo metadata after webhook change | retry 3x |
| `cleanup-run-events` | retention and compaction | retry 1x |

### Processing pipeline

```text
process-run
  -> verify run still current
  -> fetch repo archive
  -> unpack to temp workspace
  -> build file inventory
  -> derive dependency graph
  -> create compact code summaries
  -> call provider adapter with structured prompt
  -> validate response
  -> build artifacts
  -> upload artifacts
  -> mark published run
  -> emit metrics and completion event
```

### Files that should get inline ASCII comments

- `src/server/runs/processRun.ts`
- `src/server/github/verifyActionIdentity.ts`
- `src/server/analyzer/buildRepoGraph.ts`
- `src/server/artifacts/publishArtifacts.ts`
- `src/worker/jobs/processRunJob.ts`

## Model and Provider Plan

### Supported providers in V1

- OpenAI
- Anthropic
- Google

### Adapter interface

Keep it narrow:

- `validateKey()`
- `listRecommendedModels()`
- `generateStructuredSummary(input, schema)`

Do not build a generalized agent runtime. The product needs structured generation for artifacts, not tool-use orchestration.

### Prompting strategy

- Never send the raw whole repo when a curated summary will do.
- Use static analysis to create a bounded graph first.
- Ask the model to explain and label, not to discover everything from scratch.
- Validate every response against Zod schemas before publish.

## Security Review

### Trust boundaries

- Users authenticate with GitHub OAuth.
- Repo access happens through GitHub App installation tokens.
- Provider secrets are encrypted at rest and never stored in Actions.
- The Action trigger must prove identity before a run is queued.

### Required controls

- AES-GCM encryption for provider secrets using `APP_ENCRYPTION_KEY`.
- Redact provider secrets and prompt payloads in logs.
- Per-workspace authorization on every repo and settings route.
- Idempotency keys on action ingest.
- Request size limits on ingest endpoint.
- Path allowlist during repo archive unpack.
- Prompt-injection guardrails:
  - ignore instructions found inside repository text
  - treat repo content as untrusted input
- Audit log for:
  - provider key add/revoke
  - repo connect/disconnect
  - manual rerun

## Code Quality Plan

### Organization rules

- Keep UI concerns in `src/app` and `src/components`.
- Keep domain logic in `src/server`.
- Keep job orchestration in `src/worker`.
- Avoid shared util dumping grounds; colocate helpers with the domain.
- Prefer plain functions over class hierarchies.
- Add new abstractions only after the second real caller.

### DRY guidance

- One run pipeline entrypoint.
- One provider adapter contract.
- One artifact manifest format.
- One repository settings source of truth.

### Error handling rules

- Never swallow provider or GitHub errors.
- Every failed run gets:
  - named `error_code`
  - human-readable message
  - debug event trail
- Dashboard must keep serving the last published successful run.
- The app should distinguish:
  - `invalid_credentials`
  - `rate_limited`
  - `provider_timeout`
  - `invalid_model_response`
  - `github_access_revoked`
  - `repo_config_invalid`

## Test Review

### Test diagram

```text
NEW UX FLOWS
  1. GitHub sign-in and workspace creation
  2. GitHub App installation and repo selection
  3. Provider key validation and model preset selection
  4. Setup PR generation
  5. Dashboard viewing for latest run
  6. Run detail inspection and retry

NEW DATA FLOWS
  1. Action ingest request -> run row -> queued job
  2. Repo archive fetch -> temp workspace -> analyzer summary
  3. Analyzer summary -> provider response -> validated artifact payload
  4. Artifact payload -> object storage -> published_run_id switch

NEW CODEPATHS
  1. OIDC verification success/failure
  2. Provider key test success/failure
  3. Duplicate SHA trigger dedupe
  4. Provider malformed JSON repair path
  5. Publish fail with old dashboard preserved
  6. Superseded run after newer publish

NEW BACKGROUND JOBS
  1. process-run
  2. rebuild-artifacts
  3. sync-installation

NEW EXTERNAL INTEGRATIONS
  1. GitHub OAuth
  2. GitHub App API
  3. GitHub Actions OIDC
  4. Provider APIs
  5. Neon Postgres
  6. S3-compatible object storage
```

### Required test matrix

| Area | Test type | Must cover |
| --- | --- | --- |
| onboarding gating | integration + e2e | each blocked state and first-success path |
| provider key validation | unit + integration | invalid key, revoked key, supported models |
| action ingest | integration | valid token, invalid token, duplicate SHA, wrong branch |
| process-run job | unit + integration | repo fetch, analyzer output, provider retry, publish success |
| artifact publish | integration | atomic switch to new dashboard, no partial publish |
| dashboard pages | e2e | loading, empty, stale, failed, success |
| access control | integration | workspace isolation and unauthorized access |
| supersede logic | unit | older run cannot replace newer published run |

### Failure modes registry

| Codepath | Failure mode | Test? | Error handling? | User sees | Critical gap? |
| --- | --- | --- | --- | --- | --- |
| `/api/actions/ingest` | invalid OIDC token | yes | reject 401 and log event | run not created, setup hint remains | no |
| `process-run` | GitHub archive fetch timeout | yes | retry 2x then fail run | failed run with retry CTA | no |
| `process-run` | repo archive path traversal attempt | yes | reject unpack and fail run | failed run with security error | no |
| provider adapter | malformed JSON response | yes | schema reject, repair once, then fail run | failed run with provider error | no |
| artifact publish | object storage write error | yes | do not switch published pointer | old dashboard stays active | no |
| dashboard load | no successful run yet | yes | render empty state | setup/progress UI | no |
| rerun action | workspace member lacks access | yes | 403 | permission error | no |

### QA artifact inputs

The QA plan should focus on:

- `/onboarding`
- `/settings/providers`
- `/repos/[repoId]`
- `/repos/[repoId]/runs/[runId]`
- generated workflow success after merge to `main`

## Performance Review

### Main risks

- Large repos causing expensive prompt payloads.
- Re-running identical SHAs.
- Loading dashboards by stitching too many artifact objects.
- Queue starvation when one workspace pushes many merges quickly.

### Performance controls

- Hard repo cap in V1:
  - max file count
  - max total text bytes
- Skip ignored paths by default:
  - `node_modules`
  - build output
  - lockfile-heavy vendor directories
- Cache analysis snapshots by commit SHA.
- Deduplicate on `{repository_id, sha}`.
- Keep a compact artifact manifest in Postgres; do not list object storage on each page load.
- Limit worker concurrency per workspace.

### Expected slow paths

| Codepath | p95 target |
| --- | --- |
| action ingest | < 1s |
| provider key test | < 5s |
| dashboard page load | < 2s server render |
| process-run for medium repo | < 5 min end-to-end |

## Deployment and rollout plan

### Environments

- local: Docker Postgres or Neon dev branch + local object storage
- preview: Neon branch database + non-production GitHub App + test provider keys
- production: dedicated Neon project/database, dedicated GitHub App, encrypted secrets, production bucket

### Recommended hosted deployment

- `web`: Railway Node service running the Next.js app
- `worker`: Railway worker service running the same repo with a worker start command
- `db`: Neon Postgres
- `blob`: Cloudflare R2

This is the recommended default because it keeps the deployment story understandable for open-source users:

- one repo
- one database vendor
- one blob vendor
- no Redis
- no Kubernetes
- no separate internal control plane
- Render remains a compatible fallback, but Railway is the default recommendation for V1.

It is also the fastest and cheapest clean production path in this plan:

- Next.js still works unchanged.
- Railway fits long-running worker jobs without redesigning the pipeline around function limits.
- Neon keeps the database fully managed.
- R2 keeps artifact storage cheap and simple.

### Infrastructure as code and templates

Everything needed to stand the app up should live in versioned templates:

- `Dockerfile.web`
  - builds and runs the Next.js app
- `Dockerfile.worker`
  - runs the queue consumer
- `docker-compose.yml`
  - local app + worker + Postgres + MinIO-style local blob storage
- `railway.web.json`
  - Railway deploy config for the web service
- `railway.worker.json`
  - Railway deploy config for the worker service
- `infra/opentofu/neon/*`
  - Neon project, branch, role, and database provisioning
- `infra/opentofu/r2/*`
  - R2 bucket and credentials wiring
- `.env.example`
  - all required environment variables with comments
- `templates/codebase-visualizer.config.ts`
  - repo-local analysis config generated into the user's repo
- `templates/codebase-visualizer.workflow.yml`
  - GitHub Actions workflow template generated into the user's repo

### IaC rules

- The hosted path must be reproducible from the repo without dashboard-only steps, except for unavoidable OAuth/GitHub App registration.
- Provider resources should have one command to plan/apply:
  - `tofu plan`
  - `tofu apply`
- Local development should have one command:
  - `docker compose up`
- New environments must be derivable from the same templates, not rebuilt by hand.

### Rollout sequence

```text
deploy app + worker
  -> verify GitHub webhook connectivity
  -> test provider credential flow
  -> install app on internal dogfood repo
  -> merge setup PR
  -> confirm first run publishes
  -> confirm second run replaces dashboard cleanly
  -> open to external beta
```

### Rollback posture

- App deploy rollback: revert deployment, keep schema backward compatible.
- Failed run rollback: no action needed, old dashboard remains current.
- GitHub App issue: disable repo in UI and show reconnect instructions.

## Suggested implementation slices

### Slice 1: app skeleton and auth

- Next.js app shell
- GitHub OAuth login
- workspace model
- protected app layout

### Slice 2: GitHub App and repo connection

- installation webhook
- repo sync
- onboarding screens

### Slice 3: provider credentials

- encrypted secret storage
- key validation
- model preset UI

### Slice 4: run pipeline

- action ingest
- queue
- worker
- run events

### Slice 5: analyzer and artifact generation

- repo fetch/unpack
- JS/TS graph extraction
- structured generation
- manifest publishing

### Slice 6: dashboard and run details

- latest dashboard page
- run detail page
- stale/failure states

### Slice 7: setup PR generator

- generated workflow
- generated config
- merge-time onboarding finish

### Slice 8: deployment templates and IaC

- Dockerfiles for web and worker
- local docker-compose stack
- Railway deploy configs
- OpenTofu modules for Neon and R2
- environment variable templates and bootstrap docs

## Proposed TODOs

### PR preview dashboards

**What:** Generate a temporary visualization preview for pull requests before merge.

**Why:** Lets teams inspect architecture drift before changes hit `main`.

**Context:** Valuable after the main-branch pipeline is stable; do not add before V1 proves the artifact model and run queue.

**Effort:** L
**Priority:** P2
**Depends on:** stable run pipeline and artifact publishing

### Docs sync-back PRs

**What:** Open a PR that commits generated docs and diagrams back into the repository.

**Why:** Gives teams a docs-as-code path once they trust the generated outputs.

**Context:** This should remain opt-in because it changes the source repo and creates merge-noise risk.

**Effort:** M
**Priority:** P3
**Depends on:** artifact quality and approval workflow

### Multi-language analyzer plugins

**What:** Add parser modules for Python, Ruby, and Go repositories.

**Why:** Expands product reach after JS/TS V1.

**Context:** Do not mix this into V1; parser breadth can easily become the main project.

**Effort:** XL
**Priority:** P3
**Depends on:** JS/TS pipeline proving useful first

## Unresolved decisions

None for V1. Recommended defaults are locked:

- Railway for `web` and `worker`
- Neon Postgres for database and queue storage
- Cloudflare R2 for artifact storage
- `ts-morph` for JS/TS parsing

## Summary

- Step 0: scope reduced to a complete single-repo V1
- Architecture review: one Next.js app, one worker, Neon-backed Postgres queue, GitHub App, thin Action trigger
- Code quality review: function-first modules, narrow provider adapter, explicit run states
- Test review: full matrix defined for onboarding, ingest, run processing, publishing, and dashboard states
- Performance review: dedupe by SHA, cap repo size, cache analysis snapshot, keep artifact reads cheap
- Deployment posture: Railway + Neon + R2 with repo-checked templates and IaC
- Result: implementation-ready plan without unnecessary platform abstractions
