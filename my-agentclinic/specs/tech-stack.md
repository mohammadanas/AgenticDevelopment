# Tech Stack

AgentClinic is a local-first, server-rendered TypeScript application. The server sends standards-based HTML to the browser, keeping the initial MVP reliable, understandable, and light on client-side complexity.

## Core Stack

| Layer | Choice | Rationale |
|---|---|---|
| Language | TypeScript | Provides end-to-end type safety and meets the engineering requirement for a popular TypeScript-based stack |
| Runtime | Node.js | Mature, well-supported, and widely understood |
| Web framework | Hono | Lightweight, TypeScript-first, and well suited to routes and middleware |
| Rendering | Hono JSX | Enables reusable server-rendered components without a client-side application framework |
| Styling | Mobile-first plain CSS with custom properties | Supports an attractive, responsive interface without an additional framework |
| Database | SQLite with `better-sqlite3` | Provides dependable local persistence with minimal infrastructure |
| Migrations | Plain SQL files | Keeps schema changes explicit and avoids an unnecessary ORM |
| Testing and validation | Vitest | Provides fast, repeatable TypeScript tests for routes, components, and data access before changes are merged |

## Recommended Framework: Hono

Hono is the recommended server framework for AgentClinic. It offers first-class TypeScript support, a small runtime footprint, built-in JSX rendering, and a straightforward middleware model. Its familiar routing style keeps the MVP easy to teach and demonstrate while leaving room to run on Node.js or other JavaScript runtimes later.

For this project, Hono will run on Node.js and render pages on the server with Hono JSX.

## Development Tooling

- `tsx` runs TypeScript directly during development.
- `tsc` performs type checking and creates production JavaScript builds.
- `vitest` runs automated validation in a Node.js test environment. The non-watch `npm test` script executes `vitest run` so the same suite is used locally and in future CI workflows.
- Prettier keeps TypeScript, JSX, CSS, and Markdown formatting consistent.
- npm manages dependencies and project scripts.

## Architecture Principles

- Render pages on the server and send semantic HTML to the browser.
- Use shared JSX components for layouts and repeated interface elements.
- Treat responsive behavior as a baseline requirement for every web interface: start with mobile styles, use fluid sizing, and add content-driven breakpoints only when needed.
- Keep route handling, data access, and presentation responsibilities distinct.
- Store application data in SQLite and evolve its schema through ordered SQL migrations.
- Prefer progressive enhancement and modern-browser compatibility.
- Add Vitest coverage as each behavior is introduced and require `npm test` to pass as part of feature validation.

## Initial MVP Boundaries

The initial MVP will not include:

- A client-side framework such as React, Vue, or Svelte
- An object-relational mapper
- Docker or container orchestration
- Authentication or authorization
- Cloud deployment or other production infrastructure

These choices can be revisited after the core clinic workflow is complete and validated.
