---
name: changelog
description: Maintain the project-root CHANGELOG.md from Git commit history, grouped under newest-first YYYY-MM-DD headings. Use when explicitly invoked with $changelog before merging, or when the user explicitly asks to create, bootstrap, refresh, or update the changelog.
---

# Maintain the Changelog

Run this workflow from the project root before merging completed work.

## Workflow

1. Confirm the current directory is the intended project root and is inside a Git worktree.
2. Run the bundled updater:

```sh
python3 .codex/skills/changelog/scripts/changelog.py
```

3. Review `CHANGELOG.md` and its diff. Confirm:
   - the file begins with `# Changelog`;
   - headings use `## YYYY-MM-DD` and appear newest first;
   - every project-scoped Git commit appears as one bullet under its authored date;
   - no uncommitted implementation is described as completed work.
4. Report whether the file was created, updated, or already current. Do not commit or merge unless the user separately requests it.

## Behavior

- Scope history to commits that touched the current project directory, even when the project is nested in a larger repository.
- Create `CHANGELOG.md` when absent by examining all project-scoped commits.
- Regenerate the Git-derived dated sections when present so commits added on an existing date are not missed.
- Use commit subjects as bullet text and preserve their Git order within each date.
- Make no change when generated content already matches the file.

## Format

```markdown
# Changelog

## 2026-09-29

- Add route validation tests

## 2026-09-28

- Complete Hono foundation phase
```
