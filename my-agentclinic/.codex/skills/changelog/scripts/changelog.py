#!/usr/bin/env python3
"""Generate a dated project changelog from project-scoped Git history."""

from __future__ import annotations

import subprocess
import sys
from collections import defaultdict
from pathlib import Path


def run_git(*args: str) -> str:
    result = subprocess.run(
        ["git", *args],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout


def project_history() -> dict[str, list[str]]:
    output = run_git(
        "log",
        "--format=%ad%x00%s%x00",
        "--date=short",
        "--",
        ".",
    )
    fields = [field.strip() for field in output.split("\0") if field.strip()]
    if len(fields) % 2:
        raise RuntimeError("Unexpected git log output")

    commits: dict[str, list[str]] = defaultdict(list)
    for index in range(0, len(fields), 2):
        date = fields[index].strip()
        subject = fields[index + 1].strip()
        if date and subject:
            commits[date].append(subject)
    return commits


def render(commits: dict[str, list[str]]) -> str:
    lines = ["# Changelog", ""]
    for date in sorted(commits, reverse=True):
        lines.extend([f"## {date}", ""])
        lines.extend(f"- {subject}" for subject in commits[date])
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    try:
        if run_git("rev-parse", "--is-inside-work-tree").strip() != "true":
            raise RuntimeError("Current directory is not inside a Git worktree")
        commits = project_history()
    except (subprocess.CalledProcessError, RuntimeError) as error:
        print(f"changelog: {error}", file=sys.stderr)
        return 1

    if not commits:
        print("No project-scoped commits found; CHANGELOG.md was not changed.")
        return 0

    changelog = Path.cwd() / "CHANGELOG.md"
    content = render(commits)
    existed = changelog.exists()

    if existed and changelog.read_text(encoding="utf-8") == content:
        print("CHANGELOG.md is already up to date.")
        return 0

    changelog.write_text(content, encoding="utf-8")
    action = "Updated" if existed else "Created"
    count = sum(len(subjects) for subjects in commits.values())
    print(f"{action} CHANGELOG.md with {count} entries across {len(commits)} dates.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
