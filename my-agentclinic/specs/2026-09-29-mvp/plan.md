# MVP Plan — Therapies, Appointments, Dashboard, and Hardening

## Task Group 1 — Therapy Data and Recommendations

1. Add the therapies migration with stable integer IDs, unique non-empty names, and non-empty descriptions.
2. Add the `ailment_therapies` migration with foreign keys, unique ailment/therapy pairs, positive display order, unique order within each ailment, and lookup indexes.
3. Define explicit therapy and recommendation TypeScript types.
4. Add at least five coherent, deterministic therapy seeds and ordered recommendations for every seeded ailment.
5. Make therapy and recommendation seeds idempotent without changing stable identities or recommendation order.
6. Extend repository queries to list therapies and retrieve ailments with recommendations in documented order.
7. Add `GET /therapies` with stable `therapy-{id}` fragment targets, extend the ailments catalog with `/therapies#therapy-{id}` recommendation links, and provide a recommendation empty state without adding therapy detail routes.
8. Add Therapies to shared navigation and test migrations, constraints, seeds, ordering, routes, layout, and retained Phase 2 behavior.

## Task Group 2 — Appointment Persistence and Booking

9. Add the appointments migration with agent foreign key, offset-bearing scheduled timestamp, constrained status, creation timestamp, and query indexes.
10. Add explicit appointment, booking-input, validation-error, and appointment-detail types.
11. Add repository operations to create an appointment and retrieve one appointment with its agent using parameterized SQL.
12. Resolve an IANA application timezone from `TZ` or the runtime host timezone at startup, fail clearly for unsupported or unresolved zones, and introduce injectable clock and local-time conversion boundaries so future and daylight-saving validation are deterministic in tests.
13. Add `GET /agents/:id/appointments/new` and an agent-specific, explicitly labelled `datetime-local` booking form.
14. Add `POST /agents/:id/appointments` with agent lookup, required/valid/future date checks, rejection of nonexistent or ambiguous daylight-saving wall times, safe value redisplay, field-associated errors, and `422` responses.
15. Persist valid bookings as `scheduled`, then issue a `303` redirect to `/appointments/:id`.
16. Add the appointment confirmation/detail page and a booking link on agent records.
17. Test success, Post/Redirect/Get behavior, storage offset, configured-timezone display, exact-now and past rejection, malformed calendar values, missing input, unknown agents, escaped redisplay, and missing appointment details.

## Task Group 3 — Dashboard Queries and Presentation

18. Add repository queries for total agents, distinct active-agent ailments, future scheduled appointments, the next ten upcoming appointments, and the ten most recently created appointments.
19. Keep aggregation and ordering in SQL and return typed dashboard data to route and presentation layers.
20. Add `GET /dashboard` with summary cards, upcoming appointments, recent activity, links to agents and appointment details, and explicit empty states.
21. Add Dashboard to primary navigation and keep all dashboard content usable without client-side JavaScript.
22. Test summary definitions, deterministic ordering, ten-record limits, links, empty databases, mixed statuses, past appointments, and HTML contracts.

## Task Group 4 — Appointment Status Lifecycle

23. Add an atomic conditional repository operation that updates an appointment only from `scheduled` to `completed` or `cancelled` and distinguishes missing, terminal, and successful outcomes.
24. Add separate, clearly labelled completion and cancellation forms for scheduled dashboard entries.
25. Add `POST /dashboard/appointments/:id/status` with strict ID and target-status validation.
26. Redirect successful updates with `303` to the allow-listed `appointment-completed` or `appointment-cancelled` dashboard notice code, map those codes to fixed server-owned copy, and ignore unknown notice values.
27. Return shared-layout `404`, `422`, and `409` responses for unknown appointments, invalid targets, and terminal transition attempts respectively.
28. Test both successful terminal transitions, unsupported values, missing values, malformed and missing IDs, repeated/concurrent transition protection, absence of controls for terminal records, and unchanged rows after rejection.

## Task Group 5 — Responsive and Accessibility Audit

29. Audit the shared layout and every existing and new page at 320px, 768px, and 1440px, preserving the shared skip link and focusable main target.
30. Refine mobile-first styles for the home hero, wrapping navigation, catalogs, record details, forms and field errors, confirmations, dashboard summary grids, activity/action groups, localized table overflow, notices, empty states, and error pages.
31. Replace layouts that require horizontal document scrolling with wrapping lists, cards, or narrow-screen record patterns.
32. Verify semantic landmarks and heading order, skip-link behavior, explicit labels, associated field errors, descriptive control text, and status text that does not depend on color.
33. Ensure keyboard reachability, sensible focus order, visible focus, practical touch targets, WCAG 2.2 AA contrast, and usability at 200% text size.
34. Add or confirm reduced-motion CSS and testable responsive/accessibility foundations without introducing browser-side code.

## Task Group 6 — Errors, Safety, and Logging

35. Add application-level shared-layout handling for unknown routes and unexpected errors.
36. Keep public `500` content generic while passing unexpected errors to an injectable logger with request context.
37. Add request timing middleware that emits method, path, final status, and elapsed time exactly once per completed request.
38. Keep expected `404`, `409`, and `422` responses deliberate, safe, and free of stack traces, SQL, paths, and database details.
39. Review every form and query for JSX escaping, bound SQL parameters, allow-listed status and notice values, and safe failed-submission behavior.
40. Document and verify that mutation forms use `POST` while CSRF protection remains an explicit local-only MVP deferral that blocks treating the application as internet-ready.
41. Test successful and failed request logs, controlled thrown errors, generic `500` pages, expected-error behavior, and absence of sensitive details in responses and logs.

## Task Group 7 — Full Regression and MVP Verification

42. Extend migration and seed tests for fresh databases, repeated runs, rollback behavior, constraints, indexes, foreign keys, and deterministic data.
43. Add repository and route coverage for therapies, recommendations, bookings, dashboard data, appointment details, and status transitions.
44. Retain and run every Phase 1 and Phase 2 route, component, database, responsive-foundation, and static-asset test.
45. Run clean dependency installation, the full non-watch Vitest suite, strict type checking, and the production build.
46. Start the application and execute the HTTP, browser, responsive, keyboard, accessibility, logging, failure, and persistence checks in `validation.md`.
47. Review the implementation against `requirements.md`, confirm every roadmap Phase 3–7 item is covered, and confirm deferred functionality was not introduced.

## Task Group 8 — Branch and Review Structure

48. Perform all implementation on the existing `mvp` branch, preserving the Phase 2 completion edit already carried from local `main`.
49. Keep changes reviewable in phase-sized commits: therapies; appointments; dashboard and lifecycle; accessibility/responsive audit; reliability and final validation.
50. Do not rewrite or discard the six local commits inherited from `main`.
51. Before merge, confirm the final diff contains this specification package, the preserved roadmap update, the required implementation and tests, and no generated database or temporary test artifacts.
