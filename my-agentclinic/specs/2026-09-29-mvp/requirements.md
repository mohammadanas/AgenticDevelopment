# MVP Requirements — Therapies, Appointments, Dashboard, and Hardening

## Scope

This feature completes AgentClinic's initial MVP by delivering every remaining item in roadmap Phases 3 through 7. Visitors can browse therapies and see which therapies are recommended for each ailment, book future appointments for agents, and review booking confirmations. Clinic staff can use a public dashboard to understand clinic activity and move scheduled appointments to a terminal completed or cancelled state.

The work also completes the product-wide responsive and accessibility audit and adds the friendly error handling and logging needed for a reliable local demonstration. Existing Phase 1 and Phase 2 behavior remains supported.

The implementation follows `../mission.md` and `../tech-stack.md`: Hono JSX rendered on Node.js, SQLite through `better-sqlite3`, ordered plain-SQL migrations, direct typed data access, progressively enhanced server-rendered forms, mobile-first CSS, and Vitest. No client-side application framework is introduced.

## Functional Requirements

### Shared navigation and existing records

- Every HTML page continues to use the shared layout with one semantic `header`, `nav`, `main`, and `footer`.
- Primary navigation links to Home (`/`), Agents (`/agents`), Ailments (`/ailments`), Therapies (`/therapies`), and Dashboard (`/dashboard`).
- Phase 1 and Phase 2 home, health, stylesheet, agent, ailment, migration, and seed contracts remain operational.
- All workflows work without browser-side JavaScript.
- The shared layout provides a keyboard-visible skip link targeting the focusable main landmark.

### Therapies and recommendations

Each therapy contains:

| Field | Purpose |
|---|---|
| `id` | Stable integer identifier used by relationships |
| `name` | Concise, playful therapy name |
| `description` | Clear description of the therapy |

- Seed at least five deterministic therapies consistent with AgentClinic's tone.
- Store ailment recommendations in an `ailment_therapies` many-to-many join table.
- Each recommendation has a positive integer `display_order`; order values are unique within an ailment.
- A therapy may be recommended for several ailments and an ailment may recommend several therapies.
- Recommendations contain no score, rationale, or other metadata.
- `GET /therapies` returns `200 OK` HTML and lists all therapies in deterministic name and ID order. Each entry exposes a stable fragment target in the form `therapy-{id}`.
- `GET /ailments` displays each ailment's recommended therapies in `display_order`, with deterministic ID ordering as the tie-breaking safeguard. Each recommendation links to `/therapies#therapy-{id}`; the MVP does not add therapy detail routes.
- Each seeded ailment has at least one recommendation. The UI still provides an explicit empty state if an ailment has none.

### Appointment data and booking

Each appointment contains:

| Field | Purpose |
|---|---|
| `id` | Stable integer identifier used by confirmation and management routes |
| `agent_id` | Required foreign key to the booked agent |
| `scheduled_at` | Unambiguous ISO-8601 timestamp including an offset |
| `status` | One of `scheduled`, `completed`, or `cancelled` |
| `created_at` | Timestamp used to order recent activity |

- `GET /agents/:id/appointments/new` returns a booking form for an existing agent.
- Agent detail pages include a clear link to that agent's booking form.
- The form accepts a local date and time using one `datetime-local` field and identifies the selected agent in visible copy rather than accepting a client-controlled agent selector.
- `POST /agents/:id/appointments` validates the agent ID, required date/time value, calendar validity, and that the selected instant is strictly in the future when submitted.
- Resolve the application timezone at startup from the `TZ` environment variable when it is set; otherwise use the host timezone reported by `Intl.DateTimeFormat().resolvedOptions().timeZone`. The resolved value must be a supported IANA timezone or startup fails with a clear configuration error.
- Interpret submitted wall-clock values in the resolved application timezone and persist them as ISO-8601 timestamps with an explicit offset. Display appointment times in that same timezone.
- Reject nonexistent local times created by a daylight-saving transition and reject ambiguous repeated local times rather than silently choosing an offset. These submissions return `422` with a field-associated message asking the user to choose another time.
- Invalid submissions return `422 Unprocessable Content`, preserve the submitted value safely, and show field-associated, human-readable errors through the shared layout.
- Missing or malformed agent IDs return the shared `404 Not Found` response.
- A successful submission inserts exactly one `scheduled` appointment and redirects with `303 See Other` to `/appointments/:id`.
- `GET /appointments/:id` returns a stable confirmation/detail page containing the agent, scheduled date and time, current status, and a dashboard link. Missing or malformed appointment IDs return `404`.
- The server does not try to deduplicate two separately submitted valid bookings; each accepted POST is an intentional appointment. Browser refresh of the confirmation page does not create another appointment because POST uses Post/Redirect/Get.

### Staff dashboard

- `GET /dashboard` returns `200 OK` HTML through the shared layout. It remains public for the MVP because authentication and authorization are deferred.
- The dashboard shows:
  - the total number of agents;
  - the number of distinct ailments currently linked to at least one active agent;
  - the number of future appointments whose status is `scheduled`;
  - upcoming scheduled appointments ordered by `scheduled_at`, then ID;
  - recent appointments ordered by `created_at` descending, then ID descending.
- Upcoming and recent sections show at most ten records each and provide explicit empty states.
- Agent names link to agent detail pages and appointment entries link to appointment detail pages.
- Counts and lists are computed by repository queries rather than in JSX components.

### Appointment status controls

- Each scheduled appointment shown on the dashboard offers separate server-rendered forms to mark it `completed` or `cancelled`.
- `POST /dashboard/appointments/:id/status` accepts only `completed` or `cancelled` as the requested target state.
- The server changes an appointment only when its current status is `scheduled`.
- `completed` and `cancelled` are terminal; attempts to change a terminal appointment return `409 Conflict` and do not modify it.
- A malformed or unknown appointment ID returns `404`; a missing or unsupported target status returns `422`.
- A successful transition updates exactly one record and redirects with `303 See Other` to `/dashboard?notice=appointment-completed` or `/dashboard?notice=appointment-cancelled`.
- The dashboard maps only those two allow-listed notice codes to fixed success copy. Unknown or repeated `notice` values are ignored and are never reflected into HTML.
- Status controls are clearly labelled and remain usable without JavaScript. Terminal appointments display their status but no mutation controls.

### Responsive design and accessibility

- Audit every page at common mobile, tablet, and desktop widths, including all catalogs, details, forms, confirmation, dashboard, empty states, and errors.
- Pages remain usable from 320px upward without document-level horizontal scrolling, clipped content, overlapping regions, or unreachable controls.
- Use semantic landmarks, logical heading order, explicit form labels, associated error messages, descriptive links and buttons, and HTML that remains understandable without CSS.
- All interactive elements are keyboard reachable in a sensible order and have a visible focus indicator.
- Text, links, controls, statuses, errors, and focus indicators meet WCAG 2.2 AA contrast expectations. Meaning is never communicated by color alone.
- Content remains usable at 200% browser text size.
- Touch targets and spacing remain practical on narrow screens.
- Any non-essential animation or transition is disabled under `prefers-reduced-motion: reduce`.
- Primary navigation wraps without overlap at narrow widths, while its source and keyboard order remain logical.
- Wide tabular data may use a labelled, keyboard-focusable local scroll region, but the document itself must not scroll horizontally.
- Forms expose consistent normal, focus, invalid, disabled, success, and destructive-action styling. Field errors appear adjacent to their controls and remain identifiable without color.
- Dashboard summary cards use responsive one-, two-, and three-column layouts where space permits; activity and action groups collapse to a readable single-column flow on narrow screens.
- Home, empty, confirmation, not-found, and server-error states receive deliberate visual hierarchy rather than relying on unstyled framework defaults.

### Reliability and error handling

- Unknown application routes return a friendly shared-layout `404` page.
- Unhandled route errors return a friendly shared-layout `500` page with no stack trace, SQL text, filesystem path, submitted form value, or other internal detail.
- Expected validation, not-found, and conflict responses are handled deliberately and are not presented as server failures.
- Form values are rendered through JSX escaping; SQL uses bound parameters; status transitions use constrained values rather than interpolated input.
- CSRF protection is deliberately deferred for this local-only, unauthenticated MVP. The server-rendered mutation forms must use `POST`, but this decision must not be represented as suitable security for an internet-exposed deployment.
- Add request logging middleware that emits one entry per completed request containing method, path, response status, and elapsed time.
- Add error logging that records unexpected errors with useful server-side context while the public response stays generic.
- Do not log request bodies, query values, database contents, or stack traces for expected validation failures.
- Logging uses an injectable logger or sink so tests can assert entries without relying on global console state.

## Technical Requirements

- Add ordered migrations after the existing Phase 2 migrations for `therapies`, `ailment_therapies`, and `appointments`.
- Enforce primary keys, foreign keys, supported status values, non-empty user-facing fields, unique ailment/display-order pairs, and unique ailment/therapy pairs in SQLite.
- Add indexes supporting appointment queries by status and scheduled time, recent appointment ordering, and both directions of therapy recommendation lookups.
- Make therapy and recommendation seeds deterministic and idempotent. Do not seed appointments; tests create their own time-relative appointment fixtures.
- Keep database creation, migrations, seeds, repository queries, route validation, and JSX presentation distinct.
- Use parameterized SQL and explicit TypeScript domain/result types. Do not introduce an ORM.
- Inject a clock and timezone-aware date conversion boundary into booking logic so time-dependent and daylight-saving tests are deterministic.
- Use transactions or a single conditional update for appointment status changes so terminal-state protection is atomic.
- Continue serving PicoCSS locally before the AgentClinic override stylesheet.
- Add no runtime dependency unless it is necessary for correct timezone conversion or another documented requirement; pin any added dependency exactly.
- Cover new migrations, constraints, seeds, repositories, routes, forms, status transitions, logging, errors, and retained contracts with Vitest.

## Decisions

- The MVP consists of every non-deferred roadmap item in Phases 3 through 7.
- Therapy recommendations are ordered links only; the MVP has no scoring or explanatory recommendation metadata.
- Booking is agent-specific and accepts future local date/time values only.
- Successful booking uses Post/Redirect/Get and a stable appointment detail page.
- Duplicate valid submissions create distinct appointments; the application does not invent a scheduling-capacity or uniqueness rule.
- The dashboard is public and includes operational appointment controls despite authentication being deferred.
- Appointment transitions are one-way from `scheduled` to either `completed` or `cancelled`.
- Active ailments means distinct ailments linked to agents whose status is `active`.
- Upcoming appointments means future appointments whose status is `scheduled`.
- Recent activity means recently created appointments, regardless of current status.
- Server local timezone is the single display and input timezone for the MVP; stored timestamps always include an explicit offset.
- `TZ` is the explicit timezone override; otherwise the runtime-resolved host IANA timezone is used. Unsupported zones and unresolved host zones prevent startup.
- Therapy recommendations deep-link to stable entries in the catalog; individual therapy detail pages are not part of the MVP.
- CSRF protection is deferred only because this MVP is local and unauthenticated; it must be revisited with authentication or any network deployment.
- Dashboard status success feedback uses allow-listed query-string notice codes mapped to fixed server-owned copy.
- Responsive behavior and accessibility are release requirements, not advisory checks.

## Out of Scope

- Authentication, authorization, roles, or private dashboard access
- CSRF tokens or other production-grade cross-site request protections
- Appointment rescheduling, reopening, deletion, capacity management, or notifications
- Agent, ailment, or therapy creation, editing, and deletion
- Therapy scoring, rationales, treatment progress, or clinical outcomes
- Free-form appointment reasons or notes
- Advanced analytics, exports, reports, or charts
- Email, calendar, messaging, or other external-service integrations
- Client-side frameworks or browser-side application state
- ORM adoption, Docker, cloud hosting, deployment automation, and production monitoring

## Context

The MVP is designed for course students and conference demonstrations. Its complete story should be apparent in one short walkthrough: inspect an agent and their ailments, see recommended therapies, book future care, confirm the booking, and manage it from the staff dashboard. The code and specification should stay explicit, local-first, and teachable while still demonstrating reliable persistence, validation, accessibility, and failure behavior.
