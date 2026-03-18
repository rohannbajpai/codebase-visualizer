---
name: qa-only
description: Use when the user asks for `qa-only` or `/qa-only` in this repo. Follow the vendored gstack workflow at `.claude/skills/gstack/qa-only/SKILL.md`.
---

# qa-only

This repo vendors gstack at `.claude/skills/gstack`. For this skill:

1. Read `.claude/skills/gstack/qa-only/SKILL.md` and use it as the source of truth.
2. Apply repo overrides from `AGENTS.md`:
   - Prefer repo-local `.claude/skills/gstack/...` paths over `~/.claude/skills/gstack/...`.
   - Translate any `CLAUDE.md` reference into `AGENTS.md`.
   - If browser setup is required and `.claude/skills/gstack/browse/dist/browse` is missing, run `cd .claude/skills/gstack && ./setup-codex`.
   - Do not run upstream `./setup` unless the user explicitly asks for Claude Code symlink registration.
   - Do not edit `.claude/skills/gstack` unless the task is to update the vendored gstack snapshot.
3. Treat `/qa-only` as an alias for this Codex skill, not as a literal slash command.
