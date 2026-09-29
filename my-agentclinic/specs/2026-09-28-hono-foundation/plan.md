# Phase 1 Plan — Hono Foundation

## Task Group 1 — Dependencies and Configuration

1. Add exact-version runtime dependencies for Hono and its Node.js adapter.
2. Add `tsx` as an exact-version development dependency while retaining TypeScript.
3. Configure TypeScript for the selected Node.js and Hono setup, preserving `strict: true` and a production build output directory.

## Task Group 2 — Hono Application

4. Replace the placeholder entry point with a small Hono application.
5. Keep the application instance separable from the server-start call so its route contracts remain straightforward to exercise.
6. Start the application with the Hono Node.js adapter on port `3000` by default.

## Task Group 3 — Home Route

7. Add `GET /` with a `200 OK` HTML response.
8. Connect the route to a server-rendered Hono JSX home page.

## Task Group 4 — Shared Main Layout

9. Configure TypeScript for Hono JSX and create a `Layout` component that renders the complete English-language HTML document.
10. Add document metadata for UTF-8, responsive viewport behavior, and a title containing `AgentClinic`.
11. Create `Header`, `Main`, and `Footer` as separate subcomponents in their own files (`src/components/Header.tsx`, `src/components/Main.tsx`, and `src/components/Footer.tsx`) and compose exactly one of each inside `Layout`.
12. Have `Header` link the AgentClinic name to `/`, have `Main` render page children, and have `Footer` identify AgentClinic.
13. Keep page-specific content outside the shared layout components.

## Task Group 5 — Home Page and Styles

14. Create a `Home` page that uses `Layout` and provides an `h1` whose exact text is `AgentClinic` plus a short message communicating that the clinic is open.
15. Add a plain CSS file with a small reset and foundational styles for the page, header, main content, and footer.
16. Implement mobile-first responsive behavior with fluid gutters and content width, overflow-safe sizing, and a content-driven breakpoint for wider viewports.
17. Serve the stylesheet from `/static/style.css` with Hono's Node.js static-file middleware.
18. Link `/static/style.css` from `Layout` and confirm the route returns a CSS content type.
19. Add no client-side JavaScript or client-side framework.

## Task Group 6 — Health Route

20. Add `GET /health` with a `200 OK` JSON response.
21. Return the exact payload `{"status":"ok"}` without external dependency checks.

## Task Group 7 — Project Scripts

22. Add a development script that runs the server through `tsx`.
23. Add a type-check script that runs TypeScript without emitting files.
24. Ensure the build script produces the configured JavaScript output successfully.
25. Add a non-watch test script that runs Vitest once and returns an appropriate process status.

## Task Group 8 — Automated Tests

26. Add Vitest tests that call the exported Hono app directly without starting the network server.
27. Verify the home route's status, HTML content type, responsive viewport metadata, linked stylesheet, semantic layout, heading, and open message.
28. Verify the stylesheet route returns non-empty CSS with a CSS content type and contains the responsive layout foundations.
29. Verify the health route returns status `200`, a JSON content type, and exactly `{ "status": "ok" }`.

## Task Group 9 — Verification

30. Install dependencies from a clean lockfile-respecting state and confirm installation succeeds.
31. Run the Vitest suite, type-check, and production build and resolve all errors.
32. Start the development server and verify the home page, stylesheet, and health response contracts with repeatable HTTP commands.
33. Check the page at the viewport widths listed in `validation.md` and complete the remaining manual smoke checks.
34. Review the implementation diff to confirm persistence, authentication, client-side code, and unrelated features were not introduced.
