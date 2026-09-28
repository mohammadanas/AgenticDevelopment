# Tech Stack

AgentClinic is a local-first, server-side TypeScript application. The server renders HTML for the browser, keeping the initial MVP reliable, understandable, and light on client-side complexity.

## Core Stack

| Layer | Choice | Rationale |
|---|---|---|
| Language | TypeScript | Provides end-to-end type safety and meets the engineering requirement for a popular TypeScript-based stack |
| Runtime | Node.js | Mature, well-supported, and widely understood |
| Web framework | Hono | Lightweight, TypeScript-first, and well suited to server routes and middleware |
| Rendering | Hono JSX | Enables reusable server-rendered components without a client-side application framework |
| Styling | Plain CSS with custom properties | Supports an attractive, responsive interface with no additional build-time framework |
| Database | SQLite with `better-sqlite3` | Provides simple, dependable local persistence with minimal infrastructure |
| Migrations | Plain SQL files | Keeps schema changes explicit and avoids introducing an ORM for a small data model |
| Testing | Vitest | Fast, TypeScript-friendly testing for routes, components, and data access |

## Development Tooling

- `tsx` runs TypeScript directly during development.
- `tsc` performs type checking and creates production JavaScript builds.
- Prettier keeps TypeScript, JSX, CSS, and Markdown formatting consistent.
- npm manages dependencies and project scripts.

## Architecture Principles

- Render pages on the server and send standards-based HTML to the browser.
- Use shared JSX components for the layout and repeated interface elements.
- Keep route handling, data access, and presentation responsibilities distinct.
- Store application data in SQLite and evolve the schema through ordered SQL migrations.
- Prefer semantic HTML, progressive enhancement, and modern-browser compatibility.
- Add automated tests as each behavior is introduced.

## Initial MVP Boundaries

The initial MVP will not include:

- A client-side framework such as React, Vue, or Svelte
- An object-relational mapper
- Docker or container orchestration
- Authentication or authorization
- Cloud deployment or other production infrastructure

These choices can be revisited after the core clinic workflow is complete and validated.
