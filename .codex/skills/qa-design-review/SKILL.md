---
name: qa-design-review
description: Use when the user asks for the legacy `qa-design-review` or `/qa-design-review` name in this repo. Redirect to the vendored gstack design review workflow at `.claude/skills/gstack/design-review/SKILL.md`.
---

# qa-design-review

This is a compatibility alias. For this skill:

1. Read `.claude/skills/gstack/design-review/SKILL.md` and use it as the source of truth.
2. Apply repo overrides from `AGENTS.md`:
   - Prefer repo-local `.claude/skills/gstack/...` paths over `~/.claude/skills/gstack/...`.
   - Translate any `CLAUDE.md` reference into `AGENTS.md`.
   - If browser setup is required and `.claude/skills/gstack/browse/dist/browse` is missing, run `cd .claude/skills/gstack && ./setup-codex`.
   - Do not run upstream `./setup` unless the user explicitly asks for Claude Code symlink registration.
   - Do not edit `.claude/skills/gstack` unless the task is to update the vendored gstack snapshot.
3. Treat `/qa-design-review` as an alias for this Codex skill, not as a literal slash command.
