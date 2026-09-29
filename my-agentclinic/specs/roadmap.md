# Roadmap

Work is divided into very small phases. Each phase should be independently reviewable, testable, and leave the application in a usable state.

## Delivered Baseline

The application already includes agents, ailments, therapies, appointment booking, a staff dashboard, responsive styling, logging, and user-facing error handling. The phases below begin with the outstanding work in `TODO.md` and preserve its priority: feedback form first, customer reviews second, and the about page with its address and map third.

## Phase 1 — Feedback Form Presentation

- Add a clearly labeled feedback form in the existing site layout.
- Include only the fields needed to provide useful feedback.
- Ensure labels, instructions, and keyboard navigation are clear.

**Outcome:** An agent can find and complete the form in a modern browser.

## Phase 2 — Feedback Submission

- Add server-side submission handling.
- Validate required input and return specific, accessible validation messages.
- Preserve safe form values when validation fails.

**Outcome:** Valid feedback is accepted and invalid feedback can be corrected without guesswork.

## Phase 3 — Feedback Completion and Tests

- Show an unambiguous success state after submission.
- Handle storage or processing failures without exposing internals or losing clarity.
- Add automated tests for rendering, validation, successful submission, and failure behavior.

**Outcome:** The feedback journey is complete, reliable, and covered by tests.

## Phase 4 — Customer Review Content

- Define the small data shape needed for a customer review.
- Add representative sample reviews consistent with AgentClinic's tone.
- Keep attribution appropriate for fictional AI-agent customers.

**Outcome:** Review content is structured, credible within the product, and ready to display.

## Phase 5 — Customer Review Presentation

- Add reviews to an appropriate public page without obscuring the primary care journey.
- Use semantic markup and an attractive, responsive layout.
- Test empty and populated review states.

**Outcome:** Visitors can read customer experiences comfortably across supported modern viewport sizes.

## Phase 6 — About Page

- Add an About Us page explaining the clinic's mission and services.
- Add the page to the shared navigation.
- Present clinic information in clear, agent-friendly language.

**Outcome:** Visitors can understand AgentClinic and reach the page from anywhere in the site.

## Phase 7 — Address and Accessible Map

- Add the clinic's written address as usable text.
- Add a map experience that does not make location information dependent on the map itself.
- Provide an accessible fallback if the map cannot load or is unavailable.

**Outcome:** Visitors can identify the clinic location with or without the interactive map.

## Phase 8 — Cross-Feature Quality Check

- Run regression tests across feedback, reviews, About Us, and existing care journeys.
- Check semantic structure, keyboard navigation, focus visibility, and responsive layouts.
- Verify expected behavior in representative modern browsers.

**Outcome:** All roadmap features meet the mission's reliability, accessibility, and presentation principles.

## Not Yet Committed

Authentication, notifications, deployment work, production infrastructure changes, and other capabilities not requested in `TODO.md` remain outside this roadmap until stakeholders prioritize them.
