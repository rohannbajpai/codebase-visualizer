---
name: design-review
description: Use when the user asks for `design-review`, `/design-review`, or the legacy `/qa-design-review` in this repo. Follow the vendored gstack workflow at `.claude/skills/gstack/design-review/SKILL.md`.
---

# design-review

This repo vendors gstack at `.claude/skills/gstack`. For this skill:

1. Read `.claude/skills/gstack/design-review/SKILL.md` and use it as the source of truth.
2. Apply repo overrides from `AGENTS.md`:
   - Prefer repo-local `.claude/skills/gstack/...` paths over `~/.claude/skills/gstack/...`.
   - Translate any `CLAUDE.md` reference into `AGENTS.md`.
   - If browser setup is required and `.claude/skills/gstack/browse/dist/browse` is missing, run `cd .claude/skills/gstack && ./setup-codex`.
   - Do not run upstream `./setup` unless the user explicitly asks for Claude Code symlink registration.
   - Do not edit `.claude/skills/gstack` unless the task is to update the vendored gstack snapshot.
3. Treat `/design-review` and `/qa-design-review` as aliases for this Codex skill, not as literal slash commands.
