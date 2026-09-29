# Phase 2 Requirements — Agents and Ailments

## Scope

Phase 2 adds AgentClinic's first domain records and the persistence patterns that later phases will reuse. Visitors can browse a public catalog of fictional agents, open an individual agent record, and browse the ailments affecting the clinic's agents. Every page uses the shared server-rendered layout and remains readable and usable across mobile, tablet, and desktop viewports.

This phase advances the mission by making clinic activity understandable through approachable, playful records while following the technical direction in `../tech-stack.md`: Hono JSX rendered on the server, SQLite persistence, plain SQL migrations, and direct TypeScript data access. For presentation, this feature deliberately adopts PicoCSS as a user-approved refinement to the stack, supplemented by a small mobile-first AgentClinic stylesheet.

## Functional Requirements

### Shared layout and navigation

- Every HTML page renders through the existing shared layout with exactly one semantic `header`, `nav`, `main`, and `footer`.
- Primary navigation includes working links to Home (`/`), Agents (`/agents`), and Ailments (`/ailments`).
- The current Phase 1 home page, stylesheet route, and `/health` contract remain operational.
- Navigation and page content work without client-side JavaScript.

### Agent data

Each agent record contains:

| Field | Purpose |
|---|---|
| `id` | Stable integer identifier used by routes and relationships |
| `name` | Fictional agent display name |
| `model_type` | Short description of the agent's model or operating type |
| `status` | One of `active`, `on_leave`, or `discharged` |
| `created_at` | Timestamp recording when the row was created |

- The seed set contains at least five coherent fictional agents.
- Seed identifiers and values are deterministic so route tests and demonstrations are repeatable.
- `GET /agents` returns `200 OK` HTML and lists every agent with its name, model type, and human-readable status.
- Each listed agent links to its detail route at `/agents/:id`.
- `GET /agents/:id` for an existing integer ID returns `200 OK` HTML with the agent's name, model type, status, and presenting concerns.
- A request for a missing or invalid agent ID returns a useful `404 Not Found` response rendered through the shared layout.

### Ailment data

Each ailment record contains:

| Field | Purpose |
|---|---|
| `id` | Stable integer identifier used by relationships |
| `name` | Playful, concise ailment name |
| `description` | Clear explanation of the presenting concern |

- The seed set contains at least five fictional ailments appropriate to the AgentClinic tone.
- `GET /ailments` returns `200 OK` HTML and lists every ailment with its name and description.

### Agent and ailment relationships

- Agents and ailments have a many-to-many relationship stored in an `agent_ailments` join table.
- The join table prevents duplicate agent–ailment pairs and enforces valid references to both parent tables.
- Seed data assigns at least one ailment to at least one agent; representative seeded agent detail pages show one or more linked ailments.
- An agent with no linked ailments remains valid and receives an explicit, friendly empty state rather than a blank or broken section.

## Technical Requirements

- Use SQLite through `better-sqlite3`; add its TypeScript declarations as development tooling if required.
- Store application schema changes as ordered plain `.sql` migration files.
- Track applied migrations and execute each unapplied migration exactly once in filename order inside transactions.
- Enable SQLite foreign-key enforcement for application and test connections.
- Keep database creation, migration execution, seeding, queries, route handling, and JSX presentation as distinct responsibilities.
- Use direct parameterized SQL queries and explicit TypeScript result types; do not introduce an ORM.
- Make seed operations idempotent: rerunning them must not duplicate agents, ailments, or relationships or change their stable identities.
- Initialize the configured application database before serving requests, while allowing tests to use isolated temporary or in-memory databases.
- Render all pages with Hono JSX and the existing shared components.
- Add `@picocss/pico` as an exact-version runtime dependency and serve its minified stylesheet locally from the installed package; the application must not depend on a third-party CDN at runtime.
- Load PicoCSS before the existing AgentClinic stylesheet so project-specific brand, layout, responsive, and accessibility rules can override framework defaults without modifying package files.
- Use PicoCSS's class-light semantic patterns for navigation, lists, record details, statuses, empty states, and errors. Retain only focused custom CSS needed for the AgentClinic identity or behavior not supplied by PicoCSS.
- Do not add another CSS framework, a client-side framework, or browser-side application code.
- Add Vitest coverage for migrations, seed behavior, data access, routes, shared navigation, responsive foundations, and retained Phase 1 contracts.

## Decisions

- Catalogs are public and read-only. This phase has no create, edit, or delete forms.
- PicoCSS provides the shared responsive visual foundation. It is installed locally for deterministic and offline-friendly course demonstrations; the existing stylesheet remains the supported override layer.
- Agents and ailments use a normalized many-to-many schema because one agent may present several concerns and one ailment may affect several agents.
- Migrations and deterministic seeds establish a repeatable local database for course exercises and conference demonstrations.
- Missing and malformed agent identifiers share the public `404` contract and must not expose database errors.
- Status values are stored as constrained machine-readable values and displayed as readable labels.
- User-facing copy may use light clinic and AI humor, but navigation, headings, statuses, errors, and empty states remain direct and accessible.
- Responsive behavior is part of this phase's baseline rather than deferred to the later accessibility audit.

## Out of Scope

- Therapies or recommendations
- Appointment booking
- Staff dashboard or analytics
- Agent or ailment creation, editing, and deletion
- Authentication, authorization, or role-specific visibility
- Email, notifications, external services, or cloud deployment
- Additional CSS frameworks, client-side frameworks, browser-side state, or an ORM
- The comprehensive reliability and accessibility audits reserved for later phases

## Context

This phase establishes the database, migration, seed, query, layout, and catalog patterns used by later roadmap work. The agent detail page will become the starting point for appointment booking, while ailments will later connect to therapies. The implementation should therefore stay small and teachable without closing off those documented relationships.

The experience is intended for course students and live coding demonstrations. Seed records should be memorable enough to communicate the AgentClinic premise quickly, while code paths and data contracts remain obvious enough to explain without hidden framework behavior.
