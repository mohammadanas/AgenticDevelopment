---
name: feature-spec
description: Start the next roadmap feature by inspecting specs/roadmap.md and existing dated specs, interviewing the user with one grouped three-question AskUserQuestion call, creating a feature branch, and writing requirements.md, plan.md, and validation.md in a dated specs directory. Use when the user asks for a feature spec, the next phase, a new feature branch and specification, or wants to start the next roadmap feature.
---

# Feature Spec

Create a decision-complete specification for the next unplanned roadmap phase. Do not implement the feature.

## Workflow

### 1. Inspect before asking

- Read `specs/roadmap.md`, `specs/mission.md`, and `specs/tech-stack.md` completely.
- Inspect existing `specs/YYYY-MM-DD-*` directories, the current branch, and `git status`.
- Inspect only the application files needed to understand established routes, data, UI, and test patterns.
- Identify the next phase as the first roadmap phase that is not marked complete and is not already represented by a feature-spec directory. Do not rely on checkboxes being present.
- If completion is genuinely ambiguous after inspection, include the concrete candidates in the interview instead of guessing.

### 2. Interview before any mutation

Use AskUserQuestion (the interactive `request_user_input` tool where available) once with exactly three questions in one grouped call:

| Header | Lock down |
|---|---|
| **Scope** | User-visible behavior, data or fields, inclusions, and exclusions |
| **Decisions** | Material UX, storage, interface, validation, privacy, or compatibility choices not answered by the repository |
| **Validation** | Automated and manual evidence required for merge readiness |

- Offer meaningful, mutually exclusive choices and recommend the option most consistent with the roadmap, mission, stack, and existing patterns.
- Do not ask for facts discoverable from the repository.
- Do not create a branch, directory, or file until all three answers are received.
- If the interactive question tool is unavailable, stop without mutating the repository and explain that the required interview cannot be completed in the current mode. Do not replace it with an ordinary text questionnaire.

### 3. Resolve branch safety

- Require a clean worktree before creating the branch. Preserve all unrelated user changes.
- If the tree is dirty, stop and report the exact conflicting paths; do not stash, commit, discard, or carry them onto the new branch without explicit authorization.
- Create `feature/<feature-name>` from the branch containing the latest completed phase. Use a short kebab-case feature name derived from the roadmap heading.
- If the branch already exists, inspect it and reuse it only when it clearly belongs to this exact feature; otherwise ask before choosing another name.

### 4. Create the specification

Create `specs/YYYY-MM-DD-<feature-name>/` using the current local date and add exactly these files:

#### `requirements.md`

- State the roadmap context, user goal, and relevant current behavior.
- Record in-scope and out-of-scope behavior explicitly.
- Capture the interview decisions and their consequences.
- Define public routes, interfaces, fields, data changes, and failure behavior only where the feature needs them.
- Cite `specs/mission.md` and `specs/tech-stack.md` as governing guidance without copying them wholesale.
- Leave no material implementation choice unresolved. Label intentionally deferred work.

#### `plan.md`

- Organize implementation into numbered task groups (`## 1. ...`, `## 2. ...`).
- Order groups by dependency and keep each independently reviewable.
- Include concrete implementation outcomes and relevant tests in each group.
- Do not implement the feature or include completed checkboxes.

#### `validation.md`

- Define objective automated and manual merge gates.
- Name the repository's real test, typecheck, build, or lint commands after inspecting its configuration.
- Cover the primary flow, validation and failure paths, accessibility, responsive behavior, regressions, and user-facing tone when relevant.
- End with an explicit definition of done and handling for checks that cannot be run locally.

### 5. Verify and report

- Confirm the expected branch is active.
- Confirm the dated directory contains exactly `plan.md`, `requirements.md`, and `validation.md`.
- Run `git diff --check` and inspect the complete diff, including untracked files.
- Compare the documents against the selected roadmap phase, interview answers, mission, and stack.
- Report the branch, clickable file paths, validation performed, and any unresolved blocker. Do not commit or implement unless the user separately requests it.

## Guardrails

- Add no dependencies or application code while creating the spec.
- Do not combine later roadmap phases unless the user explicitly chooses to expand scope during the interview.
- Prefer the repository's established terminology and architecture.
- Keep the documents concise, specific, and ready for another agent to implement without further product decisions.
