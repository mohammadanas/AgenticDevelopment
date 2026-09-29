# Tech Stack

AgentClinic is a server-rendered TypeScript application. The stack favors a small number of well-understood components, reliable behavior, and HTML that remains useful without unnecessary browser-side JavaScript.

## Current Choices

| Layer | Choice | Purpose |
|---|---|---|
| Language | TypeScript with strict checking | Provides consistent types across routes, components, and data access. |
| Runtime | Node.js | Runs the application and its server-side dependencies. |
| Web framework | Hono with `@hono/node-server` | Handles HTTP routing and serves the application on Node.js. |
| Rendering | Hono JSX | Produces server-rendered HTML using typed components. |
| Data store | SQLite via `better-sqlite3` | Provides simple, local, durable storage. |
| Schema changes | Plain SQL migrations | Keeps database evolution explicit and reviewable. |
| Styling | Pico CSS plus `static/style.css` | Supplies accessible defaults and project-specific responsive styling. |
| Development | `tsx` | Runs TypeScript directly during development. |
| Build and type checking | TypeScript compiler (`tsc`) | Produces the build and verifies types. |
| Automated testing | Vitest | Runs application, component, database, and utility tests. |

## Engineering Principles

- Keep TypeScript strict and preserve type safety across application boundaries.
- Prefer server-rendered pages and progressive enhancement over mandatory client-side JavaScript.
- Keep routes, components, and data access focused and independently testable.
- Use explicit migrations and automated tests to protect persistent data and core care journeys.
- Produce semantic HTML with keyboard access, visible focus states, and responsive layouts.
- Favor dependable, maintainable solutions over adding infrastructure before it is needed.
- Treat useful error handling and actionable logging as part of reliability.

## Open Decisions

The current project and stakeholder input do not yet settle the following choices. They must be decided when a concrete feature or production requirement makes them necessary:

- Hosting platform and deployment process.
- Authentication, authorization, and staff access controls.
- Whether and when production scale requires moving beyond SQLite.
- A formal supported-browser matrix beyond the current modern-browser requirement.
- A formal accessibility conformance target, including any external audit process.
- Production observability, monitoring, alerting, and log aggregation.

These are deliberate open decisions, not commitments to particular vendors or tools.
