# Phase 2 Plan — Agents and Ailments

## Task Group 1 — Shared Layout and Navigation

1. Extend the existing shared header to include semantic primary navigation linking to `/`, `/agents`, and `/ailments`.
2. Preserve the shared `Header`, `Main`, `Footer`, and `Layout` component boundaries and render exactly one header, navigation region, main region, and footer on every HTML page.
3. Add an exact compatible version of `@picocss/pico`, expose its minified stylesheet through a narrowly scoped local static route, and link it before the existing `/static/style.css` override stylesheet in the shared document head.
4. Keep the existing home page, `/health` route, document metadata, and static-file behavior unchanged except for the additive PicoCSS and navigation work.
5. Add component or route assertions for the navigation landmarks, link labels, destinations, and stylesheet order.

## Task Group 2 — SQLite Bootstrap and Migration Runner

6. Add exact compatible versions of `better-sqlite3` and its TypeScript declarations without introducing an ORM or unrelated dependency.
7. Add a database factory that opens the configured SQLite file, enables foreign keys, and can create isolated database connections for tests.
8. Add an ordered migration runner that reads plain SQL migration files by filename, records successfully applied migrations, and applies each pending file within a transaction.
9. Make repeated migration runs safe and ensure a failed migration is not recorded as applied.
10. Initialize and migrate the application database before the server begins accepting requests.

## Task Group 3 — Agent Schema and Seed Data

11. Add the agents migration with an integer primary key, unique name, model type, constrained status, and creation timestamp.
12. Define explicit TypeScript shapes for stored agents and agent summaries returned from SQLite.
13. Add at least five deterministic fictional agent seed records covering the supported status values.
14. Implement the agent seed operation with stable identifiers and conflict-safe SQL so running it repeatedly produces the same rows.
15. Test the agents schema, constraints, seed contents, and seed idempotency using an isolated database.

## Task Group 4 — Ailment Schema and Many-to-Many Associations

16. Add the ailments migration with an integer primary key, unique name, and non-empty description.
17. Add the `agent_ailments` migration with foreign keys and a composite primary key preventing duplicate relationships.
18. Define explicit TypeScript shapes for ailments and agent–ailment query results.
19. Seed at least five deterministic ailments plus coherent agent–ailment links, including one representative agent with multiple concerns.
20. Make ailment and relationship seeding idempotent and test foreign-key enforcement, duplicate prevention, and repeatability.

## Task Group 5 — Data-Access Functions

21. Add parameterized data-access functions that list agents in a deterministic order and retrieve one agent by integer ID with all linked ailments.
22. Add a parameterized data-access function that lists ailments in a deterministic order.
23. Return domain-friendly typed results rather than exposing raw statement rows to route handlers.
24. Represent a missing agent distinctly and return an empty ailment collection for an existing agent with no relationships.
25. Test successful lists, joined detail results, empty relationships, missing IDs, and isolation between test databases.

## Task Group 6 — Agent List and Detail Routes

26. Add `GET /agents` and render a server-side agent catalog containing names, model types, readable statuses, and links to detail pages.
27. Add `GET /agents/:id` and validate the path value as an integer before querying the database.
28. Render existing agents through the shared layout with identity, model type, status, and presenting ailments or the documented empty state.
29. Return a shared-layout `404 Not Found` page for malformed and unknown IDs without leaking query or database details.
30. Test HTML status and content types, catalog ordering and links, known detail data, linked ailments, empty states, and both forms of `404` response.

## Task Group 7 — Ailment Catalog Route

31. Add `GET /ailments` and render every ailment's name and description through the shared layout.
32. Use meaningful headings and list structure so ailment entries remain understandable without visual styling.
33. Test the response contract, deterministic ordering, seeded content, layout, and navigation links.

## Task Group 8 — Responsive Styling and Accessible Presentation

34. Apply PicoCSS's semantic, class-light patterns to navigation, agent and ailment lists, record details, statuses, empty states, and not-found content.
35. Reduce the existing stylesheet to focused AgentClinic brand and behavior overrides, keeping PicoCSS loaded first and leaving package files untouched.
36. Keep overrides mobile-first with visible focus states, comfortable touch targets, fluid sizing, overflow-safe content, and content-driven wider-screen enhancements.
37. Ensure color is not the only status indicator and maintain readable contrast for text, links, focus indicators, and status treatments.
38. Use concise clinic-themed copy while keeping route purpose, record labels, error messages, and empty states unambiguous.
39. Verify that all new pages remain operable by keyboard and readable without horizontal scrolling at the validation widths.

## Task Group 9 — Automated Tests and Final Verification

40. Add migration and seed tests covering schemas, constraints, foreign keys, ordering, repeatability, and deterministic data.
41. Add data-access and Hono route tests covering all public catalog and detail behavior, including absent relationships and missing records.
42. Retain the Phase 1 home, stylesheet, layout, and health tests and extend shared-component assertions for navigation and locally served PicoCSS.
43. Run clean dependency installation, the full Vitest suite, strict type checking, and the production build.
44. Start the development server and complete the HTTP, responsive, keyboard, copy, and visual checks in `validation.md`.
45. Review the final diff against `requirements.md` and confirm that no deferred feature, CRUD workflow, external integration, additional CSS framework, client-side framework, or ORM was introduced.
