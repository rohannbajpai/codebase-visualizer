# Repo Instructions

## gstack for Codex

This repo vendors upstream `garrytan/gstack` at `.claude/skills/gstack` from commit `78c207efb42c90f84b5e383cd4aba39ecff29896`.
Repo-local Codex wrappers live at `.codex/skills/<workflow>/SKILL.md` and forward to the vendored gstack workflows.

The `.claude/skills/gstack` path is intentional. Upstream `SKILL.md` files and helper scripts resolve paths relative to that layout, so preserving it is safer than rewriting the prompts.

Codex does not execute Claude slash commands literally. Use the repo-local Codex wrappers as the primary entrypoint and treat slash forms as aliases only.

Workflow mapping:
- `$browse`, `browse`, or `/browse` -> `.codex/skills/browse/SKILL.md`
- `$plan-ceo-review`, `plan-ceo-review`, or `/plan-ceo-review` -> `.codex/skills/plan-ceo-review/SKILL.md`
- `$plan-eng-review`, `plan-eng-review`, or `/plan-eng-review` -> `.codex/skills/plan-eng-review/SKILL.md`
- `$plan-design-review`, `plan-design-review`, or `/plan-design-review` -> `.codex/skills/plan-design-review/SKILL.md`
- `$design-consultation`, `design-consultation`, or `/design-consultation` -> `.codex/skills/design-consultation/SKILL.md`
- `$design-review`, `design-review`, or `/design-review` -> `.codex/skills/design-review/SKILL.md`
- `$review`, `review`, or `/review` -> `.codex/skills/review/SKILL.md`
- `$ship`, `ship`, or `/ship` -> `.codex/skills/ship/SKILL.md`
- `$qa`, `qa`, or `/qa` -> `.codex/skills/qa/SKILL.md`
- `$qa-only`, `qa-only`, or `/qa-only` -> `.codex/skills/qa-only/SKILL.md`
- `$setup-browser-cookies`, `setup-browser-cookies`, or `/setup-browser-cookies` -> `.codex/skills/setup-browser-cookies/SKILL.md`
- `$retro`, `retro`, or `/retro` -> `.codex/skills/retro/SKILL.md`
- `$document-release`, `document-release`, or `/document-release` -> `.codex/skills/document-release/SKILL.md`
- `$gstack-upgrade`, `gstack-upgrade`, or `/gstack-upgrade` -> `.codex/skills/gstack-upgrade/SKILL.md`
- Legacy `$qa-design-review`, `qa-design-review`, or `/qa-design-review` -> `.codex/skills/qa-design-review/SKILL.md`

Operational rules:
- Prefer repo-local `.codex/skills/...` wrappers for Codex skill invocation.
- Prefer repo-local `.claude/skills/gstack/...` paths over `~/.claude/skills/gstack/...` when wrappers or upstream docs mention both.
- Treat the older `/qa-design-review` name as an alias for the design review wrapper. The current vendored upstream snapshot no longer ships a separate `/qa-design-review` directory.
- If a gstack workflow needs the browser binary and `.claude/skills/gstack/browse/dist/browse` is missing, run `cd .claude/skills/gstack && ./setup-codex`.
- Do not run upstream `./setup` unless the user explicitly wants Claude Code symlink registration. That script creates `.claude/skills/<skill>` symlinks that Codex does not need.
- Translate any instruction that says `CLAUDE.md` into `AGENTS.md` when working in this repo.
- Do not edit `.claude/skills/gstack` unless the task is to update or patch the vendored gstack snapshot itself.
