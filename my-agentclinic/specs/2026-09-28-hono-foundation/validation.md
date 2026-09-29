# Phase 1 Validation — Hono Foundation

## Merge Criteria

All checks below must pass before this feature can be merged. Run commands from the `my-agentclinic` directory.

## 1. Clean Dependency Installation

```sh
npm ci
```

- The command exits with status `0`.
- The lockfile and manifest agree.
- Hono, the Hono Node.js adapter, `tsx`, and Vitest are recorded at exact versions without `^` or `~` prefixes.

## 2. Automated Tests

```sh
npm test
```

- The command runs `vitest run` and exits with status `0`.
- Tests exercise the exported Hono app without starting a network server.
- The suite covers the home page and shared layout, stylesheet response, and health response contracts.
- The suite verifies responsive viewport metadata and the stylesheet's fluid-width and wide-screen rules.

## 3. TypeScript Checks

```sh
npm run typecheck
npm run build
```

- Both commands exit with status `0` and report no TypeScript errors.
- `tsconfig.json` retains `"strict": true`.
- The build produces the configured JavaScript output.

## 4. Server Startup

```sh
npm run dev
```

- The process starts without an exception.
- The application listens on port `3000` by default.
- Keep the process running while completing the HTTP checks below.

## 5. HTTP Smoke Checks

In a second terminal, run:

```sh
curl --fail-with-body --silent --show-error \
  --output /tmp/agentclinic-home.html \
  --write-out '%{http_code} %{content_type}\n' \
  http://localhost:3000/

grep -F '<h1>AgentClinic</h1>' /tmp/agentclinic-home.html
grep -F '<html lang="en">' /tmp/agentclinic-home.html
grep -Fi '<meta charset="UTF-8"' /tmp/agentclinic-home.html
grep -Fi 'name="viewport"' /tmp/agentclinic-home.html
grep -F '<title>AgentClinic' /tmp/agentclinic-home.html
grep -F '<link rel="stylesheet" href="/static/style.css"' /tmp/agentclinic-home.html
grep -F '<header' /tmp/agentclinic-home.html
grep -F '<main' /tmp/agentclinic-home.html
grep -F '<footer' /tmp/agentclinic-home.html
grep -Fi 'open' /tmp/agentclinic-home.html

curl --fail-with-body --silent --show-error \
  --output /tmp/agentclinic-style.css \
  --write-out '%{http_code} %{content_type}\n' \
  http://localhost:3000/static/style.css

test -s /tmp/agentclinic-style.css

curl --fail-with-body --silent --show-error \
  --output /tmp/agentclinic-health.json \
  --write-out '%{http_code} %{content_type}\n' \
  http://localhost:3000/health

grep -Fx '{"status":"ok"}' /tmp/agentclinic-health.json
```

- Each `curl` command exits with status `0` and reports HTTP `200`.
- The home response content type includes `text/html`.
- The home response is a complete English-language HTML document with UTF-8 and viewport metadata.
- The document title contains `AgentClinic`, and visible content is placed in `main`.
- The response contains one semantic header, main, and footer and links `/static/style.css`.
- The home response contains the exact `AgentClinic` heading and an open-for-business message.
- The stylesheet request returns HTTP `200`, a CSS content type, and non-empty CSS.
- The stylesheet includes mobile-first fluid gutters/content sizing and a wider-viewport media query.
- The health response content type includes `application/json`.
- The health response body is exactly `{"status":"ok"}`.

## 6. Component Boundaries

Confirm all three component modules exist:

```sh
test -f src/components/Header.tsx
test -f src/components/Main.tsx
test -f src/components/Footer.tsx
```

- Each file exports its corresponding component.
- `Layout.tsx` imports and composes all three components.
- `Header`, `Main`, and `Footer` are not declared inline in `Layout.tsx` or combined into a shared component file.

## 7. Manual Smoke Check

- Open `http://localhost:3000/` in a modern browser, or inspect the saved response with `curl`.
- Confirm the page is readable and clearly identifies AgentClinic as open.
- Confirm the browser tab title contains `AgentClinic` and the page has no broken assets or unintended client-side behavior.
- Confirm the stylesheet loads and the header, main content, and footer are visibly styled.
- Use responsive browser tools to check widths of `320px`, `768px`, and `1440px`; at each width, confirm there is no horizontal page scrolling, content remains readable, gutters remain visible, and header/main/footer do not overlap or clip.
- Open `http://localhost:3000/health`, or inspect it with `curl`, and confirm the documented JSON is shown.
- Stop the development server cleanly with `Ctrl-C` after verification.

## 8. Scope Review

Inspect the implementation diff and confirm it contains no:

- Navigation beyond the home link, additional layouts, or a comprehensive design system
- Database, migration, or seed-data work
- Authentication or authorization
- Business routes other than `/` and `/health`
- Client-side framework or browser-side application code
- CI/CD configuration, deployment, or monitoring work

## Definition of Done

The feature is mergeable when dependency installation, the Vitest suite, type-checking, building, server startup, all HTTP contracts, the manual smoke check, and the scope review pass. Any failure blocks the merge until corrected or the specification is deliberately revised.
