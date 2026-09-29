# Roadmap

AgentClinic will be delivered in small, independently reviewable phases. Each phase should leave the application working and introduce only the foundation required by later phases. Every phase that adds or changes web UI must preserve mobile-first responsive behavior.

## Phase 1 — Hono Foundation ✅

- Install and configure Hono and the `tsx` development server.
- Add a home route confirming that AgentClinic is open.
- Add a lightweight health route for a reliable server check.
- Confirm TypeScript builds successfully.
- Add Vitest coverage for the home page, stylesheet, and health contracts.
- Establish a responsive viewport and mobile-first, fluid foundational styles.

## Phase 2 — Agents and Ailments

- Add server-rendered JSX support.
- Create shared header, navigation, main-content, and footer components.
- Add foundational typography, color, spacing, and layout styles.
- Render every page through the shared layout.
- Add SQLite, a migration runner, and the initial agents table.
- Seed a small set of fictional agents.
- Add an agent list page with links to individual records.
- Test the migration, data access, and list route.
- Add an agent detail page with identity, model type, status, and presenting concerns.
- Handle missing agent records with an appropriate not-found response.
- Test successful and missing detail views.
- Add the ailments schema and seed data.
- Associate agents with one or more ailments.
- Add an ailments catalog and show ailments on agent records.
- Test ailment listings and agent relationships.

## Phase 3 — Therapies

- Add the therapies schema and seed data.
- Associate ailments with recommended therapies.
- Add a therapies catalog and display recommendations alongside ailments.
- Test therapy listings and recommendations.

## Phase 4 — Appointment Booking

- Add the appointments schema with agent, date and time, and status.
- Add a booking form reachable from an agent record.
- Validate submitted values on the server.
- Show a clear confirmation after successful booking.
- Test valid submissions, invalid submissions, and persistence.

## Phase 5 — Staff Dashboard

- Add a dashboard summarizing agents, active ailments, and upcoming appointments.
- Add simple tables or lists for recent clinic activity.
- Link dashboard summaries to the relevant detail views.
- Test summary calculations and empty states.

## Phase 6 — Responsive Design and Accessibility Audit

- Audit and refine every page across common mobile, tablet, and desktop viewport sizes; responsive behavior is required in every earlier UI phase rather than deferred until this phase.
- Audit semantic page structure, labels, headings, and alternative text.
- Add visible focus states and verify keyboard navigation.
- Check color contrast and reduced-motion behavior.

## Phase 7 — Reliability and Hardening

- Add friendly not-found and server-error pages.
- Review form handling for validation, escaping, and safe failure behavior.
- Add request and error logging middleware.
- Run the complete automated test and production-build checks.

## Deferred Until After the MVP

- Authentication and authorization
- Email or other appointment notifications
- Advanced analytics and reporting
- Production hosting, deployment automation, and operational monitoring
