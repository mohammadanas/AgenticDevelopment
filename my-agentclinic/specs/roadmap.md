# Roadmap

AgentClinic will be delivered in small, independently reviewable phases. Each phase should leave the application working and introduce only the foundation required by later phases. Every phase that adds or changes web UI must preserve mobile-first responsive behavior.

## Phase 1 — Hono Foundation ✅

- [x] Install and configure Hono and the `tsx` development server.
- [x] Add a home route confirming that AgentClinic is open.
- [x] Add a lightweight health route for a reliable server check.
- [x] Confirm TypeScript builds successfully.
- [x] Add Vitest coverage for the home page, stylesheet, and health contracts.
- [x] Establish a responsive viewport and mobile-first, fluid foundational styles.

## Phase 2 — Agents and Ailments ✅

- [x] Add server-rendered JSX support.
- [x] Create shared header, navigation, main-content, and footer components.
- [x] Add foundational typography, color, spacing, and layout styles.
- [x] Render every page through the shared layout.
- [x] Add SQLite, a migration runner, and the initial agents table.
- [x] Seed a small set of fictional agents.
- [x] Add an agent list page with links to individual records.
- [x] Test the migration, data access, and list route.
- [x] Add an agent detail page with identity, model type, status, and presenting concerns.
- [x] Handle missing agent records with an appropriate not-found response.
- [x] Test successful and missing detail views.
- [x] Add the ailments schema and seed data.
- [x] Associate agents with one or more ailments.
- [x] Add an ailments catalog and show ailments on agent records.
- [x] Test ailment listings and agent relationships.

## Phase 3 — Therapies ✅

- [x] Add the therapies schema and seed data.
- [x] Associate ailments with recommended therapies.
- [x] Add a therapies catalog and display recommendations alongside ailments.
- [x] Test therapy listings and recommendations.

## Phase 4 — Appointment Booking ✅

- [x] Add the appointments schema with agent, date and time, and status.
- [x] Add a booking form reachable from an agent record.
- [x] Validate submitted values on the server.
- [x] Show a clear confirmation after successful booking.
- [x] Test valid submissions, invalid submissions, and persistence.

## Phase 5 — Staff Dashboard ✅

- [x] Add a dashboard summarizing agents, active ailments, and upcoming appointments.
- [x] Add simple tables or lists for recent clinic activity.
- [x] Link dashboard summaries to the relevant detail views.
- [x] Test summary calculations and empty states.

## Phase 6 — Responsive Design and Accessibility Audit ✅

- [x] Audit and refine every page across common mobile, tablet, and desktop viewport sizes; responsive behavior is required in every earlier UI phase rather than deferred until this phase.
- [x] Audit semantic page structure, labels, headings, and alternative text.
- [x] Add visible focus states and verify keyboard navigation.
- [x] Check color contrast and reduced-motion behavior.

## Phase 7 — Reliability and Hardening ✅

- [x] Add friendly not-found and server-error pages.
- [x] Review form handling for validation, escaping, and safe failure behavior.
- [x] Add request and error logging middleware.
- [x] Run the complete automated test and production-build checks.

## Deferred Until After the MVP

- Authentication and authorization
- Email or other appointment notifications
- Advanced analytics and reporting
- Production hosting, deployment automation, and operational monitoring
