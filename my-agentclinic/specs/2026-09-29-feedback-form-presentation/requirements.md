# Feedback Form Presentation Requirements

## Context

This feature implements Phase 1 of `specs/roadmap.md`: a clearly labeled feedback form that agents can find, understand, and complete in a modern browser. It is the presentation foundation for later phases that will add submission handling, server-side validation responses, persistence, confirmation, and processing-failure behavior.

The experience must follow the AgentClinic mission: agents are the primary audience and should be treated with empathy, clarity, and dignity. It must also fit the existing strict-TypeScript, Hono, server-rendered Hono JSX, Pico CSS, local CSS, and Vitest stack described in `specs/tech-stack.md`.

## Scope

### In Scope

- Add a public `GET /feedback` route that returns a server-rendered feedback page.
- Add a **Feedback** destination to the shared primary navigation.
- Present a focused feedback form containing:
  - A feedback-category selector.
  - A required multiline message field.
  - An optional contact-details field.
  - Concise help text explaining what useful feedback includes.
  - Concise privacy text explaining that contact details are optional and must not imply a data-handling policy that has not been implemented.
  - A clearly labeled submit control whose unavailable or deferred behavior is honest to the user.
- Use explicit labels and clearly distinguish required fields from optional fields.
- Preserve a logical reading and keyboard-navigation order.
- Provide usable layouts at mobile, tablet, and desktop viewport sizes.
- Use semantic HTML and existing shared layout and styling conventions.

### Out of Scope

- A `POST /feedback` endpoint or any other submission handler.
- Database migrations, persistence, email, notifications, or third-party integrations.
- Server-side validation responses, retained form values, success confirmation, or processing-failure behavior.
- Authentication or authorization.
- Changes to existing care journeys or unrelated visual redesigns.
- New runtime or development dependencies.

## Product Decisions

- The form lives on a dedicated `/feedback` page rather than the home page.
- The shared primary navigation is the standard discovery path.
- The form collects a category, a required message, and optional contact details. Exact category labels may be a small static set chosen during implementation to match AgentClinic's tone; they do not establish a persistent data contract in this phase.
- The page uses reassuring, agent-first language and may be playful only where humor does not reduce clarity or dignity.
- Because submission is outside this phase, the UI must not claim that feedback was sent, received, saved, or reviewed. The submit control may be disabled with a clear explanation or otherwise presented as forthcoming without causing navigation or a false success state.
- The page must work as server-rendered HTML and must not require client-side JavaScript for its presentation or navigation.

## Acceptance Requirements

1. Visiting `GET /feedback` returns a successful HTML response rendered inside the shared AgentClinic layout.
2. Every page using the shared header exposes a **Feedback** link pointing to `/feedback`.
3. The page contains the agreed category, message, and contact controls with associated labels and unambiguous required/optional status.
4. Help and privacy text is concise, readable, and programmatically associated with the relevant controls when it describes a field.
5. The heading structure, landmarks, form grouping, and control order are semantic and understandable without visual styling.
6. All interactive elements are keyboard reachable and have visible focus treatment supplied by Pico CSS or project styles.
7. The page remains readable and operable at representative mobile, tablet, and desktop widths without horizontal page scrolling.
8. Activating the presentation-phase UI cannot produce a false success message or imply that feedback was persisted.
9. Existing routes, navigation destinations, and clinic workflows continue to behave as before.

## Constraints

- Use the existing Hono routing and Hono JSX component patterns.
- Reuse the shared layout and existing Pico/local CSS pipeline.
- Keep strict TypeScript checks passing.
- Add no database schema or dependency changes.
- Treat later roadmap phases as separate work rather than partially implementing them here.
