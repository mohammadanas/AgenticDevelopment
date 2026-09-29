# Phase 2 Validation — Agents and Ailments

## Merge Criteria

Phase 2 is ready to merge only when every automated, HTTP, manual, accessibility, responsive, and scope check below passes. Run all commands from `my-agentclinic/`.

## 1. Clean Dependency Installation

```sh
npm ci
```

- The command exits with status `0` and the manifest agrees with the lockfile.
- `@picocss/pico`, `better-sqlite3`, and any required type declarations are recorded at exact versions.
- No additional CSS framework, ORM, client-side framework, or unrelated dependency is present.

## 2. Automated Test Suite

```sh
npm test
```

- The command runs Vitest once and exits with status `0`.
- Tests use isolated temporary or in-memory databases and do not depend on a developer's application database.
- Existing Phase 1 home, stylesheet, shared-layout, and health tests continue to pass, with layout expectations extended for PicoCSS.

Required migration and database assertions:

- A fresh database migrates successfully and contains the migrations, agents, ailments, and `agent_ailments` tables with the documented columns and constraints.
- Foreign-key enforcement is active, invalid relationships are rejected, and duplicate agent–ailment pairs are prevented.
- Running migrations twice succeeds without reapplying or duplicating migrations.
- A failed migration is rolled back and is not marked as applied.
- Seeds create at least five deterministic agents, at least five deterministic ailments, and representative relationships.
- Running seeds twice leaves the same agents, ailments, and relationship counts and stable identifiers.

Required data-access and route assertions:

- Agent and ailment list queries return deterministic, typed results.
- An existing agent can be retrieved with all linked ailments; an agent with none returns an empty collection.
- `GET /agents` returns `200` HTML with every seeded agent's name, model type, readable status, and detail link.
- `GET /agents/:id` for a representative seeded record returns `200` HTML with its identity fields and linked ailments.
- Known agents without ailments render the documented empty state.
- Unknown and malformed agent IDs return `404` HTML through the shared layout and expose no database details.
- `GET /ailments` returns `200` HTML with every seeded ailment's name and description.
- New pages contain the shared semantic landmarks and navigation links to `/`, `/agents`, and `/ailments`.
- Every HTML page links the locally served PicoCSS stylesheet before `/static/style.css`; no stylesheet depends on a third-party CDN.

## 3. Type Checking and Build

```sh
npm run typecheck
npm run build
```

- Both commands exit with status `0` and report no TypeScript errors.
- Strict TypeScript remains enabled.
- The production build emits the configured output successfully.

## 4. Server and HTTP Smoke Checks

```sh
npm run dev
```

- The application initializes its database, applies pending migrations, and starts without an exception on port `3000`.
- Keep it running while checking `/`, `/health`, `/agents`, a known seeded `/agents/:id`, `/agents/999999`, `/agents/not-a-number`, `/ailments`, the local PicoCSS URL, and `/static/style.css`.
- Home and health responses preserve their Phase 1 status, content type, and body contracts; both stylesheets return `200` with CSS content types.
- Catalog and known-detail routes return `200` with HTML content types; missing and malformed agent routes return `404` with HTML content types.
- Every HTML response is a complete English-language document with the shared header, navigation, main content, footer, and linked stylesheet.
- Agent links resolve to the expected detail records, and navigation links reach the expected pages without redirects or errors.

## 5. Manual Browser Walkthrough

- Visit Home, Agents, a representative agent detail, an agent with no ailments if one is seeded, Ailments, and a missing-agent URL.
- Confirm agent names, model types, readable statuses, ailment names, descriptions, and relationships agree with the deterministic seed records.
- Confirm the no-ailments and missing-agent messages are clear, friendly, and actionable rather than blank or technical.
- Confirm clinic-themed copy is playful but concise and does not obscure navigation, record labels, state, or errors.
- Confirm no page requires client-side JavaScript and there are no broken assets or browser console errors.
- In the browser network panel, confirm PicoCSS loads from the local application with `200`, loads before the AgentClinic override stylesheet, and makes no CDN request.

## 6. Responsive and Accessibility Checks

Use responsive browser tools at widths of `320px`, `768px`, and `1440px`.

- No page has horizontal document scrolling, clipped text, overlapping regions, or unreachable links.
- Navigation wraps or adapts cleanly, content retains visible gutters, and lists and record details remain readable.
- PicoCSS base styling is visibly applied, while AgentClinic-specific brand and responsive overrides remain effective.
- Page content follows a logical heading order and uses semantic landmarks, links, lists, and descriptive labels.
- Traverse each page using only the keyboard; every interactive element is reachable in a sensible order and has a visible focus indicator.
- Link purpose and agent status remain understandable without relying on color alone.
- Text, links, status treatments, and focus indicators have readable contrast.
- At increased browser text size, content reflows without hiding information or controls.

## 7. Scope and Data Review

- Inspect the implementation diff and confirm routes use parameterized SQL and do not expose database errors.
- Restart the server and confirm migrations and seeds remain idempotent and existing records are not duplicated.
- Confirm the implementation contains no therapies, appointment booking, staff dashboard, CRUD forms, authentication, authorization, notifications, external services, cloud deployment, ORM, additional CSS framework, or client-side application framework.
- Confirm application database artifacts and temporary test databases are not committed.

## Definition of Done

The feature is mergeable when clean installation, the complete Vitest suite, type checking, production build, application startup, HTTP contracts, browser walkthrough, responsive and accessibility checks, persistence repeatability, and scope review all pass. Any failure blocks merge until the implementation or this specification is deliberately corrected and reviewed.
