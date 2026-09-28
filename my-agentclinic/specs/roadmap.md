# Roadmap

AgentClinic will be delivered in small, independently reviewable phases. Each phase should leave the application in a working state and introduce only the foundation needed by later phases.

## Phase 1 — Hono Foundation ✅

- Install and configure Hono and the `tsx` development server.
- Add a basic home route confirming that AgentClinic is open.
- Add a lightweight health route for a reliable server check.
- Confirm TypeScript builds successfully.

## Phase 2 — Shared Layout

- Add server-rendered JSX support.
- Create shared header, navigation, main-content, and footer components.
- Add foundational typography, color, spacing, and layout styles.
- Render all pages through the shared layout.

## Phase 3 — Agent List

- Add SQLite, the migration runner, and the initial agents table.
- Seed a small set of fictional agents.
- Add an agent list page with links to individual records.
- Test the migration, data access, and list route.

## Phase 4 — Agent Details

- Add an agent detail page with identity, model type, status, and presenting concerns.
- Handle missing agent records with an appropriate not-found response.
- Test successful and missing detail views.

## Phase 5 — Ailments

- Add the ailments schema and seed data.
- Associate agents with one or more ailments.
- Add an ailments catalog and show ailments on agent records.
- Test ailment listings and agent relationships.

## Phase 6 — Therapies

- Add the therapies schema and seed data.
- Associate ailments with recommended therapies.
- Add a therapies catalog and display recommendations alongside ailments.
- Test therapy listings and recommendations.

## Phase 7 — Appointment Booking

- Add the appointments schema with agent, date and time, and status.
- Add a booking form reachable from an agent record.
- Validate submitted values on the server.
- Show a clear confirmation after a successful booking.
- Test valid submissions, invalid submissions, and persistence.

## Phase 8 — Staff Dashboard

- Add a staff dashboard summarizing agents, active ailments, and upcoming appointments.
- Add simple tables or lists for recent clinic activity.
- Link dashboard summaries to the relevant detail views.
- Test summary calculations and empty states.

## Phase 9 — Responsive Design and Accessibility

- Refine the visual design for common modern-browser viewport sizes.
- Audit semantic page structure, labels, headings, and alternative text.
- Add visible focus states and verify keyboard navigation.
- Check color contrast and reduced-motion behavior.

## Phase 10 — Reliability and Hardening

- Add friendly not-found and server-error pages.
- Review all form handling for validation, escaping, and safe failure behavior.
- Add request and error logging middleware.
- Run the complete automated test and production-build checks.

## Deferred Until After the MVP

- Authentication and authorization
- Email or other appointment notifications
- Advanced analytics and reporting
- Production hosting, deployment automation, and operational monitoring
