# Phase 1 Requirements — Hono Foundation

## Scope

Establish the smallest working AgentClinic server on Node.js with Hono. The application must run locally through `tsx`, expose a welcoming HTML home page, expose a lightweight health endpoint, and compile successfully with strict TypeScript.

This phase follows the project mission by giving course students and demo developers a reliable, understandable starting point. It follows the technical direction in `../tech-stack.md`: server-rendered TypeScript, Hono on Node.js, and standards-based HTML without a client-side framework.

## Functional Requirements

### Home page

- `GET /` returns `200 OK`.
- The response content type is HTML.
- The response is a complete HTML document with a doctype and `<html lang="en">`.
- The document includes UTF-8 charset metadata, responsive viewport metadata, and a title containing `AgentClinic`.
- The visible content is contained in a `main` element.
- The response contains an `h1` whose exact text is `AgentClinic`.
- The page includes a short visible message communicating that AgentClinic is open.
- The HTML is rendered with Hono JSX through a shared `Layout` component.
- The layout composes separate `Header`, `Main`, and `Footer` components and emits exactly one semantic `header`, `main`, and `footer` element.
- Each layout subcomponent lives in its own module: `src/components/Header.tsx`, `src/components/Main.tsx`, and `src/components/Footer.tsx`. They must not be declared inline in `Layout.tsx` or combined into one component file.
- The header links the AgentClinic name to `/`, the main component renders page-specific children, and the footer identifies AgentClinic.
- The document links `/static/style.css`, which returns the page's foundational CSS with a CSS content type.
- The page uses mobile-first, fluid styles and remains readable without horizontal page scrolling at viewport widths from `320px` through common tablet and desktop sizes.
- Content width is constrained on wide screens, while page gutters and vertical spacing adapt to the available viewport.

### Health check

- `GET /health` returns `200 OK` while the application is running normally.
- The response content type is JSON.
- The response body is exactly `{"status":"ok"}`.
- The endpoint performs no database, network, or other dependency checks in this phase.

## Technical Requirements

- Use Hono as the web framework and the Hono Node.js adapter to start the server.
- Use `tsx` for the local development command.
- Listen on port `3000` by default.
- Keep TypeScript strict mode enabled.
- Configure TypeScript for Hono JSX.
- Provide npm scripts for development, type-checking, and producing the configured TypeScript build.
- Provide a non-watch `npm test` script that runs the Vitest suite.
- Add Vitest route tests for the home page document and shared layout, linked stylesheet, and health response contracts.
- Preserve the responsive viewport metadata and cover the stylesheet's responsive foundations in Vitest.
- Pin newly added runtime and development dependency versions exactly, without `^` or `~` prefixes, so course and live-demo environments remain reproducible.
- Keep the application entry point and route definitions small and easy to understand; introduce no abstractions needed only by later phases.

## Decisions

- The home page establishes the initial shared JSX document shell and modest foundational styling. Expanded navigation, additional layouts, and a broader design system remain later-phase work.
- Responsive design is a baseline for all UI work, not a Phase 6 retrofit. This phase establishes mobile-first defaults, fluid sizing, and a content-driven wide-screen enhancement; Phase 6 performs the full-product audit.
- The health contract is a minimal JSON object so it is stable and easy to verify from scripts or monitoring tools.
- Vitest exercises the exported Hono application directly, without opening a network port, so route contracts provide fast and repeatable validation.
- Server startup must use the Hono Node.js adapter rather than relying on runtime-specific behavior from another JavaScript runtime.

## Out of Scope

- Navigation beyond the home link or additional layout variants
- A comprehensive design system, complex responsive behavior, or client-side interactions
- SQLite, migrations, seed data, or any other persistence
- Authentication or authorization
- Business-domain routes beyond `/` and `/health`
- A client-side framework or browser-side JavaScript
- CI/CD, deployment, or production monitoring

## Context

This is the first shippable roadmap phase. Its purpose is to prove the development loop end to end: dependencies install, strict TypeScript compiles, Hono starts on Node.js, and callers can receive both a user-facing page and a machine-readable health response. Later phases may build on this foundation without expanding its initial scope.
