# MVP Validation — Therapies, Appointments, Dashboard, and Hardening

## Merge Criteria

The `mvp` branch is ready to merge only when every automated, HTTP, browser, responsive, accessibility, reliability, and scope check below passes. Run commands from `my-agentclinic/` unless stated otherwise.

## 1. Branch and Clean Dependency Installation

```sh
git branch --show-current
npm ci
```

- The active branch is exactly `mvp`.
- `npm ci` exits with status `0` and the manifest agrees with the lockfile.
- Any new dependency is necessary, documented, and pinned to an exact version.
- No ORM, client-side framework, second CSS framework, analytics SDK, or unrelated dependency is present.

## 2. Automated Test Suite

```sh
npm test
```

- Vitest runs once and exits with status `0`.
- Tests use isolated temporary or in-memory databases and an injected clock/logger; they do not depend on the application database, wall-clock timing, or global console state.
- Every retained Phase 1 and Phase 2 test passes.

Required database assertions:

- A fresh database contains the migrations, agents, ailments, `agent_ailments`, therapies, `ailment_therapies`, and appointments tables with documented columns, constraints, and indexes.
- Foreign keys are enabled and reject invalid agent, ailment, and therapy relationships.
- Therapy names are non-empty and unique; recommendation pairs and display positions are unique per ailment; display orders are positive.
- Appointment statuses outside `scheduled`, `completed`, and `cancelled` are rejected.
- Running migrations and seeds twice leaves the same schema, therapy records, recommendations, IDs, and order.
- A failed migration rolls back and is not recorded as applied.
- Appointment queries use test-created fixtures; application seeds do not create appointments.

Required therapy assertions:

- At least five seeded therapies are listed deterministically by `GET /therapies`, and each exposes its documented `therapy-{id}` fragment target.
- Every seeded ailment displays its recommendations in `display_order`, with links resolving to the matching `/therapies#therapy-{id}` entries and no therapy detail route.
- A test ailment with no recommendations produces the explicit empty state.
- Shared navigation, layout landmarks, local PicoCSS, and AgentClinic styling remain present.

Required booking assertions:

- The form route works for an existing agent and returns `404` for malformed or missing IDs.
- A valid future local value creates exactly one `scheduled` appointment, stores an offset-bearing ISO-8601 timestamp, and returns a `303` confirmation redirect.
- Following the redirect returns an appointment detail page with the correct agent, time, and status; refreshing it creates no additional row.
- Missing, malformed, nonexistent-calendar, exact-current-time, past, daylight-saving-gap, and ambiguous repeated-time values return `422` without inserting a row.
- A valid `TZ` override controls conversion and display; without it, the supported runtime host IANA timezone is used. An unsupported `TZ` or unresolved host timezone prevents startup with a clear configuration error.
- Invalid forms safely retain the submitted value, associate readable errors with the field, and escape markup-like input.
- Two separate valid POST requests may create two appointments; no undocumented uniqueness rule rejects them.

Required dashboard and lifecycle assertions:

- Agent count includes every agent.
- Active-ailment count includes distinct ailments linked to active agents only.
- Upcoming count and list include future `scheduled` appointments only.
- Upcoming records order by scheduled timestamp then ID; recent records order by creation timestamp and ID descending; each list is limited to ten.
- Dashboard links resolve to their agent and appointment records and all empty states are explicit.
- A scheduled appointment can transition once to `completed` or once to `cancelled`.
- Successful status updates affect exactly one row and return a `303` redirect.
- Completion redirects to `/dashboard?notice=appointment-completed` and cancellation redirects to `/dashboard?notice=appointment-cancelled`; each renders fixed success copy.
- Unknown, duplicated, or markup-like notice values are ignored and never reflected into the page.
- Unsupported or missing targets return `422`, unknown/malformed IDs return `404`, and transitions from terminal states return `409`.
- Repeated or competing transitions cannot change a terminal record, and rejected updates leave stored data unchanged.
- Terminal appointments have no mutation controls.

Required reliability assertions:

- Unknown routes render the shared `404` page.
- A controlled unexpected exception renders the shared `500` page and invokes error logging.
- Public error responses contain no stack, SQL, filesystem path, database details, or submitted private values.
- Each completed request log contains method, path, status, and elapsed time once.
- Expected validation and conflict responses do not emit unexpected-error logs or request-body content.
- Mutation controls submit with `POST`; project documentation and scope review explicitly identify CSRF protection as a local-only MVP deferral rather than production-ready security.

## 3. Type Checking and Production Build

```sh
npm run typecheck
npm run build
```

- Both commands exit with status `0` and report no TypeScript errors.
- Strict TypeScript remains enabled.
- The configured production output is emitted successfully.

## 4. Server and HTTP Smoke Checks

```sh
npm run dev
```

- Startup migrates and seeds the configured database and listens on port `3000` without an exception.
- Check `/`, `/health`, `/agents`, a known and missing agent, `/ailments`, `/therapies`, a known agent booking form, a known and missing appointment, `/dashboard`, both stylesheets, and an unknown route.
- Existing routes retain their documented status, body, content-type, layout, and navigation contracts.
- New successful page routes return `200` HTML; missing records and unknown routes return `404` HTML.
- Submit invalid bookings and status updates and confirm the documented `422` and `409` responses.
- Submit a valid future booking, confirm the `303` redirect and stored record, then mark it terminal from the dashboard and confirm the second `303` redirect.
- Set `TZ` to a supported IANA zone and confirm booking conversion and display use it; separately confirm invalid configuration fails before the server accepts requests.
- Observe one useful completion log per request and confirm an intentionally controlled server error produces a generic `500` response plus a server-side error log.
- No response exposes internal details and no page or workflow requires JavaScript.

## 5. End-to-End Browser Walkthrough

- Open an agent record and understand its identity, status, and ailments.
- Open the ailments catalog and see ordered therapy recommendations.
- Browse the complete therapies catalog.
- Start booking from an agent record; verify labels, future-date expectations, and clear invalid-input feedback.
- Book a valid future appointment, land on its confirmation page, and verify agent, local date/time, and scheduled status.
- Open the dashboard and verify summary counts, upcoming appointments, recent activity, empty states where applicable, and record links.
- Complete or cancel the new appointment and verify its terminal status and disappearance from upcoming work.
- Confirm a terminal appointment cannot be changed again and exposes no further status controls.
- Confirm playful copy never obscures navigation, labels, statuses, validation, errors, or next actions.
- Confirm there are no broken assets, unintended external requests, or browser console errors.

## 6. Responsive and Accessibility Audit

Inspect every catalog, detail page, form state, confirmation, dashboard state, and error page at `320px`, `768px`, and `1440px`.

- No page has horizontal document scrolling, clipped content, overlapping regions, or unreachable controls.
- Navigation wraps or adapts cleanly; content retains visible gutters; dashboard summaries and activity records remain understandable on narrow screens.
- The skip link is hidden until keyboard-focused, then remains visible and moves focus to the main landmark.
- Dashboard summaries progress from one column on narrow screens to two and then three columns when space permits; forms and action groups return to a readable single-column flow when constrained.
- Wide data tables, if retained, scroll only inside labelled keyboard-focusable regions rather than widening the document.
- At 200% browser text size, information and controls reflow without loss or overlap.
- Each page has semantic landmarks and a logical heading hierarchy.
- Every form control has an explicit label; validation messages are associated with the affected field and remain understandable without color.
- Normal, focused, invalid, disabled, success, and destructive form states are visually distinguishable without depending on color alone.
- Keyboard-only traversal reaches every link and form control in a sensible order, with a visible focus indicator throughout.
- Link purpose, status, success, warning, and error meaning do not rely on color alone.
- Text, links, controls, status treatments, errors, and focus indicators meet WCAG 2.2 AA contrast expectations.
- Touch targets and spacing remain practical at mobile sizes.
- With reduced motion enabled, non-essential transitions or animations are disabled.
- Pages remain understandable when project CSS fails to load.

## 7. Persistence, Restart, and Failure Review

- Restart the server and confirm migrations and seeds do not duplicate or reorder data.
- Confirm created appointments and terminal statuses survive restart.
- Confirm a terminal-state update is atomic by exercising two competing transitions in a repository or route test; only one may succeed.
- Confirm malformed identifiers never reach an unsafe database query or expose an exception.
- Confirm form values and route-derived content are escaped and all SQL values are bound parameters.
- Confirm logging never records request bodies, database contents, or validation field values.
- Confirm deployment/security documentation does not imply that public mutation routes without CSRF protection are safe for internet exposure.

## 8. Scope and Diff Review

- Confirm every roadmap item in Phases 3 through 7 is implemented and covered by this validation document.
- Confirm the existing Phase 2 roadmap completion checkmark remains in the branch.
- Confirm the implementation contains no authentication, authorization, CSRF-token system, notifications, appointment notes, rescheduling, capacity rules, therapy scoring, therapy detail route, advanced analytics, external integrations, deployment automation, ORM, or client-side framework.
- Confirm no application database, temporary test database, log output, build artifact, or other generated runtime file is committed.
- Review the final diff for focused phase-sized commits and ensure unrelated inherited work was not rewritten.

## Definition of Done

The MVP is mergeable only when clean installation, the full Vitest suite, strict type checking, production build, HTTP contracts, end-to-end workflow, responsive and accessibility audit, persistence restart, atomic lifecycle behavior, safe logging and failures, roadmap coverage, and scope review all pass. Any failure blocks merge until the implementation or this specification is deliberately corrected and reviewed.
