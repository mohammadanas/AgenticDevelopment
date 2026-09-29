# Feedback Form Presentation Validation

The feature is ready to merge only when every required automated check passes and every available manual check has been completed. Any unavailable browser check must be documented for the reviewer rather than silently treated as passing.

## Automated Merge Gates

### Route and Rendering

- [ ] `GET /feedback` returns HTTP 200 and a complete server-rendered HTML document.
- [ ] The page is rendered within the shared layout and includes its main heading.
- [ ] A request does not require client-side JavaScript to reveal the form or navigation.

### Navigation and Form Contract

- [ ] Shared primary navigation includes a **Feedback** link to `/feedback`.
- [ ] The page contains a category selector, required multiline message, and optional contact-details field.
- [ ] Every form control has an associated label.
- [ ] Required and optional status is unambiguous in markup and visible text.
- [ ] Relevant help and privacy descriptions are present and associated with their fields where appropriate.
- [ ] The submit control and surrounding copy do not claim that feedback is sent, stored, or successfully received.
- [ ] No feedback POST route, database migration, persistence layer, or new dependency is introduced.

### Regression Commands

- [ ] Focused feedback route/component tests pass.
- [ ] `npm test` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] Existing agent, ailment, therapy, appointment, dashboard, error-page, and navigation tests remain green.

## Manual Acceptance

### Accessibility and Semantics

- [ ] The page has one clear main heading and a logical heading structure.
- [ ] Landmarks, labels, field grouping, instructions, and reading order remain understandable without visual styling.
- [ ] All interactive elements are reachable using only the keyboard in a logical order.
- [ ] Keyboard focus is visibly apparent on every interactive element.
- [ ] The deferred submission behavior is understandable and does not lead to a false success state.

### Responsive Presentation

- [ ] At a representative mobile width, fields and text remain readable and usable without horizontal page scrolling.
- [ ] At a representative tablet width, spacing and line lengths remain comfortable.
- [ ] At a representative desktop width, the form remains focused and does not become unnecessarily wide.
- [ ] Navigation remains usable at each reviewed width.

### Browser Review

- [ ] Current Chromium review passes.
- [ ] Current Firefox review passes.
- [ ] Current WebKit/Safari review passes, or its unavailability and required follow-up are recorded in the merge notes.

### Existing Behavior

- [ ] Existing navigation destinations still resolve correctly.
- [ ] Existing care journeys for agents, ailments, therapies, appointments, and the dashboard show no observed regressions.
- [ ] The feedback page language aligns with the mission's agent-first, empathetic, clear, and dignified tone.

## Merge Decision

The feature may be merged when all automated gates pass, all available manual checks pass, unavailable browser coverage is explicitly documented, the final diff contains no unrelated changes, and the implementation remains within the presentation-only scope in `requirements.md`.
